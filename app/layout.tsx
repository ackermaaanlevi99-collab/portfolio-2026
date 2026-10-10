import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Silkscreen, Space_Grotesk } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Cursor from '@/components/layout/Cursor';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Transition from '@/components/layout/Transition';
import siteData from '@/content/site.json';
import siteConfig from '@/config/site';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
const pixel = Silkscreen({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-pixel', display: 'swap' });

const previewBuild = process.env.NODE_ENV !== 'production'
  || process.env.VERCEL_ENV === 'preview'
  || ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT ?? '');

export const viewport: Viewport = { themeColor: '#0A0A0A', colorScheme: 'dark' };

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteData.seo.title, template: '%s | Aranguibel Studio' },
  description: siteData.seo.description,
  authors: [{ name: siteData.person }],
  creator: siteData.person,
  keywords: ['diseño gráfico', 'branding', 'identidad visual', 'diseño publicitario', 'diseño textil', 'ilustración', 'visualización 3D', 'Caracas', 'Venezuela'],
  openGraph: {
    title: siteData.seo.title,
    description: siteData.seo.description,
    url: siteConfig.url,
    siteName: siteData.brand,
    locale: 'es_VE',
    type: 'website',
    images: [{ url: '/assets/projects/portfolio-2026/cover.webp', alt: 'Pieza gráfica verde de la colección de trabajo 2026 de Emmanuel Aranguibel González' }],
  },
  twitter: { card: 'summary_large_image', title: siteData.seo.title, description: siteData.seo.description, images: ['/assets/projects/portfolio-2026/cover.webp'] },
  alternates: { canonical: siteConfig.url },
  ...(previewBuild ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } } : {}),
  icons: { icon: '/images/logo.svg' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteData.person,
  jobTitle: siteData.role,
  url: siteConfig.url,
  email: siteData.contact.email,
  homeLocation: { '@type': 'Place', name: siteData.location },
  brand: { '@type': 'Brand', name: siteData.brand },
  sameAs: [siteData.social.behance, siteData.social.beacons],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable} ${pixel.variable}`}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        <SmoothScroll>
          <Cursor />
          <Navbar />
          <Transition><main id="main-content">{children}</main></Transition>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
