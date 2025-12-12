import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, FileText, DollarSign, Calendar, Target, X } from 'lucide-react';

const projectTypes = [
  'Custom Software',
  'SaaS Development',
  'Web Portal',
  'Dashboard',
  'Integration',
  'White-Label',
  'Other',
];

const budgetRanges = [
  'Under $10k',
  '$10k - $25k',
  '$25k - $50k',
  '$50k - $100k',
  '$100k - $250k',
  '$250k+',
  'Not sure yet',
];

const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourtechassist.us';

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

// Map option IDs to readable labels
const optionLabels: Record<string, string> = {
  internal_tool: 'Internal Tool / Dashboard',
  customer_portal: 'Customer-Facing Portal',
  saas_product: 'SaaS Product',
  ecommerce: 'E-commerce / Marketplace',
  mobile_app: 'Mobile Application',
  save_time: 'Save Time',
  increase_revenue: 'Increase Revenue',
  reduce_errors: 'Reduce Errors',
  better_cx: 'Improve Customer Experience',
  scale: 'Enable Growth',
  visibility: 'Gain Visibility',
};

function getLabel(id: string): string {
  return optionLabels[id] || id;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });

  // Load estimate data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('estimateData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setEstimateData(data);
        // Pre-fill project type based on estimate
        if (data.answers?.project_type) {
          const typeMap: Record<string, string> = {
            internal_tool: 'Dashboard',
            customer_portal: 'Web Portal',
            saas_product: 'SaaS Development',
            ecommerce: 'Custom Software',
            mobile_app: 'Custom Software',
            other: 'Other',
          };
          setFormData(prev => ({
            ...prev,
            projectType: typeMap[data.answers.project_type] || prev.projectType,
          }));
        }
      } catch (e) {
        console.error('Failed to parse estimate data:', e);
      }
    }
  }, []);

  const clearEstimateData = () => {
    localStorage.removeItem('estimateData');
    setEstimateData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(`${API_URL}/api/leads/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimateData: estimateData || undefined,
        }),
      });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    }

    // Clear estimate data after submission
    localStorage.removeItem('estimateData');
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="heading-2 text-gray-900 mb-4">Message Sent!</h1>
          <p className="text-lead max-w-md">
            Thanks for reaching out. We'll review your message and get back to you within 24 hours.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-sm gradient-bg">
        <div className="container-wide text-center">
          <h1 className="heading-1 text-gray-900 mb-4">Let's Talk</h1>
          <p className="text-lead max-w-2xl mx-auto">
            Ready to discuss your project? Fill out the form below or schedule a call directly.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div>
            {/* Estimate Context */}
            {estimateData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 bg-primary-50 border-primary-200 mb-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-primary-900">Your Project Estimate</h3>
                  </div>
                  <button
                    onClick={clearEstimateData}
                    className="p-1 hover:bg-primary-100 rounded transition-colors"
                    title="Clear estimate data"
                  >
                    <X className="w-4 h-4 text-primary-600" />
                  </button>
                </div>
                <p className="text-sm text-primary-700 mb-4">
                  We've included your estimate data with this form so we can better prepare for our conversation.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 text-primary-600 text-xs font-medium mb-1">
                      <Target className="w-3 h-3" />
                      Tier
                    </div>
                    <div className="font-semibold text-gray-900">{estimateData.estimate.tier}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 text-primary-600 text-xs font-medium mb-1">
                      <DollarSign className="w-3 h-3" />
                      Investment
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${estimateData.estimate.priceRange.min.toLocaleString()} - ${estimateData.estimate.priceRange.max.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 text-primary-600 text-xs font-medium mb-1">
                      <Calendar className="w-3 h-3" />
                      Timeline
                    </div>
                    <div className="font-semibold text-gray-900">
                      {estimateData.estimate.timelineWeeks.min} - {estimateData.estimate.timelineWeeks.max} weeks
                    </div>
                  </div>
                </div>
                {estimateData.answers.primary_goal && (
                  <div className="mt-3 pt-3 border-t border-primary-200">
                    <span className="text-xs text-primary-600 font-medium">Primary Goal:</span>
                    <span className="text-sm text-gray-700 ml-2">{getLabel(estimateData.answers.primary_goal as string)}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Form */}
            <div>
              <div className="card p-8">
                <h2 className="heading-4 text-gray-900 mb-6">
                  {estimateData ? 'Complete Your Request' : 'Tell Us About Your Project'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="label">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input"
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="projectType" className="label">Project Type *</label>
                      <select
                        id="projectType"
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="">Select a type...</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="budget" className="label">Budget Range</label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="">Select a range...</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timeline" className="label">Ideal Timeline</label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Need to launch by Q2 2025"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="label">Project Description *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="input"
                      placeholder="Tell us about your project, challenges, and goals..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {estimateData ? 'Send & Schedule Call' : 'Send Message'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
