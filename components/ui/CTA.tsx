'use client';

import type { MouseEventHandler } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useLenis } from '@/components/layout/SmoothScroll';

interface CTAProps {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export default function CTA({ href, label, variant = 'primary', icon = true, className = '', onClick }: CTAProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const isAnchor = href.startsWith('#');
  const target = isAnchor && pathname !== '/' ? `/${href}` : href;

  function handleClick(event: Parameters<MouseEventHandler<HTMLAnchorElement>>[0]) {
    if (isAnchor && pathname === '/') {
      const node = document.querySelector(href);
      if (node) {
        event.preventDefault();
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (lenis && !reduceMotion) lenis.scrollTo(href, { offset: -100 });
        else node.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
    onClick?.(event);
  }

  const variantClass = variant === 'secondary' ? 'cta--secondary' : variant === 'ghost' ? 'cta--ghost' : '';
  return (
    <Link href={target} onClick={handleClick} className={`cta ${variantClass} ${className}`.trim()}>
      {label}
      {icon && <ArrowUpRight size={15} aria-hidden="true" />}
    </Link>
  );
}
