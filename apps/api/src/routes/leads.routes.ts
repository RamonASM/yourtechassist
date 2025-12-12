import { Router } from 'express';
import { sendEstimateEmail, sendContactEmail } from '../services/email.service.js';

const router = Router();

/**
 * POST /api/leads/estimate
 * Receive and email estimate questionnaire data
 */
router.post('/estimate', async (req, res) => {
  const { answers, estimate, submittedAt } = req.body;

  if (!answers || !estimate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Send email notification (fire and forget - don't await)
  sendEstimateEmail({ answers, estimate, submittedAt: submittedAt || new Date().toISOString() })
    .then(() => console.log('Estimate email sent successfully'))
    .catch((error) => console.error('Error sending estimate email:', error));

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

  // Send email notification (fire and forget - don't await)
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
    .then(() => console.log('Contact email sent successfully'))
    .catch((error) => console.error('Error sending contact email:', error));

  // Respond immediately
  res.json({ success: true, message: 'Contact form submitted successfully' });
});

export default router;
