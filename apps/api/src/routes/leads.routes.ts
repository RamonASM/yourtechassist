import { Router } from 'express';
import {
  sendEstimateEmail,
  sendContactEmail,
  sendEstimateConfirmationToClient,
  sendContactConfirmationToClient,
} from '../services/email.service.js';

const router = Router();

/**
 * POST /api/leads/estimate
 * Receive and email estimate questionnaire data
 */
router.post('/estimate', async (req, res) => {
  const { answers, estimate, submittedAt, clientEmail } = req.body;

  if (!answers || !estimate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Log the submission for tracking
  console.log('=== NEW ESTIMATE SUBMISSION ===');
  console.log('Tier:', estimate.tier);
  console.log('Investment:', `$${estimate.priceRange?.min} - $${estimate.priceRange?.max}`);
  console.log('Timeline:', `${estimate.timelineWeeks?.min} - ${estimate.timelineWeeks?.max} weeks`);
  console.log('Project Type:', answers.project_type);
  console.log('Primary Goal:', answers.primary_goal);
  console.log('Client Email:', clientEmail || 'Not provided');
  console.log('Submitted:', submittedAt || new Date().toISOString());
  console.log('=== END ESTIMATE ===');

  const estimateData = { answers, estimate, submittedAt: submittedAt || new Date().toISOString() };

  // Send team notification email (fire and forget)
  sendEstimateEmail(estimateData)
    .then(() => console.log('Team estimate email sent successfully'))
    .catch((error) => console.error('Error sending team estimate email:', error));

  // If client email provided, send confirmation to them too
  if (clientEmail) {
    sendEstimateConfirmationToClient(clientEmail, estimateData)
      .then(() => console.log('Client estimate confirmation sent successfully'))
      .catch((error) => console.error('Error sending client estimate confirmation:', error));
  }

  // Respond immediately
  res.json({ success: true, message: 'Estimate submitted successfully' });
});

/**
 * POST /api/leads/contact
 * Receive contact form submission with optional estimate data
 */
router.post('/contact', async (req, res) => {
  const { name, email, company, phone, projectType, budget, timeline, message, estimateData } = req.body;

  if (!name || !email || !projectType || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Log the submission for tracking
  console.log('=== NEW CONTACT SUBMISSION ===');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Company:', company || 'N/A');
  console.log('Phone:', phone || 'N/A');
  console.log('Project Type:', projectType);
  console.log('Budget:', budget || 'N/A');
  console.log('Timeline:', timeline || 'N/A');
  console.log('Message:', message);
  console.log('Has Estimate Data:', !!estimateData);
  if (estimateData) {
    console.log('Estimate Tier:', estimateData.estimate?.tier);
  }
  console.log('=== END CONTACT ===');

  // Send team notification email (fire and forget)
  sendContactEmail({
    name,
    email,
    company,
    phone,
    projectType,
    budget,
    timeline,
    message,
    estimateData,
  })
    .then(() => console.log('Team contact email sent successfully'))
    .catch((error) => console.error('Error sending team contact email:', error));

  // Send confirmation email to client
  sendContactConfirmationToClient(email, name, !!estimateData)
    .then(() => console.log('Client contact confirmation sent successfully'))
    .catch((error) => console.error('Error sending client contact confirmation:', error));

  // Respond immediately
  res.json({ success: true, message: 'Contact form submitted successfully' });
});

export default router;
