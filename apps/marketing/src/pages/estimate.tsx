import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Lightbulb,
  Target,
  AlertTriangle,
  Sparkles,
  Users,
  Zap,
  Calendar,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { clsx } from 'clsx';

// Question types
type QuestionType = 'single' | 'multiple' | 'scale';

interface Option {
  id: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
  weight?: {
    complexity?: number;
    timeline?: number;
    cost?: number;
  };
}

interface Question {
  id: string;
  step: number;
  type: QuestionType;
  category: 'situation' | 'pain' | 'goals' | 'scope' | 'timeline' | 'readiness';
  question: string;
  subtitle?: string;
  insight?: string;
  options: Option[];
  required?: boolean;
}

const questions: Question[] = [
  // STEP 1: Current Situation
  {
    id: 'project_type',
    step: 1,
    type: 'single',
    category: 'situation',
    question: 'What type of solution are you looking to build?',
    subtitle: 'This helps us understand the general direction of your project.',
    options: [
      {
        id: 'internal_tool',
        label: 'Internal Tool / Dashboard',
        description: 'For your team to manage operations, track data, or streamline workflows',
        weight: { complexity: 1, timeline: 1, cost: 1 },
      },
      {
        id: 'customer_portal',
        label: 'Customer-Facing Portal',
        description: 'A platform where your customers can log in, manage accounts, or access services',
        weight: { complexity: 2, timeline: 2, cost: 2 },
      },
      {
        id: 'saas_product',
        label: 'SaaS Product',
        description: 'A software product you want to sell to other businesses or consumers',
        weight: { complexity: 3, timeline: 3, cost: 3 },
      },
      {
        id: 'ecommerce',
        label: 'E-commerce / Marketplace',
        description: 'Online store, booking platform, or multi-vendor marketplace',
        weight: { complexity: 3, timeline: 3, cost: 3 },
      },
      {
        id: 'mobile_app',
        label: 'Mobile Application',
        description: 'iOS, Android, or cross-platform mobile app',
        weight: { complexity: 3, timeline: 3, cost: 3 },
      },
      {
        id: 'other',
        label: 'Something Else',
        description: "I have a unique idea that doesn't fit these categories",
        weight: { complexity: 2, timeline: 2, cost: 2 },
      },
    ],
    required: true,
  },
  {
    id: 'current_state',
    step: 1,
    type: 'single',
    category: 'situation',
    question: 'Where are you starting from?',
    subtitle: 'Understanding your current state helps us plan the right approach.',
    insight: 'Projects that replace manual processes often see the fastest ROI because we can measure the time saved immediately.',
    options: [
      {
        id: 'scratch',
        label: 'Starting Fresh',
        description: "This is a new idea - I don't have anything built yet",
        weight: { complexity: 0, timeline: 0, cost: 0 },
      },
      {
        id: 'manual',
        label: 'Manual Processes / Spreadsheets',
        description: "I'm doing this manually with spreadsheets, emails, or paper",
        weight: { complexity: 0, timeline: -1, cost: 0 },
      },
      {
        id: 'legacy',
        label: 'Replacing Old System',
        description: 'I have an existing system that needs to be replaced or modernized',
        weight: { complexity: 1, timeline: 1, cost: 1 },
      },
      {
        id: 'prototype',
        label: 'Have a Prototype/MVP',
        description: 'I have something basic built that needs to be scaled or rebuilt properly',
        weight: { complexity: 1, timeline: 0, cost: 1 },
      },
      {
        id: 'enhancement',
        label: 'Adding to Existing Product',
        description: 'I have a working product and need to add new features',
        weight: { complexity: 1, timeline: -1, cost: 0 },
      },
    ],
    required: true,
  },

  // STEP 2: Pain Points
  {
    id: 'pain_points',
    step: 2,
    type: 'multiple',
    category: 'pain',
    question: 'What challenges are you facing right now?',
    subtitle: 'Select all that apply. This helps us understand what problems we need to solve.',
    insight: 'The most successful projects solve specific, measurable problems. The more pain points you identify, the more value we can deliver.',
    options: [
      {
        id: 'time_waste',
        label: 'Too Much Manual Work',
        description: 'Spending hours on repetitive tasks that could be automated',
        icon: Clock,
        weight: { complexity: 1, cost: 1 },
      },
      {
        id: 'no_visibility',
        label: 'Lack of Visibility',
        description: "Can't easily see what's happening across the business",
        icon: Target,
        weight: { complexity: 1, cost: 1 },
      },
      {
        id: 'scattered_data',
        label: 'Data in Too Many Places',
        description: 'Information spread across spreadsheets, emails, and different tools',
        icon: FileText,
        weight: { complexity: 2, cost: 1 },
      },
      {
        id: 'poor_cx',
        label: 'Poor Customer Experience',
        description: 'Customers complaining about slow responses or confusing processes',
        icon: Users,
        weight: { complexity: 2, cost: 2 },
      },
      {
        id: 'scaling',
        label: 'Struggling to Scale',
        description: 'Current processes break down as we grow',
        icon: Zap,
        weight: { complexity: 2, cost: 2 },
      },
      {
        id: 'errors',
        label: 'Too Many Errors',
        description: 'Manual processes leading to mistakes and rework',
        icon: AlertTriangle,
        weight: { complexity: 1, cost: 1 },
      },
      {
        id: 'communication',
        label: 'Communication Gaps',
        description: 'Team members or customers not staying on the same page',
        icon: MessageSquare,
        weight: { complexity: 1, cost: 1 },
      },
    ],
    required: true,
  },
  {
    id: 'pain_severity',
    step: 2,
    type: 'single',
    category: 'pain',
    question: 'How urgent is solving these problems?',
    subtitle: 'Be honest - this helps us prioritize and plan realistically.',
    options: [
      {
        id: 'critical',
        label: 'Critical - Losing Money Daily',
        description: 'These problems are actively costing us customers or significant money',
        weight: { timeline: -2 },
      },
      {
        id: 'high',
        label: 'High - Major Inefficiency',
        description: "We're wasting significant time and resources",
        weight: { timeline: -1 },
      },
      {
        id: 'medium',
        label: 'Medium - Need to Address Soon',
        description: "It's not an emergency but needs to be fixed in the next few months",
        weight: { timeline: 0 },
      },
      {
        id: 'low',
        label: 'Planning Ahead',
        description: "We're being proactive - want to solve this before it becomes critical",
        weight: { timeline: 1 },
      },
    ],
    required: true,
  },

  // STEP 3: Goals & Objectives
  {
    id: 'primary_goal',
    step: 3,
    type: 'single',
    category: 'goals',
    question: 'What is the #1 outcome you want from this project?',
    subtitle: 'If we could only deliver one thing, what would make this project a success?',
    insight: 'Projects with a clear primary goal are 3x more likely to succeed. We can add features, but we need one north star.',
    options: [
      {
        id: 'save_time',
        label: 'Save Time',
        description: 'Free up hours every week by automating manual work',
        icon: Clock,
      },
      {
        id: 'increase_revenue',
        label: 'Increase Revenue',
        description: 'Create new revenue streams or improve conversion rates',
        icon: DollarSign,
      },
      {
        id: 'reduce_errors',
        label: 'Reduce Errors',
        description: 'Eliminate mistakes from manual processes',
        icon: CheckCircle,
      },
      {
        id: 'better_cx',
        label: 'Improve Customer Experience',
        description: 'Make it easier and more enjoyable for customers to work with us',
        icon: Users,
      },
      {
        id: 'scale',
        label: 'Enable Growth',
        description: 'Build infrastructure that can handle 10x our current volume',
        icon: Zap,
      },
      {
        id: 'visibility',
        label: 'Gain Visibility',
        description: 'See real-time data and make better decisions',
        icon: Target,
      },
    ],
    required: true,
  },
  {
    id: 'success_metric',
    step: 3,
    type: 'single',
    category: 'goals',
    question: 'How will you measure success?',
    subtitle: 'Having a clear metric helps us design the right solution.',
    options: [
      {
        id: 'time_saved',
        label: 'Hours Saved Per Week',
        description: 'Measuring reduction in manual work',
      },
      {
        id: 'revenue_increase',
        label: 'Revenue or Conversion Increase',
        description: 'Measuring financial impact',
      },
      {
        id: 'error_reduction',
        label: 'Error Rate Reduction',
        description: 'Measuring quality improvement',
      },
      {
        id: 'customer_satisfaction',
        label: 'Customer Satisfaction Score',
        description: 'Measuring experience improvement',
      },
      {
        id: 'capacity',
        label: 'Capacity Increase',
        description: 'Handling more volume with same resources',
      },
      {
        id: 'not_sure',
        label: "I'm Not Sure Yet",
        description: "Help me figure out the right metrics",
      },
    ],
    required: true,
  },

  // STEP 4: Scope & Features
  {
    id: 'user_count',
    step: 4,
    type: 'single',
    category: 'scope',
    question: 'How many people will use this system?',
    subtitle: 'This affects infrastructure, security, and complexity.',
    options: [
      {
        id: 'solo',
        label: 'Just Me',
        description: 'Personal tool or solo operation',
        weight: { complexity: 0, cost: 0 },
      },
      {
        id: 'small_team',
        label: '2-10 Users',
        description: 'Small team or department',
        weight: { complexity: 1, cost: 1 },
      },
      {
        id: 'medium_team',
        label: '11-50 Users',
        description: 'Medium-sized organization',
        weight: { complexity: 2, cost: 2 },
      },
      {
        id: 'large',
        label: '50+ Internal Users',
        description: 'Large organization with many employees',
        weight: { complexity: 3, cost: 3 },
      },
      {
        id: 'public',
        label: 'Public / Customer-Facing',
        description: 'Potentially hundreds or thousands of external users',
        weight: { complexity: 4, cost: 4 },
      },
    ],
    required: true,
  },
  {
    id: 'features',
    step: 4,
    type: 'multiple',
    category: 'scope',
    question: 'What capabilities do you need?',
    subtitle: 'Select all that apply. Each adds complexity but also value.',
    insight: 'Start with must-haves. We can always add features in phases - launching sooner means getting value sooner.',
    options: [
      {
        id: 'auth',
        label: 'User Accounts & Login',
        description: 'Users can create accounts and log in securely',
        weight: { complexity: 1, timeline: 1, cost: 1 },
      },
      {
        id: 'payments',
        label: 'Payment Processing',
        description: 'Accept payments, subscriptions, or invoicing',
        weight: { complexity: 2, timeline: 2, cost: 2 },
      },
      {
        id: 'integrations',
        label: 'Third-Party Integrations',
        description: 'Connect with other tools (CRM, accounting, etc.)',
        weight: { complexity: 2, timeline: 2, cost: 2 },
      },
      {
        id: 'reporting',
        label: 'Reporting & Analytics',
        description: 'Dashboards, charts, and data exports',
        weight: { complexity: 2, timeline: 1, cost: 1 },
      },
      {
        id: 'notifications',
        label: 'Email/SMS Notifications',
        description: 'Automated alerts and communications',
        weight: { complexity: 1, timeline: 1, cost: 1 },
      },
      {
        id: 'file_upload',
        label: 'File Uploads & Storage',
        description: 'Users can upload and manage documents/images',
        weight: { complexity: 1, timeline: 1, cost: 1 },
      },
      {
        id: 'roles',
        label: 'Multiple User Roles',
        description: 'Different permission levels (admin, manager, user)',
        weight: { complexity: 2, timeline: 1, cost: 1 },
      },
      {
        id: 'mobile',
        label: 'Mobile-Friendly',
        description: 'Works well on phones and tablets',
        weight: { complexity: 1, timeline: 1, cost: 1 },
      },
      {
        id: 'realtime',
        label: 'Real-Time Updates',
        description: 'Live data without refreshing the page',
        weight: { complexity: 2, timeline: 2, cost: 2 },
      },
    ],
    required: true,
  },

  // STEP 5: Timeline & Budget
  {
    id: 'timeline',
    step: 5,
    type: 'single',
    category: 'timeline',
    question: 'When do you need this completed?',
    subtitle: 'Be realistic - rushed timelines often lead to compromises.',
    insight: 'Quality software takes time. We\'d rather be honest about timelines than over-promise and under-deliver.',
    options: [
      {
        id: 'asap',
        label: 'ASAP (1-2 months)',
        description: 'Urgent - willing to prioritize speed over features',
        weight: { timeline: -2, cost: 2 },
      },
      {
        id: 'soon',
        label: 'Soon (2-4 months)',
        description: 'Important but not emergency',
        weight: { timeline: -1, cost: 1 },
      },
      {
        id: 'standard',
        label: 'Standard (4-6 months)',
        description: 'Comfortable timeline for a quality build',
        weight: { timeline: 0, cost: 0 },
      },
      {
        id: 'relaxed',
        label: 'Flexible (6+ months)',
        description: 'No rush - want to do it right',
        weight: { timeline: 1, cost: -1 },
      },
    ],
    required: true,
  },
  {
    id: 'budget_range',
    step: 5,
    type: 'single',
    category: 'timeline',
    question: 'What investment are you considering?',
    subtitle: 'This helps us recommend the right approach and scope.',
    insight: 'Custom software is an investment that pays dividends. Most of our clients see ROI within 6-12 months through time savings and efficiency gains.',
    options: [
      {
        id: 'exploring',
        label: "Not Sure Yet",
        description: "I'm still exploring what's possible",
      },
      {
        id: 'starter',
        label: 'Under $25,000',
        description: 'Good for focused MVPs and simple tools',
        weight: { cost: 0 },
      },
      {
        id: 'growth',
        label: '$25,000 - $75,000',
        description: 'Good for feature-rich applications',
        weight: { cost: 1 },
      },
      {
        id: 'scale',
        label: '$75,000 - $150,000',
        description: 'Good for complex, multi-feature platforms',
        weight: { cost: 2 },
      },
      {
        id: 'enterprise',
        label: '$150,000+',
        description: 'Enterprise-grade solutions with advanced requirements',
        weight: { cost: 3 },
      },
    ],
    required: true,
  },

  // STEP 6: Readiness
  {
    id: 'decision_maker',
    step: 6,
    type: 'single',
    category: 'readiness',
    question: 'Who is involved in this decision?',
    subtitle: 'Understanding your team helps us tailor our approach.',
    options: [
      {
        id: 'solo',
        label: 'Just Me',
        description: 'I make the final call',
      },
      {
        id: 'small_team',
        label: 'Small Team (2-3 people)',
        description: 'A few stakeholders to align',
      },
      {
        id: 'committee',
        label: 'Multiple Stakeholders',
        description: 'Several departments or executives involved',
      },
      {
        id: 'board',
        label: 'Board / Executive Approval',
        description: 'Requires formal approval process',
      },
    ],
    required: true,
  },
  {
    id: 'timeline_decision',
    step: 6,
    type: 'single',
    category: 'readiness',
    question: 'When are you looking to make a decision?',
    subtitle: "This helps us understand your timeline for moving forward.",
    options: [
      {
        id: 'immediate',
        label: 'Ready Now',
        description: 'Looking to start in the next 2-4 weeks',
      },
      {
        id: 'soon',
        label: 'Within 1-2 Months',
        description: 'Actively evaluating options',
      },
      {
        id: 'planning',
        label: 'Within 3-6 Months',
        description: 'Planning and budgeting phase',
      },
      {
        id: 'research',
        label: 'Just Researching',
        description: 'Exploring possibilities for the future',
      },
    ],
    required: true,
  },
];

const stepTitles = [
  { step: 1, title: 'Your Situation', description: 'Tell us about your project' },
  { step: 2, title: 'Pain Points', description: 'What challenges are you facing?' },
  { step: 3, title: 'Goals', description: 'What does success look like?' },
  { step: 4, title: 'Scope', description: 'What do you need built?' },
  { step: 5, title: 'Timeline & Budget', description: 'Planning your investment' },
  { step: 6, title: 'Next Steps', description: 'Ready to move forward?' },
];

interface Answers {
  [key: string]: string | string[];
}

interface EstimateResult {
  tier: string;
  tierDescription: string;
  priceRange: { min: number; max: number };
  timelineWeeks: { min: number; max: number };
  phases: string[];
  keyFeatures: string[];
  recommendations: string[];
  fitScore: number;
  fitAssessment: string;
  nextSteps: string[];
}

function calculateEstimate(answers: Answers): EstimateResult {
  let complexityScore = 0;
  let timelineModifier = 0;
  let costModifier = 0;

  // Calculate scores based on answers
  questions.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;

    if (q.type === 'single') {
      const option = q.options.find((o) => o.id === answer);
      if (option?.weight) {
        complexityScore += option.weight.complexity || 0;
        timelineModifier += option.weight.timeline || 0;
        costModifier += option.weight.cost || 0;
      }
    } else if (q.type === 'multiple' && Array.isArray(answer)) {
      answer.forEach((a) => {
        const option = q.options.find((o) => o.id === a);
        if (option?.weight) {
          complexityScore += option.weight.complexity || 0;
          timelineModifier += option.weight.timeline || 0;
          costModifier += option.weight.cost || 0;
        }
      });
    }
  });

  // Determine tier based on total score
  let tier: string;
  let tierDescription: string;
  let basePrice: { min: number; max: number };
  let baseTimeline: { min: number; max: number };

  const totalScore = complexityScore + costModifier;

  if (totalScore <= 8) {
    tier = 'Starter';
    tierDescription = 'A focused solution that solves your core problem without unnecessary complexity.';
    basePrice = { min: 5000, max: 15000 };
    baseTimeline = { min: 4, max: 8 };
  } else if (totalScore <= 15) {
    tier = 'Launchpad';
    tierDescription = 'A well-rounded MVP or single-purpose application with room to grow.';
    basePrice = { min: 25000, max: 50000 };
    baseTimeline = { min: 8, max: 14 };
  } else if (totalScore <= 25) {
    tier = 'Growth';
    tierDescription = 'A comprehensive platform with multiple features working together seamlessly.';
    basePrice = { min: 75000, max: 150000 };
    baseTimeline = { min: 14, max: 24 };
  } else {
    tier = 'Enterprise';
    tierDescription = 'An enterprise-grade solution built for scale, security, and complex requirements.';
    basePrice = { min: 150000, max: 300000 };
    baseTimeline = { min: 24, max: 40 };
  }

  // Adjust timeline based on modifiers
  const timelineAdjustment = timelineModifier * 2;
  const adjustedTimeline = {
    min: Math.max(4, baseTimeline.min + timelineAdjustment),
    max: Math.max(6, baseTimeline.max + timelineAdjustment),
  };

  // Generate phases based on project type and features
  const phases: string[] = ['Discovery & Planning', 'Design & Prototyping'];
  if (answers.project_type === 'saas_product' || answers.project_type === 'customer_portal') {
    phases.push('Core Platform Development');
    phases.push('User Experience Polish');
  } else {
    phases.push('Development');
  }
  if (Array.isArray(answers.features) && answers.features.includes('integrations')) {
    phases.push('Integration & Testing');
  }
  phases.push('Testing & Quality Assurance');
  phases.push('Launch & Training');

  // Generate key features based on selections
  const keyFeatures: string[] = [];
  if (Array.isArray(answers.features)) {
    const featureMap: Record<string, string> = {
      auth: 'Secure user authentication system',
      payments: 'Payment processing integration',
      integrations: 'Third-party system integrations',
      reporting: 'Custom reporting dashboard',
      notifications: 'Automated notification system',
      file_upload: 'Document management system',
      roles: 'Role-based access control',
      mobile: 'Mobile-responsive design',
      realtime: 'Real-time data updates',
    };
    answers.features.forEach((f) => {
      if (featureMap[f]) keyFeatures.push(featureMap[f]);
    });
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (answers.current_state === 'manual') {
    recommendations.push('Start by documenting your current manual processes to ensure nothing is missed in the automation.');
  }
  if (answers.pain_severity === 'critical') {
    recommendations.push('Consider a phased approach - launch core functionality fast, then iterate based on real usage.');
  }
  if (Array.isArray(answers.features) && answers.features.length > 5) {
    recommendations.push('With multiple features, we recommend prioritizing a core MVP first to get value sooner.');
  }
  if (answers.timeline === 'asap') {
    recommendations.push('For faster delivery, focus on must-have features first. Nice-to-haves can come in phase 2.');
  }
  if (answers.user_count === 'public') {
    recommendations.push('Public-facing apps need extra attention to security, performance, and user experience.');
  }
  if (recommendations.length === 0) {
    recommendations.push("Based on your inputs, you're well-positioned for a successful project.");
  }

  // Calculate fit score (0-100)
  let fitScore = 70; // Base score
  if (answers.budget_range === 'exploring') {
    fitScore -= 10;
  } else if (
    (tier === 'Starter' && ['starter', 'growth'].includes(answers.budget_range as string)) ||
    (tier === 'Launchpad' && ['growth', 'scale'].includes(answers.budget_range as string)) ||
    (tier === 'Growth' && ['scale', 'enterprise'].includes(answers.budget_range as string)) ||
    (tier === 'Enterprise' && answers.budget_range === 'enterprise')
  ) {
    fitScore += 15;
  }
  if (answers.timeline_decision === 'immediate' || answers.timeline_decision === 'soon') {
    fitScore += 10;
  }
  if (answers.decision_maker === 'solo' || answers.decision_maker === 'small_team') {
    fitScore += 5;
  }
  fitScore = Math.min(100, Math.max(0, fitScore));

  let fitAssessment: string;
  if (fitScore >= 85) {
    fitAssessment = "Excellent fit! Your project aligns well with our expertise and approach.";
  } else if (fitScore >= 70) {
    fitAssessment = "Good fit! We'd love to discuss your project in more detail.";
  } else if (fitScore >= 50) {
    fitAssessment = "Potential fit. Let's talk to see if we're the right partner for your needs.";
  } else {
    fitAssessment = "Let's have a conversation to better understand your needs and see how we can help.";
  }

  // Next steps
  const nextSteps = [
    'Schedule a free discovery call to discuss your project',
    'We\'ll prepare a detailed proposal within 3-5 business days',
    'Review the proposal and ask any questions',
    'If we\'re a good fit, we\'ll kick off with a discovery workshop',
  ];

  return {
    tier,
    tierDescription,
    priceRange: basePrice,
    timelineWeeks: adjustedTimeline,
    phases,
    keyFeatures: keyFeatures.length > 0 ? keyFeatures : ['Custom solution tailored to your needs'],
    recommendations,
    fitScore,
    fitAssessment,
    nextSteps,
  };
}

export default function EstimatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestions = questions.filter((q) => q.step === currentStep);
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleSingleSelect = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleMultiSelect = (questionId: string, optionId: string) => {
    const current = (answers[questionId] as string[]) || [];
    if (current.includes(optionId)) {
      setAnswers({ ...answers, [questionId]: current.filter((id) => id !== optionId) });
    } else {
      setAnswers({ ...answers, [questionId]: [...current, optionId] });
    }
  };

  const canProceed = () => {
    return currentQuestions.every((q) => {
      if (!q.required) return true;
      const answer = answers[q.id];
      if (q.type === 'multiple') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return !!answer;
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const estimate = showResults ? calculateEstimate(answers) : null;

  if (showResults && estimate) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-wide py-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Questions
            </button>
            <h1 className="heading-2 text-gray-900">Your Project Estimate</h1>
            <p className="text-lead mt-2">
              Based on your answers, here's what we recommend for your project.
            </p>
          </div>
        </div>

        <div className="container-wide py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Estimate */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tier Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elevated p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="badge-primary mb-2">Recommended Tier</span>
                    <h2 className="heading-3 text-gray-900">{estimate.tier}</h2>
                    <p className="text-gray-600 mt-2">{estimate.tierDescription}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <DollarSign className="w-4 h-4" />
                      Estimated Investment
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${estimate.priceRange.min.toLocaleString()} - ${estimate.priceRange.max.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Calendar className="w-4 h-4" />
                      Estimated Timeline
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {estimate.timelineWeeks.min} - {estimate.timelineWeeks.max} weeks
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Project Phases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <h3 className="heading-4 text-gray-900 mb-4">Project Phases</h3>
                <div className="space-y-3">
                  {estimate.phases.map((phase, index) => (
                    <div key={phase} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{phase}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h3 className="heading-4 text-gray-900 mb-4">What You'll Get</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {estimate.keyFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6 bg-amber-50 border-amber-200"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Our Recommendations</h3>
                    <ul className="space-y-2">
                      {estimate.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700 text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Fit Score */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Project Fit</h3>
                <div className="relative h-4 bg-gray-200 rounded-full mb-4">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    style={{ width: `${estimate.fitScore}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{estimate.fitAssessment}</p>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
                <ol className="space-y-3">
                  {estimate.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6 bg-primary-600 text-white"
              >
                <h3 className="font-semibold mb-2">Ready to Get Started?</h3>
                <p className="text-primary-100 text-sm mb-4">
                  Let's discuss your project and create a detailed proposal tailored to your needs.
                </p>
                <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-primary-50 w-full justify-center">
                  Schedule a Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 text-center">
                This is a preliminary estimate based on the information provided. Actual pricing and timeline will be determined during our discovery process.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stepInfo = stepTitles.find((s) => s.step === currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-wide py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 mb-2 block">
                ← Back to Home
              </Link>
              <h1 className="heading-3 text-gray-900">Project Estimator</h1>
              <p className="text-gray-600 mt-1">
                Answer a few questions to get a personalized estimate for your project.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</div>
              <div className="font-semibold text-gray-900">{stepInfo?.title}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            {stepTitles.map((step, index) => (
              <div
                key={step.step}
                className={clsx(
                  'flex items-center',
                  index < stepTitles.length - 1 && 'flex-1'
                )}
              >
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    currentStep > step.step
                      ? 'bg-primary-600 text-white'
                      : currentStep === step.step
                      ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {currentStep > step.step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.step
                  )}
                </div>
                {index < stepTitles.length - 1 && (
                  <div
                    className={clsx(
                      'flex-1 h-0.5 mx-2',
                      currentStep > step.step ? 'bg-primary-600' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="container-narrow py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentQuestions.map((question) => (
              <div key={question.id} className="card p-8">
                <h2 className="heading-4 text-gray-900 mb-2">{question.question}</h2>
                {question.subtitle && (
                  <p className="text-gray-600 mb-6">{question.subtitle}</p>
                )}

                {question.insight && (
                  <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg mb-6">
                    <Lightbulb className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary-800">{question.insight}</p>
                  </div>
                )}

                <div className={clsx(
                  'grid gap-3',
                  question.options.length <= 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
                )}>
                  {question.options.map((option) => {
                    const isSelected = question.type === 'single'
                      ? answers[question.id] === option.id
                      : (answers[question.id] as string[] || []).includes(option.id);

                    return (
                      <button
                        key={option.id}
                        onClick={() =>
                          question.type === 'single'
                            ? handleSingleSelect(question.id, option.id)
                            : handleMultiSelect(question.id, option.id)
                        }
                        className={clsx(
                          'text-left p-4 rounded-xl border-2 transition-all',
                          isSelected
                            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {option.icon && (
                            <option.icon className={clsx(
                              'w-5 h-5 mt-0.5',
                              isSelected ? 'text-primary-600' : 'text-gray-400'
                            )} />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={clsx(
                                'font-medium',
                                isSelected ? 'text-primary-900' : 'text-gray-900'
                              )}>
                                {option.label}
                              </span>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                            {option.description && (
                              <p className={clsx(
                                'text-sm mt-1',
                                isSelected ? 'text-primary-700' : 'text-gray-500'
                              )}>
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {question.type === 'multiple' && (
                  <p className="text-sm text-gray-500 mt-4">
                    Select all that apply
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
              currentStep === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={clsx(
              'flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors',
              canProceed()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            {currentStep === totalSteps ? 'See My Estimate' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
