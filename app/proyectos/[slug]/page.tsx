import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import portfolio from '@/content/portfolio.json';
import Gallery from '@/components/ui/Gallery';
import CTA from '@/components/ui/CTA';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { SpecTag } from '@/components/ui/SectionHeading';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = portfolio.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    openGraph: { images: [project.cover] },
  };
}

export default function ProjectPage({ params }: PageProps) {
  const project = portfolio.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-6xl px-6 pb-32 pt-36 md:px-10">
      <Link
        href="/#portfolio"
        className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition hover:text-primary"
        data-cursor-hover
      >
        <ArrowLeft size={16} /> Volver al portfolio
      </Link>

      <AnimatedSection>
        <SpecTag>
          {project.category} · {project.year}
        </SpecTag>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">{project.name}</h1>
        <p className="mt-6 max-w-2xl text-lg text-textSecondary">{project.description}</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl border border-border">
        <Image src={project.cover} alt={project.name} fill className="object-cover" priority />
      </AnimatedSection>

      {project.gallery?.length > 0 && (
        <div className="mt-16">
          <Gallery images={project.gallery} alt={project.name} />
        </div>
      )}

      <div className="mt-16 flex flex-wrap gap-3">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border px-4 py-1.5 font-mono text-xs text-textSecondary">
            {tag}
          </span>
        ))}
      </div>

      <AnimatedSection
        delay={0.2}
        className="mt-20 flex flex-col items-start gap-6 rounded-3xl border border-border bg-secondary p-10 text-background md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 className="font-display text-2xl font-bold">¿Tienes un proyecto similar en mente?</h2>
          <p className="mt-2 text-background/70">Conversemos y démosle forma a tu próxima pieza visual.</p>
        </div>
        <CTA href="/#contacto" label="Hablemos" variant="primary" />
      </AnimatedSection>
    </article>
  );
}
