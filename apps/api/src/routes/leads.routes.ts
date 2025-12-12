import { Router } from 'express';
import { sendEstimateEmail, sendContactEmail } from '../services/email.service.js';

const router = Router();

/**
 * POST /api/leads/estimate
 * Receive and email estimate questionnaire data
 */
router.post('/estimate', async (req, res) => {
  try {
    const { answers, estimate, submittedAt } = req.body;

    if (!answers || !estimate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email notification
    await sendEstimateEmail({ answers, estimate, submittedAt: submittedAt || new Date().toISOString() });

    res.json({ success: true, message: 'Estimate submitted successfully' });
  } catch (error) {
    console.error('Error processing estimate:', error);
    // Don't fail the request if email fails - just log it
    res.json({ success: true, message: 'Estimate received', emailSent: false });
  }
});

/**
 * POST /api/leads/contact
 * Receive contact form submission with optional estimate data
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, company, phone, projectType, budget, timeline, message, estimateData } = req.body;

    if (!name || !email || !projectType || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email notification
    await sendContactEmail({
      name,
      email,
      company,
      phone,
      projectType,
      budget,
      timeline,
      message,
      estimateData,
    });

    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    // Don't fail the request if email fails
    res.json({ success: true, message: 'Contact received', emailSent: false });
  }
});

export default router;
