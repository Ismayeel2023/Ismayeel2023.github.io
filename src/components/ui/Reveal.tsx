import { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ease } from '../../lib/scroll';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ children, delay = 0, y = 28, className = '' }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

type SplitWordsProps = {
  /** Words wrapped in *asterisks* render in the italic serif accent; "\n" forces a line break. */
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** When provided, animation is driven by this flag instead of scrolling into view. */
  trigger?: boolean;
};

const word: Variants = {
  hidden: { y: '110%', rotate: 4 },
  show: { y: '0%', rotate: 0, transition: { duration: 1.1, ease } },
};

/** Masked word-by-word slide-up reveal for headings. */
export function SplitWords({ text, className = '', delay = 0, stagger = 0.06, trigger }: SplitWordsProps) {
  const tokens = text.replace(/\n/g, ' \n ').split(' ').filter(Boolean);
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const play =
    trigger === undefined
      ? { whileInView: 'show', viewport: { once: true, margin: '-60px' } }
      : { animate: trigger ? 'show' : 'hidden' };

  return (
    <motion.span className={className} variants={container} initial="hidden" {...play}>
      {tokens.map((token, i) => {
        if (token === '\n') return <br key={i} />;
        const emphasis = token.startsWith('*');
        const clean = token.replace(/\*/g, '');
        return (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
              <motion.span
                variants={word}
                className={`inline-block origin-bottom-left ${
                  emphasis ? 'pr-[0.06em] font-serif font-normal italic text-accent' : ''
                }`}
              >
                {clean}
              </motion.span>
            </span>{' '}
          </span>
        );
      })}
    </motion.span>
  );
}

/** Small "01 — About" style label that opens each section. */
export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <motion.div
      className="mb-10 flex items-center gap-4 text-xs text-muted md:mb-14 md:text-sm"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      <motion.span
        className="font-mono text-accent"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}
      >
        {index}
      </motion.span>
      <motion.span
        className="h-px w-12 origin-left bg-white/25"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease, delay: 0.1 } } }}
      />
      <motion.span
        className="uppercase tracking-[0.25em]"
        variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease, delay: 0.3 } } }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
