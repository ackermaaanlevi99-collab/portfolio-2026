import site from '@/content/site.json';

export default function About({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const Heading = headingLevel;
  return (
    <section id="sobre-mi" className="about-section section-space section-rule" aria-labelledby="about-title">
      <div className="page-container about-layout">
        <div className="about-stamp" aria-label="Firma AG de Aranguibel Studio">
          <p className="eyebrow">Perfil / 01</p>
          <span className="about-stamp__monogram" aria-hidden="true">AG.</span>
          <p className="about-stamp__note">Diseño independiente<br />Caracas, Venezuela</p>
        </div>

        <div className="about-copy">
          <p className="eyebrow">{site.person} / {site.location}</p>
          <Heading id="about-title" className="about-copy__title">Diseño gráfico<br />con intención.</Heading>
          <p className="about-copy__story">{site.about.text}</p>
          <div className="about-copy__years">
            <strong>{site.experienceYears}</strong>
            <span>Años de experiencia en diseño gráfico.</span>
          </div>

          <div>
            <p className="eyebrow">Herramientas de trabajo</p>
            <ul className="about-tools" aria-label="Herramientas de trabajo">
              {site.about.tools.map((tool) => <li className="about-tool" key={tool}>{tool}</li>)}
            </ul>
          </div>

          <div className="about-experience">
            <p className="eyebrow">Experiencia</p>
            <div className="experience-list">
              {site.experience.map((item) => (
                <article className="experience-entry" key={`${item.period}-${item.org}`}>
                  <span className="experience-entry__period">{item.period}</span>
                  <div><h3 className="experience-entry__role">{item.role}</h3><p className="experience-entry__org">{item.org}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
