import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { marqueeBottom, marqueeTop } from '../data';

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Infinite row that drifts on its own and speeds up / reverses with scroll velocity. */
function VelocityRow({ items, baseVelocity, outline }: { items: string[]; baseVelocity: number; outline?: boolean }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) direction.current = -1;
    else if (factor.get() > 0) direction.current = 1;
    move += direction.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex flex-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {items.map((item) => (
              <span key={item} className="flex items-center">
                <span
                  className={`px-6 text-[clamp(2.5rem,6.5vw,5.5rem)] font-medium leading-tight tracking-[-0.04em] md:px-10 ${
                    outline ? 'text-outline' : 'text-fg'
                  }`}
                >
                  {item}
                </span>
                <Star />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-accent md:h-9 md:w-9" fill="currentColor" aria-hidden>
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

export function TechMarquee() {
  return (
    <section aria-label="Technologies" className="relative border-y border-white/[0.07] py-10 md:py-14">
      <div className="flex flex-col gap-2">
        <VelocityRow items={marqueeTop} baseVelocity={-2} />
        <VelocityRow items={marqueeBottom} baseVelocity={2} outline />
      </div>
    </section>
  );
}
