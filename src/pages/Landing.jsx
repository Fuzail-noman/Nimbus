import Hero from '../components/landing/Hero';
import LogoCloud from '../components/landing/LogoCloud';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Showcase from '../components/landing/Showcase';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';

export default function Landing() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <Stats />
      <Features />
      <HowItWorks />
      <Showcase />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
