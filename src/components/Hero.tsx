import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import { profile, roles } from '../data';
import { ease, scrollToId } from '../lib/scroll';
import { SplitWords } from './ui/Reveal';
import { Magnetic } from './ui/Magnetic';

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const mx = useMotionValue(50);
  const my = useMotionValue(35);
  const spotlight = useMotionTemplate`radial-gradient(640px circle at ${mx}% ${my}%, rgba(198,244,50,0.07), transparent 65%)`;

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, ease, delay },
  });

  return (
    <section id="top" ref={ref} onMouseMove={handleMove} className="relative min-h-[100svh] overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      <div className="absolute -left-40 -top-40 h-[520px] w-[520px] animate-drift rounded-full bg-accent/[0.12] blur-[140px]" />
      <div className="absolute -bottom-40 right-[-10%] h-[560px] w-[560px] animate-drift-slow rounded-full bg-violet/20 blur-[150px]" />

      <motion.div
        style={{ y, opacity, scale }}
        className="container-x relative z-10 grid min-h-[100svh] grid-cols-1 items-center gap-14 pb-28 pt-32 lg:grid-cols-12 lg:gap-8"
      >
        <div className="lg:col-span-7">
          <motion.div {...fadeUp(0.1)} className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-muted backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping2 rounded-full bg-accent" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Graduate Engineering Trainee at Pricol
          </motion.div>

          <motion.p {...fadeUp(0.2)} className="mb-5 text-base text-muted md:text-lg">
            Hi, I'm <span className="text-fg">{profile.name}</span> —
          </motion.p>

          <h1 className="text-[clamp(2.8rem,7.4vw,6.6rem)] font-medium leading-[0.98] tracking-[-0.045em]">
            <SplitWords text={'I build *clean,* scalable\nweb *experiences.*'} trigger={ready} delay={0.25} stagger={0.07} />
          </h1>

          <motion.div {...fadeUp(0.75)} className="mt-8 flex items-center gap-3 text-sm text-muted md:text-base">
            <span className="h-px w-8 bg-white/25" />
            <RotatingRole />
          </motion.div>

          <motion.p {...fadeUp(0.85)} className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Full stack developer working across React, Laravel and PHP — from database design to pixel-perfect
            interfaces — with a soft spot for deep learning.
          </motion.p>

          <motion.div {...fadeUp(0.95)} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId('work');
                }}
                className="group flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-ink transition-shadow duration-300 hover:shadow-[0_0_40px_-6px_rgba(198,244,50,0.7)]"
              >
                View my work
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-medium transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.04]"
              >
                GitHub
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <Portrait ready={ready} />
        </div>
      </motion.div>

      <motion.div
        {...fadeUp(1.2)}
        className="container-x absolute inset-x-0 bottom-6 z-10 flex items-center justify-between text-xs text-muted"
      >
        <span className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" /> {profile.location}
        </span>
        <button
          type="button"
          onClick={() => scrollToId('about')}
          className="flex items-center gap-3 uppercase tracking-[0.25em]"
        >
          Scroll
          <span className="relative h-8 w-[18px] rounded-full border border-white/25">
            <motion.span
              className="absolute left-1/2 top-1.5 -ml-[2px] h-1.5 w-1 rounded-full bg-accent"
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </button>
      </motion.div>
    </section>
  );
}

function RotatingRole() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex h-6 overflow-hidden md:h-7">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          className="block text-fg"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const chips = [
  { label: 'React', className: '-left-4 top-[12%] md:-left-10', delay: 0 },
  { label: 'Laravel', className: '-right-3 top-[38%] md:-right-8', delay: 0.6 },
  { label: 'TensorFlow', className: '-left-6 bottom-[22%] md:-left-14', delay: 1.2 },
];

function Portrait({ ready }: { ready: boolean }) {
  const rotateX = useSpring(0, { stiffness: 140, damping: 16 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 16 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[400px]"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 60 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1.3, ease, delay: 0.45 }}
    >
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={reset}
        data-cursor
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10 bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
      >
        <motion.img
          src="/maheen.jpg"
          alt={`Portrait of ${profile.name}`}
          className="h-full w-full object-cover object-[50%_20%]"
          initial={{ scale: 1.3, clipPath: 'inset(100% 0 0 0)' }}
          animate={ready ? { scale: 1, clipPath: 'inset(0% 0 0 0)' } : {}}
          transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6" style={{ transform: 'translateZ(40px)' }}>
          <div>
            <p className="font-serif text-3xl italic">{profile.first}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{profile.role}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink/70 px-3 py-2 text-right backdrop-blur">
            <p className="text-lg font-semibold leading-none text-accent">8.09</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">CGPA</p>
          </div>
        </div>
      </motion.div>

      {chips.map((chip) => (
        <motion.div
          key={chip.label}
          className={`absolute ${chip.className}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease, delay: 1.3 + chip.delay / 2 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: chip.delay }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-ink/70 px-4 py-2 text-xs font-medium shadow-xl backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {chip.label}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
