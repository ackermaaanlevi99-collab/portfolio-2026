import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ProjectGrid from '@/components/sections/ProjectGrid';
import { getPublishedProjects } from '@/lib/projects';
import site from '@/content/site.json';

export default function Portfolio() {
  const projects = getPublishedProjects();

  return (
    <section id="portfolio" className="portfolio-section section-space section-rule" aria-labelledby="portfolio-title">
      <div className="page-container">
        <header className="section-intro">
          <div>
            <p className="eyebrow">{site.portfolio.eyebrow}</p>
            <h2 id="portfolio-title">{site.portfolio.title}</h2>
          </div>
          <div>
            <p className="section-intro__aside">{site.portfolio.description}</p>
            <p className="pixel-label" style={{ marginTop: '1.2rem', color: 'var(--text-3)' }}>
              {String(projects.length).padStart(2, '0')} PIEZAS / SELECCIÓN ACTUAL
            </p>
          </div>
        </header>
        <ProjectGrid projects={projects} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <Link className="text-link" href="/proyectos">Explorar el archivo completo <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
