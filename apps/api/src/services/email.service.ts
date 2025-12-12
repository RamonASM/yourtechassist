import nodemailer from 'nodemailer';

interface EstimateData {
  answers: Record<string, string | string[]>;
  estimate: {
    tier: string;
    tierDescription: string;
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

function formatAnswers(answers: Record<string, string | string[]>): string {
  const sections: string[] = [];

  // Situation
  sections.push('📋 SITUATION');
  sections.push(`Project Type: ${getLabel(answers.project_type as string)}`);
  sections.push(`Current State: ${getLabel(answers.current_state as string)}`);

  // Pain Points
  sections.push('\n🔥 PAIN POINTS');
  const painPoints = answers.pain_points as string[];
  if (Array.isArray(painPoints)) {
    painPoints.forEach(p => sections.push(`• ${getLabel(p)}`));
  }
  sections.push(`Urgency: ${getLabel(answers.pain_severity as string)}`);

  // Goals
  sections.push('\n🎯 GOALS');
  sections.push(`Primary Goal: ${getLabel(answers.primary_goal as string)}`);
  sections.push(`Success Metric: ${getLabel(answers.success_metric as string)}`);

  // Scope
  sections.push('\n📊 SCOPE');
  sections.push(`Users: ${getLabel(answers.user_count as string)}`);
  const features = answers.features as string[];
  if (Array.isArray(features) && features.length > 0) {
    sections.push('Features:');
    features.forEach(f => sections.push(`• ${getLabel(f)}`));
  }

  // Timeline & Budget
  sections.push('\n⏱️ TIMELINE & BUDGET');
  sections.push(`Timeline: ${getLabel(answers.timeline as string)}`);
  sections.push(`Budget: ${getLabel(answers.budget_range as string)}`);

  // Readiness
  sections.push('\n✅ READINESS');
  sections.push(`Decision Maker: ${getLabel(answers.decision_maker as string)}`);
  sections.push(`Decision Timeline: ${getLabel(answers.timeline_decision as string)}`);

  return sections.join('\n');
}

// Create transporter - using environment variables
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEstimateEmail(data: EstimateData): Promise<void> {
  const transporter = createTransporter();

  const { answers, estimate, submittedAt } = data;

  const subject = `🚀 New Project Estimate - ${estimate.tier} Tier`;

  const text = `
NEW PROJECT ESTIMATE SUBMISSION
===============================
Submitted: ${new Date(submittedAt).toLocaleString()}

📈 ESTIMATE RESULTS
-------------------
Recommended Tier: ${estimate.tier}
${estimate.tierDescription}

Investment: $${estimate.priceRange.min.toLocaleString()} - $${estimate.priceRange.max.toLocaleString()}
Timeline: ${estimate.timelineWeeks.min} - ${estimate.timelineWeeks.max} weeks
Fit Score: ${estimate.fitScore}%
Assessment: ${estimate.fitAssessment}

📝 QUESTIONNAIRE RESPONSES
--------------------------
${formatAnswers(answers)}

🔧 KEY FEATURES IDENTIFIED
--------------------------
${estimate.keyFeatures.map(f => `• ${f}`).join('\n')}

💡 RECOMMENDATIONS
------------------
${estimate.recommendations.map(r => `• ${r}`).join('\n')}

📅 PROJECT PHASES
-----------------
${estimate.phases.map((p, i) => `${i + 1}. ${p}`).join('\n')}
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0 0 10px 0; font-size: 24px; }
    .header p { margin: 0; opacity: 0.9; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .estimate-card { background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .tier-badge { display: inline-block; background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 10px; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
    .stat { background: white; padding: 15px; border-radius: 8px; }
    .stat-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
    .stat-value { font-size: 18px; font-weight: 600; color: #111827; }
    .fit-bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin-top: 8px; }
    .fit-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 4px; }
    .list { list-style: none; padding: 0; margin: 0; }
    .list li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    .list li:last-child { border-bottom: none; }
    .bullet { color: #667eea; margin-right: 8px; }
    .footer { background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New Project Estimate</h1>
      <p>Submitted ${new Date(submittedAt).toLocaleString()}</p>
    </div>

    <div class="content">
      <div class="estimate-card">
        <span class="tier-badge">${estimate.tier} Tier</span>
        <p style="margin: 10px 0 0 0; color: #4b5563;">${estimate.tierDescription}</p>

        <div class="stats">
          <div class="stat">
            <div class="stat-label">💰 Investment</div>
            <div class="stat-value">$${estimate.priceRange.min.toLocaleString()} - $${estimate.priceRange.max.toLocaleString()}</div>
          </div>
          <div class="stat">
            <div class="stat-label">📅 Timeline</div>
            <div class="stat-value">${estimate.timelineWeeks.min} - ${estimate.timelineWeeks.max} weeks</div>
          </div>
        </div>

        <div style="margin-top: 15px;">
          <div class="stat-label">Fit Score: ${estimate.fitScore}%</div>
          <div class="fit-bar">
            <div class="fit-fill" style="width: ${estimate.fitScore}%;"></div>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #4b5563;">${estimate.fitAssessment}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📋 Situation</div>
        <ul class="list">
          <li><strong>Project Type:</strong> ${getLabel(answers.project_type as string)}</li>
          <li><strong>Current State:</strong> ${getLabel(answers.current_state as string)}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">🔥 Pain Points</div>
        <ul class="list">
          ${Array.isArray(answers.pain_points) ? answers.pain_points.map(p => `<li><span class="bullet">•</span>${getLabel(p)}</li>`).join('') : ''}
          <li><strong>Urgency:</strong> ${getLabel(answers.pain_severity as string)}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">🎯 Goals</div>
        <ul class="list">
          <li><strong>Primary Goal:</strong> ${getLabel(answers.primary_goal as string)}</li>
          <li><strong>Success Metric:</strong> ${getLabel(answers.success_metric as string)}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">📊 Scope</div>
        <ul class="list">
          <li><strong>Users:</strong> ${getLabel(answers.user_count as string)}</li>
          ${Array.isArray(answers.features) && answers.features.length > 0 ? `
          <li><strong>Features:</strong>
            <ul style="margin-top: 8px; padding-left: 20px;">
              ${answers.features.map(f => `<li>${getLabel(f)}</li>`).join('')}
            </ul>
          </li>
          ` : ''}
        </ul>
      </div>

      <div class="section">
        <div class="section-title">⏱️ Timeline & Budget</div>
        <ul class="list">
          <li><strong>Timeline:</strong> ${getLabel(answers.timeline as string)}</li>
          <li><strong>Budget:</strong> ${getLabel(answers.budget_range as string)}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">✅ Readiness</div>
        <ul class="list">
          <li><strong>Decision Maker:</strong> ${getLabel(answers.decision_maker as string)}</li>
          <li><strong>Decision Timeline:</strong> ${getLabel(answers.timeline_decision as string)}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">💡 Recommendations</div>
        <ul class="list">
          ${estimate.recommendations.map(r => `<li><span class="bullet">•</span>${r}</li>`).join('')}
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

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@yourtechassist.us',
    to: 'ramon@aerialshots.media',
    subject,
    text,
    html,
  });
}

export async function sendContactEmail(data: ContactData): Promise<void> {
  const transporter = createTransporter();

  const { name, email, company, phone, projectType, budget, timeline, message, estimateData } = data;

  const hasEstimate = !!estimateData;
  const subject = hasEstimate
    ? `📩 Contact Form - ${name} (Has Estimate: ${estimateData.estimate.tier})`
    : `📩 Contact Form - ${name}`;

  let estimateSection = '';
  if (hasEstimate) {
    estimateSection = `

📈 PREVIOUS ESTIMATE DATA
-------------------------
Tier: ${estimateData.estimate.tier}
Investment: $${estimateData.estimate.priceRange.min.toLocaleString()} - $${estimateData.estimate.priceRange.max.toLocaleString()}
Timeline: ${estimateData.estimate.timelineWeeks.min} - ${estimateData.estimate.timelineWeeks.max} weeks
Fit Score: ${estimateData.estimate.fitScore}%

Key Pain Points:
${Array.isArray(estimateData.answers.pain_points) ? estimateData.answers.pain_points.map(p => `• ${getLabel(p)}`).join('\n') : 'N/A'}

Primary Goal: ${getLabel(estimateData.answers.primary_goal as string)}
`;
  }

  const text = `
NEW CONTACT FORM SUBMISSION
===========================

👤 CONTACT INFORMATION
---------------------
Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Phone: ${phone || 'Not provided'}

📋 PROJECT DETAILS
------------------
Project Type: ${projectType}
Budget: ${budget || 'Not specified'}
Timeline: ${timeline || 'Not specified'}

💬 MESSAGE
----------
${message}
${estimateSection}
`;

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
      <h1>📩 New Contact Form Submission</h1>
      <p>${name}${company ? ` from ${company}` : ''}</p>
    </div>

    <div class="content">
      ${hasEstimate ? '<span class="estimate-badge">✓ Has Estimate Data</span>' : ''}

      <div class="section">
        <div class="section-title">👤 Contact Information</div>
        <div class="info-row"><span class="info-label">Name:</span> ${name}</div>
        <div class="info-row"><span class="info-label">Email:</span> <a href="mailto:${email}">${email}</a></div>
        ${company ? `<div class="info-row"><span class="info-label">Company:</span> ${company}</div>` : ''}
        ${phone ? `<div class="info-row"><span class="info-label">Phone:</span> <a href="tel:${phone}">${phone}</a></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">📋 Project Details</div>
        <div class="info-row"><span class="info-label">Type:</span> ${projectType}</div>
        ${budget ? `<div class="info-row"><span class="info-label">Budget:</span> ${budget}</div>` : ''}
        ${timeline ? `<div class="info-row"><span class="info-label">Timeline:</span> ${timeline}</div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">💬 Message</div>
        <div class="message-box">${message}</div>
      </div>

      ${hasEstimate ? `
      <div class="estimate-card">
        <div class="section-title">📈 Previous Estimate Data</div>
        <div class="info-row"><span class="info-label">Tier:</span> ${estimateData.estimate.tier}</div>
        <div class="info-row"><span class="info-label">Investment:</span> $${estimateData.estimate.priceRange.min.toLocaleString()} - $${estimateData.estimate.priceRange.max.toLocaleString()}</div>
        <div class="info-row"><span class="info-label">Timeline:</span> ${estimateData.estimate.timelineWeeks.min} - ${estimateData.estimate.timelineWeeks.max} weeks</div>
        <div class="info-row"><span class="info-label">Fit Score:</span> ${estimateData.estimate.fitScore}%</div>
        <div class="info-row"><span class="info-label">Primary Goal:</span> ${getLabel(estimateData.answers.primary_goal as string)}</div>
        ${Array.isArray(estimateData.answers.pain_points) ? `
        <div class="info-row">
          <span class="info-label">Pain Points:</span>
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            ${estimateData.answers.pain_points.map(p => `<li>${getLabel(p)}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
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

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@yourtechassist.us',
    to: 'ramon@aerialshots.media',
    subject,
    text,
    html,
  });
}
