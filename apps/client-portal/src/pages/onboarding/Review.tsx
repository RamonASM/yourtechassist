import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  Building2,
  Lightbulb,
  DollarSign,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { companyApi } from '../../lib/api';
import { useAuthStore } from '../../stores/auth';

const tierInfo: Record<string, { color: string; range: string; desc: string }> = {
  starter: {
    color: 'bg-gray-100 text-gray-800',
    range: '$2K - $12K',
    desc: 'Perfect for simple projects and MVPs',
  },
  launchpad: {
    color: 'bg-blue-100 text-blue-800',
    range: '$25K - $50K',
    desc: 'Ideal for standard custom builds',
  },
  growth: {
    color: 'bg-purple-100 text-purple-800',
    range: '$75K - $150K',
    desc: 'Great for complex applications',
  },
  scale: {
    color: 'bg-primary-100 text-primary-800',
    range: '$150K - $500K+',
    desc: 'Enterprise-grade solutions',
  },
};

export default function OnboardingReview() {
  const navigate = useNavigate();
  const { company } = useAuthStore();

  const { data: onboarding, isLoading } = useQuery({
    queryKey: ['onboarding', company?.id],
    queryFn: () => companyApi.getOnboarding(company!.id).then((res) => res.data.data),
    enabled: !!company?.id,
  });

  const completeMutation = useMutation({
    mutationFn: () => companyApi.completeOnboarding(company!.id),
    onSuccess: () => {
      navigate('/');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const suggestedTier = onboarding?.suggestedTier || 'launchpad';
  const tier = tierInfo[suggestedTier] || tierInfo.launchpad;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">Step 4 of 4</span>
            <span className="text-sm text-gray-500">Review & Submit</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-primary-600 rounded-full w-full" />
          </div>
        </div>

        {/* Suggested Tier Card */}
        <div className="card p-8 mb-6 border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-600">
              Based on your requirements
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {suggestedTier} Tier
              </h2>
              <p className="text-gray-600">{tier.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">{tier.range}</p>
              <p className="text-sm text-gray-500">Estimated investment</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4">
          {/* Business Profile */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Business Profile</h3>
              <Link
                to="/onboarding/business"
                className="ml-auto text-sm text-primary-600 hover:underline"
              >
                Edit
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Industry</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {onboarding?.industry || 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Company Size</dt>
                <dd className="font-medium text-gray-900">
                  {onboarding?.companySize || 'Not specified'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Requirements */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Project Requirements</h3>
              <Link
                to="/onboarding/requirements"
                className="ml-auto text-sm text-primary-600 hover:underline"
              >
                Edit
              </Link>
            </div>
            <div className="space-y-4">
              {onboarding?.projectTypes?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Project Types</p>
                  <div className="flex flex-wrap gap-2">
                    {onboarding.projectTypes.map((type: string) => (
                      <span key={type} className="badge-info capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {onboarding?.keyFeatures?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Key Features</p>
                  <div className="flex flex-wrap gap-2">
                    {onboarding.keyFeatures.map((feature: string) => (
                      <span key={feature} className="badge-gray">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {onboarding?.integrations?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Integrations</p>
                  <div className="flex flex-wrap gap-2">
                    {onboarding.integrations.map((integration: string) => (
                      <span key={integration} className="badge-gray">
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Budget & Preferences</h3>
              <Link
                to="/onboarding/budget"
                className="ml-auto text-sm text-primary-600 hover:underline"
              >
                Edit
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Engagement Model</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {onboarding?.engagementModel?.replace('-', ' ') || 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Communication</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {onboarding?.communicationPreference?.replace('_', ' ') ||
                    'Not specified'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8">
          <Link
            to="/onboarding/budget"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <button
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
            className="btn-primary flex items-center gap-2 px-8"
          >
            {completeMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Complete Setup
              </>
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By completing setup, you agree to our terms of service. Our team will
          review your requirements and reach out within 24 hours.
        </p>
      </div>
    </div>
  );
}
