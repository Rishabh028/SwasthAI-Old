import prisma from '../config/database.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

export const listLabTests = async (req, res, next) => {
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

    const tests = await prisma.labTest.findMany({
      where: where.AND.length > 0 ? where : {},
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { name: 'asc' },
    });

    const total = await prisma.labTest.count({
      where: where.AND.length > 0 ? where : {},
    });

    res.status(200).json({
      success: true,
      data: tests,
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

export const getTestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const test = await prisma.labTest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!test) {
      throw new NotFoundError('Lab test not found');
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    next(error);
  }
};

export const bookLabTest = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tests, bookingType, address, bookingDate, timeSlot } = req.body;

    if (!tests || tests.length === 0) {
      throw new ValidationError('At least one test is required');
    }

    if (!bookingType || !['home_collection', 'lab_visit'].includes(bookingType)) {
      throw new ValidationError('Valid booking type is required');
    }

    if (!bookingDate || !timeSlot) {
      throw new ValidationError('Booking date and time slot are required');
    }

    // Calculate total amount and validate tests
    let totalAmount = 0;
    const testItems = [];

    for (const test of tests) {
      const labTest = await prisma.labTest.findUnique({
        where: { id: test.testId || test.id },
      });

      if (!labTest) {
        throw new NotFoundError(`Lab test with ID ${test.testId || test.id} not found`);
      }

      totalAmount += labTest.price;
      testItems.push({
        testId: labTest.id,
        testName: labTest.name,
        price: labTest.price,
      });
    }

    const booking = await prisma.labBooking.create({
      data: {
        userId,
        tests: testItems,
        totalAmount,
        bookingType,
        address: address || null,
        bookingDate: new Date(bookingDate),
        timeSlot,
        status: 'booked',
        paymentStatus: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Lab test booked successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { status, limit = 10, offset = 0 } = req.query;

    const where = {
      userId,
      ...(status && { status }),
    };

    const bookings = await prisma.labBooking.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { bookingDate: 'desc' },
    });

    const total = await prisma.labBooking.count({ where });

    res.status(200).json({
      success: true,
      data: bookings,
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

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const booking = await prisma.labBooking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      throw new NotFoundError('Lab booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized to view this booking');
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'booked',
      'sample_collected',
      'processing',
      'report_ready',
      'cancelled',
    ];

    if (!status || !validStatuses.includes(status)) {
      throw new ValidationError('Invalid booking status');
    }

    const booking = await prisma.labBooking.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reportUrl, reportData } = req.body;

    if (!reportUrl && !reportData) {
      throw new ValidationError('Report URL or report data is required');
    }

    const booking = await prisma.labBooking.update({
      where: { id: parseInt(id) },
      data: {
        reportUrl: reportUrl || null,
        reportData: reportData || null,
        status: 'report_ready',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Report uploaded successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
