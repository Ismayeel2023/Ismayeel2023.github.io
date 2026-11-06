import { useRef, useState } from 'react';
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
import { playKey } from '../lib/keySound';

/**
 * The stack as two rails of keycaps sliding past each other, echoing the
 * dev deck in the hero. Rails drift on their own, speed up with scroll, and
 * pause while hovered so any keycap can be pressed (with a real "thock").
 */

const META: Record<string, { code: string; group: string }> = {
  React: { code: 'RCT', group: 'Interface' },
  Laravel: { code: 'LRV', group: 'Backend' },
  TypeScript: { code: 'TS', group: 'Language' },
  PHP: { code: 'PHP', group: 'Language' },
  MySQL: { code: 'SQL', group: 'Database' },
  'Tailwind CSS': { code: 'TW', group: 'Interface' },
  TensorFlow: { code: 'TF', group: 'Machine learning' },
  Python: { code: 'PY', group: 'Language' },
  ClickHouse: { code: 'CH', group: 'Analytics' },
  Java: { code: 'JV', group: 'Language' },
  Git: { code: 'GIT', group: 'Tooling' },
  'REST APIs': { code: 'API', group: 'Integration' },
};

type Tone = 'graphite' | 'ivory' | 'copper' | 'sage';

const TONES: Record<Tone, { top: string; side: string; ink: string; sub: string }> = {
  graphite: { top: '#2B2723', side: '#141210', ink: '#F2EDE4', sub: 'rgba(242,237,228,0.45)' },
  ivory: { top: '#EFE7DA', side: '#ADA290', ink: '#1B1814', sub: 'rgba(27,24,20,0.5)' },
  copper: { top: '#E4A36A', side: '#A0683A', ink: '#1E1006', sub: 'rgba(30,16,6,0.55)' },
  sage: { top: '#93B09E', side: '#5E7A69', ink: '#0E1712', sub: 'rgba(14,23,18,0.55)' },
};

// Mostly graphite, with accent caps placed like a custom keyboard set.
const toneFor = (row: number, i: number): Tone => {
  const pattern: Tone[] = row === 0 ? ['graphite', 'copper', 'graphite', 'ivory', 'graphite', 'sage'] : ['ivory', 'graphite', 'sage', 'graphite', 'copper', 'graphite'];
  return pattern[i % pattern.length];
};

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Rail({ items, row, baseVelocity }: { items: string[]; row: number; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 3], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);
  const paused = useRef(false);
  const speed = useSpring(1, { stiffness: 60, damping: 20 });

  useAnimationFrame((_, delta) => {
    speed.set(paused.current ? 0 : 1);
    let move = direction.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) direction.current = -1;
    else if (factor.get() > 0) direction.current = 1;
    move += direction.current * move * Math.abs(factor.get());
    baseX.set(baseX.get() + move * speed.get());
  });

  return (
    <div
      className="flex overflow-hidden py-3"
      onPointerEnter={(e) => e.pointerType === 'mouse' && (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <motion.div className="flex flex-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-3 pr-3 md:gap-4 md:pr-4" aria-hidden={copy > 0}>
            {items.map((item, i) => (
              <Cap key={item} label={item} tone={toneFor(row, i)} index={row * items.length + i + 1} focusable={copy === 0} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Cap({ label, tone, index, focusable }: { label: string; tone: Tone; index: number; focusable: boolean }) {
  const [down, setDown] = useState(false);
  const t = TONES[tone];
  const meta = META[label] ?? { code: label.slice(0, 3).toUpperCase(), group: 'Stack' };
  const depth = down ? 1 : 7;

  const press = () => {
    if (down) return;
    setDown(true);
    playKey('down');
  };
  const release = () => {
    if (!down) return;
    setDown(false);
    playKey('up');
  };

  return (
    <button
      type="button"
      tabIndex={focusable ? 0 : -1}
      aria-label={`${label} — ${meta.group}`}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !e.repeat && press()}
      onKeyUp={(e) => (e.key === ' ' || e.key === 'Enter') && release()}
      className="group relative h-[92px] shrink-0 select-none rounded-[16px] outline-none transition-transform duration-[90ms] focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-4 focus-visible:ring-offset-ink md:h-[112px]"
      style={{
        background: t.side,
        transform: `translateY(${7 - depth}px)`,
        boxShadow: `0 ${depth}px 0 ${t.side}, 0 ${depth + 10}px 22px -8px rgba(0,0,0,0.75)`,
      }}
    >
      <span
        className="relative flex h-[calc(100%-9px)] flex-col justify-between rounded-[13px] px-5 pb-3 pt-3 text-left transition-[filter] duration-200 group-hover:brightness-[1.08] md:px-6 md:pb-4"
        style={{
          margin: '3px 4px 0',
          background: `linear-gradient(180deg, ${t.top} 0%, ${t.top} 50%, color-mix(in srgb, ${t.top} 84%, #000) 100%)`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -3px 4px rgba(0,0,0,0.18)',
          color: t.ink,
        }}
      >
        <span className="flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: t.sub }}>
          <span>{meta.code}</span>
          <span>{String(index).padStart(2, '0')}</span>
        </span>
        <span className="whitespace-nowrap text-[clamp(1.6rem,3.2vw,2.6rem)] font-medium leading-none tracking-[-0.035em]">
          {label}
        </span>
      </span>
    </button>
  );
}

export function TechMarquee() {
  return (
    <section aria-label="Technologies" className="relative overflow-hidden border-y border-white/[0.06] py-12 md:py-16">
      <div className="container-x mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted md:mb-8 md:text-[11px]">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(228,163,106,0.9)]" />
          stack.layout — {marqueeTop.length + marqueeBottom.length} keys
        </span>
        <span className="hidden sm:inline">hover to pause · press any key</span>
      </div>

      {/* plate */}
      <div
        className="relative mx-0 border-y border-white/[0.05] py-4 md:py-6"
        style={{
          background: 'linear-gradient(180deg, #0E0C0A 0%, #14120F 50%, #0E0C0A 100%)',
          boxShadow: 'inset 0 10px 30px -10px rgba(0,0,0,0.9), inset 0 -10px 30px -10px rgba(0,0,0,0.9)',
          maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        }}
      >
        <Rail items={marqueeTop} row={0} baseVelocity={-1.4} />
        <Rail items={marqueeBottom} row={1} baseVelocity={1.4} />
      </div>
    </section>
  );
}
