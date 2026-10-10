'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectImage } from '@/types/content';

interface GalleryProps {
  images: ProjectImage[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  function openImage(index: number, event: React.MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    setActiveIndex(index);
    dialogRef.current?.showModal();
  }
  function close() {
    if (dialogRef.current?.open) dialogRef.current.close();
    setActiveIndex(null);
  }
  function changeImage(index: number) {
    setActiveIndex(Math.max(0, Math.min(images.length - 1, index)));
  }

  const currentImage = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <div className="project-gallery__grid" role="list" aria-label={`Galería de ${title}`}>
        {images.map((image, index) => (
          <figure className="project-gallery__item" key={`${image.src}-${index}`} role="listitem">
            <button
              ref={index === activeIndex ? openerRef : undefined}
              type="button"
              onClick={(event) => openImage(index, event)}
              aria-label={`Abrir imagen ${index + 1} de ${images.length}: ${image.alt}`}
            >
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 94vw, 48vw" />
            </button>
            {image.caption && <figcaption className="sr-only">{image.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        aria-label={`Galería ampliada: ${title}`}
        onClose={() => { setActiveIndex(null); openerRef.current?.focus(); }}
        onCancel={() => setActiveIndex(null)}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' && activeIndex !== null && activeIndex > 0) changeImage(activeIndex - 1);
          if (event.key === 'ArrowRight' && activeIndex !== null && activeIndex < images.length - 1) changeImage(activeIndex + 1);
        }}
      >
        {currentImage && activeIndex !== null && (
          <div className="gallery-dialog__frame">
            <button type="button" className="gallery-dialog__close" onClick={close} aria-label="Cerrar imagen ampliada"><X size={22} aria-hidden="true" /></button>
            <figure className="gallery-dialog__image">
              <Image src={currentImage.src} alt={currentImage.alt} fill sizes="95vw" priority />
              {currentImage.caption && <figcaption className="gallery-dialog__caption">{currentImage.caption}</figcaption>}
            </figure>
            <div className="gallery-dialog__controls" aria-label="Controles de la galería">
              <button type="button" onClick={() => changeImage(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Imagen anterior"><ChevronLeft aria-hidden="true" /></button>
              <span className="gallery-dialog__count" aria-live="polite" aria-atomic="true">{activeIndex + 1} / {images.length}</span>
              <button type="button" onClick={() => changeImage(activeIndex + 1)} disabled={activeIndex === images.length - 1} aria-label="Imagen siguiente"><ChevronRight aria-hidden="true" /></button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
