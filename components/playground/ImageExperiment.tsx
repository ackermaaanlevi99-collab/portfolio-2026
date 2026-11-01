'use client';

import { useState } from 'react';
import GatherExperiment from '@/components/ui/GatherExperiment';
import type { ProjectItem } from '@/types/content';

// Experimento "Imagen": elige una imagen real de proyecto y conviértela en partículas.
// Reutiliza el mismo componente y la misma escena que la página de proyecto.
export default function ImageExperiment({ projects }: { projects: ProjectItem[] }) {
  const [slug, setSlug] = useState(projects[0]?.slug ?? '');

  if (projects.length === 0) {
    return <p className="playground__status">No hay imágenes de proyecto disponibles.</p>;
  }

  const project = projects.find((p) => p.slug === slug) ?? projects[0];

  return (
    <div className="playground-image">
      <label className="playground__select">
        <span>Imagen</span>
        <select value={project.slug} onChange={(event) => setSlug(event.target.value)}>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      <GatherExperiment key={project.slug} src={project.cover} alt={project.coverAlt} title={project.title} />
    </div>
  );
}
