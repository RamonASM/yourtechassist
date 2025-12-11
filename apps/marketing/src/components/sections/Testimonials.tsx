import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { clsx } from 'clsx';

const testimonials = [
  {
    quote: "YourTechAssist transformed our manual inventory process into an intelligent dashboard that saves us hours every week. The team truly understood our challenges and delivered beyond expectations.",
    author: "Sarah Chen",
    role: "Operations Director",
    company: "Everstory Partners",
    avatar: null, // Would be an image URL
    rating: 5,
  },
  {
    quote: "We needed a client portal that our customers would actually use. The team delivered a beautiful, intuitive solution that our clients love. Support has been outstanding too.",
    author: "Michael Rodriguez",
    role: "CEO",
    company: "Brightline Services",
    avatar: null,
    rating: 5,
  },
  {
    quote: "The licensing model works perfectly for us. We get continuous improvements and support, and the cost is predictable. It's like having an in-house dev team without the overhead.",
    author: "Jessica Park",
    role: "CTO",
    company: "NovaTech Solutions",
    avatar: null,
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section bg-gray-900 text-white">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">
            Trusted by Growing Businesses
          </h2>
          <p className="text-gray-400 text-lg">
            Don't just take our word for it. Here's what our clients have to say.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Quote icon */}
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-8">
                <Quote className="w-6 h-6 text-primary-400" />
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                "{testimonials[current].quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                  {testimonials[current].author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{testimonials[current].author}</div>
                  <div className="text-gray-400 text-sm">
                    {testimonials[current].role}, {testimonials[current].company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-all',
                    current === index ? 'w-8 bg-primary-500' : 'bg-white/30 hover:bg-white/50'
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
