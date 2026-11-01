'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { sampleProjectImage, supportsWebGL } from '@/lib/gather-image';
import { gatherForProgress, scrollProgress, stepForProgress } from '@/lib/scroll-story';
import type { GatherController } from '@/lib/gather-scene';

interface GatherScrollStoryProps {
  src: string;
  alt: string;
  /** Un texto por paso. Cada paso ocupa una pantalla de desplazamiento. */
  steps: string[];
}

type Mode = 'static' | 'scroll';

// Narrativa con scroll: la imagen se dispersa y se reconstruye según el desplazamiento.
// Sin movimiento reducido o sin WebGL se muestra la imagen original con todos los pasos.
export default function GatherScrollStory({ src, alt, steps }: GatherScrollStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GatherController | null>(null);
  const loadingRef = useRef(false);
  const visibleRef = useRef(false);
  const gatherRef = useRef(1);
  const [mode, setMode] = useState<Mode>('static');
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [ratio, setRatio] = useState(0.8);

  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => {
      if (probe.naturalWidth && probe.naturalHeight) setRatio(probe.naturalWidth / probe.naturalHeight);
    };
    probe.src = src;
  }, [src]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !supportsWebGL()) return;
    setMode('scroll');
  }, []);

  const stepCount = steps.length;

  useEffect(() => {
    if (mode !== 'scroll') return;
    const section = sectionRef.current;
    if (!section) return;

    const dispose = () => {
      controllerRef.current?.dispose();
      controllerRef.current = null;
      setReady(false);
    };

    // La escena se crea cuando la sección está cerca de la pantalla y se libera al salir.
    const mount = async () => {
      if (loadingRef.current || controllerRef.current) return;
      loadingRef.current = true;
      try {
        const mobile = window.matchMedia('(pointer: coarse), (max-width: 760px)').matches;
        const sample = await sampleProjectImage(src, mobile ? 12000 : 40000);
        const { mountGatherScene } = await import('@/lib/gather-scene');
        if (!hostRef.current) return;
        const controller = mountGatherScene(hostRef.current, sample, { mobile });
        if (!visibleRef.current) {
          controller.dispose();
          return;
        }
        controller.setGather(gatherRef.current);
        controllerRef.current = controller;
        setReady(true);
      } catch {
        setMode('static');
      } finally {
        loadingRef.current = false;
      }
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) void mount();
        else dispose();
      },
      { rootMargin: '200px 0px' },
    );
    intersection.observe(section);

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const progress = scrollProgress(rect.top, rect.height, window.innerHeight);
      const gather = gatherForProgress(progress);
      gatherRef.current = gather;
      controllerRef.current?.setGather(gather);
      setStep(stepForProgress(progress, stepCount));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      intersection.disconnect();
      dispose();
    };
  }, [mode, src, stepCount]);

  const stage = (
    <div className="gather-story__stage" style={{ ['--gather-ratio' as string]: ratio }}>
      <Image
        src={src}
        alt={mode === 'scroll' && ready ? '' : alt}
        fill
        sizes="(max-width: 760px) 100vw, 60vw"
        className={mode === 'scroll' && ready ? 'gather__image gather__image--hidden' : 'gather__image'}
        style={{ objectFit: 'contain' }}
      />
      {mode === 'scroll' && <div ref={hostRef} className="gather__host" />}
    </div>
  );

  if (mode === 'static') {
    return (
      <section className="gather-story gather-story--static" aria-label="Imagen del proyecto">
        {stage}
        <ol className="gather-story__steps">
          {steps.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>
        <p className="gather__status">Movimiento reducido o WebGL no disponible: se muestra la imagen original.</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="gather-story"
      style={{ height: `${stepCount * 100}vh` }}
      aria-label="Narrativa con desplazamiento: de la imagen a las partículas"
    >
      <div className="gather-story__sticky">
        {stage}
        <ol className="gather-story__steps">
          {steps.map((text, index) => (
            <li key={text} aria-current={index === step ? 'step' : undefined} className={index === step ? 'is-active' : undefined}>
              {text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
