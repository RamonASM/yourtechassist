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
    demoUrl: 'https://admin.yourtechassist.us',
    featured: true,
  },
  {
    id: 'client-portal',
    title: 'Self-Service Client Portal',
    client: 'YourTechAssist',
    industry: 'Professional Services',
    description: 'A customer-facing portal for project management, real-time progress tracking, and seamless communication.',
    challenge: 'Clients needed visibility into project status and a central place to manage their engagements.',
    solution: 'Built a self-service portal where clients can track project progress, view milestones, and communicate directly with their team.',
    results: [
      { label: 'Client visibility', value: '100%', icon: TrendingUp },
      { label: 'Client satisfaction', value: '4.9/5', icon: Users },
      { label: 'Response time', value: '<24h', icon: Clock },
    ],
    technologies: ['React', 'Express', 'PostgreSQL', 'Stripe', 'TailwindCSS'],
    image: null,
    demoUrl: 'https://portal.yourtechassist.us',
    featured: false,
  },
  {
    id: 'tozi-secret-santa',
    title: 'Secret Santa Gift Exchange',
    client: 'Tozi',
    industry: 'Consumer / Social',
    description: 'A fun, easy-to-use platform for organizing Secret Santa gift exchanges with friends, family, or coworkers.',
    challenge: 'Organizing gift exchanges manually is tedious - tracking participants, setting budgets, and ensuring fair matching.',
    solution: 'Created an intuitive platform that handles participant management, random matching, wishlists, and budget tracking all in one place.',
    results: [
      { label: 'Groups created', value: '500+', icon: Users },
      { label: 'Setup time', value: '<2 min', icon: Clock },
      { label: 'User rating', value: '4.8/5', icon: TrendingUp },
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    image: null,
    demoUrl: 'https://tozi.us',
    featured: false,
  },
  {
    id: 'storywork-media',
    title: 'Real Estate Media Showcase',
    client: 'Aerial Shots Media',
    industry: 'Real Estate / Media',
    description: 'A beautiful portfolio and content management platform for showcasing real estate photography and videography work.',
    challenge: 'Needed a professional way to display media work and attract high-end real estate clients.',
    solution: 'Built a visually stunning showcase with integrated CMS for easy content updates, property galleries, and service information.',
    results: [
      { label: 'Lead increase', value: '45%', icon: TrendingUp },
      { label: 'Avg. session time', value: '4 min', icon: Clock },
      { label: 'Properties featured', value: '200+', icon: BarChart3 },
    ],
    technologies: ['React', 'Sanity CMS', 'TailwindCSS', 'Framer Motion'],
    image: null,
    demoUrl: 'https://storywork.aerialshots.media',
    featured: false,
  },
  {
    id: 'aerial-hub',
    title: 'Media Operations Hub',
    client: 'Aerial Shots Media',
    industry: 'Real Estate / Media',
    description: 'A comprehensive operations platform for managing real estate media shoots, scheduling, and client communications.',
    challenge: 'Managing multiple shoots, photographers, and client requests was becoming overwhelming with manual processes.',
    solution: 'Developed a centralized hub for booking management, photographer scheduling, asset delivery, and client communications.',
    results: [
      { label: 'Booking efficiency', value: '+60%', icon: TrendingUp },
      { label: 'Response time', value: '<1 hr', icon: Clock },
      { label: 'Monthly shoots', value: '150+', icon: Users },
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    image: null,
    demoUrl: 'https://hub.aerialshots.media',
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

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Demo
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
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
