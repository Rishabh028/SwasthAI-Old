import jwt from 'jsonwebtoken';
import logger from './logger.js';

/**
 * Verify JWT token and extract user information
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is missing',
      code: 'NO_TOKEN',
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret', (err, user) => {
    if (err) {
      logger.warn(`Invalid token: ${err.message}`);
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      });
    }
    req.user = user;
    next();
  });
};

// Alias for backwards compatibility
export const protect = authenticateToken;

/**
 * Optional authentication - doesn't fail if token is missing
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret', (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};

/**
 * Verify that user is a doctor
 */
export const isDoctorAuth = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only doctors can access this resource.',
        code: 'NOT_DOCTOR',
      });
    }
    next();
  });
};

/**
 * Verify that user is an admin
 */
export const isAdminAuth = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
        code: 'NOT_ADMIN',
      });
    }
    next();
  });
};

/**
 * Allow multiple roles
 */
export const hasRole = (allowedRoles) => {
  return (req, res, next) => {
    authenticateToken(req, res, () => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
          code: 'INSUFFICIENT_ROLE',
        });
      }
      next();
    });
  };
};
