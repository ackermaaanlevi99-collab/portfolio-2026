'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import testimonials from '@/content/testimonials.json';

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const current = testimonials[index];

  return (
    <section id="testimonios" className="relative px-6 py-32 md:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <SectionHeading align="center" eyebrow="Testimonios" title="Lo que dicen los clientes" />

        <div className="relative mt-16 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <Quote className="mx-auto text-primary" size={30} />
              <p className="text-balance mt-6 font-display text-2xl font-medium leading-snug md:text-3xl">
                &ldquo;{current.quote}&rdquo;
              </p>
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-textSecondary">
                {current.name} <span className="text-muted">— {current.role}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button onClick={prev} aria-label="Testimonio anterior" className="rounded-full border border-border p-3 transition hover:border-primary hover:text-primary">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir al testimonio ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`}
              />
            ))}
          </div>
          <button onClick={next} aria-label="Testimonio siguiente" className="rounded-full border border-border p-3 transition hover:border-primary hover:text-primary">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
