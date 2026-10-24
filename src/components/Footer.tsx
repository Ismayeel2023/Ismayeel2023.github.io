import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { profile } from '../data';
import { scrollToId } from '../lib/scroll';

const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-IN', { timeZone: profile.timezone, hour: '2-digit', minute: '2-digit', hour12: true });

export function Footer() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative border-t border-white/[0.08]">
      <div className="container-x overflow-hidden pt-16">
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center text-[17vw] font-medium leading-[0.8] tracking-[-0.07em] text-white/[0.04] md:text-[15vw]"
        >
          maheen<span className="font-serif italic">.</span>
        </p>
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-6 py-8 text-sm text-muted md:flex-row">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {time} in {profile.location.split(',')[0]}
        </p>
        <button
          type="button"
          onClick={() => scrollToId('top')}
          className="group flex items-center gap-2 transition-colors duration-300 hover:text-fg"
        >
          Back to top
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:text-accent">
            <ArrowUp className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </footer>
  );
}
