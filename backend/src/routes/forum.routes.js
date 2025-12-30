import express from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import * as forumController from '../controllers/forum.controller.js';

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

// GET /api/v1/forum/posts
router.get('/posts', asyncHandler(forumController.listPosts));

// POST /api/v1/forum/posts
router.post('/posts', protect, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
], validate, asyncHandler(forumController.createPost));

// GET /api/v1/forum/posts/:id
router.get('/posts/:id', asyncHandler(forumController.getPostById));

// PUT /api/v1/forum/posts/:id
router.put('/posts/:id', protect, validate, asyncHandler(forumController.updatePost));

// DELETE /api/v1/forum/posts/:id
router.delete('/posts/:id', protect, asyncHandler(forumController.deletePost));

// POST /api/v1/forum/posts/:postId/comments
router.post('/posts/:postId/comments', protect, [
  body('content').notEmpty().withMessage('Comment content is required'),
], validate, asyncHandler(forumController.addComment));

// GET /api/v1/forum/posts/:postId/comments
router.get('/posts/:postId/comments', asyncHandler(forumController.getComments));

// POST /api/v1/forum/posts/:postId/upvote
router.post('/posts/:postId/upvote', protect, asyncHandler(forumController.upvotePost));

export default router;
