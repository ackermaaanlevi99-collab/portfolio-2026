'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CTA from './CTA';

interface ServiceCardProps {
  code: string;
  title: string;
  description: string;
  icon: string;
  button?: { label: string; href: string };
}

export default function ServiceCard({ code, title, description, icon, button }: ServiceCardProps) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.Sparkles;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-8 shadow-[0_1px_2px_rgba(23,21,15,0.04)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-20px_rgba(23,21,15,0.18)]"
    >
      <span className="absolute right-6 top-6 font-mono text-[11px] tracking-widest text-muted/70">
        REF.{code}
      </span>

      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Icon size={22} />
        </div>
        <h3 className="mt-6 font-display text-2xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-textSecondary">{description}</p>
      </div>

      {button && (
        <div className="mt-8">
          <CTA href={button.href} label={button.label} variant="ghost" />
        </div>
      )}
    </motion.div>
  );
}
