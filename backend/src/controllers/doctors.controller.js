import prisma from '../config/database.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

export const listDoctors = async (req, res, next) => {
  try {
    const { 
      specialty, 
      city, 
      search,
      minRating,
      maxFee,
      limit = 10, 
      offset = 0 
    } = req.query;

    const where = {
      AND: [
        specialty ? { specialty: { contains: specialty, mode: 'insensitive' } } : {},
        city ? { clinicAddress: { contains: city, mode: 'insensitive' } } : {},
        search ? {
          OR: [
            { user: { fullName: { contains: search, mode: 'insensitive' } } },
            { clinicName: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
        minRating ? { averageRating: { gte: parseFloat(minRating) } } : {},
        maxFee ? { consultationFee: { lte: parseFloat(maxFee) } } : {},
      ].filter(cond => Object.keys(cond).length > 0),
    };

    const doctors = await prisma.doctor.findMany({
      where: where.AND.length > 0 ? where : {},
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            profilePhotoUrl: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { averageRating: 'desc' },
    });

    const total = await prisma.doctor.count({
      where: where.AND.length > 0 ? where : {},
    });

    res.status(200).json({
      success: true,
      data: doctors,
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

export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        reviews: {
          include: {
            user: {
              select: {
                fullName: true,
                profilePhotoUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const doctor = await prisma.doctor.findUnique({
      where: { userId },
      include: {
        user: true,
        reviews: {
          include: {
            user: {
              select: {
                fullName: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundError('Doctor profile not found');
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const {
      specialty,
      qualifications,
      experienceYears,
      licenseNumber,
      clinicName,
      clinicAddress,
      latitude,
      longitude,
      consultationFee,
      availability,
    } = req.body;

    const doctor = await prisma.doctor.update({
      where: { userId },
      data: {
        specialty: specialty || undefined,
        qualifications: qualifications || undefined,
        experienceYears: experienceYears || undefined,
        licenseNumber: licenseNumber || undefined,
        clinicName: clinicName || undefined,
        clinicAddress: clinicAddress || undefined,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        consultationFee: consultationFee || undefined,
        availability: availability || undefined,
      },
      include: {
        user: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { doctorId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) },
    });

    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }

    const review = await prisma.doctorReview.create({
      data: {
        doctorId: parseInt(doctorId),
        userId,
        rating,
        comment: comment || null,
      },
    });

    // Calculate average rating
    const allReviews = await prisma.doctorReview.findMany({
      where: { doctorId: parseInt(doctorId) },
      select: { rating: true },
    });

    const averageRating = 
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.doctor.update({
      where: { id: parseInt(doctorId) },
      data: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: allReviews.length,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const reviews = await prisma.doctorReview.findMany({
      where: { doctorId: parseInt(doctorId) },
      include: {
        user: {
          select: {
            fullName: true,
            profilePhotoUrl: true,
          },
        },
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.doctorReview.count({
      where: { doctorId: parseInt(doctorId) },
    });

    res.status(200).json({
      success: true,
      data: reviews,
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

export const getNearbyDoctors = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      throw new ValidationError('Latitude and longitude are required');
    }

    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Simplified distance calculation using coordinates
    // In production, use PostGIS for accurate distance queries
    const doctors = await prisma.doctor.findMany({
      where: {
        AND: [
          { latitude: { not: null } },
          { longitude: { not: null } },
        ],
      },
      include: {
        user: {
          select: {
            fullName: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    // Filter by distance (basic calculation)
    const nearbyDoctors = doctors.filter(doc => {
      const distance = Math.sqrt(
        Math.pow(doc.latitude - lat, 2) + Math.pow(doc.longitude - long, 2)
      );
      return distance <= rad;
    });

    res.status(200).json({
      success: true,
      data: nearbyDoctors,
    });
  } catch (error) {
    next(error);
  }
};
