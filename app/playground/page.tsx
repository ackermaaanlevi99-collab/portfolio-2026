import type { Metadata } from 'next';
import Playground from '@/components/playground/Playground';
import { getPublishedProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Tres experimentos interactivos: forma, imagen y composición.',
  alternates: { canonical: '/playground' },
};

export default function PlaygroundPage() {
  const projects = getPublishedProjects().filter((project) => Boolean(project.cover));

  return (
    <section className="playground-page section-space page-container">
      <div className="playground-page__intro">
        <p className="eyebrow">Experimentos</p>
        <h1>Playground</h1>
        <p>
          Tres experimentos con código propio: una forma 3D de puntos, una imagen de proyecto convertida en partículas y un lienzo
          de composición que se exporta como SVG.
        </p>
      </div>
      <Playground projects={projects} />
    </section>
  );
}
