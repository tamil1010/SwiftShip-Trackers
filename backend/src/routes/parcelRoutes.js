const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { generateTrackingNumber } = require('../utils/trackingNumber');

// Helper for status transition validation
const VALID_TRANSITIONS = {
  BOOKED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'DELIVERY_FAILED', 'RETURNED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'DELIVERY_FAILED', 'RETURNED'],
  DELIVERED: [], // Final state
  DELIVERY_FAILED: ['OUT_FOR_DELIVERY', 'RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

// GET /api/parcels/track/:trackingNumber (PUBLIC)
router.get('/track/:trackingNumber', async (req, res, next) => {
  try {
    const { trackingNumber } = req.params;
    const cleanTracking = trackingNumber.trim();

    const parcel = await prisma.parcel.findUnique({
      where: { trackingNumber: cleanTracking },
      include: {
        sender: true,
        receiver: true,
        assignedAgent: {
          select: { id: true, name: true, phone: true, email: true },
        },
        trackingEvents: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Shipment not found. Check tracking number.' });
    }

    res.status(200).json({
      success: true,
      parcel,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/parcels (CUSTOMER or ADMIN) - Book Parcel
router.post('/', authenticateToken, authorizeRoles('CUSTOMER', 'ADMIN'), async (req, res, next) => {
  try {
    const { sender, receiver, packageDescription, weight, length, width, height, priority } = req.body;

    if (!sender || !receiver || !packageDescription || weight === undefined) {
      return res.status(400).json({ success: false, message: 'Sender, receiver, package description, and weight are required.' });
    }

    const numericWeight = parseFloat(weight);
    if (isNaN(numericWeight) || numericWeight <= 0) {
      return res.status(400).json({ success: false, message: 'Weight must be a positive number.' });
    }

    if (length !== undefined && parseFloat(length) < 0) {
      return res.status(400).json({ success: false, message: 'Length cannot be negative.' });
    }
    if (width !== undefined && parseFloat(width) < 0) {
      return res.status(400).json({ success: false, message: 'Width cannot be negative.' });
    }
    if (height !== undefined && parseFloat(height) < 0) {
      return res.status(400).json({ success: false, message: 'Height cannot be negative.' });
    }

    // Calculate shipping cost
    let baseRate = 120; // Base cost in INR
    const weightRate = numericWeight * 45;
    const priorityMultiplier = priority === 'EXPRESS' ? 1.5 : priority === 'PRIORITY' ? 2.0 : 1.0;
    const shippingCost = Math.round((baseRate + weightRate) * priorityMultiplier);

    // Calculate estimated delivery (3 days for standard, 1 day for express)
    const estDays = priority === 'EXPRESS' || priority === 'PRIORITY' ? 1 : 3;
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estDays);

    let trackingNumber = generateTrackingNumber();
    // Ensure uniqueness
    let exists = await prisma.parcel.findUnique({ where: { trackingNumber } });
    while (exists) {
      trackingNumber = generateTrackingNumber();
      exists = await prisma.parcel.findUnique({ where: { trackingNumber } });
    }

    // Create Sender & Receiver in transaction
    const newParcel = await prisma.$transaction(async (tx) => {
      const createdSender = await tx.sender.create({
        data: {
          name: sender.name,
          phone: sender.phone,
          email: sender.email || null,
          address: sender.address,
          city: sender.city,
          state: sender.state,
          pincode: sender.pincode,
          country: sender.country || 'India',
        },
      });

      const createdReceiver = await tx.receiver.create({
        data: {
          name: receiver.name,
          phone: receiver.phone,
          email: receiver.email || null,
          address: receiver.address,
          city: receiver.city,
          state: receiver.state,
          pincode: receiver.pincode,
          country: receiver.country || 'India',
        },
      });

      const parcel = await tx.parcel.create({
        data: {
          trackingNumber,
          senderId: createdSender.id,
          receiverId: createdReceiver.id,
          createdById: req.user.id,
          packageDescription,
          weight: numericWeight,
          length: length ? parseFloat(length) : null,
          width: width ? parseFloat(width) : null,
          height: height ? parseFloat(height) : null,
          priority: priority || 'STANDARD',
          status: 'BOOKED',
          currentLocation: sender.city,
          estimatedDeliveryDate,
          shippingCost,
          paymentStatus: 'PAID',
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      // Initial tracking event
      await tx.trackingEvent.create({
        data: {
          parcelId: parcel.id,
          status: 'BOOKED',
          location: sender.city,
          message: `Parcel successfully booked from ${sender.city} to ${receiver.city}.`,
          updatedById: req.user.id,
        },
      });

      // Customer notification
      await tx.notification.create({
        data: {
          userId: req.user.id,
          parcelId: parcel.id,
          title: 'Shipment Booked',
          message: `Your shipment ${parcel.trackingNumber} has been booked successfully!`,
          type: 'STATUS_UPDATE',
        },
      });

      return parcel;
    });

    // Real-time broadcast if socket available
    const io = req.app.get('io');
    if (io) {
      io.emit('parcel_created', { parcelId: newParcel.id, trackingNumber: newParcel.trackingNumber });
    }

    res.status(201).json({
      success: true,
      message: 'Shipment booked successfully!',
      parcel: newParcel,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/parcels (List with search, filter, pagination)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { search, status, agentId, priority, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let whereClause = {};

    // Role-based scoping
    if (req.user.role === 'CUSTOMER') {
      whereClause.OR = [
        { createdById: req.user.id },
        { sender: { email: req.user.email } },
        { receiver: { email: req.user.email } },
      ];
    } else if (req.user.role === 'DELIVERY_AGENT') {
      whereClause.assignedAgentId = req.user.id;
    }

    // Additional filters
    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (agentId && (req.user.role === 'ADMIN' || req.user.role === 'SUPPORT')) {
      whereClause.assignedAgentId = agentId;
    }

    if (search) {
      const searchTerms = search.trim();
      whereClause.AND = [
        ...(whereClause.AND || []),
        {
          OR: [
            { trackingNumber: { contains: searchTerms } },
            { packageDescription: { contains: searchTerms } },
            { currentLocation: { contains: searchTerms } },
            { sender: { name: { contains: searchTerms } } },
            { sender: { city: { contains: searchTerms } } },
            { receiver: { name: { contains: searchTerms } } },
            { receiver: { city: { contains: searchTerms } } },
          ],
        },
      ];
    }

    const [parcels, total] = await Promise.all([
      prisma.parcel.findMany({
        where: whereClause,
        include: {
          sender: true,
          receiver: true,
          assignedAgent: {
            select: { id: true, name: true, phone: true, email: true },
          },
          trackingEvents: {
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      prisma.parcel.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      parcels,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/parcels/:id
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const parcel = await prisma.parcel.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
        createdBy: {
          select: { id: true, name: true, email: true, phone: true },
        },
        assignedAgent: {
          select: { id: true, name: true, email: true, phone: true, city: true },
        },
        trackingEvents: {
          orderBy: { timestamp: 'desc' },
        },
        supportTickets: true,
      },
    });

    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found.' });
    }

    // Role check
    if (req.user.role === 'CUSTOMER') {
      const isOwner = parcel.createdById === req.user.id || 
                      parcel.sender.email === req.user.email || 
                      parcel.receiver.email === req.user.email;
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'You are not authorized to view this parcel.' });
      }
    } else if (req.user.role === 'DELIVERY_AGENT') {
      if (parcel.assignedAgentId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'This parcel is not assigned to you.' });
      }
    }

    res.status(200).json({
      success: true,
      parcel,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/parcels/:id/status (AGENT, SUPPORT, ADMIN)
router.put('/:id/status', authenticateToken, authorizeRoles('DELIVERY_AGENT', 'SUPPORT', 'ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, currentLocation, notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required.' });
    }

    const parcel = await prisma.parcel.findUnique({
      where: { id },
      include: { sender: true, receiver: true },
    });

    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found.' });
    }

    // Delivery agent constraint
    if (req.user.role === 'DELIVERY_AGENT' && parcel.assignedAgentId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only update parcels assigned to you.' });
    }

    // Status transition validation
    const allowed = VALID_TRANSITIONS[parcel.status] || [];
    if (req.user.role !== 'ADMIN' && !allowed.includes(status) && parcel.status !== status) {
      return res.status(400).json({
        success: false,
        message: `Invalid shipment status transition from '${parcel.status}' to '${status}'.`,
      });
    }

    const updatedLocation = currentLocation || parcel.currentLocation;
    const now = new Date();

    const updateData = {
      status,
      currentLocation: updatedLocation,
      notes: notes !== undefined ? notes : parcel.notes,
    };

    if (status === 'PICKED_UP' && !parcel.pickedUpAt) {
      updateData.pickedUpAt = now;
    } else if (status === 'DELIVERED' && !parcel.deliveredAt) {
      updateData.deliveredAt = now;
    }

    const updatedParcel = await prisma.$transaction(async (tx) => {
      const p = await tx.parcel.update({
        where: { id },
        data: updateData,
        include: {
          sender: true,
          receiver: true,
          assignedAgent: { select: { id: true, name: true, phone: true } },
        },
      });

      let statusMsg = `Status updated to ${status.replace(/_/g, ' ')}. Location: ${updatedLocation}`;
      if (notes) statusMsg += ` (${notes})`;

      await tx.trackingEvent.create({
        data: {
          parcelId: id,
          status,
          location: updatedLocation,
          message: statusMsg,
          updatedById: req.user.id,
        },
      });

      // Notify owner / customer
      if (parcel.createdById) {
        await tx.notification.create({
          data: {
            userId: parcel.createdById,
            parcelId: id,
            title: `Shipment Status: ${status.replace(/_/g, ' ')}`,
            message: `Parcel ${parcel.trackingNumber} is now ${status.replace(/_/g, ' ')} at ${updatedLocation}.`,
            type: 'STATUS_UPDATE',
          },
        });
      }

      return p;
    });

    // Broadcast Socket.IO event
    const io = req.app.get('io');
    if (io) {
      io.to(`parcel_${parcel.trackingNumber}`).emit('status_updated', {
        trackingNumber: parcel.trackingNumber,
        status: updatedParcel.status,
        currentLocation: updatedParcel.currentLocation,
        timestamp: new Date(),
      });
      io.emit('parcel_status_change', {
        parcelId: updatedParcel.id,
        trackingNumber: updatedParcel.trackingNumber,
        status: updatedParcel.status,
      });
    }

    res.status(200).json({
      success: true,
      message: `Parcel status updated to ${status}.`,
      parcel: updatedParcel,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/parcels/:id/assign (ADMIN)
router.assignAgent = router.put('/:id/assign', authenticateToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ success: false, message: 'Delivery Agent ID is required.' });
    }

    const agent = await prisma.user.findUnique({
      where: { id: agentId },
    });

    if (!agent || agent.role !== 'DELIVERY_AGENT') {
      return res.status(400).json({ success: false, message: 'Invalid delivery agent specified.' });
    }

    const parcel = await prisma.parcel.findUnique({ where: { id } });
    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found.' });
    }

    const updatedParcel = await prisma.$transaction(async (tx) => {
      const p = await tx.parcel.update({
        where: { id },
        data: { assignedAgentId: agentId },
        include: {
          assignedAgent: { select: { id: true, name: true, phone: true } },
          sender: true,
          receiver: true,
        },
      });

      await tx.trackingEvent.create({
        data: {
          parcelId: id,
          status: p.status,
          location: p.currentLocation,
          message: `Delivery agent ${agent.name} assigned to this shipment.`,
          updatedById: req.user.id,
        },
      });

      // Notification to Agent
      await tx.notification.create({
        data: {
          userId: agentId,
          parcelId: id,
          title: 'New Parcel Assigned',
          message: `Parcel ${p.trackingNumber} has been assigned to you for delivery.`,
          type: 'AGENT_ASSIGNED',
        },
      });

      // Notification to Customer
      if (p.createdById) {
        await tx.notification.create({
          data: {
            userId: p.createdById,
            parcelId: id,
            title: 'Agent Assigned',
            message: `Delivery agent ${agent.name} has been assigned to your shipment ${p.trackingNumber}.`,
            type: 'STATUS_UPDATE',
          },
        });
      }

      return p;
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('agent_assigned', { parcelId: id, agentId });
    }

    res.status(200).json({
      success: true,
      message: `Assigned parcel to ${agent.name} successfully.`,
      parcel: updatedParcel,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
