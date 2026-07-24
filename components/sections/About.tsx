import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { RegMark } from '@/components/layout/Background';
import about from '@/content/about.json';

export default function About() {
  const initials = about.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <section id="sobre-mi" className="relative px-6 py-32 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Sobre mí" title="La persona detrás del diseño" />

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          <AnimatedSection direction="left" className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-secondary">
            <div className="grid-bg absolute inset-0 opacity-10" />
            <RegMark className="absolute left-6 top-6 h-8 w-8 text-background/30" />
            <RegMark className="absolute bottom-6 right-6 h-8 w-8 text-background/30" />
            <div className="relative flex h-full flex-col items-center justify-center gap-6 p-10 text-center">
              <span className="font-display text-[7rem] font-bold leading-none text-background md:text-[9rem]">
                {initials}
              </span>
              <div>
                <p className="font-display text-xl font-semibold text-background">{about.name}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-background/50">{about.role}</p>
              </div>
            </div>
          </AnimatedSection>

          <div>
            <AnimatedSection direction="right">
              <p className="text-lg leading-relaxed text-textSecondary">{about.story}</p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1} className="mt-10">
              <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Herramientas</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {about.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-textSecondary">
                    {skill}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2} className="mt-12">
              <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Experiencia</p>
              <div className="mt-4 space-y-6 border-l border-border pl-6">
                {about.experience.map((item) => (
                  <div key={item.role} className="relative">
                    <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="font-mono text-xs text-muted">{item.period}</p>
                    <p className="mt-1 font-display text-lg font-semibold">{item.role}</p>
                    <p className="text-sm text-textSecondary">{item.company}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
