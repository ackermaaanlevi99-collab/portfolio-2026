'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export default function Cursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.4 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;

    document.documentElement.classList.add('custom-cursor-active');
    setIsActive(true);

    function moveCursor(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const target = e.target as HTMLElement;
      setIsPointer(!!target.closest('a, button, [data-cursor-hover]'));
    }

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY, shouldReduceMotion]);

  if (!isActive) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      aria-hidden="true"
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{ width: isPointer ? 44 : 10, height: isPointer ? 44 : 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
