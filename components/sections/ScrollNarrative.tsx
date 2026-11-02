import GatherScrollStory from '@/components/ui/GatherScrollStory';
import { getProjectBySlug } from '@/lib/projects';

// Narrativa con desplazamiento en la portada. Usa una portada publicada y los mismos pasos técnicos
// que la página de proyecto: describe el efecto, no hace afirmaciones sobre clientes ni resultados.
export default function ScrollNarrative() {
  const project = getProjectBySlug('portfolio-2026');
  if (!project) return null;

  return (
    <section id="narrativa" className="section-space" aria-labelledby="scroll-narrative-title">
      <div className="page-container">
        <header className="section-intro">
          <div>
            <p className="eyebrow">Narrativa</p>
            <h2 id="scroll-narrative-title">Una imagen que se separa y vuelve a formarse.</h2>
          </div>
          <p className="section-intro__aside">Con el desplazamiento, la imagen se dispersa y se reconstruye. Sin WebGL o con movimiento reducido se muestra la imagen original con los mismos pasos.</p>
        </header>
        <GatherScrollStory
          src={project.cover}
          alt={project.coverAlt}
          steps={['Imagen original del proyecto', 'Los píxeles se separan en puntos', 'Los puntos vuelven a formar la imagen']}
        />
      </div>
    </section>
  );
}
