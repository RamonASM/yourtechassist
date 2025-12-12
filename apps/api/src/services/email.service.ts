import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'YourTechAssist <noreply@yourtechassist.us>';
const TEAM_EMAIL = 'ramon@aerialshots.media';

interface EstimateData {
  answers: Record<string, string | string[]>;
  estimate: {
    tier: string;
    tierDescription?: string;
    priceRange: { min: number; max: number };
    timelineWeeks: { min: number; max: number };
    phases: string[];
    keyFeatures: string[];
    recommendations: string[];
    fitScore: number;
    fitAssessment: string;
  };
  submittedAt: string;
}

interface ContactData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
  estimateData?: EstimateData;
}

// Map option IDs to readable labels
const optionLabels: Record<string, string> = {
  // Project types
  internal_tool: 'Internal Tool / Dashboard',
  customer_portal: 'Customer-Facing Portal',
  saas_product: 'SaaS Product',
  ecommerce: 'E-commerce / Marketplace',
  mobile_app: 'Mobile Application',
  other: 'Something Else',
  // Current state
  scratch: 'Starting Fresh',
  manual: 'Manual Processes / Spreadsheets',
  legacy: 'Replacing Old System',
  prototype: 'Have a Prototype/MVP',
  enhancement: 'Adding to Existing Product',
  // Pain points
  time_waste: 'Too Much Manual Work',
  no_visibility: 'Lack of Visibility',
  scattered_data: 'Data in Too Many Places',
  poor_cx: 'Poor Customer Experience',
  scaling: 'Struggling to Scale',
  errors: 'Too Many Errors',
  communication: 'Communication Gaps',
  // Pain severity
  critical: 'Critical - Losing Money Daily',
  high: 'High - Major Inefficiency',
  medium: 'Medium - Need to Address Soon',
  low: 'Planning Ahead',
  // Primary goal
  save_time: 'Save Time',
  increase_revenue: 'Increase Revenue',
  reduce_errors: 'Reduce Errors',
  better_cx: 'Improve Customer Experience',
  scale: 'Enable Growth',
  visibility: 'Gain Visibility',
  // Success metric
  time_saved: 'Hours Saved Per Week',
  revenue_increase: 'Revenue or Conversion Increase',
  error_reduction: 'Error Rate Reduction',
  customer_satisfaction: 'Customer Satisfaction Score',
  capacity: 'Capacity Increase',
  not_sure: "I'm Not Sure Yet",
  // User count
  solo: 'Just Me',
  small_team: '2-10 Users',
  medium_team: '11-50 Users',
  large: '50+ Internal Users',
  public: 'Public / Customer-Facing',
  // Features
  auth: 'User Accounts & Login',
  payments: 'Payment Processing',
  integrations: 'Third-Party Integrations',
  reporting: 'Reporting & Analytics',
  notifications: 'Email/SMS Notifications',
  file_upload: 'File Uploads & Storage',
  roles: 'Multiple User Roles',
  mobile: 'Mobile-Friendly',
  realtime: 'Real-Time Updates',
  // Timeline
  asap: 'ASAP (1-2 months)',
  soon: 'Soon (2-4 months)',
  standard: 'Standard (4-6 months)',
  relaxed: 'Flexible (6+ months)',
  // Budget
  exploring: 'Not Sure Yet',
  starter: 'Under $25,000',
  growth: '$25,000 - $75,000',
  scale_budget: '$75,000 - $150,000',
  enterprise: '$150,000+',
  // Decision maker
  committee: 'Multiple Stakeholders',
  board: 'Board / Executive Approval',
  // Decision timeline
  immediate: 'Ready Now',
  planning: 'Within 3-6 Months',
  research: 'Just Researching',
};

function getLabel(id: string): string {
  return optionLabels[id] || id;
}

// ============================================================================
// TEAM NOTIFICATION EMAILS
// ============================================================================

export async function sendEstimateEmail(data: EstimateData): Promise<void> {
  const { answers, estimate, submittedAt } = data;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0 0 10px 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .estimate-card { background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .tier-badge { display: inline-block; background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 10px; }
    .stats { display: flex; gap: 15px; margin-top: 15px; }
    .stat { background: white; padding: 15px; border-radius: 8px; flex: 1; }
    .stat-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
    .stat-value { font-size: 18px; font-weight: 600; color: #111827; }
    .list { list-style: none; padding: 0; margin: 0; }
    .list li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    .list li:last-child { border-bottom: none; }
    .footer { background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Project Estimate</h1>
      <p>Submitted ${new Date(submittedAt).toLocaleString()}</p>
    </div>

    <div class="content">
      <div class="estimate-card">
        <span class="tier-badge">${estimate.tier} Tier</span>
        <p style="margin: 10px 0 0 0; color: #4b5563;">${estimate.tierDescription || ''}</p>

        <div class="stats">
          <div class="stat">
            <div class="stat-label">Investment</div>
            <div class="stat-value">$${estimate.priceRange.min.toLocaleString()} - $${estimate.priceRange.max.toLocaleString()}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Timeline</div>
            <div class="stat-value">${estimate.timelineWeeks.min} - ${estimate.timelineWeeks.max} weeks</div>
          </div>
          <div class="stat">
            <div class="stat-label">Fit Score</div>
            <div class="stat-value">${estimate.fitScore}%</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Project Details</div>
        <ul class="list">
          <li><strong>Project Type:</strong> ${getLabel(answers.project_type as string)}</li>
          <li><strong>Current State:</strong> ${getLabel(answers.current_state as string) || 'N/A'}</li>
          <li><strong>Primary Goal:</strong> ${getLabel(answers.primary_goal as string)}</li>
          <li><strong>Timeline Preference:</strong> ${getLabel(answers.timeline as string) || 'N/A'}</li>
          <li><strong>Budget Range:</strong> ${getLabel(answers.budget_range as string) || 'N/A'}</li>
        </ul>
      </div>

      ${Array.isArray(answers.pain_points) && answers.pain_points.length > 0 ? `
      <div class="section">
        <div class="section-title">Pain Points</div>
        <ul class="list">
          ${answers.pain_points.map(p => `<li>${getLabel(p)}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${Array.isArray(answers.features) && answers.features.length > 0 ? `
      <div class="section">
        <div class="section-title">Requested Features</div>
        <ul class="list">
          ${answers.features.map(f => `<li>${getLabel(f)}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Recommendations</div>
        <ul class="list">
          ${estimate.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="footer">
      YourTechAssist Project Estimator
    </div>
  </div>
</body>
</html>
`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: TEAM_EMAIL,
    subject: `New Project Estimate - ${estimate.tier} Tier ($${estimate.priceRange.min.toLocaleString()}+)`,
    html,
  });
}

export async function sendContactEmail(data: ContactData): Promise<void> {
  const { name, email, company, phone, projectType, budget, timeline, message, estimateData } = data;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0 0 10px 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .info-row { padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .info-label { font-weight: 600; color: #374151; }
    .message-box { background: #f9fafb; padding: 20px; border-radius: 8px; white-space: pre-wrap; }
    .estimate-badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
    .estimate-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin-top: 20px; }
    .footer { background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p>${name}${company ? ` from ${company}` : ''}</p>
    </div>

    <div class="content">
      ${estimateData ? '<span class="estimate-badge">Has Estimate Data</span>' : ''}

      <div class="section">
        <div class="section-title">Contact Information</div>
        <div class="info-row"><span class="info-label">Name:</span> ${name}</div>
        <div class="info-row"><span class="info-label">Email:</span> <a href="mailto:${email}">${email}</a></div>
        ${company ? `<div class="info-row"><span class="info-label">Company:</span> ${company}</div>` : ''}
        ${phone ? `<div class="info-row"><span class="info-label">Phone:</span> <a href="tel:${phone}">${phone}</a></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Project Details</div>
        <div class="info-row"><span class="info-label">Type:</span> ${projectType}</div>
        ${budget ? `<div class="info-row"><span class="info-label">Budget:</span> ${budget}</div>` : ''}
        ${timeline ? `<div class="info-row"><span class="info-label">Timeline:</span> ${timeline}</div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Message</div>
        <div class="message-box">${message}</div>
      </div>

      ${estimateData ? `
      <div class="estimate-card">
        <div class="section-title">Previous Estimate Data</div>
        <div class="info-row"><span class="info-label">Tier:</span> ${estimateData.estimate.tier}</div>
        <div class="info-row"><span class="info-label">Investment:</span> $${estimateData.estimate.priceRange.min.toLocaleString()} - $${estimateData.estimate.priceRange.max.toLocaleString()}</div>
        <div class="info-row"><span class="info-label">Timeline:</span> ${estimateData.estimate.timelineWeeks.min} - ${estimateData.estimate.timelineWeeks.max} weeks</div>
        <div class="info-row"><span class="info-label">Fit Score:</span> ${estimateData.estimate.fitScore}%</div>
        <div class="info-row"><span class="info-label">Primary Goal:</span> ${getLabel(estimateData.answers.primary_goal as string)}</div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      YourTechAssist Contact Form
    </div>
  </div>
</body>
</html>
`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: TEAM_EMAIL,
    subject: `New Contact: ${name}${estimateData ? ` (${estimateData.estimate.tier} Tier)` : ''} - ${projectType}`,
    html,
  });
}

// ============================================================================
// CLIENT CONFIRMATION EMAILS
// ============================================================================

export async function sendEstimateConfirmationToClient(
  clientEmail: string,
  data: EstimateData
): Promise<void> {
  const { estimate } = data;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; }
    .header p { margin: 0; opacity: 0.9; font-size: 16px; }
    .content { background: #fff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
    .estimate-summary { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
    .tier-badge { display: inline-block; background: #667eea; color: white; padding: 8px 20px; border-radius: 25px; font-size: 16px; font-weight: 600; margin-bottom: 15px; }
    .estimate-details { display: flex; justify-content: center; gap: 30px; margin-top: 20px; }
    .estimate-item { text-align: center; }
    .estimate-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .estimate-value { font-size: 20px; font-weight: 600; color: #111827; margin-top: 5px; }
    .next-steps { background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .next-steps h3 { color: #166534; margin: 0 0 15px 0; font-size: 18px; }
    .next-steps ul { margin: 0; padding-left: 20px; color: #166534; }
    .next-steps li { margin-bottom: 10px; }
    .cta-section { text-align: center; margin: 30px 0; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
    .footer { background: #f9fafb; padding: 25px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You!</h1>
      <p>We've received your project estimate request</p>
    </div>

    <div class="content">
      <p style="font-size: 16px; color: #4b5563;">
        Thank you for taking the time to share your project details with us. We're excited to learn more about your goals and how we can help bring your vision to life.
      </p>

      <div class="estimate-summary">
        <span class="tier-badge">${estimate.tier} Tier</span>
        <p style="color: #4b5563; margin: 10px 0 0 0;">${estimate.tierDescription || 'A solution tailored to your needs'}</p>

        <div class="estimate-details">
          <div class="estimate-item">
            <div class="estimate-label">Estimated Investment</div>
            <div class="estimate-value">$${estimate.priceRange.min.toLocaleString()} - $${estimate.priceRange.max.toLocaleString()}</div>
          </div>
          <div class="estimate-item">
            <div class="estimate-label">Estimated Timeline</div>
            <div class="estimate-value">${estimate.timelineWeeks.min} - ${estimate.timelineWeeks.max} weeks</div>
          </div>
        </div>
      </div>

      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <ul>
          <li><strong>Our team is reviewing your submission</strong> and will reach out shortly</li>
          <li><strong>We'll schedule a Care Call</strong> via Google Meet to learn more about your goals</li>
          <li><strong>You'll receive a detailed proposal</strong> within 3-5 business days after our call</li>
        </ul>
      </div>

      <p style="font-size: 16px; color: #4b5563;">
        This is an initial estimate based on the information you provided. During our Care Call, we'll dive deeper into your specific needs and refine the scope together.
      </p>

      <div class="cta-section">
        <a href="https://yourtechassist.us/contact" class="cta-button">Have Questions? Contact Us</a>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>YourTechAssist</strong></p>
      <p style="margin: 0;">Custom software solutions for growing businesses</p>
      <p style="margin: 15px 0 0 0;"><a href="https://yourtechassist.us">yourtechassist.us</a></p>
    </div>
  </div>
</body>
</html>
`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: clientEmail,
    subject: `Your Project Estimate - ${estimate.tier} Tier | YourTechAssist`,
    html,
  });
}

export async function sendContactConfirmationToClient(
  clientEmail: string,
  clientName: string,
  hasEstimate: boolean
): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; }
    .header p { margin: 0; opacity: 0.9; font-size: 16px; }
    .content { background: #fff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
    .next-steps { background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .next-steps h3 { color: #166534; margin: 0 0 15px 0; font-size: 18px; }
    .next-steps ul { margin: 0; padding-left: 20px; color: #166534; }
    .next-steps li { margin-bottom: 10px; }
    .footer { background: #f9fafb; padding: 25px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Message Received!</h1>
      <p>Thank you for reaching out, ${clientName}</p>
    </div>

    <div class="content">
      <p style="font-size: 16px; color: #4b5563;">
        Thank you for taking the time to contact us${hasEstimate ? ' and sharing your project details' : ''}. We appreciate your interest in working with YourTechAssist.
      </p>

      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <ul>
          <li><strong>Our team is reviewing your message</strong> and will respond within 24 hours</li>
          <li><strong>We'll reach out to schedule a Care Call</strong> via Google Meet to learn more about your goals</li>
          <li><strong>During the call</strong>, we'll discuss your project in detail and answer any questions</li>
        </ul>
      </div>

      <p style="font-size: 16px; color: #4b5563;">
        We're excited to learn more about your project and explore how we can help you achieve your goals. Talk soon!
      </p>

      <p style="font-size: 16px; color: #4b5563; margin-top: 30px;">
        Best regards,<br>
        <strong>The YourTechAssist Team</strong>
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>YourTechAssist</strong></p>
      <p style="margin: 0;">Custom software solutions for growing businesses</p>
      <p style="margin: 15px 0 0 0;"><a href="https://yourtechassist.us">yourtechassist.us</a></p>
    </div>
  </div>
</body>
</html>
`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: clientEmail,
    subject: `We've Received Your Message | YourTechAssist`,
    html,
  });
}
