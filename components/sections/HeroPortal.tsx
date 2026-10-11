'use client';

import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { PortalSceneController } from '@/lib/portal-scene';

type SceneStatus = 'loading' | 'ready' | 'error';

export default function HeroPortal({ cover }: { cover: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<PortalSceneController | null>(null);
  const motionRef = useRef(false);
  const visibleRef = useRef(false);
  const enteredRef = useRef(false);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [status, setStatus] = useState<SceneStatus>('loading');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wideViewport = window.matchMedia('(min-width: 761px)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const updatePreference = () => {
      const mayAutoplay = !reducedMotion.matches && wideViewport.matches && !coarsePointer.matches;
      setMotionEnabled(mayAutoplay);
      // Touch and reduced-motion devices keep the original artwork as the full
      // static presentation. They can opt in; Three.js loads only after activation.
      if (mayAutoplay) setShouldLoad(true);
    };
    updatePreference();
    reducedMotion.addEventListener('change', updatePreference);
    wideViewport.addEventListener('change', updatePreference);
    coarsePointer.addEventListener('change', updatePreference);
    return () => {
      reducedMotion.removeEventListener('change', updatePreference);
      wideViewport.removeEventListener('change', updatePreference);
      coarsePointer.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    motionRef.current = motionEnabled;
    controllerRef.current?.setActive(motionEnabled);
  }, [motionEnabled]);

  useEffect(() => {
    visibleRef.current = isVisible;
    controllerRef.current?.setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasEntered(true);
      visibleRef.current = true;
      enteredRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      const visible = Boolean(entry?.isIntersecting);
      setIsVisible(visible);
      visibleRef.current = visible;
      if (visible && !enteredRef.current) {
        enteredRef.current = true;
        setHasEntered(true);
      }
    }, { rootMargin: '140px 0px', threshold: 0.01 });

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered || !shouldLoad) return;
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    let controller: PortalSceneController | null = null;
    setStatus('loading');

    import('@/lib/portal-scene')
      .then(({ mountPortalScene }) => {
        if (cancelled || !stage.isConnected) return;
        try {
          controller = mountPortalScene(stage, {
            onReady: () => { if (!cancelled) setStatus('ready'); },
            onError: () => { if (!cancelled) setStatus('error'); },
          });
          controllerRef.current = controller;
          controller.setActive(motionRef.current);
          controller.setVisible(visibleRef.current);
        } catch {
          setStatus('error');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      controller?.dispose();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [hasEntered, shouldLoad]);

  const toggleMotion = () => {
    setShouldLoad(true);
    setMotionEnabled((enabled) => !enabled);
  };

  return (
    <figure className="hero-portal" data-state={status} data-motion={motionEnabled ? 'active' : 'paused'}>
      <div className="hero-portal__stage">
        <Image
          src={cover}
          alt=""
          aria-hidden="true"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 760px) 100vw, 38vw"
          className="hero-portal__fallback"
        />
        <div
          ref={stageRef}
          className="hero-portal__canvas"
          aria-hidden="true"
        />
        <span className="sr-only" aria-live="polite">
          {status === 'error' ? 'La escena 3D no está disponible; se conserva el arte original del proyecto 2026.' : ''}
        </span>
      </div>
      <figcaption className="hero-portal__caption">
        <span className="hero-portal__label">Portal gráfico / Archivo 2026</span>
        <button
          type="button"
          className="hero-portal__toggle"
          aria-pressed={motionEnabled}
          aria-label={motionEnabled ? 'Pausar movimiento 3D' : 'Activar movimiento 3D'}
          disabled={status === 'error'}
          onClick={toggleMotion}
        >
          {motionEnabled ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
          <span>{motionEnabled ? 'Pausar' : 'Activar'} movimiento</span>
        </button>
      </figcaption>
    </figure>
  );
}
