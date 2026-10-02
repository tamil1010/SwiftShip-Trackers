const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/users/agents (ADMIN & SUPPORT) - Delivery Agent list for dropdowns
router.get('/agents', authenticateToken, authorizeRoles('ADMIN', 'SUPPORT'), async (req, res, next) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: 'DELIVERY_AGENT', isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        _count: {
          select: { assignedParcels: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ success: true, agents });
  } catch (error) {
    next(error);
  }
});

// GET /api/users (ADMIN only)
router.get('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    let whereClause = {};

    if (role) {
      whereClause.role = role;
    }

    if (search) {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              createdParcels: true,
              assignedParcels: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      users,
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

// POST /api/users (ADMIN only) - Create user with specific role
router.post('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address, city, state, pincode } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `User '${user.name}' created successfully with role ${user.role}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id (ADMIN only)
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, role, isActive, address, city, state, pincode } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(pincode !== undefined && { pincode }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
