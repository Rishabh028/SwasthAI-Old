import express from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation, validate } from '../middleware/validation.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Register user
 * POST /api/v1/auth/register
 */
router.post(
  '/register',
  registerValidation,
  validate,
  asyncHandler(authController.register)
);

/**
 * Login user
 * POST /api/v1/auth/login
 */
router.post(
  '/login',
  loginValidation,
  validate,
  asyncHandler(authController.login)
);

/**
 * Get current user
 * GET /api/v1/auth/me
 */
router.get(
  '/me',
  protect,
  asyncHandler(authController.getCurrentUser)
);

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
router.post(
  '/refresh',
  asyncHandler(authController.refreshToken)
);

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
router.post(
  '/logout',
  asyncHandler(authController.logout)
);

/**
 * Forgot password
 * POST /api/v1/auth/forgot-password
 */
router.post(
  '/forgot-password',
  [body('email').isEmail()],
  validate,
  asyncHandler(authController.forgotPassword)
);

/**
 * Reset password
 * POST /api/v1/auth/reset-password
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  validate,
  asyncHandler(authController.resetPassword)
);

/**
 * Verify email
 * POST /api/v1/auth/verify-email
 */
router.post(
  '/verify-email',
  [body('token').notEmpty()],
  validate,
  asyncHandler(authController.verifyEmail)
);

export default router;
