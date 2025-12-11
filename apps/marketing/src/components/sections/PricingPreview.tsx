import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

const tiers = [
  {
    name: 'Starter',
    oneTime: '$2k - $12k',
    monthly: '$500 - $1,000/mo',
    description: 'Perfect for landing pages, simple tools, and quick wins.',
    features: [
      'Landing pages & marketing sites',
      'Simple CRUD applications',
      'Feature additions',
      'Maintenance retainers',
    ],
    popular: false,
  },
  {
    name: 'Launchpad',
    oneTime: '$25k - $50k',
    monthly: '$1,500 - $2,500/mo',
    description: 'Ideal for MVPs, single-purpose apps, and small teams.',
    features: [
      'MVP development',
      'Single-purpose tools',
      'Basic integrations',
      'Standard support',
    ],
    popular: false,
  },
  {
    name: 'Growth',
    oneTime: '$75k - $150k',
    monthly: '$3,500 - $6,000/mo',
    description: 'For multi-feature apps and team collaboration tools.',
    features: [
      'Multi-feature applications',
      'Team collaboration tools',
      'Advanced integrations',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Scale',
    oneTime: '$150k - $500k+',
    monthly: '$8,000 - $15,000+/mo',
    description: 'Enterprise platforms with complex requirements.',
    features: [
      'Enterprise platforms',
      'Complex integrations',
      'Custom infrastructure',
      'Dedicated team',
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
          <span className="badge-accent mb-4">Transparent Pricing</span>
          <h2 className="heading-2 text-gray-900 mb-4">
            Choose Your Path to Success
          </h2>
          <p className="text-lead">
            Whether you need a one-time build or ongoing licensed software, we have flexible options to fit your needs.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              <h3 className="font-bold text-lg text-gray-900 mb-2">{tier.name}</h3>

              {/* Pricing */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">{tier.oneTime}</div>
                <div className="text-sm text-gray-500">one-time build</div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-lg font-semibold text-primary-600">{tier.monthly}</div>
                  <div className="text-xs text-gray-500">or licensed monthly</div>
                </div>
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
        <div className="text-center">
          <Link to="/pricing" className="btn-primary btn-lg">
            See Full Pricing Details
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
