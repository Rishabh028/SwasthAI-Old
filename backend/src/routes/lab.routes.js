import express from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import * as labController from '../controllers/lab.controller.js';

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

// GET /api/v1/lab/tests
router.get('/tests', asyncHandler(labController.listLabTests));

// GET /api/v1/lab/tests/:id
router.get('/tests/:id', asyncHandler(labController.getTestById));

// POST /api/v1/lab/book
router.post('/book', protect, [
  body('tests').isArray().withMessage('Tests must be an array'),
  body('bookingType').isIn(['home_collection', 'lab_visit']),
  body('bookingDate').isISO8601(),
  body('timeSlot').notEmpty(),
], validate, asyncHandler(labController.bookLabTest));

// GET /api/v1/lab/bookings
router.get('/bookings', protect, asyncHandler(labController.getMyBookings));

// GET /api/v1/lab/bookings/:id
router.get('/bookings/:id', protect, asyncHandler(labController.getBookingById));

// PATCH /api/v1/lab/bookings/:id
router.patch('/bookings/:id', protect, [
  body('status').notEmpty(),
], validate, asyncHandler(labController.updateBookingStatus));

// POST /api/v1/lab/bookings/:id/report
router.post('/bookings/:id/report', protect, [
  body('reportUrl').notEmpty(),
], validate, asyncHandler(labController.uploadReport));

export default router;
