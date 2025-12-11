import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, ArrowLeft, Lightbulb, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { companyApi } from '../../lib/api';
import { useAuthStore } from '../../stores/auth';

interface RequirementsForm {
  problemDescription: string;
  timeline: string;
}

const projectTypes = [
  { value: 'custom_software', label: 'Custom Software', desc: 'Bespoke application built for your needs' },
  { value: 'saas', label: 'SaaS Platform', desc: 'Multi-tenant cloud software' },
  { value: 'portal', label: 'Web Portal', desc: 'Customer or partner portal' },
  { value: 'dashboard', label: 'Dashboard', desc: 'Analytics and reporting tools' },
  { value: 'integration', label: 'System Integration', desc: 'Connect existing systems' },
  { value: 'white_label', label: 'White-Label', desc: 'Rebrandable solution' },
];

const featureOptions = [
  'User Authentication',
  'Role-Based Access',
  'Real-time Updates',
  'Reporting & Analytics',
  'Payment Processing',
  'Email Notifications',
  'File Upload/Storage',
  'API Integration',
  'Mobile Responsive',
  'Workflow Automation',
  'Data Import/Export',
  'Multi-language',
];

const integrationOptions = [
  'Stripe',
  'QuickBooks',
  'Salesforce',
  'HubSpot',
  'Shopify',
  'Zapier',
  'Slack',
  'Google Workspace',
  'Microsoft 365',
  'Other CRM',
  'Other ERP',
  'Custom API',
];

const timelines = [
  { value: 'ASAP', label: 'ASAP', desc: 'As soon as possible' },
  { value: '1-3_months', label: '1-3 Months', desc: 'Near-term project' },
  { value: '3-6_months', label: '3-6 Months', desc: 'Medium-term planning' },
  { value: '6+_months', label: '6+ Months', desc: 'Long-term roadmap' },
];

export default function OnboardingRequirements() {
  const navigate = useNavigate();
  const { company } = useAuthStore();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);

  const { register, handleSubmit } = useForm<RequirementsForm>();

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      companyApi.updateOnboarding(company!.id, data),
    onSuccess: () => {
      navigate('/onboarding/budget');
    },
  });

  const onSubmit = (data: RequirementsForm) => {
    updateMutation.mutate({
      ...data,
      projectTypes: selectedTypes,
      keyFeatures: selectedFeatures,
      integrations: selectedIntegrations,
    });
  };

  const toggleItem = (
    item: string,
    _selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">Step 2 of 4</span>
            <span className="text-sm text-gray-500">Project Requirements</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-primary-600 rounded-full w-2/4" />
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                What are you looking to build?
              </h1>
              <p className="text-gray-600">
                Tell us about your project requirements
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Project Types */}
            <div>
              <label className="label">Project Type (select all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      toggleItem(type.value, selectedTypes, setSelectedTypes)
                    }
                    className={`flex items-start gap-3 p-4 border rounded-lg text-left transition-colors ${
                      selectedTypes.includes(type.value)
                        ? 'border-primary-500 bg-primary-50'
                        : 'hover:border-gray-400'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${
                        selectedTypes.includes(type.value)
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedTypes.includes(type.value) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{type.label}</p>
                      <p className="text-sm text-gray-500">{type.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="label">
                Describe the problem you're trying to solve
              </label>
              <textarea
                className="input min-h-[120px]"
                placeholder="What challenges are you facing? What would success look like?"
                {...register('problemDescription')}
              />
            </div>

            {/* Key Features */}
            <div>
              <label className="label">
                Key features needed (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() =>
                      toggleItem(feature, selectedFeatures, setSelectedFeatures)
                    }
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedFeatures.includes(feature)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div>
              <label className="label">
                Systems to integrate with (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {integrationOptions.map((integration) => (
                  <button
                    key={integration}
                    type="button"
                    onClick={() =>
                      toggleItem(
                        integration,
                        selectedIntegrations,
                        setSelectedIntegrations
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedIntegrations.includes(integration)
                        ? 'bg-accent-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {integration}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="label">When do you need this?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timelines.map((timeline) => (
                  <label
                    key={timeline.value}
                    className="flex flex-col items-center gap-1 p-4 border rounded-lg cursor-pointer hover:border-primary-500 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 text-center"
                  >
                    <input
                      type="radio"
                      value={timeline.value}
                      className="sr-only"
                      {...register('timeline', { required: true })}
                    />
                    <span className="font-medium text-gray-900">{timeline.label}</span>
                    <span className="text-xs text-gray-500">{timeline.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link
                to="/onboarding/business"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn-primary flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
