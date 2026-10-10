import type { Metadata } from 'next';
import Services from '@/components/sections/Services';
import site from '@/content/site.json';

export const metadata: Metadata = {
  title: 'Servicios de diseño gráfico',
  description: site.seo.description,
  alternates: { canonical: '/servicios' },
};

export default function ServicesPage() {
  return <Services headingLevel="h1" />;
}
