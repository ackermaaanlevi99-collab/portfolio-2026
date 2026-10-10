import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import CTA from '@/components/ui/CTA';
import { getPublishedProjects } from '@/lib/projects';
import site from '@/content/site.json';

export default function Hero() {
  const featured = getPublishedProjects().find((project) => project.slug === 'portfolio-2026');
  if (!featured) return null;

  return (
    <section id="inicio" className="hero page-container" aria-labelledby="home-title">
      <div className="hero__intro">
        <div className="hero__identity">
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1 id="home-title" className="hero__headline">
            EMMANUEL<br /><span className="hero__headline-accent">ARANGUIBEL</span><br />GONZÁLEZ.
          </h1>
          <div className="hero__meta">
            <span>Diseñador gráfico</span><span>Caracas, Venezuela</span><span>{site.experienceYears} años</span>
          </div>
        </div>
        <div className="hero__copy">
          <p className="hero__summary">Diseño que deja marca. {site.hero.support}</p>
          <div className="cta-row">
            <CTA href="#portfolio" label={site.hero.primaryLabel} icon={false} />
            <CTA href="#contacto" label={site.hero.secondaryLabel} variant="secondary" />
          </div>
        </div>
      </div>

      <Link href={`/proyectos/${featured.slug}`} className="hero__image-link">
        <div className="hero__art">
          <Image
            src={featured.cover}
            alt={featured.coverAlt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 92vw"
            style={{ objectFit: featured.coverFit === 'contain' ? 'contain' : 'cover' }}
          />
          <div className="hero__image-caption">
            <span>Archivo 2026 / pieza destacada</span>
            <span>Explorar proyecto <ArrowUpRight size={14} aria-hidden="true" /></span>
          </div>
        </div>
      </Link>
      <div className="hero__index">
        <strong>Aranguibel Studio</strong>
        <span>{site.hero.note}</span>
        <a href="#portfolio" className="text-link"><ArrowDown size={14} aria-hidden="true" /> {site.hero.scrollLabel}</a>
      </div>
    </section>
  );
}
