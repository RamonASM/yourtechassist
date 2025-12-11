import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const tiers = [
  {
    name: 'Starter',
    oneTime: { min: 2000, max: 12000 },
    monthly: { min: 500, max: 1000 },
    description: 'Perfect for landing pages, simple tools, and quick wins that deliver immediate value.',
    features: [
      'Landing pages & marketing sites',
      'Simple CRUD applications',
      'Feature additions to existing apps',
      'Bug fix packages',
      'Maintenance retainers',
      'Email support',
    ],
    popular: false,
    cta: 'Get Started',
  },
  {
    name: 'Launchpad',
    oneTime: { min: 25000, max: 50000 },
    monthly: { min: 1500, max: 2500 },
    description: 'Ideal for MVPs, single-purpose applications, and startups validating their ideas.',
    features: [
      'MVP development',
      'Single-purpose tools',
      'Basic integrations (up to 2)',
      'UI/UX design included',
      'Standard support',
      '90-day warranty',
    ],
    popular: false,
    cta: 'Start Building',
  },
  {
    name: 'Growth',
    oneTime: { min: 75000, max: 150000 },
    monthly: { min: 3500, max: 6000 },
    description: 'For multi-feature applications and growing teams that need robust solutions.',
    features: [
      'Multi-feature applications',
      'Team collaboration tools',
      'Advanced integrations (up to 5)',
      'Custom analytics dashboard',
      'Priority support',
      'Quarterly strategy calls',
    ],
    popular: true,
    cta: 'Scale Up',
  },
  {
    name: 'Scale',
    oneTime: { min: 150000, max: 500000 },
    monthly: { min: 8000, max: 15000 },
    description: 'Enterprise platforms with complex requirements and mission-critical operations.',
    features: [
      'Enterprise platforms',
      'Complex system integrations',
      'Custom infrastructure',
      'Dedicated development team',
      '24/7 support available',
      'SLA guarantees',
    ],
    popular: false,
    cta: 'Contact Sales',
  },
];

const faqs = [
  {
    question: 'What\'s the difference between one-time and licensing?',
    answer: 'One-time builds are project-based engagements where you pay for development and own the code outright. Licensing includes ongoing maintenance, updates, hosting, and support for a predictable monthly fee.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Timeline varies by complexity. Starter projects typically take 2-4 weeks. Launchpad projects run 6-12 weeks. Growth and Scale projects can range from 3-9 months depending on scope.',
  },
  {
    question: 'Do I own the code?',
    answer: 'For one-time builds, yes - you own all code and IP upon final payment. For licensing, we retain ownership but you have perpetual usage rights. You can buy out at any time.',
  },
  {
    question: 'What if I need something custom?',
    answer: 'Every project is custom! These tiers are starting points. We\'ll discuss your specific needs and provide a tailored proposal with exact pricing during our discovery call.',
  },
  {
    question: 'What support is included?',
    answer: 'All tiers include post-launch support. One-time builds include a 90-day warranty. Licensing includes ongoing support, bug fixes, and regular updates as part of your subscription.',
  },
];

export default function PricingPage() {
  const [billingType, setBillingType] = useState<'one-time' | 'monthly'>('one-time');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section gradient-bg">
        <div className="container-wide text-center">
          <span className="badge-primary mb-4">Transparent Pricing</span>
          <h1 className="heading-1 text-gray-900 mb-4">
            Pricing That Makes Sense
          </h1>
          <p className="text-lead max-w-2xl mx-auto mb-8">
            Choose between a one-time build or ongoing licensing. Both options include quality development, dedicated support, and transparent communication.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setBillingType('one-time')}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                billingType === 'one-time'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              One-Time Build
            </button>
            <button
              onClick={() => setBillingType('monthly')}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                billingType === 'monthly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Monthly License
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="section-sm bg-white">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  'relative rounded-2xl border p-6 flex flex-col',
                  tier.popular
                    ? 'border-primary-500 bg-primary-50/50 shadow-xl'
                    : 'border-gray-200 bg-white hover:border-primary-200 hover:shadow-lg transition-all'
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="font-bold text-lg text-gray-900 mb-2">{tier.name}</h3>

                <div className="mb-4">
                  {billingType === 'one-time' ? (
                    <>
                      <div className="text-3xl font-bold text-gray-900">
                        ${tier.oneTime.min.toLocaleString()} - ${tier.oneTime.max.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">one-time investment</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-primary-600">
                        ${tier.monthly.min.toLocaleString()} - ${tier.monthly.max.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per month</div>
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-6">{tier.description}</p>

                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={clsx(
                    'btn w-full justify-center',
                    tier.popular ? 'btn-primary' : 'btn-secondary'
                  )}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section bg-gray-50">
        <div className="container-narrow">
          <h2 className="heading-3 text-gray-900 text-center mb-12">
            What's Included in Every Project
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Discovery & requirements gathering',
              'UI/UX design & prototyping',
              'Full-stack development',
              'Testing & quality assurance',
              'Deployment & configuration',
              'Documentation & training',
              'Post-launch support period',
              'Source code (for one-time builds)',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <Check className="w-5 h-5 text-accent-500" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-white">
        <div className="container-narrow">
          <h2 className="heading-3 text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <HelpCircle className={clsx(
                    'w-5 h-5 text-gray-400 transition-transform',
                    openFaq === index && 'rotate-180'
                  )} />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section gradient-bg">
        <div className="container-narrow text-center">
          <h2 className="heading-3 text-gray-900 mb-4">
            Not Sure Which Plan is Right?
          </h2>
          <p className="text-lead mb-8">
            Let's discuss your project. We'll recommend the best approach based on your specific needs and goals.
          </p>
          <Link to="/contact" className="btn-primary btn-lg">
            Get a Custom Quote
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
