import { validationResult, body } from 'express-validator';

/**
 * Middleware to handle validation errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
      message: 'Validation failed',
    });
  }
  next();
};

/**
 * Common validation chains
 */
export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const updateProfileValidation = [
  body('fullName').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('bloodGroup').optional(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('country').optional().trim(),
];

export const appointmentValidation = [
  body('doctorId').isInt().withMessage('Doctor ID must be an integer'),
  body('appointmentDate').isISO8601().withMessage('Invalid appointment date'),
  body('reason').trim().notEmpty().withMessage('Reason for appointment is required'),
];

export const medicineValidation = [
  body('name').trim().notEmpty().withMessage('Medicine name is required'),
  body('dosage').trim().notEmpty().withMessage('Dosage is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

export const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
];
