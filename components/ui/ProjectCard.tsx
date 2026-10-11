'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getCategoryLabel } from '@/lib/categories';
import type { ProjectItem } from '@/types/content';

interface ProjectCardProps { project: ProjectItem; index?: number; priority?: boolean }

export default function ProjectCard({ project, index = 0, priority = false }: ProjectCardProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const aspect = project.grid === 'portrait' ? '0.82 / 1' : project.grid === 'square' ? '1.12 / 1' : '1.55 / 1';
  const primaryCategory = project.categories[0];
  const imageSrcSet = project.coverSources?.map(({ src, width }) => `${src} ${width}w`).join(', ');
  const imageSizes = project.coverFit === 'contain'
    ? '(max-width: 760px) 18vw, (max-width: 1100px) 14vw, 8vw'
    : project.grid === 'wide'
      ? '(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 55vw'
      : '(max-width: 380px) 100vw, (max-width: 1100px) 50vw, 39vw';

  useEffect(() => {
    const element = articleRef.current;
    document.documentElement.classList.add('has-js');
    if (!element || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={articleRef}
      className={`project-card project-card--${project.grid ?? 'wide'} reveal ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: visible ? `${Math.min(index * 35, 300)}ms` : '0ms' }}
    >
      <Link href={`/proyectos/${project.slug}`} className="project-card__link" aria-label={`Ver proyecto: ${project.title}`}>
        <figure className="project-card__media" style={{ aspectRatio: aspect }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- manual srcSet keeps the verified originals and uses prebuilt WebP sizes; the Next optimizer is intentionally disabled to avoid black-frame regressions. */}
          <img
            src={project.cover}
            srcSet={imageSrcSet}
            sizes={imageSizes}
            alt={project.coverAlt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className={`project-card__image ${project.coverFit === 'contain' ? 'project-card__image--contain' : ''}`}
          />
          <span className="project-card__serial" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="project-card__arrow" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.6} /></span>
        </figure>
        <div className="project-card__details">
          <div>
            <p className="project-card__category">{primaryCategory ? getCategoryLabel(primaryCategory) : 'Proyecto'}</p>
            <h3 className="project-card__title">{project.title}</h3>
          </div>
          {project.year && <span className="project-card__year">{project.year}</span>}
        </div>
      </Link>
    </article>
  );
}
