import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, Building2, Check } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { companyApi } from '../../lib/api';
import { useAuthStore } from '../../stores/auth';

interface BusinessForm {
  industry: string;
  companySize: string;
  revenue: string;
  currentTech: string[];
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Logistics',
  'Other',
];

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
];

const revenueRanges = [
  { value: '250k-500k', label: '$250K - $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m-5m', label: '$1M - $5M' },
  { value: '5m-10m', label: '$5M - $10M' },
  { value: '10m+', label: '$10M+' },
];

const techOptions = [
  'Spreadsheets / Excel',
  'Custom Software',
  'Off-the-shelf SaaS',
  'ERP System',
  'CRM System',
  'Manual Processes',
];

export default function OnboardingBusiness() {
  const navigate = useNavigate();
  const { company } = useAuthStore();
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const { register, handleSubmit } = useForm<BusinessForm>();

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      companyApi.updateOnboarding(company!.id, data),
    onSuccess: () => {
      navigate('/onboarding/requirements');
    },
  });

  const onSubmit = (data: BusinessForm) => {
    updateMutation.mutate({
      ...data,
      currentTech: selectedTech,
    });
  };

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">Step 1 of 4</span>
            <span className="text-sm text-gray-500">Business Profile</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-primary-600 rounded-full w-1/4" />
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tell us about your business
              </h1>
              <p className="text-gray-600">
                This helps us understand your needs better
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Industry */}
            <div>
              <label className="label">What industry are you in?</label>
              <select className="input" {...register('industry', { required: true })}>
                <option value="">Select industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="label">How many employees?</label>
              <div className="grid grid-cols-2 gap-3">
                {companySizes.map((size) => (
                  <label
                    key={size.value}
                    className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary-500 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
                  >
                    <input
                      type="radio"
                      value={size.value}
                      className="sr-only"
                      {...register('companySize', { required: true })}
                    />
                    <span className="text-gray-900">{size.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Revenue */}
            <div>
              <label className="label">Annual revenue range</label>
              <select className="input" {...register('revenue', { required: true })}>
                <option value="">Select range</option>
                {revenueRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Tech */}
            <div>
              <label className="label">
                What do you currently use? (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`flex items-center gap-2 p-3 border rounded-lg text-left transition-colors ${
                      selectedTech.includes(tech)
                        ? 'border-primary-500 bg-primary-50'
                        : 'hover:border-gray-400'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedTech.includes(tech)
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedTech.includes(tech) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm text-gray-900">{tech}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Skip for now
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
