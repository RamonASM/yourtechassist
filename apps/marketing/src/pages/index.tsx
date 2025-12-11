import Hero from '@/components/sections/Hero';
import ServicesGrid from '@/components/sections/ServicesGrid';
import ProcessSteps from '@/components/sections/ProcessSteps';
import PricingPreview from '@/components/sections/PricingPreview';
import Testimonials from '@/components/sections/Testimonials';
import CTASection from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <ProcessSteps />
      <PricingPreview />
      <Testimonials />
      <CTASection />
    </>
  );
}
