import express from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import * as appointmentsController from '../controllers/appointments.controller.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// POST /api/v1/appointments
router.post('/', protect, [
  body('doctorId').isInt(),
  body('appointmentDate').isISO8601(),
  body('timeSlot').notEmpty(),
  body('consultationType').isIn(['online', 'in_clinic']),
], validate, asyncHandler(appointmentsController.bookAppointment));

// GET /api/v1/appointments
router.get('/', protect, asyncHandler(appointmentsController.getMyAppointments));

// GET /api/v1/appointments/doctor/list
router.get('/doctor/list', protect, asyncHandler(appointmentsController.getDoctorAppointments));

// GET /api/v1/appointments/:id
router.get('/:id', protect, asyncHandler(appointmentsController.getAppointmentById));

// PATCH /api/v1/appointments/:id/status
router.patch('/:id/status', protect, [
  body('status').notEmpty(),
], validate, asyncHandler(appointmentsController.updateAppointmentStatus));

// PATCH /api/v1/appointments/:id/reschedule
router.patch('/:id/reschedule', protect, [
  body('appointmentDate').isISO8601(),
  body('timeSlot').notEmpty(),
], validate, asyncHandler(appointmentsController.rescheduleAppointment));

// DELETE /api/v1/appointments/:id
router.delete('/:id', protect, asyncHandler(appointmentsController.cancelAppointment));

export default router;
