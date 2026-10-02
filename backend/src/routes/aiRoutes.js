const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// POST /api/ai/chat
router.post('/chat', async (req, res, next) => {
  try {
    const { message, trackingNumber: inputTracking } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const query = message.trim();
    const queryUpper = query.toUpperCase();

    // Regex to detect tracking numbers like SST-YYYYMMDD-XXXXX or SST-XXXX
    const trackingRegex = /SST-?\d{8}-?\d{5}|SST-[A-Z0-9-]+/i;
    const matched = query.match(trackingRegex);
    
    let targetTracking = inputTracking || (matched ? matched[0].toUpperCase() : null);

    let parcel = null;

    if (targetTracking) {
      // Direct lookup by tracking number
      parcel = await prisma.parcel.findFirst({
        where: {
          trackingNumber: {
            contains: targetTracking.replace(/-/g, ''), // support slight variations
          },
        },
        include: {
          sender: true,
          receiver: true,
          assignedAgent: { select: { name: true, phone: true } },
          trackingEvents: { orderBy: { timestamp: 'desc' } },
        },
      });

      if (!parcel) {
        // Exact match attempt
        parcel = await prisma.parcel.findUnique({
          where: { trackingNumber: targetTracking },
          include: {
            sender: true,
            receiver: true,
            assignedAgent: { select: { name: true, phone: true } },
            trackingEvents: { orderBy: { timestamp: 'desc' } },
          },
        });
      }
    }

    // Response synthesis based on real database records
    let aiResponse = '';
    let foundParcel = parcel;

    if (parcel) {
      const statusFormatted = parcel.status.replace(/_/g, ' ');
      const etaFormatted = parcel.estimatedDeliveryDate 
        ? new Date(parcel.estimatedDeliveryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : 'To be determined';
      
      const lastEvent = parcel.trackingEvents[0];
      const lastUpdatedStr = lastEvent 
        ? new Date(lastEvent.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : new Date(parcel.updatedAt).toLocaleString();

      const agentInfo = parcel.assignedAgent 
        ? `${parcel.assignedAgent.name} (Contact: ${parcel.assignedAgent.phone || 'N/A'})` 
        : 'Agent pending assignment';

      // Smart intent matching
      if (queryUpper.includes('WHERE') || queryUpper.includes('LOCATION') || queryUpper.includes('STATUS')) {
        aiResponse = `📦 **Shipment Status for ${parcel.trackingNumber}**:\n` +
          `• **Current Status**: ${statusFormatted}\n` +
          `• **Current Location**: ${parcel.currentLocation}\n` +
          `• **Origin**: ${parcel.sender.city} → **Destination**: ${parcel.receiver.city}\n` +
          `• **Estimated Delivery**: ${etaFormatted}\n` +
          `• **Last Activity**: ${lastEvent ? lastEvent.message : 'No recent updates'}`;
      } else if (queryUpper.includes('WHEN') || queryUpper.includes('ARRIVE') || queryUpper.includes('ETA') || queryUpper.includes('DELIVERY')) {
        aiResponse = `⏰ **Estimated Delivery Info for ${parcel.trackingNumber}**:\n` +
          `• **Expected Arrival**: ${etaFormatted}\n` +
          `• **Current Status**: ${statusFormatted}\n` +
          `• **Current City**: ${parcel.currentLocation}\n` +
          `• **Assigned Agent**: ${agentInfo}`;
      } else if (queryUpper.includes('WEIGHT') || queryUpper.includes('DIMENSION') || queryUpper.includes('PACKAGE') || queryUpper.includes('SIZE')) {
        aiResponse = `⚖️ **Package Specifications for ${parcel.trackingNumber}**:\n` +
          `• **Description**: ${parcel.packageDescription}\n` +
          `• **Weight**: ${parcel.weight} kg\n` +
          `• **Dimensions**: ${parcel.length || 0} x ${parcel.width || 0} x ${parcel.height || 0} cm\n` +
          `• **Shipping Priority**: ${parcel.priority}`;
      } else if (queryUpper.includes('AGENT') || queryUpper.includes('WHO') || queryUpper.includes('DELIVERING') || queryUpper.includes('DRIVER')) {
        aiResponse = `👤 **Delivery Agent Details for ${parcel.trackingNumber}**:\n` +
          `• **Assigned Agent**: ${agentInfo}\n` +
          `• **Current Status**: ${statusFormatted}\n` +
          `• **Current Location**: ${parcel.currentLocation}`;
      } else if (queryUpper.includes('LAST') || queryUpper.includes('UPDATE') || queryUpper.includes('HISTORY')) {
        aiResponse = `🕒 **Latest Update for ${parcel.trackingNumber}**:\n` +
          `• **Time**: ${lastUpdatedStr}\n` +
          `• **Location**: ${parcel.currentLocation}\n` +
          `• **Event**: ${lastEvent ? lastEvent.message : statusFormatted}`;
      } else {
        // General comprehensive summary
        aiResponse = `Here is the verified shipment summary for **${parcel.trackingNumber}**:\n\n` +
          `• **Status**: ${statusFormatted}\n` +
          `• **Current Location**: ${parcel.currentLocation}\n` +
          `• **Estimated Delivery**: ${etaFormatted}\n` +
          `• **Weight**: ${parcel.weight} kg (${parcel.priority} Shipping)\n` +
          `• **From**: ${parcel.sender.name} (${parcel.sender.city})\n` +
          `• **To**: ${parcel.receiver.name} (${parcel.receiver.city})\n` +
          `• **Delivery Agent**: ${agentInfo}`;
      }
    } else if (targetTracking) {
      aiResponse = `❌ I searched our database for tracking number **${targetTracking}**, but no active shipment was found. Please double-check your tracking number (format: SST-YYYYMMDD-XXXXX).`;
    } else {
      // No tracking number provided in query
      aiResponse = `👋 Hello! I am the **SwiftShip AI Parcel Assistant**.\n\n` +
        `To help you track your shipment, please mention your **Tracking Number** (e.g. \`SST-20261002-10001\`) in your message, or ask questions like:\n` +
        `• *"Where is parcel SST-20261002-10001?"*\n` +
        `• *"When will SST-20261002-10001 arrive?"*\n` +
        `• *"Who is delivering SST-20261002-10001?"*\n` +
        `• *"What is the weight of SST-20261002-10001?"*`;
    }

    res.status(200).json({
      success: true,
      message: aiResponse,
      parcel: foundParcel ? {
        trackingNumber: foundParcel.trackingNumber,
        status: foundParcel.status,
        currentLocation: foundParcel.currentLocation,
        estimatedDeliveryDate: foundParcel.estimatedDeliveryDate,
      } : null,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
