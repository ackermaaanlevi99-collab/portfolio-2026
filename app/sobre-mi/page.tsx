import type { Metadata } from 'next';
import About from '@/components/sections/About';
import site from '@/content/site.json';

export const metadata: Metadata = {
  title: 'Sobre Emmanuel Aranguibel González',
  description: site.about.text,
  alternates: { canonical: '/sobre-mi' },
};

export default function AboutPage() {
  return <About headingLevel="h1" />;
}
