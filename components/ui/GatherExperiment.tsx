'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { sampleImageData } from '@/lib/gather-sampler';
import type { GatherController } from '@/lib/gather-scene';

type Phase = 'idle' | 'loading' | 'active' | 'error';

interface GatherExperimentProps {
  src: string;
  alt: string;
  title: string;
}

const MAX_SAMPLE_SIDE = 360;

async function sampleImage(src: string, budget: number) {
  const image = new window.Image();
  image.decoding = 'async';
  image.src = src;
  await image.decode();

  const scale = Math.min(1, MAX_SAMPLE_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D no disponible');
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  return sampleImageData(data, width, height, { budget, depth: 0.9 });
}

function supportsWebGL(): boolean {
  const probe = document.createElement('canvas');
  return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
}

export default function GatherExperiment({ src, alt, title }: GatherExperimentProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [gather, setGather] = useState(100);
  const [ratio, setRatio] = useState(0.8);
  const [webgl, setWebgl] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GatherController | null>(null);

  useEffect(() => {
    setWebgl(supportsWebGL());
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // La proporción del marco sigue a la imagen para que el plano de partículas no se deforme.
    const probe = new window.Image();
    probe.onload = () => {
      if (probe.naturalWidth && probe.naturalHeight) setRatio(probe.naturalWidth / probe.naturalHeight);
    };
    probe.src = src;

    return () => {
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, [src]);

  async function activate() {
    setPhase('loading');
    try {
      const mobile = window.matchMedia('(pointer: coarse), (max-width: 760px)').matches;
      const sample = await sampleImage(src, mobile ? 12000 : 40000);
      const { mountGatherScene } = await import('@/lib/gather-scene');
      if (!hostRef.current) throw new Error('Contenedor no disponible');
      controllerRef.current?.dispose();
      controllerRef.current = mountGatherScene(hostRef.current, sample, { mobile });
      controllerRef.current.setGather(gather / 100);
      setPhase('active');
    } catch {
      controllerRef.current?.dispose();
      controllerRef.current = null;
      setPhase('error');
    }
  }

  function restoreOriginal() {
    controllerRef.current?.dispose();
    controllerRef.current = null;
    setPhase('idle');
  }

  function changeGather(value: number) {
    setGather(value);
    controllerRef.current?.setGather(value / 100);
  }

  const isActive = phase === 'active';

  return (
    <div className="gather">
      <div
        className="gather__stage"
        style={{ ['--gather-ratio' as string]: ratio }}
      >
        <Image
          src={src}
          alt={isActive ? '' : alt}
          fill
          sizes="(max-width: 760px) 100vw, 60vw"
          className={isActive ? 'gather__image gather__image--hidden' : 'gather__image'}
          style={{ objectFit: 'contain' }}
        />
        <div ref={hostRef} className="gather__host" />
        {phase === 'loading' && <p className="gather__status gather__status--overlay">Preparando partículas…</p>}
      </div>

      {isActive && (
        <p className="gather__sr" aria-live="polite">
          Nube de partículas de {title}. Usa el control de reconstrucción o mueve el ratón sobre la imagen.
        </p>
      )}

      <div className="gather__controls">
        {reducedMotion && (
          <p className="gather__status">Movimiento reducido activo: se muestra la imagen original.</p>
        )}

        {!reducedMotion && !webgl && (
          <p className="gather__status">Tu navegador no admite WebGL. La imagen original sigue disponible.</p>
        )}

        {!reducedMotion && webgl && !isActive && (
          <button type="button" className="gather__button gather__button--primary" onClick={activate} disabled={phase === 'loading'}>
            {phase === 'loading' ? 'Preparando…' : 'Ver como partículas'}
          </button>
        )}

        {phase === 'error' && (
          <p className="gather__status" role="alert">No se pudo crear la escena. La imagen original sigue disponible.</p>
        )}

        {isActive && (
          <>
            <label className="gather__range">
              <span>Reconstrucción</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={gather}
                aria-valuetext={`${gather} por ciento reconstruido`}
                onChange={(event) => changeGather(Number(event.target.value))}
              />
            </label>
            <button type="button" className="gather__button" onClick={() => changeGather(0)}>Dispersar</button>
            <button type="button" className="gather__button" onClick={() => changeGather(100)}>Reconstruir</button>
            <button type="button" className="gather__button" onClick={restoreOriginal}>Volver a la imagen original</button>
          </>
        )}
      </div>
    </div>
  );
}
