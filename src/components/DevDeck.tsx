import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { profile } from '../data';
import { ease, scrollToId } from '../lib/scroll';
import { playKeystroke } from '../lib/keySound';

/**
 * A small piece of "hardware": a terminal screen on a metal chassis with
 * clickable keycaps. Each key types a command on the screen, then navigates.
 * Letter shortcuts work from the keyboard while the hero is on screen.
 */

type Key = {
  id: string;
  cap: string;
  label: string;
  command: string;
  reply: string;
  top: string; // keycap face
  side: string; // keycap skirt
  ink: string; // legend colour
  wide?: boolean;
  action: () => void;
};

const KEYS: Key[] = [
  {
    id: 'a', cap: 'A', label: 'About', command: 'cat about.md', reply: 'opening /about …',
    top: '#EFE7DA', side: '#B3A895', ink: '#1B1814', action: () => scrollToId('about'),
  },
  {
    id: 'j', cap: 'J', label: 'Journey', command: 'git log --oneline', reply: 'opening /journey …',
    top: '#93B09E', side: '#5E7A69', ink: '#0E1712', action: () => scrollToId('journey'),
  },
  {
    id: 's', cap: 'S', label: 'Skills', command: 'ls ./skills', reply: 'opening /skills …',
    top: '#8A9CAE', side: '#56677A', ink: '#0C131B', action: () => scrollToId('skills'),
  },
  {
    id: 'w', cap: 'W', label: 'Work', command: 'open ./projects', reply: 'opening /work …',
    top: '#C99A90', side: '#8E625A', ink: '#23110D', action: () => scrollToId('work'),
  },
  {
    id: 'g', cap: 'G', label: 'GitHub', command: `gh browse ${profile.githubHandle}`, reply: 'launching github.com …',
    top: '#2E2A26', side: '#15130F', ink: '#F2EDE4',
    action: () => window.open(profile.github, '_blank', 'noopener,noreferrer'),
  },
  {
    id: 'l', cap: 'L', label: 'LinkedIn', command: 'open linkedin', reply: 'launching linkedin.com …',
    top: '#403A34', side: '#1E1B17', ink: '#F2EDE4',
    action: () => window.open(profile.linkedin, '_blank', 'noopener,noreferrer'),
  },
  {
    id: 'enter', cap: '↵', label: 'Hire me', command: 'sudo hire maheen', reply: 'permission granted ✓ — say hello',
    top: '#E4A36A', side: '#A0683A', ink: '#1E1006', wide: true, action: () => scrollToId('contact'),
  },
];

type Line = { kind: 'cmd' | 'out'; text: string };

const BOOT: Line[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: profile.name },
  { kind: 'cmd', text: 'cat role.txt' },
  { kind: 'out', text: 'Software Developer @ Pricol' },
  { kind: 'cmd', text: 'echo $STACK' },
  { kind: 'out', text: 'React · Laravel · PHP · TensorFlow' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function DevDeck({ ready }: { ready: boolean }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState('');
  const [pressed, setPressed] = useState<string | null>(null);
  const [time, setTime] = useState('');
  const busy = useRef(false);
  const queue = useRef(Promise.resolve());
  const rootRef = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 18 });

  // Types a command character by character, then prints its reply.
  const run = useCallback((cmd: string, reply?: string, speed = 38) => {
    queue.current = queue.current.then(async () => {
      busy.current = true;
      for (let i = 1; i <= cmd.length; i++) {
        setTyping(cmd.slice(0, i));
        await sleep(speed + Math.random() * 30);
      }
      await sleep(120);
      setTyping('');
      setLines((prev) => [...prev, { kind: 'cmd' as const, text: cmd }].slice(-7));
      if (reply) {
        await sleep(140);
        setLines((prev) => [...prev, { kind: 'out' as const, text: reply }].slice(-7));
      }
      busy.current = false;
    });
    return queue.current;
  }, []);

  // Boot sequence once the intro hands over.
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      await sleep(700);
      for (let i = 0; i < BOOT.length; i += 2) {
        if (cancelled) return;
        await run(BOOT[i].text, BOOT[i + 1].text, 30);
        await sleep(220);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, run]);

  // Live local clock in the screen header.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: profile.timezone,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const press = useCallback(
    (key: Key) => {
      setPressed(key.id);
      playKeystroke(!!key.wide);
      setTimeout(() => setPressed((p) => (p === key.id ? null : p)), 160);
      if (busy.current) return; // ignore mashing while a command is typing
      run(key.command, key.reply, 30).then(() => sleep(250)).then(key.action);
    },
    [run],
  );

  // Keyboard shortcuts while the deck is visible.
  useEffect(() => {
    if (!ready) return;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.2 });
    if (rootRef.current) io.observe(rootRef.current);

    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [contenteditable="true"]')) return;
      const id = e.key === 'Enter' ? 'enter' : e.key.toLowerCase();
      // Let Enter keep activating focused links/buttons.
      if (id === 'enter' && el !== document.body) return;
      const key = KEYS.find((k) => k.id === id);
      if (!key) return;
      e.preventDefault();
      press(key);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      io.disconnect();
    };
  }, [ready, press]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={rootRef}
      className="relative mx-auto w-full max-w-[520px]"
      style={{ perspective: 1400 }}
      initial={{ opacity: 0, y: 70, rotateX: 25 }}
      animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 1.3, ease, delay: 0.35 }}
    >
      {/* floor glow */}
      <div className="absolute -bottom-10 left-1/2 h-24 w-[85%] -translate-x-1/2 rounded-[100%] bg-accent/20 blur-3xl" />

      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative rounded-[30px] p-3 sm:p-4"
      >
        {/* chassis */}
        <div
          className="absolute inset-0 rounded-[30px] border border-white/10"
          style={{
            background:
              'linear-gradient(160deg, #35312D 0%, #1E1B18 38%, #151311 70%, #25211E 100%)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -2px 0 rgba(0,0,0,0.6), 0 50px 120px -40px rgba(0,0,0,0.95), 0 0 0 1px rgba(0,0,0,0.6)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.07]"
          style={{ background: 'repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 3px)' }}
        />
        {['left-3 top-3', 'right-3 top-3', 'left-3 bottom-3', 'right-3 bottom-3'].map((pos) => (
          <span key={pos} className={`absolute ${pos} hidden h-2 w-2 rounded-full sm:block`}
            style={{ background: 'radial-gradient(circle at 35% 35%, #7a6f62, #1a1714)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.5)' }} />
        ))}

        {/* status strip */}
        <div className="relative mb-3 flex items-center justify-between px-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted sm:px-3">
          <span className="flex items-center gap-3">
            <Led on color="#E4A36A" /> PWR
            <Led on blink color="#93B09E" /> NET
          </span>
          <span>MDK-01 · dev deck</span>
        </div>

        {/* screen */}
        <div
          className="relative overflow-hidden rounded-[18px] p-[3px]"
          style={{ background: 'linear-gradient(180deg, #0b0a09, #2a2622)', transform: 'translateZ(20px)' }}
        >
          <div className="relative h-[200px] overflow-hidden rounded-[15px] bg-[#0A0907] sm:h-[220px]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2 font-mono text-[10px] text-muted">
              <span className="flex items-center gap-2">
                <img src="/maheen.jpg" alt="" className="h-4 w-4 rounded-full object-cover object-[50%_20%] grayscale" />
                maheen@deck:~
              </span>
              <span className="tabular-nums">{time} IST</span>
            </div>
            <div className="flex h-[calc(100%-29px)] flex-col justify-end px-4 pb-3 font-mono text-[11.5px] leading-[1.65] sm:text-[12.5px]" aria-live="polite">
              {lines.map((line, i) => (
                <div key={i} className={line.kind === 'cmd' ? 'truncate text-fg/90' : 'truncate pl-4 text-accent'}>
                  {line.kind === 'cmd' ? <><span className="text-accent/70">$ </span>{line.text}</> : <>→ {line.text}</>}
                </div>
              ))}
              <div className="truncate text-fg/90">
                <span className="text-accent/70">$ </span>
                {typing}
                <span className="ml-px inline-block h-[1.05em] w-[0.55em] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-accent/90" />
              </div>
            </div>
            {/* scanlines + glass */}
            <div className="pointer-events-none absolute inset-0 opacity-30"
              style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 3px)' }} />
            <div className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(228,163,106,0.07), transparent 60%), linear-gradient(115deg, rgba(255,255,255,0.06) 0%, transparent 30%)' }} />
          </div>
        </div>

        {/* keybed */}
        <div
          className="relative mt-3 rounded-[18px] p-2.5 sm:p-3"
          style={{ background: 'linear-gradient(180deg, #0e0c0a, #1a1714)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.06)' }}
        >
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {KEYS.map((key) => (
              <Keycap key={key.id} k={key} down={pressed === key.id} onPress={() => press(key)} />
            ))}
          </div>
        </div>

        <div className="relative mt-3 flex items-center justify-between px-2 sm:px-3">
          <div className="grid grid-cols-[repeat(12,4px)] gap-[3px] opacity-60">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-black shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
            ))}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
            <span className="hidden sm:inline">press a key — </span>A J S W G L ↵
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Keycap({ k, down, onPress }: { k: Key; down: boolean; onPress: () => void }) {
  const depth = down ? 1 : 6;
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`${k.label} (shortcut ${k.cap === '↵' ? 'Enter' : k.cap})`}
      className={`group relative h-[64px] select-none rounded-[12px] text-left outline-none transition-transform duration-100 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14120F] sm:h-[74px] ${
        k.wide ? 'col-span-2' : ''
      }`}
      style={{
        background: k.side,
        transform: `translateY(${6 - depth}px)`,
        boxShadow: `0 ${depth}px 0 ${k.side}, 0 ${depth + 6}px 14px -4px rgba(0,0,0,0.7)`,
      }}
    >
      <span
        className="absolute inset-x-[5px] top-[3px] bottom-[7px] flex flex-col justify-between rounded-[9px] p-2 transition-[filter] duration-200 group-hover:brightness-110 sm:p-2.5"
        style={{
          background: `linear-gradient(180deg, ${k.top} 0%, ${k.top} 55%, color-mix(in srgb, ${k.top} 82%, #000) 100%)`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 3px rgba(0,0,0,0.15)',
          color: k.ink,
        }}
      >
        <span className="text-lg font-semibold leading-none sm:text-xl">{k.cap}</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] opacity-75 sm:text-[10px]">{k.label}</span>
      </span>
    </button>
  );
}

function Led({ color, on, blink }: { color: string; on?: boolean; blink?: boolean }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${blink ? 'animate-[blink_1.4s_steps(1)_infinite]' : ''}`}
      style={{ background: on ? color : '#333', boxShadow: on ? `0 0 8px ${color}` : 'none' }}
    />
  );
}
