import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, ArrowLeft, DollarSign, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { companyApi } from '../../lib/api';
import { useAuthStore } from '../../stores/auth';

interface BudgetForm {
  engagementModel: string;
  budgetRange: string;
  communicationPreference: string;
}

// Suppress unused var warning
void Check;

const engagementModels = [
  {
    value: 'one-time',
    label: 'One-Time Build',
    desc: 'Fixed-scope project with milestone payments',
    icon: '🏗️',
  },
  {
    value: 'licensing',
    label: 'Monthly Licensing',
    desc: 'Ongoing access with continuous updates',
    icon: '📦',
  },
  {
    value: 'hybrid',
    label: 'Hybrid Model',
    desc: 'Build + ongoing maintenance/updates',
    icon: '🔄',
  },
];

const budgetRanges = [
  { value: 'starter', label: '$2K - $12K', tier: 'Starter', desc: 'Simple projects & MVPs' },
  { value: 'launchpad', label: '$25K - $50K', tier: 'Launchpad', desc: 'Standard builds' },
  { value: 'growth', label: '$75K - $150K', tier: 'Growth', desc: 'Complex applications' },
  { value: 'scale', label: '$150K - $500K+', tier: 'Scale', desc: 'Enterprise solutions' },
];

const communicationPreferences = [
  { value: 'email', label: 'Email', desc: 'Async updates via email' },
  { value: 'slack', label: 'Slack/Teams', desc: 'Real-time chat' },
  { value: 'weekly_calls', label: 'Weekly Calls', desc: 'Regular video check-ins' },
  { value: 'daily_standups', label: 'Daily Standups', desc: 'High-touch collaboration' },
];

export default function OnboardingBudget() {
  const navigate = useNavigate();
  const { company } = useAuthStore();

  const { register, handleSubmit, watch } = useForm<BudgetForm>();
  const selectedBudget = watch('budgetRange');

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      companyApi.updateOnboarding(company!.id, data),
    onSuccess: () => {
      navigate('/onboarding/review');
    },
  });

  const onSubmit = (data: BudgetForm) => {
    updateMutation.mutate(data as Record<string, unknown>);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">Step 3 of 4</span>
            <span className="text-sm text-gray-500">Budget & Preferences</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-primary-600 rounded-full w-3/4" />
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Budget & Preferences
              </h1>
              <p className="text-gray-600">
                Help us tailor our proposal to your needs
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Engagement Model */}
            <div>
              <label className="label">Preferred engagement model</label>
              <div className="space-y-3">
                {engagementModels.map((model) => (
                  <label
                    key={model.value}
                    className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:border-primary-500 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
                  >
                    <input
                      type="radio"
                      value={model.value}
                      className="sr-only"
                      {...register('engagementModel', { required: true })}
                    />
                    <span className="text-2xl">{model.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{model.label}</p>
                      <p className="text-sm text-gray-500">{model.desc}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white hidden has-[:checked]:block" />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="label">Investment range</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {budgetRanges.map((range) => (
                  <label
                    key={range.value}
                    className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedBudget === range.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value={range.value}
                      className="sr-only"
                      {...register('budgetRange', { required: true })}
                    />
                    <span className="text-xs font-medium text-primary-600 uppercase">
                      {range.tier}
                    </span>
                    <span className="text-lg font-bold text-gray-900 mt-1">
                      {range.label}
                    </span>
                    <span className="text-sm text-gray-500">{range.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Communication Preference */}
            <div>
              <label className="label">How do you prefer to communicate?</label>
              <div className="grid grid-cols-2 gap-3">
                {communicationPreferences.map((pref) => (
                  <label
                    key={pref.value}
                    className="flex flex-col items-center gap-1 p-4 border rounded-lg cursor-pointer hover:border-primary-500 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 text-center"
                  >
                    <input
                      type="radio"
                      value={pref.value}
                      className="sr-only"
                      {...register('communicationPreference', { required: true })}
                    />
                    <span className="font-medium text-gray-900">{pref.label}</span>
                    <span className="text-xs text-gray-500">{pref.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link
                to="/onboarding/requirements"
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
