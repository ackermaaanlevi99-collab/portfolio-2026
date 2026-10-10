'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navigation } from '@/config/navigation';
import texts from '@/content/texts.json';
import CTA from '@/components/ui/CTA';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('#inicio');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') { setActiveId(''); return; }
    const sections = navigation.links
      .map((link) => document.querySelector(link.href))
      .filter((element): element is Element => Boolean(element));
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActiveId(`#${entry.target.id}`);
    }, { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeIfOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !toggleRef.current?.contains(target)) setOpen(false);
    };
    const closeOnFocusExit = (event: FocusEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !toggleRef.current?.contains(target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeIfOutside);
    document.addEventListener('focusin', closeOnFocusExit);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeIfOutside);
      document.removeEventListener('focusin', closeOnFocusExit);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  function destination(href: string) {
    if (pathname === '/servicios' && href === '#servicios') return href;
    if (pathname === '/sobre-mi' && href === '#sobre-mi') return href;
    if (pathname !== '/' && href === '#servicios') return '/servicios';
    if (pathname !== '/' && href === '#sobre-mi') return '/sobre-mi';
    return href.startsWith('#') && pathname !== '/' ? `/${href}` : href;
  }

  function handleNavigation(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    if (pathname === '/' && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }
  }

  const contactHref = pathname === '/' ? '#contacto' : '/#contacto';

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__bar">
        <Link href="/#inicio" className="brand-mark" aria-label="Aranguibel Studio — Inicio">
          <Image src="/images/logo.svg" width={36} height={36} alt="" priority />
          <span className="brand-mark__name">Aranguibel<br />Studio</span>
        </Link>

        <nav className="primary-nav" aria-label="Navegación principal">
          {navigation.links.map((link) => (
            <Link
              key={link.href}
              href={destination(link.href)}
              onClick={(event) => handleNavigation(event, link.href)}
              aria-current={activeId === link.href ? 'location' : pathname === '/servicios' && link.href === '#servicios' || pathname === '/sobre-mi' && link.href === '#sobre-mi' ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <CTA href={contactHref} label="Hablemos" className="site-header__contact" />

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-label={open ? texts.navigation.menuClose : texts.navigation.menuOpen}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      <nav
        ref={menuRef}
        id="mobile-navigation"
        className={`mobile-menu ${open ? 'is-open' : ''}`}
        aria-label="Navegación móvil"
        aria-hidden={!open}
      >
        {navigation.links.map((link) => (
          <Link
            key={link.href}
            href={destination(link.href)}
            onClick={(event) => handleNavigation(event, link.href)}
            tabIndex={open ? 0 : -1}
          >
            <span>{link.label}</span><ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        ))}
        <div className="mobile-menu__contact"><CTA href={contactHref} label="Hablemos" onClick={() => setOpen(false)} /></div>
      </nav>
    </header>
  );
}
