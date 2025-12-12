import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { errorHandler } from './middleware/error-handler.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';
import projectRoutes from './routes/project.routes.js';
import billingRoutes from './routes/billing.routes.js';
import stripeWebhooks from './routes/stripe-webhooks.js';
import leadsRoutes from './routes/leads.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Stripe webhooks need raw body
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3002',
  'https://yourtechassist.us',
  'https://www.yourtechassist.us',
  'https://portal.yourtechassist.us',
  'https://admin.yourtechassist.us',
  'https://app.yourtechassist.us',
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/webhooks/stripe', stripeWebhooks);
app.use('/api/leads', leadsRoutes);

// Error handler
app.use(errorHandler);

// Start server
async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});
