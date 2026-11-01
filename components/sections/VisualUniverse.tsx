import GatherExperiment from '@/components/ui/GatherExperiment';
import { getPublishedProjects } from '@/lib/projects';

// Universo visual: imágenes reales de proyectos convertidas en partículas.
// Cada experimento se activa con un clic y conserva la imagen original como alternativa.
export default function VisualUniverse() {
  const slugs = ['ana-valdez', 'kalhua'];
  const projects = getPublishedProjects().filter((project) => slugs.includes(project.slug));
  if (projects.length === 0) return null;

  return (
    <section id="universo-visual" className="visual-universe section-space" aria-labelledby="visual-universe-title">
      <div className="page-container">
        <header className="section-intro">
          <div>
            <p className="eyebrow">Universo visual</p>
            <h2 id="visual-universe-title">Imágenes de proyectos, convertidas en partículas.</h2>
          </div>
          <p className="section-intro__aside">Dispersa y reconstruye piezas reales. El efecto se activa con un clic; sin WebGL o con movimiento reducido se muestra la imagen original.</p>
        </header>
        <div className="visual-universe__grid">
          {projects.map((project) => (
            <article key={project.slug} className="visual-universe__item">
              <GatherExperiment src={project.cover} alt={project.coverAlt} title={project.title} />
              <h3><a href={`/proyectos/${project.slug}`}>{project.title}</a></h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
