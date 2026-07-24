import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import clients from '@/content/clients.json';

export default function Clients() {
  return (
    <section id="clientes" className="relative border-y border-border bg-backgroundAlt/50 px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading align="center" eyebrow="Clientes" title="Marcas con las que he trabajado" />
        <AnimatedSection className="mt-16 flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
          {clients.map((client) => (
            <span key={client.name} className="font-display text-xl font-semibold text-muted transition hover:text-text md:text-2xl">
              {client.name}
            </span>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
