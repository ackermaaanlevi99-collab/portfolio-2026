import AnimatedSection from './AnimatedSection';

export function SpecTag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted ${className}`}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <AnimatedSection className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <SpecTag className="mb-4">{eyebrow}</SpecTag>}
      <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-textSecondary">{subtitle}</p>}
    </AnimatedSection>
  );
}
