'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import type { ProjectItem } from '@/types/content';

export default function Scene16Viewer({ project }: { project: ProjectItem }) {
  const storyRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMessage, setFullscreenMessage] = useState('');
  const frames = project.sceneSequence ?? [];

  useEffect(() => {
    const syncFullscreenState = () => setIsFullscreen(document.fullscreenElement === figureRef.current);
    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  useEffect(() => {
    const story = storyRef.current;
    if (!story || frames.length < 2) return;
    let animationFrame = 0;

    const update = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const scrollable = story.offsetHeight - window.innerHeight;
        const travelled = -story.getBoundingClientRect().top;
        const progress = scrollable > 0 ? Math.max(0, Math.min(1, travelled / scrollable)) : 0;
        const nextIndex = Math.round(progress * (frames.length - 1));
        setActiveIndex((current) => current === nextIndex ? current : nextIndex);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(animationFrame);
    };
  }, [frames.length]);

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = activeThumbRef.current;
    if (!strip || !thumb) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const left = thumb.offsetLeft - strip.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2;
    strip.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [activeIndex]);

  const goToFrame = useCallback((nextIndex: number) => {
    const index = Math.max(0, Math.min(frames.length - 1, nextIndex));
    setActiveIndex(index);
    const story = storyRef.current;
    if (!story) return;
    const scrollable = story.offsetHeight - window.innerHeight;
    const ratio = frames.length > 1 ? index / (frames.length - 1) : 0;
    window.scrollTo({
      top: story.offsetTop + Math.max(0, scrollable) * ratio,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [frames.length]);

  async function toggleFullscreen() {
    const figure = figureRef.current;
    if (!figure) return;
    try {
      if (document.fullscreenElement === figure) {
        await document.exitFullscreen();
      } else if (figure.requestFullscreen && document.fullscreenEnabled) {
        await figure.requestFullscreen();
      } else {
        setFullscreenMessage('La pantalla completa no está disponible en este navegador.');
      }
    } catch {
      setFullscreenMessage('No se pudo activar la pantalla completa. Puedes seguir recorriendo las escenas con los controles.');
    }
  }

  if (frames.length !== 16) return null;
  const activeFrame = frames[activeIndex];

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft' && activeIndex > 0) {
      event.preventDefault();
      goToFrame(activeIndex - 1);
    } else if (event.key === 'ArrowRight' && activeIndex < frames.length - 1) {
      event.preventDefault();
      goToFrame(activeIndex + 1);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined) return;
    const delta = end - start;
    if (Math.abs(delta) >= 56) goToFrame(activeIndex + (delta < 0 ? 1 : -1));
  }

  return (
    <section
      ref={storyRef}
      className="scene-story"
      aria-label={`Secuencia visual de ${project.title}: ${frames.length} escenas`}
      aria-describedby="scene-story-instructions"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="scene-story__sticky">
        <figure ref={figureRef} className="scene-story__figure" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <Image
            key={activeFrame.src}
            src={activeFrame.src}
            alt={activeFrame.alt}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 760px) 94vw, 88vw"
            className="scene-story__image"
          />
          <figcaption className="scene-story__label">
            <span>ANA VALDEZ / SECUENCIA ORIGINAL</span>
            <span className="scene-story__label-actions">
              <span>{String(activeIndex + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}</span>
              <button
                type="button"
                className="scene-story__fullscreen"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Ver escena en pantalla completa'}
                aria-pressed={isFullscreen}
                title={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
              >
                {isFullscreen ? <Minimize2 size={18} aria-hidden="true" /> : <Maximize2 size={18} aria-hidden="true" />}
              </button>
            </span>
          </figcaption>
        </figure>
        {fullscreenMessage && <p className="scene-story__screen-reader" role="status">{fullscreenMessage}</p>}
        <div className="scene-story__controls" role="group" aria-label="Controles de secuencia">
          <button type="button" onClick={() => goToFrame(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Ver escena anterior">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <progress value={activeIndex + 1} max={frames.length} aria-label={`Progreso de la secuencia: escena ${activeIndex + 1} de ${frames.length}`} />
          <button type="button" onClick={() => goToFrame(activeIndex + 1)} disabled={activeIndex === frames.length - 1} aria-label="Ver escena siguiente">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <span className="scene-story__screen-reader" aria-live="polite" aria-atomic="true">
            Escena {activeIndex + 1} de {frames.length}
          </span>
        </div>
        <div className="scene-story__thumbnails" role="group" aria-label="Elegir una escena" ref={stripRef}>
          {frames.map((frame, index) => (
            <button
              type="button"
              key={frame.src}
              ref={index === activeIndex ? activeThumbRef : undefined}
              className={`scene-story__thumbnail${index === activeIndex ? ' is-active' : ''}`}
              aria-label={`Ir a escena ${String(index + 1).padStart(2, '0')} de ${frames.length}`}
              aria-pressed={index === activeIndex}
              onClick={() => goToFrame(index)}
            >
              <Image src={frame.src} alt="" fill sizes="46px" />
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </div>
      <p id="scene-story-instructions" className="scene-story__screen-reader">
        Usa las flechas izquierda y derecha, los controles, las miniaturas o desliza sobre la imagen para recorrer las 16 escenas. El control de pantalla completa amplía la escena activa; pulsa Escape para salir.
      </p>
    </section>
  );
}
