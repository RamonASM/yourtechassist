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

// Map option IDs to readable labels (for team emails - raw data)
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
  // Pain points (raw)
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
  solo_decision: 'I Make the Decision',
  small_team_decision: 'Small Team Decision',
  committee: 'Multiple Stakeholders',
  board: 'Board / Executive Approval',
  // Decision timeline
  immediate: 'Ready Now',
  soon_decision: 'Within 1-2 Months',
  planning: 'Within 3-6 Months',
  research: 'Just Researching',
};

// Solution-focused labels for client emails (VALUE-ORIENTED framing)
const solutionLabels: Record<string, string> = {
  // Project types → Business value
  internal_tool: 'Streamlined operations with a custom internal dashboard',
  customer_portal: 'Enhanced customer engagement through a dedicated portal',
  saas_product: 'Scalable SaaS platform to grow your revenue',
  ecommerce: 'Revenue-generating marketplace or e-commerce solution',
  mobile_app: 'Mobile-first experience to reach customers anywhere',
  other: 'Custom solution tailored to your unique needs',
  // Current state → Opportunity framing
  scratch: 'Starting fresh with a modern, purpose-built solution',
  manual: 'Automating manual processes to save hours every week',
  legacy: 'Modernizing your systems for improved performance',
  prototype: 'Scaling your MVP into a production-ready platform',
  enhancement: 'Expanding capabilities of your existing investment',
  // Pain points → VALUE THEY'LL RECEIVE
  time_waste: 'Automated workflows that save your team hours every week',
  no_visibility: 'Real-time dashboards giving you instant insights into your business',
  scattered_data: 'Single source of truth with all your data in one place',
  poor_cx: 'Delightful customer experience that drives loyalty and referrals',
  scaling: 'Architecture built to grow with your business without breaking',
  errors: 'Automated validation and checks to eliminate costly mistakes',
  communication: 'Seamless communication tools to keep everyone aligned',
  // Pain severity → Urgency/value
  critical: 'Immediate ROI - stopping revenue loss from day one',
  high: 'High-impact solution addressing major inefficiencies',
  medium: 'Strategic improvement for long-term business health',
  low: 'Future-proof investment for continued growth',
  // Primary goal → Outcome they'll achieve
  save_time: 'Reclaim valuable hours for high-impact work',
  increase_revenue: 'Drive more revenue through improved efficiency',
  reduce_errors: 'Eliminate costly mistakes with automated checks',
  better_cx: 'Delight customers and increase retention',
  scale: 'Build foundation for sustainable growth',
  visibility: 'Make data-driven decisions with real-time insights',
  // Success metric → How we'll measure their success
  time_saved: 'Measurable hours saved per week',
  revenue_increase: 'Trackable revenue and conversion improvements',
  error_reduction: 'Quantifiable reduction in error rates',
  customer_satisfaction: 'Improved customer satisfaction scores',
  capacity: 'Increased capacity without adding headcount',
  not_sure: 'We\'ll help you define the right metrics',
  // User count → Who benefits
  solo: 'Optimized for your personal productivity',
  small_team: 'Collaboration tools for your growing team',
  medium_team: 'Enterprise features for your organization',
  large: 'Scalable platform for your entire workforce',
  public: 'Customer-facing solution to serve your audience',
  // Features → Benefits they deliver
  auth: 'Secure access protecting your data and users',
  payments: 'Seamless payments to improve conversion rates',
  integrations: 'Connected workflows with your existing tools',
  reporting: 'Actionable insights to drive better decisions',
  notifications: 'Timely alerts keeping everyone informed',
  file_upload: 'Organized file management saving time',
  roles: 'Granular permissions for security and efficiency',
  mobile: 'Access anywhere, anytime on any device',
  realtime: 'Instant updates for faster decision-making',
  // Timeline
  asap: 'Fast-track delivery in 1-2 months',
  soon: 'Efficient timeline of 2-4 months',
  standard: 'Comprehensive build over 4-6 months',
  relaxed: 'Flexible timeline to get it right',
  // Budget
  exploring: 'Investment to be refined together',
  starter: 'Efficient starter solution',
  growth: 'Growth-stage investment',
  scale_budget: 'Comprehensive scaling solution',
  enterprise: 'Enterprise-grade platform',
  // Decision maker
  solo_decision: 'Ready to move forward quickly',
  small_team_decision: 'Aligned team ready to proceed',
  committee: 'Building consensus among stakeholders',
  board: 'Executive-level strategic initiative',
  // Decision timeline
  immediate: 'Ready to see results soon',
  soon_decision: 'Preparing to launch shortly',
  planning: 'Planning for upcoming implementation',
  research: 'Exploring the right solution',
};

// Question labels for display
const questionLabels: Record<string, string> = {
  project_type: 'Project Type',
  current_state: 'Current State',
  pain_points: 'Key Challenges',
  pain_severity: 'Priority Level',
  primary_goal: 'Primary Goal',
  success_metric: 'Success Metric',
  user_count: 'Expected Users',
  features: 'Key Features',
  timeline: 'Preferred Timeline',
  budget_range: 'Investment Range',
  decision_maker: 'Decision Process',
  timeline_decision: 'Decision Timeline',
};

// Solution-focused question labels for client (VALUE FRAMING)
const solutionQuestionLabels: Record<string, string> = {
  project_type: 'What We\'re Building',
  current_state: 'Your Opportunity',
  pain_points: 'Value You\'ll Receive',
  pain_severity: 'Impact Level',
  primary_goal: 'Your Key Outcome',
  success_metric: 'How We\'ll Measure Success',
  user_count: 'Who Benefits',
  features: 'Capabilities That Drive Results',
  timeline: 'Expected Delivery',
  budget_range: 'Your Investment',
  decision_maker: 'Moving Forward',
  timeline_decision: 'Ready to Start',
};

function getLabel(id: string): string {
  return optionLabels[id] || id;
}

function getSolutionLabel(id: string): string {
  return solutionLabels[id] || optionLabels[id] || id;
}

function formatAnswerValue(value: string | string[], useSolutionLabels = false): string {
  const labelFn = useSolutionLabels ? getSolutionLabel : getLabel;
  if (Array.isArray(value)) {
    return value.map(v => labelFn(v)).join(', ');
  }
  return labelFn(value);
}

// ============================================================================
// TEAM NOTIFICATION EMAILS - Complete raw data
// ============================================================================

export async function sendEstimateEmail(data: EstimateData): Promise<void> {
  const { answers, estimate, submittedAt } = data;

  // Build complete answers section
  const answerRows = Object.entries(answers)
    .filter(([, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
    .map(([key, value]) => {
      const label = questionLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const displayValue = formatAnswerValue(value, false);
      return `<tr><td style="padding: 12px 15px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; width: 40%;">${label}</td><td style="padding: 12px 15px; border-bottom: 1px solid #f3f4f6; color: #4b5563;">${displayValue}</td></tr>`;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0 0 10px 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 8px; }
    .estimate-card { background: #f9fafb; border-radius: 12px; padding: 25px; margin-bottom: 25px; }
    .tier-badge { display: inline-block; background: #667eea; color: white; padding: 6px 16px; border-radius: 20px; font-size: 16px; font-weight: 600; margin-bottom: 10px; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
    .stat { background: white; padding: 15px; border-radius: 8px; text-align: center; }
    .stat-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
    .stat-value { font-size: 18px; font-weight: 700; color: #111827; }
    .data-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
    .list { list-style: none; padding: 0; margin: 0; }
    .list li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
    .list li:last-child { border-bottom: none; }
    .footer { background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Project Estimate Request</h1>
      <p style="margin: 0; opacity: 0.9;">Submitted ${new Date(submittedAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
    </div>

    <div class="content">
      <div class="estimate-card">
        <span class="tier-badge">${estimate.tier} Tier</span>
        <p style="margin: 10px 0 0 0; color: #4b5563; font-size: 15px;">${estimate.tierDescription || ''}</p>

        <div class="stats-grid">
          <div class="stat">
            <div class="stat-label">Investment Range</div>
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
        <div class="section-title">Complete Questionnaire Responses</div>
        <table class="data-table">
          ${answerRows}
        </table>
      </div>

      ${estimate.phases.length > 0 ? `
      <div class="section">
        <div class="section-title">Recommended Phases</div>
        <ul class="list">
          ${estimate.phases.map((p, i) => `<li><strong>Phase ${i + 1}:</strong> ${p}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${estimate.keyFeatures.length > 0 ? `
      <div class="section">
        <div class="section-title">Key Features Identified</div>
        <ul class="list">
          ${estimate.keyFeatures.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${estimate.recommendations.length > 0 ? `
      <div class="section">
        <div class="section-title">System Recommendations</div>
        <ul class="list">
          ${estimate.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="section" style="margin-bottom: 0;">
        <div class="section-title">Fit Assessment</div>
        <p style="margin: 0; color: #4b5563; font-style: italic;">"${estimate.fitAssessment}"</p>
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
    subject: `New Estimate: ${estimate.tier} Tier | $${estimate.priceRange.min.toLocaleString()}+ | Fit: ${estimate.fitScore}%`,
    html,
  });
}

export async function sendContactEmail(data: ContactData): Promise<void> {
  const { name, email, company, phone, projectType, budget, timeline, message, estimateData } = data;

  // Build estimate answers section if available
  let estimateAnswersHtml = '';
  if (estimateData) {
    const answerRows = Object.entries(estimateData.answers)
      .filter(([, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
      .map(([key, value]) => {
        const label = questionLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const displayValue = formatAnswerValue(value, false);
        return `<tr><td style="padding: 10px 12px; border-bottom: 1px solid #d1fae5; font-weight: 600; color: #166534; width: 40%;">${label}</td><td style="padding: 10px 12px; border-bottom: 1px solid #d1fae5; color: #166534;">${displayValue}</td></tr>`;
      })
      .join('');

    estimateAnswersHtml = `
      <div class="estimate-section">
        <div class="section-title" style="color: #166534; border-color: #10b981;">Previous Estimate Details</div>

        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
            <div>
              <div style="font-size: 11px; color: #166534; text-transform: uppercase;">Tier</div>
              <div style="font-size: 16px; font-weight: 700; color: #166534;">${estimateData.estimate.tier}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #166534; text-transform: uppercase;">Investment</div>
              <div style="font-size: 16px; font-weight: 700; color: #166534;">$${estimateData.estimate.priceRange.min.toLocaleString()}+</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #166534; text-transform: uppercase;">Fit Score</div>
              <div style="font-size: 16px; font-weight: 700; color: #166534;">${estimateData.estimate.fitScore}%</div>
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          ${answerRows}
        </table>
      </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0 0 10px 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 8px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .info-item { padding: 12px; background: #f9fafb; border-radius: 8px; }
    .info-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .info-value { font-size: 15px; color: #111827; font-weight: 500; }
    .info-value a { color: #667eea; text-decoration: none; }
    .message-box { background: #f9fafb; padding: 20px; border-radius: 8px; white-space: pre-wrap; color: #374151; font-size: 15px; border-left: 4px solid #667eea; }
    .estimate-section { background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin-top: 25px; }
    .estimate-badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .footer { background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p style="margin: 0; opacity: 0.9;">${name}${company ? ` from ${company}` : ''}</p>
    </div>

    <div class="content">
      ${estimateData ? '<p style="margin: 0 0 20px 0;"><span class="estimate-badge">Has Estimate Data</span></p>' : ''}

      <div class="section">
        <div class="section-title">Contact Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value"><a href="mailto:${email}">${email}</a></div>
          </div>
          ${company ? `
          <div class="info-item">
            <div class="info-label">Company</div>
            <div class="info-value">${company}</div>
          </div>
          ` : ''}
          ${phone ? `
          <div class="info-item">
            <div class="info-label">Phone</div>
            <div class="info-value"><a href="tel:${phone}">${phone}</a></div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Project Details</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Project Type</div>
            <div class="info-value">${projectType}</div>
          </div>
          ${budget ? `
          <div class="info-item">
            <div class="info-label">Budget</div>
            <div class="info-value">${budget}</div>
          </div>
          ` : ''}
          ${timeline ? `
          <div class="info-item">
            <div class="info-label">Timeline</div>
            <div class="info-value">${timeline}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Message</div>
        <div class="message-box">${message}</div>
      </div>

      ${estimateAnswersHtml}
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
    subject: `New Contact: ${name}${estimateData ? ` (${estimateData.estimate.tier} Tier - ${estimateData.estimate.fitScore}% Fit)` : ''} - ${projectType}`,
    html,
  });
}

// ============================================================================
// CLIENT CONFIRMATION EMAILS - Solution-focused framing
// ============================================================================

export async function sendEstimateConfirmationToClient(
  clientEmail: string,
  data: EstimateData
): Promise<void> {
  const { answers, estimate, submittedAt } = data;

  // Build clean answers section - same labels as team email
  const answerRows = Object.entries(answers)
    .filter(([, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
    .map(([key, value]) => {
      const label = questionLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const displayValue = formatAnswerValue(value, false); // Use same labels as team email
      return `<tr><td style="padding: 12px 15px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; width: 40%;">${label}</td><td style="padding: 12px 15px; border-bottom: 1px solid #f3f4f6; color: #4b5563;">${displayValue}</td></tr>`;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 650px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0 0 10px 0; font-size: 24px; }
    .header p { margin: 0; opacity: 0.9; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .intro { font-size: 15px; color: #4b5563; margin-bottom: 25px; }
    .estimate-card { background: #f9fafb; border-radius: 12px; padding: 25px; margin-bottom: 25px; }
    .tier-badge { display: inline-block; background: #667eea; color: white; padding: 6px 16px; border-radius: 20px; font-size: 16px; font-weight: 600; margin-bottom: 10px; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
    .stat { background: white; padding: 15px; border-radius: 8px; text-align: center; }
    .stat-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
    .stat-value { font-size: 18px; font-weight: 700; color: #111827; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 8px; }
    .data-table { width: 100%; border-collapse: collapse; }
    .list { list-style: none; padding: 0; margin: 0; }
    .list li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563; }
    .list li:last-child { border-bottom: none; }
    .next-steps { background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin: 25px 0; }
    .next-steps h3 { color: #166534; margin: 0 0 15px 0; font-size: 16px; }
    .next-steps ul { margin: 0; padding-left: 20px; color: #166534; }
    .next-steps li { margin-bottom: 8px; }
    .footer { background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Project Estimate</h1>
      <p>Submitted ${new Date(submittedAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
    </div>

    <div class="content">
      <p class="intro">
        Thank you for taking the time to share your project details with us. Here's a copy of your estimate for your records.
      </p>

      <div class="estimate-card">
        <span class="tier-badge">${estimate.tier} Tier</span>
        <p style="margin: 10px 0 0 0; color: #4b5563; font-size: 15px;">${estimate.tierDescription || ''}</p>

        <div class="stats-grid">
          <div class="stat">
            <div class="stat-label">Investment Range</div>
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
        <div class="section-title">Your Responses</div>
        <table class="data-table">
          ${answerRows}
        </table>
      </div>

      ${estimate.phases.length > 0 ? `
      <div class="section">
        <div class="section-title">Recommended Phases</div>
        <ul class="list">
          ${estimate.phases.map((p, i) => `<li><strong>Phase ${i + 1}:</strong> ${p}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${estimate.keyFeatures.length > 0 ? `
      <div class="section">
        <div class="section-title">Key Features</div>
        <ul class="list">
          ${estimate.keyFeatures.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${estimate.recommendations.length > 0 ? `
      <div class="section">
        <div class="section-title">System Recommendations</div>
        <ul class="list">
          ${estimate.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <ul>
          <li>Our team is reviewing your submission and will reach out shortly</li>
          <li>We'll schedule a Care Call via Google Meet to learn more about your goals</li>
          <li>After our call, you'll receive a detailed proposal within 3-5 business days</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin: 20px 0 0 0;">
        This is an initial estimate based on the information you provided. We'll refine the details together during our call.
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
    subject: `Your ${estimate.tier} Project Estimate | YourTechAssist`,
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
    .intro { font-size: 16px; color: #4b5563; margin-bottom: 25px; }
    .next-steps { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #86efac; border-radius: 16px; padding: 25px 30px; margin: 25px 0; }
    .next-steps h3 { color: #166534; margin: 0 0 20px 0; font-size: 18px; }
    .next-steps-list { margin: 0; padding: 0; list-style: none; }
    .next-steps-list li { padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #166534; display: flex; align-items: flex-start; gap: 12px; }
    .next-steps-list li:last-child { border-bottom: none; }
    .step-number { background: #166534; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
    .closing { font-size: 16px; color: #4b5563; margin-top: 25px; }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
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
      <p class="intro">
        Thank you for taking the time to contact us${hasEstimate ? ' and sharing your project details' : ''}. We appreciate your interest in working with YourTechAssist and are excited to learn more about your goals.
      </p>

      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <ul class="next-steps-list">
          <li>
            <span class="step-number">1</span>
            <div><strong>Team Review</strong> - Our team is reviewing your message and will respond within 24 hours</div>
          </li>
          <li>
            <span class="step-number">2</span>
            <div><strong>Care Call</strong> - We'll reach out to schedule a Google Meet to learn more about your goals</div>
          </li>
          <li>
            <span class="step-number">3</span>
            <div><strong>Discussion</strong> - During the call, we'll discuss your project in detail and answer any questions</div>
          </li>
        </ul>
      </div>

      <p class="closing">
        We're looking forward to exploring how we can help you achieve your goals. Talk soon!
      </p>

      <div class="signature">
        <p style="margin: 0; color: #4b5563;">Best regards,</p>
        <p style="margin: 5px 0 0 0; font-weight: 600; color: #111827;">The YourTechAssist Team</p>
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
    subject: `We've Received Your Message | YourTechAssist`,
    html,
  });
}
