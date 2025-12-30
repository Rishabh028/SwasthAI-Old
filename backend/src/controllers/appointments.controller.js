import prisma from '../config/database.js';
import { NotFoundError, ValidationError, ConflictError } from '../middleware/errorHandler.js';

export const bookAppointment = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const {
      doctorId,
      appointmentDate,
      timeSlot,
      consultationType, // online, in_clinic
      symptoms,
      notes,
    } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot || !consultationType) {
      throw new ValidationError('Doctor ID, date, time slot, and consultation type are required');
    }

    // Check doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) },
      include: { user: true },
    });

    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }

    // Check for conflicting appointments
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: parseInt(doctorId),
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: { in: ['scheduled', 'in_progress'] },
      },
    });

    if (existingAppointment) {
      throw new ConflictError('This time slot is already booked');
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: userId,
        doctorId: parseInt(doctorId),
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        consultationType,
        symptoms: symptoms || null,
        notes: notes || null,
        status: 'scheduled',
        paymentStatus: 'pending',
        amount: doctor.consultationFee,
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // Create notification for doctor
    await prisma.notification.create({
      data: {
        userId: doctor.userId,
        type: 'appointment_booked',
        title: 'New Appointment Booking',
        message: `${appointment.patient.fullName} has booked an appointment for ${appointmentDate}`,
        relatedId: appointment.id,
        relatedType: 'appointment',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { status, limit = 10, offset = 0 } = req.query;

    const where = {
      patientId: userId,
      ...(status && { status }),
    };

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          include: {
            user: {
              select: {
                fullName: true,
                profilePhotoUrl: true,
                email: true,
              },
            },
          },
        },
        prescription: true,
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { appointmentDate: 'desc' },
    });

    const total = await prisma.appointment.count({ where });

    res.status(200).json({
      success: true,
      data: appointments,
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

export const getDoctorAppointments = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { status, date, limit = 10, offset = 0 } = req.query;

    const doctor = await prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundError('Doctor profile not found');
    }

    const where = {
      doctorId: doctor.id,
      ...(status && { status }),
      ...(date && {
        appointmentDate: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
        },
      }),
    };

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            profilePhotoUrl: true,
          },
        },
        prescription: true,
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { appointmentDate: 'asc' },
    });

    const total = await prisma.appointment.count({ where });

    res.status(200).json({
      success: true,
      data: appointments,
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

export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
        prescription: true,
      },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    // Check access (patient or doctor)
    if (appointment.patientId !== userId && appointment.doctor.userId !== userId) {
      throw new Error('Unauthorized to view this appointment');
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      throw new ValidationError('Invalid appointment status');
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: appointment.doctorId },
    });

    // Only doctor or patient can update
    if (userId !== doctor.userId && userId !== appointment.patientId) {
      throw new Error('Unauthorized to update this appointment');
    }

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const rescheduleAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { appointmentDate, timeSlot } = req.body;
    const userId = req.user?.id;

    if (!appointmentDate || !timeSlot) {
      throw new ValidationError('New appointment date and time slot are required');
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    if (appointment.patientId !== userId) {
      throw new Error('Unauthorized to reschedule this appointment');
    }

    // Check for conflicting appointments
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: { in: ['scheduled', 'in_progress'] },
        id: { not: parseInt(id) },
      },
    });

    if (conflict) {
      throw new ConflictError('This time slot is already booked');
    }

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        appointmentDate: new Date(appointmentDate),
        timeSlot,
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    if (appointment.patientId !== userId) {
      throw new Error('Unauthorized to cancel this appointment');
    }

    if (appointment.status === 'cancelled') {
      throw new ValidationError('Appointment is already cancelled');
    }

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
