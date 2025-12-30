import express from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import * as healthController from '../controllers/health.controller.js';
import * as articlesController from '../controllers/articles.controller.js';
import * as notificationsController from '../controllers/notifications.controller.js';

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

// Health Records
router.get('/records', protect, asyncHandler(healthController.listHealthRecords));
router.get('/records/:id', protect, asyncHandler(healthController.getRecordById));
router.post('/records', protect, [
  body('title').notEmpty(),
  body('type').isIn(['prescription', 'lab_report', 'medical_certificate', 'scan', 'x_ray', 'other']),
  body('fileUrl').notEmpty(),
], validate, asyncHandler(healthController.uploadRecord));
router.put('/records/:id', protect, validate, asyncHandler(healthController.updateRecord));
router.delete('/records/:id', protect, asyncHandler(healthController.deleteRecord));
router.put('/records/:id/share', protect, validate, asyncHandler(healthController.shareRecord));

// Health Articles
router.get('/articles', asyncHandler(articlesController.listArticles));
router.get('/articles/:id', asyncHandler(articlesController.getArticleById));
router.get('/articles/saved', protect, asyncHandler(articlesController.getSavedArticles));
router.post('/articles/:articleId/save', protect, asyncHandler(articlesController.saveArticle));
router.delete('/articles/:articleId/save', protect, asyncHandler(articlesController.removeArticle));

// Notifications
router.get('/notifications', protect, asyncHandler(notificationsController.getNotifications));
router.patch('/notifications/:id/read', protect, asyncHandler(notificationsController.markAsRead));
router.patch('/notifications/read-all', protect, asyncHandler(notificationsController.markAllAsRead));
router.delete('/notifications/:id', protect, asyncHandler(notificationsController.deleteNotification));
router.get('/notifications/unread-count', protect, asyncHandler(notificationsController.getUnreadCount));

export default router;
