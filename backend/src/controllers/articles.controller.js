import prisma from '../config/database.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

export const listArticles = async (req, res, next) => {
  try {
    const { search, category, limit = 10, offset = 0 } = req.query;

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
        category ? { category: { contains: category, mode: 'insensitive' } } : {},
      ].filter(cond => Object.keys(cond).length > 0),
    };

    const articles = await prisma.healthArticle.findMany({
      where: where.AND.length > 0 ? where : {},
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

    const total = await prisma.healthArticle.count({
      where: where.AND.length > 0 ? where : {},
    });

    res.status(200).json({
      success: true,
      data: articles,
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

export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.healthArticle.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            fullName: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundError('Article not found');
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedArticles = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { limit = 10, offset = 0 } = req.query;

    const saved = await prisma.savedArticle.findMany({
      where: { userId },
      include: {
        article: {
          include: {
            author: {
              select: {
                fullName: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.savedArticle.count({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      data: saved,
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

export const saveArticle = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { articleId } = req.params;

    const article = await prisma.healthArticle.findUnique({
      where: { id: parseInt(articleId) },
    });

    if (!article) {
      throw new NotFoundError('Article not found');
    }

    const existing = await prisma.savedArticle.findFirst({
      where: {
        userId,
        articleId: parseInt(articleId),
      },
    });

    if (existing) {
      throw new ValidationError('Article already saved');
    }

    const saved = await prisma.savedArticle.create({
      data: {
        userId,
        articleId: parseInt(articleId),
      },
      include: {
        article: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Article saved successfully',
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

export const removeArticle = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { articleId } = req.params;

    const saved = await prisma.savedArticle.findFirst({
      where: {
        userId,
        articleId: parseInt(articleId),
      },
    });

    if (!saved) {
      throw new NotFoundError('Saved article not found');
    }

    await prisma.savedArticle.delete({
      where: { id: saved.id },
    });

    res.status(200).json({
      success: true,
      message: 'Article removed from saved',
    });
  } catch (error) {
    next(error);
  }
};
