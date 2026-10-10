import type { Metadata } from 'next';
import ProjectGrid from '@/components/sections/ProjectGrid';
import { getPublishedProjects } from '@/lib/projects';
import siteConfig from '@/config/site';
import site from '@/content/site.json';

export const metadata: Metadata = {
  title: 'Archivo de proyectos',
  description: 'Explora proyectos publicados de identidad de marca, diseño textil, publicidad, ilustración y visualización 3D de Emmanuel Aranguibel González.',
  alternates: { canonical: `${siteConfig.url}/proyectos` },
  openGraph: { title: 'Archivo de proyectos | Aranguibel Studio', description: site.portfolio.description, url: `${siteConfig.url}/proyectos`, type: 'website' },
};

export default function ProjectsPage() {
  const projects = getPublishedProjects();
  return (
    <section className="project-index section-space page-container" aria-labelledby="archive-title">
      <header className="project-index__heading">
        <p className="eyebrow">Archivo / Caracas, Venezuela</p>
        <h1 id="archive-title">Proyectos<br />publicados.</h1>
        <p>{site.portfolio.description} {projects.length} proyectos seleccionados, vinculados con sus fuentes y fichas de origen.</p>
      </header>
      <ProjectGrid projects={projects} />
    </section>
  );
}
