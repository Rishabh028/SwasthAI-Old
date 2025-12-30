import express from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
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
  asyncHandler(async (req, res) => {
    const { email, password, full_name } = req.body;

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      email,
      password_hash: hashedPassword,
      full_name,
      role: 'user',
      created_at: new Date(),
    };

    users.push(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
    });
  })
);

/**
 * Login user
 * POST /api/v1/auth/login
 */
router.post(
  '/login',
  loginValidation,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET || 'secret',
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      },
    });
  })
);

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AuthError('Refresh token is required');
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'refresh_secret',
      (err, user) => {
        if (err) {
          throw new AuthError('Invalid refresh token');
        }

        const newAccessToken = jwt.sign(
          {
            id: user.id,
            role: user.role,
          },
          process.env.ACCESS_TOKEN_SECRET || 'secret',
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
        );

        res.status(200).json({
          success: true,
          message: 'Token refreshed',
          data: {
            accessToken: newAccessToken,
          },
        });
      }
    );
  })
);

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  })
);

/**
 * Forgot password
 * POST /api/v1/auth/forgot-password
 */
router.post(
  '/forgot-password',
  [body('email').isEmail()],
  validate,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: 'If email exists, password reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id, purpose: 'password_reset' },
      process.env.ACCESS_TOKEN_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await emailService.sendPasswordReset(user.email, resetLink);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      // TODO: Remove in production
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  })
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
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'secret',
      async (err, decoded) => {
        if (err || decoded.purpose !== 'password_reset') {
          throw new AuthError('Invalid or expired reset token');
        }

        // Find and update user
        const user = users.find((u) => u.id === decoded.id);
        if (!user) {
          throw new AuthError('User not found');
        }

        user.password_hash = await bcrypt.hash(password, 10);

        res.status(200).json({
          success: true,
          message: 'Password reset successful',
        });
      }
    );
  })
);

/**
 * Verify email
 * POST /api/v1/auth/verify-email
 */
router.post(
  '/verify-email',
  [body('token').notEmpty()],
  validate,
  asyncHandler(async (req, res) => {
    const { token } = req.body;

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'secret',
      (err, decoded) => {
        if (err) {
          throw new AuthError('Invalid verification token');
        }

        // Find and update user
        const user = users.find((u) => u.id === decoded.id);
        if (!user) {
          throw new AuthError('User not found');
        }

        user.is_verified = true;

        res.status(200).json({
          success: true,
          message: 'Email verified successfully',
        });
      }
    );
  })
);

export default router;
