import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';

type CounterProps = {
  to: number;
  decimals?: number;
  suffix?: string;
};

/** Counts up from zero the first time it becomes visible. */
export function Counter({ to, decimals = 0, suffix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const value = useMotionValue(0);
  const display = useTransform(value, (v) => v.toFixed(decimals) + suffix);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: 2.2, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, to, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
