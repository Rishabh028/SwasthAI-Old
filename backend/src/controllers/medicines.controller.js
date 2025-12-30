import prisma from '../config/database.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

export const listMedicines = async (req, res, next) => {
  try {
    const { search, category, maxPrice, limit = 10, offset = 0 } = req.query;

    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
        category ? { category: { contains: category, mode: 'insensitive' } } : {},
        maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
      ].filter(cond => Object.keys(cond).length > 0),
    };

    const medicines = await prisma.medicine.findMany({
      where: where.AND.length > 0 ? where : {},
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { name: 'asc' },
    });

    const total = await prisma.medicine.count({
      where: where.AND.length > 0 ? where : {},
    });

    res.status(200).json({
      success: true,
      data: medicines,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicineById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medicine = await prisma.medicine.findUnique({
      where: { id: parseInt(id) },
    });

    if (!medicine) {
      throw new NotFoundError('Medicine not found');
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

export const orderMedicines = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { items, shippingAddress, notes } = req.body;

    if (!items || items.length === 0) {
      throw new ValidationError('At least one medicine is required');
    }

    // Calculate total amount and validate medicines
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const medicine = await prisma.medicine.findUnique({
        where: { id: item.medicineId },
      });

      if (!medicine) {
        throw new NotFoundError(`Medicine with ID ${item.medicineId} not found`);
      }

      const itemTotal = medicine.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity: item.quantity,
        price: medicine.price,
        total: itemTotal,
      });
    }

    const order = await prisma.medicineOrder.create({
      data: {
        userId,
        totalAmount,
        shippingAddress: shippingAddress || null,
        notes: notes || null,
        status: 'pending',
        paymentStatus: 'pending',
        items: orderItems,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Medicine order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { status, limit = 10, offset = 0 } = req.query;

    const where = {
      userId,
      ...(status && { status }),
    };

    const orders = await prisma.medicineOrder.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.medicineOrder.count({ where });

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await prisma.medicineOrder.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized to view this order');
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      throw new ValidationError('Invalid order status');
    }

    const order = await prisma.medicineOrder.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
