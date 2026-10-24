import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { stats } from '../data';
import { Counter } from './ui/Counter';
import { Reveal, SectionLabel } from './ui/Reveal';

const intro =
  "I'm a Computer Science graduate and software developer at Pricol, based in Tamil Nadu, India. I turn ideas into *clean,* scalable web applications — from database design to the last pixel of the interface — and I'm endlessly curious about *deep learning* and what it can do for real products.";

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionLabel index="01" label="About" />

        <ScrollWords text={intro} />

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] md:mt-28 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="bg-ink p-6 md:p-8">
              <p className="text-[clamp(2.4rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
                <Counter to={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </p>
              <p className="mt-4 max-w-[16ch] text-sm leading-snug text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Paragraph whose words light up one after another as it scrolls through the viewport. */
function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const words = text.split(' ');

  return (
    <p
      ref={ref}
      className="max-w-6xl text-[clamp(1.6rem,3.6vw,3.25rem)] font-medium leading-[1.18] tracking-[-0.03em]"
    >
      {words.map((w, i) => {
        const start = i / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]} emphasis={w.startsWith('*')}>
            {w.replace(/\*/g, '')}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  emphasis,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  emphasis: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.25em] inline-block ${emphasis ? 'font-serif font-normal italic text-accent' : ''}`}
    >
      {children}
    </motion.span>
  );
}
