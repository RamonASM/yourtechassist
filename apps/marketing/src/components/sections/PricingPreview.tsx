import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

const tiers = [
  {
    name: 'Starter',
    tagline: 'Launch & Validate',
    investment: 'Starting at $5K',
    description: 'MVPs, landing pages, and tools that prove your concept.',
    features: [
      'Simple applications & tools',
      'Basic integrations',
      'UI/UX design included',
      'Full source code ownership',
    ],
    popular: false,
  },
  {
    name: 'Growth',
    tagline: 'Scale & Optimize',
    investment: 'Starting at $25K',
    description: 'Replace multiple tools with one unified platform.',
    features: [
      'Multi-feature applications',
      'Advanced integrations',
      'Custom analytics dashboard',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    tagline: 'Transform & Dominate',
    investment: 'Custom Quote',
    description: 'Mission-critical platforms for complex requirements.',
    features: [
      'Enterprise-grade platforms',
      'Unlimited integrations',
      'Dedicated dev team',
      'SLA guarantees',
    ],
    popular: false,
  },
];

export default function PricingPreview() {
  return (
    <section className="section bg-white">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-accent mb-4">Investment-Level Quality</span>
          <h2 className="heading-2 text-gray-900 mb-4">
            Premium Software, Built Right
          </h2>
          <p className="text-lead">
            We build custom software that delivers real ROI. Every project is tailored to your specific needs and goals.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                'relative rounded-2xl border p-6 transition-all duration-300',
                tier.popular
                  ? 'border-primary-500 bg-primary-50/50 shadow-xl scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-primary-200 hover:shadow-lg'
              )}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier name */}
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900">{tier.name}</h3>
                <p className="text-primary-600 text-sm font-medium">{tier.tagline}</p>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">{tier.investment}</div>
                <div className="text-sm text-gray-500">one-time or monthly licensing</div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{tier.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link to="/estimate" className="btn-primary btn-lg">
            Get Your Estimate
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500">
            <Link to="/pricing" className="text-primary-600 hover:text-primary-700">
              View full pricing details →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
