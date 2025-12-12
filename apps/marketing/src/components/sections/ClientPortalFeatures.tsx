import { motion } from 'framer-motion';
import { BarChart3, MessageSquare, FileCheck, Bell, Eye, Clock } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Real-Time Visibility',
    description: 'See exactly where your project stands at any moment with live progress tracking.',
  },
  {
    icon: BarChart3,
    title: 'Milestone Tracking',
    description: 'Clear milestones and deliverables so you always know what\'s coming next.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Communication',
    description: 'Message your team directly through the portal. No more lost emails.',
  },
  {
    icon: FileCheck,
    title: 'Document Hub',
    description: 'All project documents, designs, and assets in one organized place.',
  },
  {
    icon: Bell,
    title: 'Instant Updates',
    description: 'Get notified when milestones are completed or when we need your input.',
  },
  {
    icon: Clock,
    title: 'Timeline View',
    description: 'Visual timeline of your project from kickoff to launch.',
  },
];

export default function ClientPortalFeatures() {
  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="badge-primary mb-4">Client Dashboard</span>
            <h2 className="heading-2 text-gray-900 mb-4">
              Stay in the Loop, Every Step of the Way
            </h2>
            <p className="text-lead mb-8">
              No more wondering about project status. Our client portal gives you 24/7 access to your project's progress, documents, and direct communication with your development team.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-gray-700 rounded-md text-xs text-gray-300">
                    portal.yourtechassist.us
                  </div>
                </div>
              </div>
              {/* Dashboard mockup */}
              <div className="p-6 bg-gray-50">
                {/* Project header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">E-Commerce Platform</h3>
                    <p className="text-sm text-gray-500">Started Oct 15, 2024</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                    On Track
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-semibold text-gray-900">68%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <FileCheck className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Design Approved</span>
                    </div>
                    <span className="text-xs text-green-600">Completed</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-primary-200 bg-primary-50">
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Backend Development</span>
                    </div>
                    <span className="text-xs text-primary-600">In Progress</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-600">3</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-500">Testing & QA</span>
                    </div>
                    <span className="text-xs text-gray-400">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
