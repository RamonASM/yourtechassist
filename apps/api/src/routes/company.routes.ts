import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireCompanyAccess } from '../middleware/auth.js';
import { NotFoundError, ValidationError } from '../middleware/error-handler.js';

const router = Router();

router.use(authenticate);

/**
 * GET /api/companies/:companyId
 * Get company details
 */
router.get('/:companyId', requireCompanyAccess, async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true },
        },
        onboarding: true,
      },
    });

    if (!company) {
      throw new NotFoundError('Company');
    }

    res.json({ data: company });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/companies/:companyId
 * Update company details
 */
router.put('/:companyId', requireCompanyAccess, async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { name, industry, size, website } = req.body;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        ...(name && { name }),
        ...(industry && { industry }),
        ...(size && { size }),
        ...(website && { website }),
      },
    });

    res.json({ data: company });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/companies/:companyId/onboarding
 * Get onboarding data
 */
router.get('/:companyId/onboarding', requireCompanyAccess, async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const onboarding = await prisma.onboardingData.findUnique({
      where: { companyId },
    });

    if (!onboarding) {
      throw new NotFoundError('Onboarding data');
    }

    res.json({ data: onboarding });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/companies/:companyId/onboarding
 * Update onboarding data
 */
router.put('/:companyId/onboarding', requireCompanyAccess, async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const data = req.body;

    // Calculate suggested tier based on onboarding data
    const suggestedTier = calculateSuggestedTier(data);

    const onboarding = await prisma.onboardingData.update({
      where: { companyId },
      data: {
        ...data,
        suggestedTier: suggestedTier.tier,
        estimatedMin: suggestedTier.min,
        estimatedMax: suggestedTier.max,
      },
    });

    res.json({
      data: onboarding,
      suggestion: suggestedTier,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/companies/:companyId/onboarding/complete
 * Mark onboarding as complete
 */
router.post('/:companyId/onboarding/complete', requireCompanyAccess, async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const onboarding = await prisma.onboardingData.update({
      where: { companyId },
      data: { completedAt: new Date() },
    });

    res.json({ data: onboarding });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/companies/:companyId/users
 * Get company users
 */
router.get('/:companyId/users', requireCompanyAccess, async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const users = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.json({ data: users });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/companies/:companyId/users
 * Invite a new user to the company
 */
router.post('/:companyId/users', requireCompanyAccess, async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { email, name, role } = req.body;

    if (!email || !name) {
      throw new ValidationError('Email and name are required');
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Create user with temporary password (they'll set it via email link)
    const user = await prisma.user.create({
      data: {
        companyId,
        email,
        name,
        passwordHash: '', // Empty until they set password
        role: role || 'MEMBER',
        isActive: false, // Inactive until they accept invite
      },
    });

    // TODO: Send invitation email

    res.status(201).json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Invitation sent',
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

interface TierSuggestion {
  tier: string;
  min: number;
  max: number;
  confidence: 'high' | 'medium' | 'low';
  factors: string[];
}

function calculateSuggestedTier(data: {
  companySize?: string;
  keyFeatures?: string[];
  integrations?: string[];
  timeline?: string;
}): TierSuggestion {
  let score = 0;
  const factors: string[] = [];

  // Company size factor
  if (data.companySize === '200+') {
    score += 3;
    factors.push('Enterprise-scale organization');
  } else if (data.companySize === '51-200') {
    score += 2;
    factors.push('Mid-size organization');
  } else if (data.companySize === '11-50') {
    score += 1;
  }

  // Feature complexity
  const featureCount = data.keyFeatures?.length || 0;
  if (featureCount > 10) {
    score += 3;
    factors.push('Complex feature requirements');
  } else if (featureCount > 5) {
    score += 2;
  } else if (featureCount > 0) {
    score += 1;
  }

  // Integration requirements
  const integrationCount = data.integrations?.length || 0;
  if (integrationCount > 3) {
    score += 2;
    factors.push('Multiple system integrations');
  } else if (integrationCount > 0) {
    score += 1;
  }

  // Timeline urgency
  if (data.timeline === 'ASAP') {
    score += 1;
    factors.push('Accelerated timeline');
  }

  // Determine tier
  if (score >= 7) {
    return {
      tier: 'scale',
      min: 150000,
      max: 500000,
      confidence: 'medium',
      factors,
    };
  } else if (score >= 4) {
    return {
      tier: 'growth',
      min: 75000,
      max: 150000,
      confidence: 'medium',
      factors,
    };
  } else if (score >= 2) {
    return {
      tier: 'launchpad',
      min: 25000,
      max: 50000,
      confidence: 'high',
      factors,
    };
  } else {
    return {
      tier: 'starter',
      min: 2000,
      max: 12000,
      confidence: 'high',
      factors,
    };
  }
}

export default router;
