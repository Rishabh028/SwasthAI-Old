import prisma from '../config/database.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

export const listHealthRecords = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { type, limit = 10, offset = 0 } = req.query;

    const where = {
      userId,
      ...(type && { type }),
    };

    const records = await prisma.healthRecord.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { recordDate: 'desc' },
    });

    const total = await prisma.healthRecord.count({ where });

    res.status(200).json({
      success: true,
      data: records,
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

export const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const record = await prisma.healthRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!record) {
      throw new NotFoundError('Health record not found');
    }

    if (record.userId !== userId) {
      throw new Error('Unauthorized to view this record');
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadRecord = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { title, description, type, fileUrl, recordDate, metadata } = req.body;

    if (!title || !type || !fileUrl) {
      throw new ValidationError('Title, type, and file URL are required');
    }

    const validTypes = [
      'prescription',
      'lab_report',
      'medical_certificate',
      'scan',
      'x_ray',
      'other',
    ];

    if (!validTypes.includes(type)) {
      throw new ValidationError('Invalid record type');
    }

    const record = await prisma.healthRecord.create({
      data: {
        userId,
        title,
        description: description || null,
        type,
        fileUrl,
        recordDate: recordDate ? new Date(recordDate) : new Date(),
        metadata: metadata || null,
        isShared: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Health record uploaded successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, description, metadata } = req.body;

    const record = await prisma.healthRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!record) {
      throw new NotFoundError('Health record not found');
    }

    if (record.userId !== userId) {
      throw new Error('Unauthorized to update this record');
    }

    const updated = await prisma.healthRecord.update({
      where: { id: parseInt(id) },
      data: {
        title: title || undefined,
        description: description || undefined,
        metadata: metadata || undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Health record updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const record = await prisma.healthRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!record) {
      throw new NotFoundError('Health record not found');
    }

    if (record.userId !== userId) {
      throw new Error('Unauthorized to delete this record');
    }

    await prisma.healthRecord.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: 'Health record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const shareRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { sharedWith, isShared } = req.body;

    const record = await prisma.healthRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!record) {
      throw new NotFoundError('Health record not found');
    }

    if (record.userId !== userId) {
      throw new Error('Unauthorized to share this record');
    }

    const updated = await prisma.healthRecord.update({
      where: { id: parseInt(id) },
      data: {
        isShared: isShared !== undefined ? isShared : true,
        sharedWith: sharedWith || undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Record shared successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
