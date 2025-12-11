import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireCompanyAccess } from '../middleware/auth.js';
import { NotFoundError, ValidationError } from '../middleware/error-handler.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

router.use(authenticate);

// =============================================================================
// STRIPE CUSTOMER MANAGEMENT
// =============================================================================

async function getOrCreateStripeCustomer(companyId: string): Promise<string> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { users: { where: { role: 'OWNER' }, take: 1 } },
  });

  if (!company) {
    throw new NotFoundError('Company');
  }

  if (company.stripeCustomerId) {
    return company.stripeCustomerId;
  }

  const ownerEmail = company.users[0]?.email || 'unknown@example.com';

  const customer = await stripe.customers.create({
    name: company.name,
    email: ownerEmail,
    metadata: { companyId: company.id },
  });

  await prisma.company.update({
    where: { id: companyId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

// =============================================================================
// BILLING OVERVIEW
// =============================================================================

/**
 * GET /api/billing/overview
 * Get billing overview for current company
 */
router.get('/overview', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;

    if (!companyId) {
      throw new ValidationError('Company ID required');
    }

    const [subscriptions, invoices, paymentMethods] = await Promise.all([
      prisma.subscription.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { milestone: { select: { name: true } } },
      }),
      prisma.paymentMethod.findMany({
        where: { companyId },
        orderBy: { isDefault: 'desc' },
      }),
    ]);

    const activeSubscription = subscriptions.find(
      (s) => s.status === 'active' || s.status === 'trialing'
    );

    const outstandingBalance = invoices
      .filter((i) => i.status === 'SENT' || i.status === 'OVERDUE')
      .reduce((sum, i) => sum + Number(i.amount), 0);

    res.json({
      data: {
        activeSubscription,
        subscriptions,
        invoices,
        paymentMethods,
        outstandingBalance,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// SUBSCRIPTION CHECKOUT
// =============================================================================

/**
 * POST /api/billing/checkout/subscription
 * Create a subscription checkout session
 */
router.post('/checkout/subscription', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!companyId) {
      throw new ValidationError('Company ID required');
    }

    if (!priceId) {
      throw new ValidationError('Price ID is required');
    }

    const customerId = await getOrCreateStripeCustomer(companyId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${process.env.PORTAL_URL}/billing?success=true`,
      cancel_url: cancelUrl || `${process.env.PORTAL_URL}/billing?canceled=true`,
      metadata: { companyId },
    });

    res.json({ data: { sessionId: session.id, url: session.url } });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// MILESTONE PAYMENT CHECKOUT
// =============================================================================

/**
 * POST /api/billing/checkout/milestone/:milestoneId
 * Create a one-time payment checkout for a milestone
 */
router.post('/checkout/milestone/:milestoneId', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;
    const { milestoneId } = req.params;
    const { successUrl, cancelUrl } = req.body;

    if (!companyId) {
      throw new ValidationError('Company ID required');
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: { select: { companyId: true, name: true } },
      },
    });

    if (!milestone) {
      throw new NotFoundError('Milestone');
    }

    if (milestone.project.companyId !== companyId && !req.user!.isAdmin) {
      throw new NotFoundError('Milestone');
    }

    if (!milestone.paymentAmount || milestone.paymentAmount.toNumber() <= 0) {
      throw new ValidationError('Milestone has no payment amount');
    }

    if (milestone.paymentStatus === 'PAID') {
      throw new ValidationError('Milestone already paid');
    }

    const customerId = await getOrCreateStripeCustomer(companyId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(milestone.paymentAmount.toNumber() * 100),
            product_data: {
              name: `${milestone.project.name} - ${milestone.name}`,
              description: `Milestone payment for ${milestone.name}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url:
        successUrl ||
        `${process.env.PORTAL_URL}/projects/${milestone.projectId}?payment=success`,
      cancel_url:
        cancelUrl ||
        `${process.env.PORTAL_URL}/projects/${milestone.projectId}?payment=canceled`,
      metadata: { companyId, milestoneId },
    });

    // Create pending invoice
    await prisma.invoice.create({
      data: {
        companyId,
        milestoneId,
        stripeInvoiceId: session.id,
        amount: milestone.paymentAmount,
        status: 'DRAFT',
      },
    });

    res.json({ data: { sessionId: session.id, url: session.url } });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// BILLING PORTAL
// =============================================================================

/**
 * POST /api/billing/portal
 * Create a Stripe Billing Portal session
 */
router.post('/portal', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;
    const { returnUrl } = req.body;

    if (!companyId) {
      throw new ValidationError('Company ID required');
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company?.stripeCustomerId) {
      throw new ValidationError('No billing account set up');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: company.stripeCustomerId,
      return_url: returnUrl || `${process.env.PORTAL_URL}/billing`,
    });

    res.json({ data: { url: session.url } });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// INVOICES
// =============================================================================

/**
 * GET /api/billing/invoices
 * Get all invoices for current company
 */
router.get('/invoices', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;

    if (!companyId) {
      throw new ValidationError('Company ID required');
    }

    const invoices = await prisma.invoice.findMany({
      where: { companyId },
      include: {
        milestone: {
          select: {
            name: true,
            project: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: invoices });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/billing/invoices/:invoiceId
 * Get invoice details
 */
router.get('/invoices/:invoiceId', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;
    const { invoiceId } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        milestone: {
          include: {
            project: { select: { name: true } },
          },
        },
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundError('Invoice');
    }

    if (invoice.companyId !== companyId && !req.user!.isAdmin) {
      throw new NotFoundError('Invoice');
    }

    res.json({ data: invoice });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// SUBSCRIPTIONS
// =============================================================================

/**
 * GET /api/billing/subscriptions
 * Get all subscriptions for current company
 */
router.get('/subscriptions', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;

    if (!companyId) {
      throw new ValidationError('Company ID required');
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: subscriptions });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/billing/subscriptions/:subscriptionId/cancel
 * Cancel a subscription
 */
router.post('/subscriptions/:subscriptionId/cancel', async (req, res, next) => {
  try {
    const companyId = req.user!.companyId;
    const { subscriptionId } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundError('Subscription');
    }

    if (subscription.companyId !== companyId && !req.user!.isAdmin) {
      throw new NotFoundError('Subscription');
    }

    // Cancel in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update local record
    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { cancelAtPeriodEnd: true },
    });

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
