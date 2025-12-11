import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireCompanyAccess } from '../middleware/auth.js';
import { NotFoundError, ValidationError } from '../middleware/error-handler.js';

const router = Router();

router.use(authenticate);

/**
 * GET /api/projects
 * Get all projects for current user's company
 */
router.get('/', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;

    if (!companyId && !req.user!.isAdmin) {
      throw new ValidationError('Company ID required');
    }

    const where = req.user!.isAdmin ? {} : { companyId };

    const projects = await prisma.project.findMany({
      where,
      include: {
        company: { select: { name: true } },
        milestones: {
          orderBy: { sortOrder: 'asc' },
          take: 5,
        },
        _count: {
          select: {
            tasks: true,
            featureRequests: true,
            issues: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ data: projects });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:projectId
 * Get project details
 */
router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        company: { select: { id: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            adminUser: { select: { id: true, name: true, email: true } },
          },
        },
        milestones: {
          orderBy: { sortOrder: 'asc' },
          include: {
            tasks: { orderBy: { createdAt: 'asc' } },
            invoice: true,
          },
        },
        iterations: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            tasks: true,
            featureRequests: true,
            issues: true,
            files: true,
            comments: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    // Check access
    if (!req.user!.isAdmin && project.companyId !== req.user!.companyId) {
      throw new NotFoundError('Project');
    }

    res.json({ data: project });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:projectId/milestones
 * Get project milestones
 */
router.get('/:projectId/milestones', async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      include: {
        tasks: { orderBy: { createdAt: 'asc' } },
        invoice: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    res.json({ data: milestones });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:projectId/tasks
 * Get project tasks
 */
router.get('/:projectId/tasks', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, milestoneId } = req.query;

    const tasks = await prisma.projectTask.findMany({
      where: {
        projectId,
        ...(status && { status: status as string }),
        ...(milestoneId && { milestoneId: milestoneId as string }),
      },
      include: {
        milestone: { select: { name: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });

    res.json({ data: tasks });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:projectId/feature-requests
 * Get feature requests for a project
 */
router.get('/:projectId/feature-requests', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, type } = req.query;

    const requests = await prisma.featureRequest.findMany({
      where: {
        projectId,
        ...(status && { status: status as string }),
        ...(type && { type: type as string }),
      },
      include: {
        user: { select: { name: true, email: true } },
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: requests });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/projects/:projectId/feature-requests
 * Create a new feature request
 */
router.post('/:projectId/feature-requests', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { type, priority, title, description } = req.body;

    if (!title || !description) {
      throw new ValidationError('Title and description are required');
    }

    const request = await prisma.featureRequest.create({
      data: {
        projectId,
        userId: req.user!.userId,
        type: type || 'feature',
        priority: priority || 'MEDIUM',
        title,
        description,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    res.status(201).json({ data: request });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:projectId/issues
 * Get issues for a project
 */
router.get('/:projectId/issues', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, severity } = req.query;

    const issues = await prisma.issue.findMany({
      where: {
        projectId,
        ...(status && { status: status as string }),
        ...(severity && { severity: severity as string }),
      },
      include: {
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: issues });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/projects/:projectId/issues
 * Report a new issue
 */
router.post('/:projectId/issues', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, severity } = req.body;

    if (!title || !description) {
      throw new ValidationError('Title and description are required');
    }

    const issue = await prisma.issue.create({
      data: {
        projectId,
        reportedBy: req.user!.userId,
        title,
        description,
        severity: severity || 'medium',
      },
    });

    res.status(201).json({ data: issue });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:projectId/comments
 * Get project comments
 */
router.get('/:projectId/comments', async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { projectId, parentId: null }, // Top-level comments only
      include: {
        user: { select: { name: true, email: true } },
        adminUser: { select: { name: true, email: true } },
        replies: {
          include: {
            user: { select: { name: true, email: true } },
            adminUser: { select: { name: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: comments });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/projects/:projectId/comments
 * Add a comment
 */
router.post('/:projectId/comments', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { content, parentId } = req.body;

    if (!content) {
      throw new ValidationError('Content is required');
    }

    const commentData: {
      projectId: string;
      content: string;
      parentId?: string;
      userId?: string;
      adminUserId?: string;
    } = {
      projectId,
      content,
      ...(parentId && { parentId }),
    };

    if (req.user!.isAdmin) {
      commentData.adminUserId = req.user!.userId;
    } else {
      commentData.userId = req.user!.userId;
    }

    const comment = await prisma.comment.create({
      data: commentData,
      include: {
        user: { select: { name: true, email: true } },
        adminUser: { select: { name: true, email: true } },
      },
    });

    res.status(201).json({ data: comment });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:projectId/files
 * Get project files
 */
router.get('/:projectId/files', async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const files = await prisma.fileAttachment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: files });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:projectId/activity
 * Get project activity feed
 */
router.get('/:projectId/activity', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { limit = '20' } = req.query;

    const activities = await prisma.activityFeed.findMany({
      where: { projectId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
    });

    res.json({ data: activities });
  } catch (error) {
    next(error);
  }
});

export default router;
