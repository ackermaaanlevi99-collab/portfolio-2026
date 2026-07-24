import Image from 'next/image';

export type BackgroundVariant =
  | 'blueprint'
  | 'grid'
  | 'paper-grain'
  | 'glass'
  | 'image'
  | 'video'
  | 'none';

interface BackgroundProps {
  variant?: BackgroundVariant;
  image?: string;
  video?: string;
  className?: string;
}

export default function Background({ variant = 'none', image, video, className = '' }: BackgroundProps) {
  if (variant === 'none') return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {variant === 'blueprint' && (
        <>
          <div className="grid-bg absolute inset-0 opacity-70" />
          <div className="absolute -left-24 top-0 h-[30rem] w-[30rem] animate-drift rounded-full bg-primary/10 blur-[110px]" />
          <div
            className="absolute -right-16 top-1/3 h-[24rem] w-[24rem] animate-drift rounded-full bg-accent/10 blur-[110px]"
            style={{ animationDelay: '4s' }}
          />
          <div className="paper-grain absolute inset-0" />
        </>
      )}

      {variant === 'grid' && <div className="grid-bg absolute inset-0" />}

      {variant === 'paper-grain' && <div className="paper-grain absolute inset-0" />}

      {variant === 'glass' && <div className="glass absolute inset-0" />}

      {variant === 'image' && image && (
        <Image src={image} alt="" fill className="object-cover" />
      )}

      {variant === 'video' && video && (
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src={video} />
        </video>
      )}
    </div>
  );
}

/** Marca de registro de imprenta — el detalle de firma del sistema visual. */
export function RegMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="0" x2="16" y2="32" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
