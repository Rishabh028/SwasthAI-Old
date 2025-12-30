import prisma from '../config/database.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

// Forum Posts
export const listPosts = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0, sortBy = 'latest' } = req.query;

    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const orderBy = 
      sortBy === 'popular' 
        ? { upvotes: 'desc' }
        : { createdAt: 'desc' };

    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePhotoUrl: true,
          },
        },
        comments: {
          select: { id: true },
        },
        upvotes: {
          select: { userId: true },
        },
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy,
    });

    const total = await prisma.forumPost.count({ where });

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      throw new ValidationError('Title and content are required');
    }

    const post = await prisma.forumPost.create({
      data: {
        authorId: userId,
        title,
        content,
        category: category || 'general',
        tags: tags || [],
        upvotes: 0,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.forumPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            profilePhotoUrl: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                profilePhotoUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, content, category, tags } = req.body;

    const post = await prisma.forumPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    if (post.authorId !== userId) {
      throw new Error('Unauthorized to update this post');
    }

    const updated = await prisma.forumPost.update({
      where: { id: parseInt(id) },
      data: {
        title: title || undefined,
        content: content || undefined,
        category: category || undefined,
        tags: tags || undefined,
      },
      include: {
        author: {
          select: {
            fullName: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const post = await prisma.forumPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    if (post.authorId !== userId) {
      throw new Error('Unauthorized to delete this post');
    }

    await prisma.forumPost.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Forum Comments
export const addComment = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new ValidationError('Comment content is required');
    }

    const post = await prisma.forumPost.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const comment = await prisma.forumComment.create({
      data: {
        postId: parseInt(postId),
        authorId: userId,
        content,
        upvotes: 0,
      },
      include: {
        author: {
          select: {
            fullName: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const comments = await prisma.forumComment.findMany({
      where: { postId: parseInt(postId) },
      include: {
        author: {
          select: {
            fullName: true,
            profilePhotoUrl: true,
          },
        },
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.forumComment.count({
      where: { postId: parseInt(postId) },
    });

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const upvotePost = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

    const post = await prisma.forumPost.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const existingUpvote = await prisma.postUpvote.findFirst({
      where: {
        postId: parseInt(postId),
        userId,
      },
    });

    if (existingUpvote) {
      // Remove upvote
      await prisma.postUpvote.delete({
        where: { id: existingUpvote.id },
      });

      const updated = await prisma.forumPost.update({
        where: { id: parseInt(postId) },
        data: { upvotes: { decrement: 1 } },
      });

      return res.status(200).json({
        success: true,
        message: 'Upvote removed',
        data: updated,
      });
    }

    // Add upvote
    await prisma.postUpvote.create({
      data: {
        postId: parseInt(postId),
        userId,
      },
    });

    const updated = await prisma.forumPost.update({
      where: { id: parseInt(postId) },
      data: { upvotes: { increment: 1 } },
    });

    res.status(200).json({
      success: true,
      message: 'Post upvoted',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
