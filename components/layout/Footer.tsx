'use client';

import Link from 'next/link';
import { FaBehance, FaWhatsapp } from 'react-icons/fa6';
import { Mail, ArrowUp } from 'lucide-react';
import texts from '@/content/texts.json';
import contact from '@/content/contact.json';
import { navigation } from '@/config/navigation';
import { useLenis } from './SmoothScroll';
import { RegMark } from './Background';

export default function Footer() {
  const year = new Date().getFullYear();
  const lenis = useLenis();

  function scrollTop() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('#') && lenis) {
      e.preventDefault();
      lenis.scrollTo(href, { offset: -96 });
    }
  }

  return (
    <footer className="relative overflow-hidden bg-secondary px-6 pb-10 pt-24 text-background md:px-10">
      <RegMark className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-background/10" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <p className="font-display text-3xl font-bold">{texts.brand.name}</p>
            <p className="mt-3 font-mono text-sm text-background/60">{texts.brand.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-background/50">Navegación</p>
              <ul className="mt-4 space-y-2">
                {navigation.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${link.href}`}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-sm text-background/80 transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-background/50">Contacto</p>
              <ul className="mt-4 space-y-2 text-sm text-background/80">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 transition hover:text-accent"
                  >
                    <Mail size={14} /> {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-accent"
                  >
                    <FaWhatsapp size={14} /> WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={contact.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-accent"
                  >
                    <FaBehance size={14} /> Behance
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-center justify-between gap-4 border-t border-background/15 pt-8 md:flex-row">
          <p className="font-mono text-xs text-background/45">
            © {year} {texts.brand.name}. {texts.footer.rights}
          </p>
          <button
            onClick={scrollTop}
            className="inline-flex items-center gap-2 font-mono text-xs text-background/60 transition hover:text-accent"
            aria-label={texts.buttons.backToTop}
          >
            {texts.buttons.backToTop} <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
