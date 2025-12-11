import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  Cloud,
  Layout,
  BarChart3,
  Plug,
  Palette,
  ArrowRight,
  Check,
} from 'lucide-react';

const services = [
  {
    slug: 'custom-software',
    icon: Code,
    title: 'Custom Software Development',
    tagline: 'Tailored solutions for unique business challenges',
    description: 'Every business is different. We build custom applications that fit your specific workflows, processes, and goals - not the other way around.',
    features: [
      'Business process automation',
      'Internal tools & dashboards',
      'Customer-facing applications',
      'Legacy system modernization',
      'API development',
      'Database design & optimization',
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    slug: 'saas',
    icon: Cloud,
    title: 'SaaS Development',
    tagline: 'Build and scale your software product',
    description: 'Turn your idea into a subscription-based product. We handle everything from architecture to billing to help you build a sustainable software business.',
    features: [
      'Multi-tenant architecture',
      'Subscription billing (Stripe)',
      'User authentication & roles',
      'Usage analytics',
      'API access for customers',
      'White-label options',
    ],
    technologies: ['Next.js', 'Prisma', 'Stripe', 'Vercel', 'Redis'],
    color: 'from-purple-500 to-purple-600',
  },
  {
    slug: 'web-portals',
    icon: Layout,
    title: 'Web Portals',
    tagline: 'Self-service platforms for your clients',
    description: 'Give your customers a beautiful, secure place to interact with your business. From order management to document sharing, we build portals that reduce support burden.',
    features: [
      'Client/customer portals',
      'Self-service functionality',
      'Document management',
      'Real-time notifications',
      'Mobile-responsive design',
      'SSO integration',
    ],
    technologies: ['React', 'Express', 'PostgreSQL', 'Socket.io', 'AWS S3'],
    color: 'from-teal-500 to-teal-600',
  },
  {
    slug: 'dashboards',
    icon: BarChart3,
    title: 'Dashboards & Analytics',
    tagline: 'Turn data into decisions',
    description: 'Beautiful data visualization that helps you understand your business at a glance. From executive dashboards to operational metrics, we make data accessible.',
    features: [
      'Real-time data visualization',
      'Custom charts & graphs',
      'KPI tracking',
      'Automated reporting',
      'Data export options',
      'Role-based access',
    ],
    technologies: ['React', 'D3.js', 'Chart.js', 'PostgreSQL', 'TimescaleDB'],
    color: 'from-orange-500 to-orange-600',
  },
  {
    slug: 'integrations',
    icon: Plug,
    title: 'System Integrations',
    tagline: 'Connect your tools, automate your workflows',
    description: 'Stop copying data between systems. We build integrations that connect your existing tools and automate repetitive tasks.',
    features: [
      'ERP/CRM integrations',
      'Payment processor connections',
      'Shipping & logistics APIs',
      'Custom webhook handlers',
      'Data synchronization',
      'ETL pipelines',
    ],
    technologies: ['Node.js', 'REST APIs', 'GraphQL', 'Webhooks', 'AWS Lambda'],
    color: 'from-green-500 to-green-600',
  },
  {
    slug: 'white-label',
    icon: Palette,
    title: 'White-Label Solutions',
    tagline: 'Your brand, our technology',
    description: 'Rebrandable software products you can sell to your own clients. Perfect for agencies and resellers looking to expand their offerings.',
    features: [
      'Full rebranding capability',
      'Multi-tenant support',
      'Reseller admin panel',
      'Custom domain support',
      'API for your integrations',
      'Partner support included',
    ],
    technologies: ['React', 'Node.js', 'Multi-tenant DB', 'Custom theming'],
    color: 'from-pink-500 to-pink-600',
  },
];

export default function ServicesPage() {
  const { slug } = useParams();

  // If no slug, show services overview
  if (!slug) {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <section className="section gradient-bg">
          <div className="container-wide text-center">
            <h1 className="heading-1 text-gray-900 mb-4">
              Our Services
            </h1>
            <p className="text-lead max-w-2xl mx-auto">
              From simple landing pages to complex enterprise platforms, we have the expertise to bring your vision to life.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section bg-white">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className="card group block p-6 h-full hover:border-primary-200 transition-all"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="heading-4 text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.tagline}</p>
                    <span className="inline-flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Find the specific service
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-2 text-gray-900 mb-4">Service Not Found</h1>
          <Link to="/services" className="btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section gradient-bg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h1 className="heading-1 text-gray-900 mb-4">{service.title}</h1>
              <p className="text-lead mb-8">{service.description}</p>
              <Link to="/contact" className="btn-primary btn-lg">
                Discuss Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="card-elevated p-8">
              <h3 className="font-semibold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent-500 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="section-sm bg-white">
        <div className="container-narrow text-center">
          <h2 className="heading-4 text-gray-900 mb-6">Technologies We Use</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {service.technologies.map((tech) => (
              <span key={tech} className="badge-gray">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section gradient-bg">
        <div className="container-narrow text-center">
          <h2 className="heading-3 text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lead mb-8">
            Let's discuss how we can help you achieve your goals.
          </p>
          <Link to="/contact" className="btn-primary btn-lg">
            Schedule a Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
