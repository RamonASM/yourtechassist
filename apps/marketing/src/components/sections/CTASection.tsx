import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section gradient-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative container-narrow text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-2 text-gray-900 mb-4">
            Ready to Build Something Great?
          </h2>
          <p className="text-lead max-w-2xl mx-auto mb-8">
            Get a personalized estimate for your project. Answer a few questions and we'll show you what's possible.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/estimate" className="btn-primary btn-lg">
              Get Your Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="btn-secondary btn-lg">
              <MessageSquare className="w-5 h-5" />
              Send a Message
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">What to expect:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Personalized estimate in minutes
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Custom proposal within 48 hours
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                No obligation
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
