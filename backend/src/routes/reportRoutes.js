const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/reports/dashboard-stats (ADMIN & SUPPORT)
router.get('/dashboard-stats', authenticateToken, authorizeRoles('ADMIN', 'SUPPORT'), async (req, res, next) => {
  try {
    const [
      totalParcels,
      bookedCount,
      pickedUpCount,
      inTransitCount,
      outForDeliveryCount,
      deliveredCount,
      failedCount,
      returnedCount,
      totalUsers,
      activeAgents,
      totalCustomers,
      recentParcels,
    ] = await Promise.all([
      prisma.parcel.count(),
      prisma.parcel.count({ where: { status: 'BOOKED' } }),
      prisma.parcel.count({ where: { status: 'PICKED_UP' } }),
      prisma.parcel.count({ where: { status: 'IN_TRANSIT' } }),
      prisma.parcel.count({ where: { status: 'OUT_FOR_DELIVERY' } }),
      prisma.parcel.count({ where: { status: 'DELIVERED' } }),
      prisma.parcel.count({ where: { status: 'DELIVERY_FAILED' } }),
      prisma.parcel.count({ where: { status: 'RETURNED' } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'DELIVERY_AGENT', isActive: true } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.parcel.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: true,
          receiver: true,
          assignedAgent: { select: { name: true } },
        },
      }),
    ]);

    const activeParcels = bookedCount + pickedUpCount + inTransitCount + outForDeliveryCount;
    const successRate = totalParcels > 0 ? ((deliveredCount / totalParcels) * 100).toFixed(1) : 100;

    // Status Distribution Chart Data
    const statusDistribution = [
      { name: 'Booked', value: bookedCount, color: '#3b82f6' },
      { name: 'Picked Up', value: pickedUpCount, color: '#8b5cf6' },
      { name: 'In Transit', value: inTransitCount, color: '#eab308' },
      { name: 'Out for Delivery', value: outForDeliveryCount, color: '#f97316' },
      { name: 'Delivered', value: deliveredCount, color: '#22c55e' },
      { name: 'Failed', value: failedCount, color: '#ef4444' },
      { name: 'Returned', value: returnedCount, color: '#64748b' },
    ];

    // City-wise statistics
    const allParcelsForCities = await prisma.parcel.findMany({
      select: { currentLocation: true, sender: { select: { city: true } }, receiver: { select: { city: true } } },
    });

    const cityMap = {};
    allParcelsForCities.forEach((p) => {
      const city = p.currentLocation || p.sender.city || 'Unknown';
      cityMap[city] = (cityMap[city] || 0) + 1;
    });

    const cityStats = Object.keys(cityMap).map((city) => ({
      city,
      count: cityMap[city],
    })).sort((a, b) => b.count - a.count).slice(0, 7);

    // Agent performance metrics
    const agents = await prisma.user.findMany({
      where: { role: 'DELIVERY_AGENT' },
      select: {
        id: true,
        name: true,
        city: true,
        assignedParcels: {
          select: { status: true },
        },
      },
    });

    const agentPerformance = agents.map((agent) => {
      const totalAssigned = agent.assignedParcels.length;
      const agentDelivered = agent.assignedParcels.filter((p) => p.status === 'DELIVERED').length;
      const inProgress = agent.assignedParcels.filter((p) => ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PICKED_UP'].includes(p.status)).length;
      const rate = totalAssigned > 0 ? Math.round((agentDelivered / totalAssigned) * 100) : 0;

      return {
        id: agent.id,
        name: agent.name,
        city: agent.city || 'N/A',
        totalAssigned,
        delivered: agentDelivered,
        inProgress,
        completionRate: `${rate}%`,
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalParcels,
        activeParcels,
        deliveredParcels: deliveredCount,
        failedDeliveries: failedCount,
        totalUsers,
        activeAgents,
        totalCustomers,
        successRate: `${successRate}%`,
      },
      statusDistribution,
      cityStats,
      agentPerformance,
      recentParcels,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/export (ADMIN & SUPPORT) - Export CSV data
router.get('/export', authenticateToken, authorizeRoles('ADMIN', 'SUPPORT'), async (req, res, next) => {
  try {
    const parcels = await prisma.parcel.findMany({
      include: {
        sender: true,
        receiver: true,
        assignedAgent: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    let csv = 'Tracking Number,Status,Priority,Current Location,Weight (kg),Shipping Cost,Sender Name,Sender City,Receiver Name,Receiver City,Assigned Agent,Booking Date\n';

    parcels.forEach((p) => {
      const row = [
        `"${p.trackingNumber}"`,
        `"${p.status}"`,
        `"${p.priority}"`,
        `"${p.currentLocation}"`,
        p.weight,
        p.shippingCost,
        `"${p.sender.name}"`,
        `"${p.sender.city}"`,
        `"${p.receiver.name}"`,
        `"${p.receiver.city}"`,
        `"${p.assignedAgent ? p.assignedAgent.name : 'Unassigned'}"`,
        `"${p.bookingDate.toISOString().split('T')[0]}"`,
      ].join(',');
      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="swiftship_parcels_report.csv"');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
