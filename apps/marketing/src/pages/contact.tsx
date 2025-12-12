import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Calendar, Send, Check } from 'lucide-react';

const projectTypes = [
  'Custom Software',
  'SaaS Development',
  'Web Portal',
  'Dashboard',
  'Integration',
  'White-Label',
  'Other',
];

const budgetRanges = [
  'Under $10k',
  '$10k - $25k',
  '$25k - $50k',
  '$50k - $100k',
  '$100k - $250k',
  '$250k+',
  'Not sure yet',
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="heading-2 text-gray-900 mb-4">Message Sent!</h1>
          <p className="text-lead max-w-md">
            Thanks for reaching out. We'll review your message and get back to you within 24 hours.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-sm gradient-bg">
        <div className="container-wide text-center">
          <h1 className="heading-1 text-gray-900 mb-4">Let's Talk</h1>
          <p className="text-lead max-w-2xl mx-auto">
            Ready to discuss your project? Fill out the form below or schedule a call directly.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="heading-4 text-gray-900 mb-6">Get in Touch</h2>

              <div className="space-y-6 mb-8">
                <a
                  href="mailto:hello@yourtechassist.us"
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email Us</div>
                    <div className="text-gray-600">hello@yourtechassist.us</div>
                  </div>
                </a>

                <a
                  href="tel:+1-555-123-4567"
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Call Us</div>
                    <div className="text-gray-600">(555) 123-4567</div>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-600">Remote-First / USA</div>
                  </div>
                </div>
              </div>

              {/* Schedule Call */}
              <div className="card p-6 bg-primary-50 border-primary-200">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold text-gray-900">Prefer to talk?</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Book a free 30-minute discovery call to discuss your project.
                </p>
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                >
                  Schedule a Call
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="heading-4 text-gray-900 mb-6">Tell Us About Your Project</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="label">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input"
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="projectType" className="label">Project Type *</label>
                      <select
                        id="projectType"
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="">Select a type...</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="budget" className="label">Budget Range</label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="">Select a range...</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timeline" className="label">Ideal Timeline</label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Need to launch by Q2 2025"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="label">Project Description *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="input"
                      placeholder="Tell us about your project, challenges, and goals..."
                    />
                  </div>

                  <button type="submit" className="btn-primary btn-lg">
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
