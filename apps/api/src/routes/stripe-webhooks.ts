import { Router, raw } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
router.post('/', raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// =============================================================================
// WEBHOOK HANDLERS
// =============================================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { companyId, milestoneId } = session.metadata || {};

  if (!companyId) {
    console.error('No companyId in checkout session metadata');
    return;
  }

  if (session.mode === 'subscription') {
    // Handle subscription checkout
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await prisma.subscription.create({
      data: {
        companyId,
        stripeSubscriptionId: subscriptionId,
        status: subscription.status,
        plan: determinePlanFromPrice(subscription.items.data[0]?.price.id),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    // Create activity log
    await prisma.activityFeed.create({
      data: {
        type: 'SUBSCRIPTION_CREATED',
        title: 'Subscription Started',
        description: `Subscription to ${determinePlanFromPrice(subscription.items.data[0]?.price.id)} plan activated`,
        metadata: { subscriptionId },
      },
    });

    console.log(`Subscription created for company ${companyId}`);
  } else if (session.mode === 'payment' && milestoneId) {
    // Handle milestone payment
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { paymentStatus: 'PAID' },
    });

    await prisma.invoice.updateMany({
      where: { milestoneId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true },
    });

    if (milestone) {
      await prisma.activityFeed.create({
        data: {
          projectId: milestone.projectId,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Received',
          description: `Payment received for milestone: ${milestone.name}`,
          metadata: { milestoneId, amount: milestone.paymentAmount?.toString() },
        },
      });
    }

    console.log(`Milestone ${milestoneId} payment completed`);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const { customer } = invoice;
  const stripeCustomerId = typeof customer === 'string' ? customer : customer?.id;

  if (!stripeCustomerId) return;

  // Find company by Stripe customer ID
  const company = await prisma.company.findFirst({
    where: { stripeCustomerId },
  });

  if (!company) {
    console.error(`Company not found for Stripe customer ${stripeCustomerId}`);
    return;
  }

  // Update any matching invoice
  if (invoice.id) {
    await prisma.invoice.updateMany({
      where: { stripeInvoiceId: invoice.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });
  }

  // Record payment
  await prisma.payment.create({
    data: {
      companyId: company.id,
      stripePaymentIntentId: invoice.payment_intent as string,
      amount: invoice.amount_paid / 100,
      status: 'succeeded',
    },
  });

  console.log(`Invoice ${invoice.id} marked as paid for company ${company.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const { customer } = invoice;
  const stripeCustomerId = typeof customer === 'string' ? customer : customer?.id;

  if (!stripeCustomerId) return;

  const company = await prisma.company.findFirst({
    where: { stripeCustomerId },
  });

  if (!company) return;

  // Update invoice status
  if (invoice.id) {
    await prisma.invoice.updateMany({
      where: { stripeInvoiceId: invoice.id },
      data: { status: 'OVERDUE' },
    });
  }

  // Create notification
  await prisma.notification.create({
    data: {
      type: 'PAYMENT_FAILED',
      title: 'Payment Failed',
      message: 'Your recent payment attempt failed. Please update your payment method.',
      metadata: { invoiceId: invoice.id },
    },
  });

  console.log(`Invoice ${invoice.id} payment failed for company ${company.id}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!existingSubscription) {
    // If subscription doesn't exist, it might be created via API directly
    // Try to find company from Stripe customer
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const companyId = (customer as Stripe.Customer).metadata?.companyId;

    if (companyId) {
      await prisma.subscription.create({
        data: {
          companyId,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          plan: determinePlanFromPrice(subscription.items.data[0]?.price.id),
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
    }
    return;
  }

  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      status: subscription.status,
      plan: determinePlanFromPrice(subscription.items.data[0]?.price.id),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Subscription ${subscription.id} updated`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const existingSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!existingSubscription) return;

  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
    },
  });

  // Create activity log
  await prisma.activityFeed.create({
    data: {
      type: 'SUBSCRIPTION_CANCELED',
      title: 'Subscription Canceled',
      description: 'Your subscription has been canceled',
      metadata: { subscriptionId: subscription.id },
    },
  });

  console.log(`Subscription ${subscription.id} canceled`);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function determinePlanFromPrice(priceId: string | undefined): string {
  if (!priceId) return 'unknown';

  const priceMappings: Record<string, string> = {
    [process.env.STRIPE_PRICE_STARTER_MONTHLY || '']: 'starter',
    [process.env.STRIPE_PRICE_LAUNCHPAD_MONTHLY || '']: 'launchpad',
    [process.env.STRIPE_PRICE_GROWTH_MONTHLY || '']: 'growth',
    [process.env.STRIPE_PRICE_SCALE_MONTHLY || '']: 'scale',
  };

  return priceMappings[priceId] || 'custom';
}

export default router;
