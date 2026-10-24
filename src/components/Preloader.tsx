import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data';

const words = ['Design', 'Develop', 'Deploy'];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    let frame = 0;
    let timeout = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) frame = requestAnimationFrame(tick);
      else timeout = window.setTimeout(onDone, 300);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [onDone]);

  const wordIndex = Math.min(words.length - 1, Math.floor(count / 34));

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink p-5 md:p-10"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted">
        <span>{profile.name}</span>
        <span>Portfolio ©2026</span>
      </div>

      <div className="flex justify-center overflow-hidden">
        <motion.span
          key={wordIndex}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl italic text-fg md:text-6xl"
        >
          {words[wordIndex]}
        </motion.span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <span className="font-medium leading-none tracking-[-0.06em] tabular-nums text-[22vw] md:text-[14vw]">
          {count}
          <span className="text-accent">%</span>
        </span>
        <div className="mb-[2vw] h-px w-1/3 bg-white/10">
          <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </div>
    </motion.div>
  );
}
