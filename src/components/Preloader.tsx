import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks, profile } from '../data';

/**
 * Intro sequence:
 *  1. a copper ball drops in and bounces under a soft spotlight,
 *  2. chrome letters tumble out of it and spell MAHEEN, the ball hopping along,
 *  3. the letters flip over into PORTFOLIO, the ball settling as a full stop,
 *  4. the title slides down as your cut-out photo rises into focus behind it,
 *     and the header appears.
 * Click or press any key to skip.
 */

const NAME = 'MAHEEN';
const TITLE = 'PORTFOLIO';
const PHOTO = '/maheen-cutout.webp';

const T = {
  letters: 750, // first letter pops out of the ball
  letterGap: 170,
  morph: 2550, // name flips to PORTFOLIO
  portrait: 3450, // photo + header
  exit: 6900, // hand over to the site
};

type Phase = 'ball' | 'name' | 'morph' | 'portrait';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>(() => (reducedMotion() ? 'portrait' : 'ball'));
  const [count, setCount] = useState(() => (reducedMotion() ? NAME.length : 0));

  /* ---------- timeline ---------- */
  useEffect(() => {
    if (reducedMotion()) {
      const id = window.setTimeout(onDone, 1200);
      return () => clearTimeout(id);
    }
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    at(T.letters - 60, () => setPhase('name'));
    for (let i = 1; i <= NAME.length; i++) at(T.letters + (i - 1) * T.letterGap, () => setCount(i));
    at(T.morph, () => setPhase('morph'));
    at(T.portrait, () => setPhase('portrait'));
    at(T.exit, onDone);

    let skipped = false;
    const skip = () => {
      if (skipped) return;
      skipped = true;
      timers.forEach(clearTimeout);
      onDone();
    };
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [onDone]);

  // Warm the cache so the photo is ready by the time it's revealed.
  useEffect(() => {
    const img = new Image();
    img.src = PHOTO;
  }, []);

  const word = phase === 'ball' || phase === 'name' ? NAME.slice(0, count) : TITLE;
  const flipped = phase === 'morph' || phase === 'portrait';
  const settled = phase === 'portrait';

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden bg-ink"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(28% 32% at 50% 50%, rgba(242,237,228,0.13), rgba(242,237,228,0.03) 55%, transparent 75%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: settled ? 0 : 1 }}
        transition={{ duration: settled ? 0.8 : 1.2 }}
      />
      {/* your photo, rising into focus behind the title */}
      <div className="pointer-events-none absolute inset-x-0 top-[5vh] flex justify-center">
        <motion.img
          src={PHOTO}
          alt=""
          aria-hidden
          draggable={false}
          className="h-[86vh] max-w-none select-none object-contain"
          style={{
            aspectRatio: '1 / 1',
            maxHeight: '96vw',
            WebkitMaskImage: 'linear-gradient(180deg, #000 55%, transparent 92%)',
            maskImage: 'linear-gradient(180deg, #000 55%, transparent 92%)',
          }}
          initial={{ opacity: 0, y: 60, scale: 1.06, filter: 'blur(14px) brightness(0.6)' }}
          animate={settled ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px) brightness(1)' } : {}}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </div>

      {/* header slides in with the portrait */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 text-xs md:p-8"
        initial={{ opacity: 0, y: -12 }}
        animate={settled ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      >
        <span className="font-semibold uppercase tracking-[0.18em] text-fg">{profile.name}</span>
        <span className="hidden gap-7 uppercase tracking-[0.18em] text-muted md:flex">
          {navLinks.map((l) => (
            <span key={l.id}>{l.label}</span>
          ))}
        </span>
      </motion.div>

      {/* title */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4"
        animate={settled ? { y: '26vh' } : { y: 0 }}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.h1
          aria-label={flipped ? TITLE : NAME}
          className="flex items-baseline font-bold leading-none tracking-[-0.05em] text-[clamp(3rem,14.5vw,12.5rem)]"
          style={{ perspective: 800 }}
          animate={settled ? { scale: 0.82 } : { scale: 1 }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {word.split('').map((ch, i) => (
              <motion.span
                key={`${flipped ? 't' : 'n'}-${i}-${ch}`}
                layout
                aria-hidden
                className="chrome-text inline-block origin-bottom"
                initial={
                  flipped
                    ? { rotateX: -95, opacity: 0, y: '0.1em' }
                    : { x: '0.7em', y: '-0.55em', rotate: 75, scale: 0.35, opacity: 0 }
                }
                animate={{ rotateX: 0, x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotateX: 95, opacity: 0, y: '-0.1em', transition: { duration: 0.32, delay: i * 0.045 } }}
                transition={
                  flipped
                    ? { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 + i * 0.05 }
                    : { type: 'spring', stiffness: 260, damping: 17 }
                }
              >
                {ch}
              </motion.span>
            ))}
          </AnimatePresence>

          {/* the ball — becomes the full stop */}
          <motion.span layout className="relative ml-[0.04em] inline-block" transition={{ layout: { type: 'spring', stiffness: 300, damping: 26 } }}>
            <motion.span
              key={phase === 'ball' ? 'drop' : `hop-${count}`}
              className="block h-[0.17em] w-[0.17em] rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #FFE2C2, #E4A36A 45%, #8A5229 100%)',
                boxShadow: '0 0 0.35em rgba(228,163,106,0.55)',
              }}
              initial={phase === 'ball' ? { y: '-48vh' } : false}
              animate={
                phase === 'ball'
                  ? { y: ['-48vh', '0vh', '-14vh', '0vh', '-4vh', '0vh'] }
                  : phase === 'name' && count < NAME.length
                    ? { y: ['0em', '-0.5em', '0em'] }
                    : { y: '0em' }
              }
              transition={
                phase === 'ball'
                  ? { duration: 0.7, times: [0, 0.38, 0.6, 0.78, 0.9, 1], ease: ['easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn'] }
                  : { duration: T.letterGap / 1000, ease: 'easeOut' }
              }
            />
          </motion.span>
        </motion.h1>

        <motion.div
          className="mt-3 flex w-full max-w-[min(90vw,1000px)] items-center justify-between text-sm md:mt-5 md:text-lg"
          initial={{ opacity: 0, y: 8 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
        >
          <span className="text-fg">
            Software <span className="font-serif italic text-accent">Developer</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-xs">{profile.location}</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-0 right-0 p-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70 md:p-8"
        animate={{ opacity: settled ? 0 : 1 }}
      >
        <span className="hidden sm:inline">Click to skip</span>
        <span className="sm:hidden">Tap to skip</span>
      </motion.div>
    </motion.div>
  );
}
