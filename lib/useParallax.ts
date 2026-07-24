'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Efecto de paralaje ligado al scroll usando GSAP + ScrollTrigger.
 * Se usa puntualmente (ej. el fondo del Hero) — el resto de las
 * animaciones del sitio corren con Framer Motion.
 */
export function useParallax(ref: React.RefObject<HTMLElement | null>, speed: number = 0.3) {
  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current as Element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, speed]);
}
