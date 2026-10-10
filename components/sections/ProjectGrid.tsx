'use client';

import { useMemo, useState } from 'react';
import ProjectCard from '@/components/ui/ProjectCard';
import { CATEGORY_LABELS } from '@/lib/categories';
import type { ProjectItem } from '@/types/content';

export default function ProjectGrid({ projects }: { projects: ProjectItem[] }) {
  const [active, setActive] = useState('all');
  const categories = useMemo(() => {
    const priority = ['branding', 'textil', 'publicidad', 'ilustracion', '3d', 'exploracion'];
    return [...new Set(projects.flatMap((project) => project.categories))]
      .sort((a, b) => {
        const aIndex = priority.indexOf(a);
        const bIndex = priority.indexOf(b);
        return (aIndex < 0 ? priority.length : aIndex) - (bIndex < 0 ? priority.length : bIndex);
      });
  }, [projects]);
  const visible = active === 'all' ? projects : projects.filter((project) => project.categories.includes(active));

  return (
    <>
      <div className="project-filters" role="group" aria-label="Filtrar proyectos por disciplina">
        <button type="button" className="project-filter" aria-pressed={active === 'all'} onClick={() => setActive('all')}>
          Todos <span>{String(projects.length).padStart(2, '0')}</span>
        </button>
        {categories.map((category) => {
          const count = projects.filter((project) => project.categories.includes(category)).length;
          return (
            <button key={category} type="button" className="project-filter" aria-pressed={active === category} onClick={() => setActive(category)}>
              {CATEGORY_LABELS[category] ?? category} <span>{String(count).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`${visible.length} ${visible.length === 1 ? 'proyecto' : 'proyectos'}`}
      </p>
      <div className="project-grid" aria-live="off">
        {visible.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
      </div>
    </>
  );
}
