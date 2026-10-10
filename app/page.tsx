import Hero from '@/components/sections/Hero';
import Portfolio from '@/components/sections/Portfolio';
import Services from '@/components/sections/Services';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollReveal><Portfolio /></ScrollReveal>
      <ScrollReveal delay={60}><Services /></ScrollReveal>
      <ScrollReveal delay={100}><About /></ScrollReveal>
      <ScrollReveal delay={140}><Contact /></ScrollReveal>
    </>
  );
}
