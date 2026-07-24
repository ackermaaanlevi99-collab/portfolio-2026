'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLenis } from '@/components/layout/SmoothScroll';

interface CTAProps {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: boolean;
  className?: string;
}

export default function CTA({ href, label, variant = 'primary', icon = true, className = '' }: CTAProps) {
  const lenis = useLenis();
  const isAnchor = href.startsWith('#');

  const base =
    'group relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs uppercase tracking-widest transition-colors duration-300';
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primaryDark',
    secondary: 'border border-border text-text hover:border-primary hover:text-primary',
    ghost: 'text-text hover:text-primary',
  };

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isAnchor && lenis) {
      e.preventDefault();
      lenis.scrollTo(href, { offset: -96 });
    }
  }

  return (
    <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
      <Link
        href={isAnchor ? `/${href}` : href}
        onClick={handleClick}
        className={`${base} ${variants[variant]} ${className}`}
        data-cursor-hover
      >
        {label}
        {icon && (
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </Link>
    </motion.span>
  );
}
