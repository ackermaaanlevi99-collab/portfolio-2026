'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navigation } from '@/config/navigation';
import texts from '@/content/texts.json';
import { useLenis } from './SmoothScroll';
import CTA from '@/components/ui/CTA';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('#inicio');
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    const sections = navigation.links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    if (href.startsWith('#') && lenis) {
      e.preventDefault();
      lenis.scrollTo(href, { offset: -96 });
    }
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div
          className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? 'glass' : 'bg-transparent'
          }`}
        >
          <Link
            href="/#inicio"
            onClick={(e) => handleNavClick(e, '#inicio')}
            className="font-display text-xl font-bold tracking-tight"
            data-cursor-hover
          >
            {texts.brand.shortName}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navigation.links.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                data-cursor-hover
                className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                  activeId === link.href ? 'text-primary' : 'text-textSecondary hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <CTA href="#contacto" label={texts.buttons.letsTalk} variant="primary" icon={false} className="!px-5 !py-2.5" />
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="text-text md:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="glass mx-6 mt-3 flex flex-col gap-1 rounded-2xl p-4 md:hidden"
          >
            {navigation.links.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="rounded-xl px-4 py-3 font-mono text-sm text-textSecondary transition hover:bg-surface hover:text-text"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 px-4">
              <CTA href="#contacto" label={texts.buttons.letsTalk} variant="primary" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
