import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  Cloud,
  Layout,
  BarChart3,
  Plug,
  Palette,
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    icon: Code,
    title: 'Custom Software',
    description: 'Tailored applications built specifically for your unique business processes and workflows.',
    href: '/services/custom-software',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Cloud,
    title: 'SaaS Development',
    description: 'Scalable cloud-based products with subscription billing, user management, and analytics.',
    href: '/services/saas',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Layout,
    title: 'Web Portals',
    description: 'Client-facing portals with secure access, self-service features, and real-time data.',
    href: '/services/web-portals',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: BarChart3,
    title: 'Dashboards',
    description: 'Beautiful data visualization and analytics platforms that drive informed decisions.',
    href: '/services/dashboards',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Plug,
    title: 'Integrations',
    description: 'Connect your existing tools and automate workflows between systems seamlessly.',
    href: '/services/integrations',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Palette,
    title: 'White-Label Solutions',
    description: 'Rebrandable software products you can sell to your own clients under your brand.',
    href: '/services/white-label',
    color: 'from-pink-500 to-pink-600',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesGrid() {
  return (
    <section className="section bg-white">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 text-gray-900 mb-4">
            Solutions Tailored to Your Needs
          </h2>
          <p className="text-lead">
            From simple tools to complex enterprise platforms, we build software that solves real business problems.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={item}>
              <Link
                to={service.href}
                className="card group block p-6 hover:border-primary-200 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="heading-4 text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <span className="inline-flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
