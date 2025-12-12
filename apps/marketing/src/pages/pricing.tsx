import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, ArrowRight, Sparkles, X, Layers, Heart, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const painPoints = [
  {
    problem: '7-8 different software subscriptions',
    reality: "You're paying for features you don't use, missing features you need, and none of them talk to each other.",
  },
  {
    problem: 'Still searching for that 9th tool',
    reality: "Because the perfect solution for YOUR business doesn't exist off the shelf. It never will.",
  },
  {
    problem: 'Cookie-cutter software',
    reality: "Built for the masses, not for you. You adapt your business to the software instead of the other way around.",
  },
  {
    problem: '"That\'s not possible"',
    reality: 'Enterprise vendors tell you what you CAN\'T have. We ask what you NEED to become unstoppable.',
  },
];

const tiers = [
  {
    name: 'Starter',
    tagline: 'Launch & Validate',
    oneTime: 'Starting at $5K',
    licensing: '$500 - $1,500/mo',
    description: 'Perfect for MVPs, landing pages, simple tools, and quick wins that prove your concept.',
    features: [
      'Landing pages & marketing sites',
      'Simple applications & tools',
      'Basic integrations (1-2 systems)',
      'MVP development',
      'UI/UX design included',
      'Mobile-responsive design',
      '90-day support warranty',
      'Full source code ownership',
    ],
    idealFor: 'Startups validating ideas, small businesses automating one process, entrepreneurs testing concepts.',
    popular: false,
    cta: 'Start Building',
  },
  {
    name: 'Growth',
    tagline: 'Scale & Optimize',
    oneTime: 'Starting at $25K',
    licensing: '$2,000 - $5,000/mo',
    description: 'For growing businesses ready to replace multiple tools with one unified platform.',
    features: [
      'Multi-feature applications',
      'Advanced integrations (3-5 systems)',
      'Custom analytics dashboard',
      'User roles & permissions',
      'Automated workflows',
      'Customer-facing portals',
      'Priority support',
      'Quarterly strategy sessions',
    ],
    idealFor: 'Growing teams tired of duct-taping tools together, businesses ready to consolidate and scale.',
    popular: true,
    cta: 'Scale Up',
  },
  {
    name: 'Enterprise',
    tagline: 'Transform & Dominate',
    oneTime: 'Custom Quote',
    licensing: 'Custom Agreement',
    description: 'Mission-critical platforms for organizations with complex requirements and high stakes.',
    features: [
      'Enterprise-grade platforms',
      'Unlimited integrations',
      'Custom infrastructure',
      'Dedicated development team',
      'Advanced security & compliance',
      'SLA guarantees',
      '24/7 support available',
      'Ongoing feature development',
    ],
    idealFor: 'Organizations with complex workflows, high transaction volumes, or regulatory requirements.',
    popular: false,
    cta: 'Talk to Us',
  },
];

const faqs = [
  {
    question: 'What\'s the difference between one-time and licensing?',
    answer: 'One-time builds are project-based: you pay for development and own the code outright. Licensing includes ongoing maintenance, updates, hosting, and support for a predictable monthly fee. Both options get you custom software built specifically for your needs.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Starter projects typically take 4-8 weeks. Growth projects run 8-16 weeks. Enterprise projects can range from 4-12 months depending on scope. We\'ll give you a realistic timeline during discovery.',
  },
  {
    question: 'Do I own the code?',
    answer: 'For one-time builds, absolutely - you own all code and IP upon final payment. For licensing, we retain ownership but you have perpetual usage rights and can buy out at any time.',
  },
  {
    question: 'What makes this different from hiring an agency?',
    answer: 'We\'re not just developers for hire. We become partners in your success. We dig deep into your pain points, understand your business, and build solutions that actually solve problems - not just check boxes.',
  },
  {
    question: 'Can I start small and upgrade later?',
    answer: 'Absolutely. Many clients start with a Starter project to validate their idea, then grow into Growth or Enterprise as their needs evolve. We build with scalability in mind from day one.',
  },
];

const includedInAll = [
  'Discovery & deep-dive into your business',
  'Custom UI/UX design',
  'Full-stack development',
  'Rigorous testing & QA',
  'Deployment & configuration',
  'Documentation & training',
  'Post-launch support',
  'Built with love, not templates',
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showLicensing, setShowLicensing] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section gradient-bg">
        <div className="container-wide text-center">
          <span className="badge-primary mb-4">Stop Settling for Software That Wasn't Built for You</span>
          <h1 className="heading-1 text-gray-900 mb-4">
            Software That Finally <span className="gradient-text">Gets It</span>
          </h1>
          <p className="text-lead max-w-2xl mx-auto">
            Custom code, built with love, designed around how YOUR business actually works.
          </p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="section bg-gray-900 text-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-white mb-4">Sound Familiar?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              You've tried the tools. You've stacked the subscriptions. And you're still not where you need to be.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">{point.problem}</h3>
                    <p className="text-gray-400">{point.reality}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-600/20 rounded-full border border-primary-500/30 mb-6">
              <Heart className="w-5 h-5 text-primary-400" />
              <span className="text-primary-300 font-medium">There's a better way</span>
            </div>
            <h3 className="heading-3 text-white mb-4">
              We Observe. We Listen. We Research.<br />
              <span className="gradient-text">Then We Build.</span>
            </h3>
            <p className="text-gray-400 max-w-xl mx-auto">
              Software that flows with your business, not against it. Custom solutions that do exactly what you need - nothing more, nothing less.
            </p>
          </div>
        </div>
      </section>

      {/* Estimate CTA Section */}
      <section className="section bg-primary-50">
        <div className="container-narrow text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
            <Zap className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">Not sure where to start?</span>
          </div>
          <h2 className="heading-3 text-gray-900 mb-4">
            Get a Personalized Estimate in Minutes
          </h2>
          <p className="text-lead max-w-2xl mx-auto mb-8">
            Answer a few questions about your challenges, goals, and vision. We'll show you the right path forward - with realistic pricing, timeline, and exactly what to expect.
          </p>
          <Link to="/estimate" className="btn-primary btn-lg">
            Start Your Estimate
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">Takes about 3 minutes. No email required.</p>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="section-sm bg-white border-b border-gray-200">
        <div className="container-wide">
          <div className="flex flex-col items-center">
            <h2 className="heading-2 text-gray-900 mb-2 text-center">Three Ways to Work With Us</h2>
            <p className="text-gray-600 mb-6 text-center">Choose the engagement model that fits your needs.</p>

            <div className="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg mb-4">
              <button
                onClick={() => setShowLicensing(false)}
                className={clsx(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  !showLicensing
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                One-Time Build
              </button>
              <button
                onClick={() => setShowLicensing(true)}
                className={clsx(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  showLicensing
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Monthly Licensing
              </button>
            </div>
            <p className="text-sm text-gray-500 max-w-md text-center">
              {showLicensing
                ? 'Includes hosting, maintenance, updates, and ongoing support. No large upfront cost.'
                : 'Own your code outright. Pay once, it\'s yours forever. Includes 90-day support.'}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  'relative rounded-2xl border p-8 flex flex-col',
                  tier.popular
                    ? 'border-primary-500 bg-primary-50/50 shadow-xl scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-primary-200 hover:shadow-lg transition-all'
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary-600 text-white text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold text-xl text-gray-900">{tier.name}</h3>
                  <p className="text-primary-600 font-medium text-sm">{tier.tagline}</p>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {showLicensing ? tier.licensing : tier.oneTime}
                  </div>
                  <div className="text-sm text-gray-500">
                    {showLicensing ? 'per month' : 'one-time investment'}
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{tier.description}</p>

                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-200 mb-6">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Ideal for:</span> {tier.idealFor}
                  </p>
                </div>

                <Link
                  to={tier.name === 'Enterprise' ? '/contact' : '/estimate'}
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">Built with love</span>
            </div>
            <h2 className="heading-3 text-gray-900 mb-4">
              What's Included in Every Project
            </h2>
            <p className="text-gray-600">
              No matter which tier you choose, you get the full YourTechAssist experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {includedInAll.map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <Check className="w-5 h-5 text-accent-500" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Custom */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-primary mb-4">The YourTechAssist Difference</span>
              <h2 className="heading-2 text-gray-900 mb-6">
                Why Custom Software Pays for Itself
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Replace 5-10 Subscriptions</h3>
                    <p className="text-gray-600">One platform that does exactly what you need. Stop paying for features you don't use.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Save 10-20 Hours Per Week</h3>
                    <p className="text-gray-600">Automate the manual work. Stop copying data between systems. Let the software work for you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Your Competitive Advantage</h3>
                    <p className="text-gray-600">Your competitors can't buy what you have. Custom software is your secret weapon.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-6 text-center">Typical ROI Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-gray-600">Month 1-2</span>
                  <span className="font-medium text-gray-900">Discovery & Development</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-gray-600">Month 3</span>
                  <span className="font-medium text-gray-900">Launch & Adoption</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <span className="text-gray-600">Month 4-6</span>
                  <span className="font-medium text-primary-600">Start Seeing ROI</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <span className="text-gray-600">Month 12+</span>
                  <span className="font-bold text-primary-600">2-5x Return on Investment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-gray-50">
        <div className="container-narrow">
          <h2 className="heading-3 text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
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

      {/* Final CTA */}
      <section className="section gradient-bg">
        <div className="container-narrow text-center">
          <h2 className="heading-3 text-gray-900 mb-4">
            Ready to Stop Settling?
          </h2>
          <p className="text-lead mb-8">
            Get software that finally works the way YOUR business works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/estimate" className="btn-primary btn-lg">
              Get Your Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="btn-secondary btn-lg">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
