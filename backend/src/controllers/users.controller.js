import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        healthProfile: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { 
      fullName, 
      phone, 
      dateOfBirth, 
      gender, 
      bloodGroup,
      city,
      state,
      country,
      address,
      abhaId,
      profilePhotoUrl 
    } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName || undefined,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        bloodGroup: bloodGroup || undefined,
        city: city || undefined,
        state: state || undefined,
        country: country || undefined,
        address: address || undefined,
        abhaId: abhaId || undefined,
        profilePhotoUrl: profilePhotoUrl || undefined,
      },
      include: {
        healthProfile: true,
        doctorProfile: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHealthProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { 
      heightCm, 
      weightKg, 
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      conditions,
      allergies,
      medications
    } = req.body;

    // Calculate BMI
    let bmi = null;
    if (heightCm && weightKg) {
      const heightM = heightCm / 100;
      bmi = Math.round((weightKg / (heightM * heightM)) * 100) / 100;
    }

    const healthProfile = await prisma.healthProfile.update({
      where: { userId },
      data: {
        heightCm: heightCm || undefined,
        weightKg: weightKg || undefined,
        bmi: bmi || undefined,
        bloodPressureSystolic: bloodPressureSystolic || undefined,
        bloodPressureDiastolic: bloodPressureDiastolic || undefined,
        heartRate: heartRate || undefined,
        conditions: conditions || undefined,
        allergies: allergies || undefined,
        medications: medications || undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Health profile updated successfully',
      data: healthProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current password and new password are required');
    }

    if (newPassword.length < 8) {
      throw new ValidationError('New password must be at least 8 characters');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!passwordMatch) {
      throw new ValidationError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        healthProfile: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { role, limit = 10, offset = 0 } = req.query;

    const where = role ? { role } : {};

    const users = await prisma.user.findMany({
      where,
      include: {
        healthProfile: true,
      },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.user.count({ where });

    res.status(200).json({
      success: true,
      data: users,
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
