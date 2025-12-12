import { motion } from 'framer-motion';
import { MessageSquare, FileText, LayoutDashboard, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Discovery Call',
    description: 'Tell us your vision. We\'ll discuss your challenges, goals, and what success looks like for your business.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Custom Proposal',
    description: 'Get a tailored solution with clear pricing, timeline, and deliverables. No surprises, just transparency.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    number: '03',
    icon: LayoutDashboard,
    title: 'Track Progress',
    description: 'Access your client dashboard to see real-time progress, milestones, and communicate directly with your team.',
    color: 'from-green-500 to-green-600',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Build & Launch',
    description: 'Watch your idea come to life with weekly demos, iterative feedback, and a smooth launch experience.',
    color: 'from-purple-500 to-purple-600',
  },
];

export default function ProcessSteps() {
  return (
    <section className="section bg-gray-50">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-primary mb-4">How We Work</span>
          <h2 className="heading-2 text-gray-900 mb-4">
            Simple Process, Exceptional Results
          </h2>
          <p className="text-lead">
            We've refined our process over hundreds of projects to deliver software that actually works for your business.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 via-green-200 to-purple-200" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="card-elevated p-8 text-center relative">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="heading-4 text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
