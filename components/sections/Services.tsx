import SectionHeading from '@/components/ui/SectionHeading';
import ServiceCard from '@/components/ui/ServiceCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import services from '@/content/services.json';

export default function Services() {
  return (
    <section id="servicios" className="relative px-6 py-32 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Servicios"
          title="Todo lo que tu marca necesita, en un solo lugar"
          subtitle="Del concepto a la producción: diseño gráfico, publicitario, textil y visualización 3D bajo un mismo estándar de calidad."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <AnimatedSection key={service.id} delay={i * 0.07}>
              <ServiceCard {...service} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
