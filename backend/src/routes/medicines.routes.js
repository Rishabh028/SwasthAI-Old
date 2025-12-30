import express from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import * as medicinesController from '../controllers/medicines.controller.js';

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

// GET /api/v1/medicines
router.get('/', asyncHandler(medicinesController.listMedicines));

// GET /api/v1/medicines/:id
router.get('/:id', asyncHandler(medicinesController.getMedicineById));

// POST /api/v1/medicines/order
router.post('/order', protect, [
  body('items').isArray().withMessage('Items must be an array'),
], validate, asyncHandler(medicinesController.orderMedicines));

// GET /api/v1/medicines/orders/my
router.get('/orders/my', protect, asyncHandler(medicinesController.getMyOrders));

// GET /api/v1/medicines/orders/:id
router.get('/orders/:id', protect, asyncHandler(medicinesController.getOrderById));

// PATCH /api/v1/medicines/orders/:id
router.patch('/orders/:id', protect, [
  body('status').notEmpty().withMessage('Status is required'),
], validate, asyncHandler(medicinesController.updateOrderStatus));

export default router;
