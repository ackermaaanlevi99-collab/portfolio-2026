'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  images: string[];
  alt: string;
}

export default function Gallery({ images, alt }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActiveIndex(i)}
            className="relative aspect-square overflow-hidden rounded-2xl border border-border"
            data-cursor-hover
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover transition duration-500 hover:scale-105"
              sizes="33vw"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-secondary/95 p-6"
            onClick={() => setActiveIndex(null)}
          >
            <button className="absolute right-6 top-6 text-background" onClick={() => setActiveIndex(null)} aria-label="Cerrar">
              <X size={28} />
            </button>
            {activeIndex > 0 && (
              <button
                className="absolute left-4 text-background md:left-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(activeIndex - 1);
                }}
                aria-label="Anterior"
              >
                <ChevronLeft size={32} />
              </button>
            )}
            {activeIndex < images.length - 1 && (
              <button
                className="absolute right-4 text-background md:right-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(activeIndex + 1);
                }}
                aria-label="Siguiente"
              >
                <ChevronRight size={32} />
              </button>
            )}
            <motion.div
              key={activeIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative h-[80vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[activeIndex]} alt={`${alt} ${activeIndex + 1}`} fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
