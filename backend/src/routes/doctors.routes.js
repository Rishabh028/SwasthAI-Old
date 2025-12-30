import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import * as doctorsController from '../controllers/doctors.controller.js';

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

// GET /api/v1/doctors
router.get('/', asyncHandler(doctorsController.listDoctors));

// GET /api/v1/doctors/nearby
router.get('/nearby', [
  query('latitude').isFloat(),
  query('longitude').isFloat(),
], validate, asyncHandler(doctorsController.getNearbyDoctors));

// GET /api/v1/doctors/:id
router.get('/:id', asyncHandler(doctorsController.getDoctorById));

// GET /api/v1/doctors/profile/me
router.get('/profile/me', protect, asyncHandler(doctorsController.getMyProfile));

// PUT /api/v1/doctors/profile/me
router.put('/profile/me', protect, [
  body('specialty').optional().trim(),
  body('consultationFee').optional().isFloat({ min: 0 }),
], validate, asyncHandler(doctorsController.updateDoctorProfile));

// POST /api/v1/doctors/:id/reviews
router.post('/:id/reviews', protect, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim(),
], validate, asyncHandler(doctorsController.addReview));

// GET /api/v1/doctors/:id/reviews
router.get('/:id/reviews', asyncHandler(doctorsController.getReviews));

export default router;
