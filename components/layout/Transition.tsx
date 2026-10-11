'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Transition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => setHasHydrated(true), []);

  // Keep server and first client render structurally identical. Motion
  // preference can differ between server and browser before hydration.
  if (hasHydrated && reduceMotion) return <>{children}</>;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
