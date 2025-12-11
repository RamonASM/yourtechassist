import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Heart, Zap, Shield } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Results-Focused',
    description: 'We measure success by the impact we create for your business, not just deliverables.',
  },
  {
    icon: Heart,
    title: 'Partnership Mindset',
    description: 'We\'re not just vendors - we\'re invested in your long-term success.',
  },
  {
    icon: Zap,
    title: 'Technical Excellence',
    description: 'We build software that\'s fast, secure, scalable, and maintainable.',
  },
  {
    icon: Shield,
    title: 'Transparent Communication',
    description: 'No surprises. Clear pricing, realistic timelines, and honest feedback.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section gradient-bg">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">
              We Listen. We Code. We Deliver.
            </h1>
            <p className="text-lead">
              YourTechAssist is a custom software development agency built on a simple belief: your software should fit your business, not the other way around.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="prose prose-lg max-w-none">
            <h2 className="heading-3 text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              We've seen it too many times: businesses struggling with off-the-shelf software that doesn't quite fit, or expensive enterprise solutions that are overkill for their needs.
            </p>
            <p className="text-gray-600 mb-4">
              That's why we started YourTechAssist. We believe every growing business deserves access to custom software that's built specifically for their unique challenges and workflows.
            </p>
            <p className="text-gray-600 mb-4">
              We work with businesses generating $250k+ in annual revenue - companies that are past the startup phase but don't yet have the resources for an in-house development team. We become your technical partner, helping you build the tools you need to scale.
            </p>
            <p className="text-gray-600">
              Our approach is simple: we listen first, then we build. No assumptions, no one-size-fits-all solutions. Just software that actually works for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-gray-50">
        <div className="container-wide">
          <h2 className="heading-3 text-gray-900 text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section bg-white">
        <div className="container-narrow">
          <h2 className="heading-3 text-gray-900 text-center mb-12">Why Work With Us?</h2>
          <div className="space-y-6">
            {[
              {
                title: 'We Speak Business, Not Just Tech',
                description: 'We understand that software is a means to an end. We focus on your business goals first, then determine the best technical approach.',
              },
              {
                title: 'Transparent, Predictable Pricing',
                description: 'No surprise bills. Whether you choose a one-time build or monthly licensing, you\'ll always know exactly what you\'re paying for.',
              },
              {
                title: 'Built for the Long Term',
                description: 'We write clean, documented, maintainable code. Your software should be an asset that grows with your business, not a liability.',
              },
              {
                title: 'Ongoing Partnership Available',
                description: 'Don\'t want to worry about maintenance? Our licensing model includes ongoing support, updates, and improvements.',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section gradient-bg">
        <div className="container-narrow text-center">
          <h2 className="heading-3 text-gray-900 mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-lead mb-8">
            Ready to see what custom software can do for your business? Let's talk.
          </p>
          <Link to="/contact" className="btn-primary btn-lg">
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
