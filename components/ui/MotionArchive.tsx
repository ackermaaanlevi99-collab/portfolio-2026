'use client';

import { useEffect, useState } from 'react';

export type ArchiveItem = {
  kind: 'motion' | 'still';
  src: string;
  poster?: string;
  width: number;
  height: number;
  alt: string;
};

// Archivo de movimiento: GIF convertidos a WebP animado. Con "reducir movimiento"
// se muestra el primer cuadro fijo. Las imágenes se cargan de forma diferida.
export default function MotionArchive({ items }: { items: ArchiveItem[] }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <ul className="motion-archive" role="list">
      {items.map((item) => (
        <li key={item.src} className="motion-archive__item">
          {/* Imágenes del archivo: texto alternativo descriptivo, sin afirmar resultados. */}
          <img
            src={item.kind === 'motion' && reduced && item.poster ? item.poster : item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
}
