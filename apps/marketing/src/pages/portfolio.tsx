import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, BarChart3, Users, Clock, TrendingUp } from 'lucide-react';

const caseStudies = [
  {
    id: 'inventory-intelligence',
    title: 'Inventory Intelligence Platform',
    client: 'Everstory Partners',
    industry: 'Fulfillment & Logistics',
    description: 'A real-time inventory management dashboard with AI-powered stock predictions and automated reorder alerts.',
    challenge: 'Manual inventory tracking was causing stockouts and excess ordering, costing the business thousands monthly.',
    solution: 'Built a comprehensive dashboard with real-time stock monitoring, predictive analytics, and automated alert system.',
    results: [
      { label: 'Reduction in stockouts', value: '40%', icon: TrendingUp },
      { label: 'Hours saved weekly', value: '15+', icon: Clock },
      { label: 'Active users', value: '25', icon: Users },
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    image: null,
    demoUrl: 'https://demo.yourtechassist.us',
    featured: true,
  },
  {
    id: 'client-portal',
    title: 'Self-Service Client Portal',
    client: 'Brightline Services',
    industry: 'Professional Services',
    description: 'A customer-facing portal for order management, document sharing, and real-time project tracking.',
    challenge: 'Clients were constantly calling for status updates, consuming valuable support time.',
    solution: 'Developed a self-service portal where clients can track orders, upload documents, and communicate with their account managers.',
    results: [
      { label: 'Support calls reduced', value: '60%', icon: TrendingUp },
      { label: 'Client satisfaction', value: '4.8/5', icon: Users },
      { label: 'Time to resolution', value: '-50%', icon: Clock },
    ],
    technologies: ['React', 'Express', 'PostgreSQL', 'Stripe', 'AWS'],
    image: null,
    demoUrl: null,
    featured: false,
  },
  {
    id: 'analytics-dashboard',
    title: 'Executive Analytics Dashboard',
    client: 'NovaTech Solutions',
    industry: 'SaaS / Technology',
    description: 'Beautiful data visualization platform for executive decision-making with real-time KPI tracking.',
    challenge: 'Leadership was making decisions based on outdated spreadsheets and inconsistent data sources.',
    solution: 'Created a unified analytics dashboard pulling from multiple systems with real-time updates and automated reporting.',
    results: [
      { label: 'Data accuracy', value: '99%', icon: BarChart3 },
      { label: 'Report generation', value: 'Instant', icon: Clock },
      { label: 'Data sources unified', value: '12', icon: TrendingUp },
    ],
    technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'Redis'],
    image: null,
    demoUrl: null,
    featured: false,
  },
];

export default function PortfolioPage() {
  const featuredProject = caseStudies.find((c) => c.featured);
  const otherProjects = caseStudies.filter((c) => !c.featured);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section gradient-bg">
        <div className="container-wide text-center">
          <h1 className="heading-1 text-gray-900 mb-4">Our Work</h1>
          <p className="text-lead max-w-2xl mx-auto">
            Real projects. Real results. See how we've helped businesses like yours achieve their goals.
          </p>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="section bg-white">
          <div className="container-wide">
            <span className="badge-primary mb-4">Featured Project</span>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {featuredProject.industry}
                </span>
                <h2 className="heading-2 text-gray-900 mt-2 mb-4">
                  {featuredProject.title}
                </h2>
                <p className="text-lead mb-6">{featuredProject.description}</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">The Challenge</h4>
                    <p className="text-gray-600">{featuredProject.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Our Solution</h4>
                    <p className="text-gray-600">{featuredProject.solution}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredProject.technologies.map((tech) => (
                    <span key={tech} className="badge-gray">{tech}</span>
                  ))}
                </div>

                {featuredProject.demoUrl && (
                  <a
                    href={featuredProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    View Live Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div>
                {/* Results */}
                <div className="card-elevated p-8">
                  <h3 className="font-semibold text-gray-900 mb-6">Results</h3>
                  <div className="space-y-6">
                    {featuredProject.results.map((result) => (
                      <div key={result.label} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                          <result.icon className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{result.value}</div>
                          <div className="text-sm text-gray-500">{result.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Projects */}
      <section className="section bg-gray-50">
        <div className="container-wide">
          <h2 className="heading-3 text-gray-900 mb-8">More Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {project.industry}
                </span>
                <h3 className="heading-4 text-gray-900 mt-1 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {project.results.map((result) => (
                    <div key={result.label} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-gray-900">{result.value}</div>
                      <div className="text-xs text-gray-500">{result.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section gradient-bg">
        <div className="container-narrow text-center">
          <h2 className="heading-3 text-gray-900 mb-4">
            Want Results Like These?
          </h2>
          <p className="text-lead mb-8">
            Let's discuss how we can help transform your business with custom software.
          </p>
          <Link to="/contact" className="btn-primary btn-lg">
            Start Your Project
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
