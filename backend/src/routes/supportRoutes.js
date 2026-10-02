const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// POST /api/support (CUSTOMER) - Create support ticket
router.post('/', authenticateToken, authorizeRoles('CUSTOMER', 'ADMIN'), async (req, res, next) => {
  try {
    const { parcelId, trackingNumber, subject, description, priority } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Subject and description are required.' });
    }

    let targetParcelId = parcelId || null;

    if (!targetParcelId && trackingNumber) {
      const p = await prisma.parcel.findUnique({
        where: { trackingNumber: trackingNumber.trim() },
      });
      if (p) targetParcelId = p.id;
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: req.user.id,
        parcelId: targetParcelId,
        subject,
        description,
        priority: priority || 'MEDIUM',
        status: 'OPEN',
      },
      include: {
        parcel: {
          select: { trackingNumber: true, status: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully.',
      ticket,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/support - List support tickets
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let whereClause = {};

    if (req.user.role === 'CUSTOMER') {
      whereClause.userId = req.user.id;
    }

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (search) {
      const q = search.trim();
      whereClause.OR = [
        { subject: { contains: q } },
        { description: { contains: q } },
        { parcel: { trackingNumber: { contains: q } } },
        { user: { name: { contains: q } } },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          parcel: { select: { id: true, trackingNumber: true, status: true, currentLocation: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.supportTicket.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      tickets,
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

// GET /api/support/:id
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        parcel: {
          include: {
            sender: true,
            receiver: true,
            trackingEvents: { orderBy: { timestamp: 'desc' } },
          },
        },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    if (req.user.role === 'CUSTOMER' && ticket.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to ticket.' });
    }

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
});

// PUT /api/support/:id (SUPPORT & ADMIN) - Update status, resolution, or assignment
router.put('/:id', authenticateToken, authorizeRoles('SUPPORT', 'ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolution, assignedToId, priority } = req.body;

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Support ticket not found.' });
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolution !== undefined && { resolution }),
        ...(assignedToId !== undefined && { assignedToId }),
        ...(priority && { priority }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        parcel: { select: { id: true, trackingNumber: true } },
      },
    });

    // Notify ticket owner if status/resolution updated
    if (status || resolution) {
      await prisma.notification.create({
        data: {
          userId: ticket.userId,
          parcelId: ticket.parcelId,
          title: `Support Ticket Updated: ${updatedTicket.subject.substring(0, 25)}...`,
          message: `Ticket status is now ${updatedTicket.status}.${resolution ? ' Resolution: ' + resolution : ''}`,
          type: 'SUPPORT',
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Support ticket updated successfully.',
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
