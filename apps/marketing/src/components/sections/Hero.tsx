import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

const highlights = [
  'Custom-built for your business',
  'Transparent pricing',
  'Ongoing support included',
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden gradient-bg">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative container-wide py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Trusted by 50+ Growing Businesses
            </div>

            {/* Headline */}
            <h1 className="heading-1 text-gray-900 mb-6">
              Custom Software That{' '}
              <span className="gradient-text">Grows With Your Business</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lead mb-8 max-w-xl">
              We listen to your unique challenges and build solutions that drive real results. From MVPs to enterprise platforms, we've got you covered.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 mb-8">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <CheckCircle className="w-5 h-5 text-accent-500" />
                  {highlight}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/estimate" className="btn-primary btn-lg">
                Get Your Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/portfolio" className="btn-secondary btn-lg">
                <Play className="w-5 h-5" />
                See Our Work
              </Link>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main dashboard mockup */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-white rounded-md text-xs text-gray-500">
                      portal.yourtechassist.us
                    </div>
                  </div>
                </div>
                {/* Dashboard content */}
                <div className="p-4 space-y-3 bg-gray-50">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">YT</span>
                      </div>
                      <span className="font-semibold text-sm text-gray-900">Client Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                  {/* Stats cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500">Active Projects</div>
                      <div className="text-lg font-bold text-gray-900">3</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500">In Progress</div>
                      <div className="text-lg font-bold text-primary-600">2</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-500">Completed</div>
                      <div className="text-lg font-bold text-green-600">12</div>
                    </div>
                  </div>
                  {/* Project list */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <span className="text-xs font-medium text-gray-700">Current Projects</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-gray-700">Dashboard Redesign</span>
                        </div>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">75%</span>
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span className="text-xs text-gray-700">API Integration</span>
                        </div>
                        <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">40%</span>
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full" />
                          <span className="text-xs text-gray-700">Mobile App MVP</span>
                        </div>
                        <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Project Status</p>
                    <p className="font-semibold text-gray-900">On Track</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-primary-600">40%</div>
                  <div>
                    <p className="text-xs text-gray-500">Efficiency</p>
                    <p className="font-medium text-green-600 text-sm">+Increase</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
