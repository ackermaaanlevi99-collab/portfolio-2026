'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  slug: string;
  name: string;
  category: string;
  year: string;
  thumbnail: string;
}

export default function ProjectCard({ slug, name, category, year, thumbnail }: ProjectCardProps) {
  return (
    <Link href={`/proyectos/${slug}`} data-cursor-hover className="block">
      <motion.div whileHover="hover" className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface">
        <motion.div variants={{ hover: { scale: 1.06 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image
            src={thumbnail}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/10 to-transparent" />

        <div className="absolute left-6 top-6 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-background/80">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="bg-background/70" style={{ width: i % 3 === 0 ? 2 : 1, height: 14 }} />
          ))}
          <span className="ml-1">{year}</span>
        </div>

        <motion.div
          variants={{ hover: { y: 0 } }}
          initial={{ y: 6 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">{category}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-background">{name}</h3>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={18} />
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
}
