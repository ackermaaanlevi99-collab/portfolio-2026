import Link from 'next/link';
import { getActiveServices, getProjectsForService } from '@/lib/projects';
import site from '@/content/site.json';

export default function Services({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const Heading = headingLevel;
  const services = getActiveServices();

  return (
    <section id="servicios" className="services-section section-space" aria-labelledby="services-title">
      <div className="page-container">
        <header className="section-intro">
          <div>
            <p className="eyebrow">Servicios con trabajo publicado</p>
            <Heading id="services-title">Del concepto a la identidad visual.</Heading>
          </div>
          <p className="section-intro__aside">{site.about.text}</p>
        </header>
        <div className="services-grid">
          {services.map((service) => {
            const examples = getProjectsForService(service.id);
            return (
              <article className="service-row" key={service.id}>
                <span className="service-row__index" aria-hidden="true">{service.index}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <nav className="service-row__projects" aria-label={`Proyectos que ejemplifican ${service.title}`}>
                    {examples.slice(0, 3).map((project) => (
                      <Link key={project.slug} href={`/proyectos/${project.slug}`}>
                        {project.title} ↗
                      </Link>
                    ))}
                  </nav>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
