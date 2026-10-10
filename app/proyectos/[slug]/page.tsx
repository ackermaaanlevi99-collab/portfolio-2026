import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import Gallery from '@/components/ui/Gallery';
import Scene16Viewer from '@/components/sections/Scene16Viewer';
import CTA from '@/components/ui/CTA';
import { getProjectBySlug, getProjectPaths, getPublishedProjects, getServiceTitle } from '@/lib/projects';
import { getCategoryLabel } from '@/lib/categories';
import siteConfig from '@/config/site';

interface PageProps { params: Promise<{ slug: string }> }

export const dynamicParams = false;

export function generateStaticParams() { return getProjectPaths(); }

function formatPublicationDate(value: string): string {
  return new Intl.DateTimeFormat('es-VE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00.000Z`));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const canonicalPath = `/proyectos/${project.slug}`;
  const title = `${project.title} — Proyecto de diseño gráfico`;
  return {
    title,
    description: project.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${project.title} | Aranguibel Studio`,
      description: project.description,
      url: `${siteConfig.url}${canonicalPath}`,
      locale: 'es_VE',
      type: 'article',
      images: [{ url: project.cover, alt: project.coverAlt }],
    },
    twitter: { card: 'summary_large_image', title, description: project.description, images: [project.cover] },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const publishedProjects = getPublishedProjects();
  const currentIndex = publishedProjects.findIndex((candidate) => candidate.slug === project.slug);
  const previousProject = publishedProjects[(currentIndex - 1 + publishedProjects.length) % publishedProjects.length];
  const nextProject = publishedProjects[(currentIndex + 1) % publishedProjects.length];
  const related = publishedProjects.filter((candidate) => candidate.slug !== project.slug && candidate.categories.some((category) => project.categories.includes(category))).slice(0, 3);
  const sourceIsBehance = Boolean(project.externalUrl?.includes('behance.net'));

  return (
    <article className="project-detail page-container" aria-labelledby="project-title">
      <div className="project-detail__topline">
        <Link href="/proyectos"><ArrowLeft size={14} aria-hidden="true" /> Volver a los proyectos</Link>
        <span>{sourceIsBehance ? 'Fuente original / Behance' : 'Portafolio de Emmanuel Aranguibel'}</span>
      </div>

      <header className="project-detail__heading">
        <div>
          <p className="eyebrow">{project.categories.map(getCategoryLabel).join(' · ')}{project.year ? ` / ${project.year}` : ''}</p>
          <h1 id="project-title">{project.title}</h1>
        </div>
        <p className="project-detail__summary">{project.description}</p>
      </header>

      <figure className="project-detail__cover">
        <div className="project-detail__cover-media">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 94vw"
            className={project.coverFit === 'contain' ? 'project-contain' : ''}
          />
        </div>
      </figure>

      <dl className="project-detail__facts">
        <div className="project-detail__fact"><dt>Disciplina</dt><dd>{project.categories.map(getCategoryLabel).join(', ')}</dd></div>
        {project.year && <div className="project-detail__fact"><dt>Año documentado</dt><dd>{project.year}</dd></div>}
        {project.services.length > 0 && <div className="project-detail__fact"><dt>Áreas</dt><dd>{project.services.map(getServiceTitle).join(', ')}</dd></div>}
        {project.datePublished && <div className="project-detail__fact"><dt>Publicado en Behance</dt><dd>{formatPublicationDate(project.datePublished)}</dd></div>}
      </dl>

      <section className="project-detail__body" aria-labelledby="project-context-title">
        <h2 id="project-context-title">Sobre el proyecto</h2>
        <div>
          <p>{project.overview ?? project.description}</p>
          {project.tools.length > 0 && (
            <>
              <p className="eyebrow project-detail__tools-label">Herramientas acreditadas</p>
              <ul className="project-detail__tags" aria-label="Herramientas y técnicas">
                {project.tools.map((tool) => <li className="project-detail__tag" key={tool}>{tool}</li>)}
              </ul>
            </>
          )}
          {project.tags.length > 0 && (
            <ul className="project-detail__tags" aria-label="Etiquetas del proyecto">
              {project.tags.map((tag) => <li className="project-detail__tag" key={tag}>{tag}</li>)}
            </ul>
          )}
        </div>
      </section>

      {project.storyStages && project.storyStages.length > 0 && (
        <section className="project-process" aria-labelledby="project-process-title">
          <header className="project-process__heading">
            <p className="eyebrow">{project.storyEyebrow ?? 'Proceso documentado'}</p>
            <h2 id="project-process-title">{project.storyTitle ?? 'Del arte a la aplicación.'}</h2>
          </header>
          <ol className="project-process__grid">
            {project.storyStages.map((stage, index) => (
              <li className="project-process__stage" key={`${project.slug}-${stage.title}`}>
                {stage.image && (
                  <div className="project-process__media">
                    <Image src={stage.image.src} alt={stage.image.alt} fill sizes="(max-width: 760px) 25vw, 24vw" />
                  </div>
                )}
                <div className="project-process__copy">
                  <span className="project-process__index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {project.sceneSequence?.length === 16 && <Scene16Viewer project={project} />}

      {project.gallery.length > 0 && (
        <section className="project-gallery" aria-labelledby="gallery-title">
          <div className="project-gallery__heading"><h2 id="gallery-title">Detalles de la pieza</h2><span className="eyebrow">{String(project.gallery.length).padStart(2, '0')} IMÁGENES</span></div>
          <Gallery images={project.gallery} title={project.title} />
        </section>
      )}

      <div className="project-detail__source">
        <p className="project-detail__source-note">Material e información del proyecto</p>
        {project.externalUrl && (
          <a className="cta cta--secondary" href={project.externalUrl} target="_blank" rel="noopener noreferrer">
            {sourceIsBehance ? 'Abrir la publicación original en Behance' : 'Abrir la ficha original'} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        )}
      </div>

      <nav className="project-sequence" aria-label="Navegación entre proyectos">
        <Link className="project-sequence__item" href={`/proyectos/${previousProject.slug}`} rel="prev">
          <span><ArrowLeft size={14} aria-hidden="true" /> Proyecto anterior</span>
          <strong>{previousProject.title}</strong>
        </Link>
        <Link className="project-sequence__all" href="/proyectos">
          <span aria-hidden="true">{String(publishedProjects.length).padStart(2, '0')}</span>
          <span>Todos los proyectos</span>
        </Link>
        <Link className="project-sequence__item project-sequence__item--next" href={`/proyectos/${nextProject.slug}`} rel="next">
          <span>Proyecto siguiente <ArrowRight size={14} aria-hidden="true" /></span>
          <strong>{nextProject.title}</strong>
        </Link>
      </nav>

      <section className="section-space section-rule" aria-labelledby="next-work-title">
        <div className="section-intro"><div><p className="eyebrow">Siguiente lectura</p><h2 id="next-work-title">Más trabajo seleccionado.</h2></div><CTA href="/#contacto" label="Conversemos" /></div>
        {related.length > 0 && <div className="project-grid">{related.map((item) => (
          <article key={item.slug} className="project-card">
            <Link className="project-card__link" href={`/proyectos/${item.slug}`}>
              <figure className="project-card__media" style={{ aspectRatio: '1.45 / 1' }}>
                <Image src={item.cover} alt={item.coverAlt} fill sizes="(max-width: 760px) 100vw, 32vw" className={item.coverFit === 'contain' ? 'project-card__image--contain' : 'project-card__image'} />
              </figure>
              <div className="project-card__details"><div><p className="project-card__category">{item.categories.map(getCategoryLabel).join(' · ')}</p><h3 className="project-card__title">{item.title}</h3></div>{item.year && <span className="project-card__year">{item.year}</span>}</div>
            </Link>
          </article>
        ))}</div>}
      </section>
    </article>
  );
}
