'use client';

import { useState, useMemo } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import portfolio from '@/content/portfolio.json';

export default function Portfolio() {
  const categories = useMemo(() => ['Todos', ...Array.from(new Set(portfolio.map((p) => p.category)))], []);
  const [active, setActive] = useState('Todos');

  const filtered = active === 'Todos' ? portfolio : portfolio.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="relative px-6 py-32 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="Proyectos que hablan por sí solos"
            subtitle="Una selección de trabajos en publicidad, diseño textil, branding y visualización 3D."
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wide transition ${
                  active === cat
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-textSecondary hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <AnimatedSection key={project.slug} delay={i * 0.06}>
              <ProjectCard {...project} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
