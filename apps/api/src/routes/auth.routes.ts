import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { ValidationError, NotFoundError, UnauthorizedError } from '../middleware/error-handler.js';

const router = Router();

// =============================================================================
// CLIENT AUTH ROUTES
// =============================================================================

/**
 * POST /api/auth/register
 * Register a new company and user
 */
router.post('/register', async (req, res, next) => {
  try {
    const { companyName, name, email, password } = req.body;

    if (!companyName || !name || !email || !password) {
      throw new ValidationError('All fields are required');
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create company and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: { name: companyName },
      });

      const user = await tx.user.create({
        data: {
          companyId: company.id,
          email,
          name,
          passwordHash,
          role: 'OWNER',
        },
      });

      // Create empty onboarding data
      await tx.onboardingData.create({
        data: { companyId: company.id },
      });

      return { company, user };
    });

    // Generate token
    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      companyId: result.company.id,
    });

    res.status(201).json({
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      company: {
        id: result.company.id,
        name: result.company.name,
      },
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Login for client users
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      company: {
        id: user.company.id,
        name: user.company.name,
      },
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (req.user.isAdmin) {
      const adminUser = await prisma.adminUser.findUnique({
        where: { id: req.user.userId },
      });
      if (!adminUser) {
        throw new NotFoundError('Admin user');
      }
      return res.json({
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          isAdmin: true,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { company: true },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      company: {
        id: user.company.id,
        name: user.company.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// ADMIN AUTH ROUTES
// =============================================================================

/**
 * POST /api/auth/admin/login
 * Login for admin users
 */
router.post('/admin/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!adminUser || !adminUser.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, adminUser.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      isAdmin: true,
    });

    res.json({
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        isAdmin: true,
      },
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
