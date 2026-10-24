import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, GitBranch, Monitor, Server, type LucideIcon } from 'lucide-react';
import { skillGroups, type SkillGroup } from '../data';
import { ease } from '../lib/scroll';
import { SectionLabel, SplitWords } from './ui/Reveal';

const icons: Record<SkillGroup['key'], LucideIcon> = {
  frontend: Monitor,
  backend: Server,
  data: Database,
  ai: Brain,
  workflow: GitBranch,
};

export function Skills() {
  return (
    <section id="skills" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionLabel index="03" label="Toolkit" />
        <div className="mb-16 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <h2 className="max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.045em]">
            <SplitWords text="The *tools* I reach for, end to end." />
          </h2>
          <p className="max-w-sm text-muted">
            A full stack toolkit — from interfaces and APIs to databases and neural networks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {skillGroups.map((group, i) => (
            <SkillCard key={group.key} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = icons[group.key];
  const wide = group.key === 'workflow';

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      className={`spotlight group overflow-hidden rounded-3xl border border-white/[0.08] bg-surface/60 p-7 transition-colors duration-500 hover:border-white/20 md:p-8 ${group.span}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: (index % 3) * 0.1 } },
      }}
    >
      <div className={`flex h-full gap-8 ${wide ? 'flex-col md:flex-row md:items-center md:justify-between' : 'flex-col justify-between'}`}>
        <div>
          <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 group-hover:-rotate-6 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-ink">
            <Icon className="h-5 w-5" strokeWidth={1.6} />
          </div>
          <h3 className="text-2xl font-medium tracking-tight md:text-3xl">{group.title}</h3>
          <p className="mt-3 max-w-md leading-relaxed text-muted">{group.description}</p>
        </div>

        <motion.ul
          className="flex flex-wrap gap-2"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
        >
          {group.items.map((item) => (
            <motion.li
              key={item}
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 10 },
                show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
              }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-fg/90 transition-colors duration-300 hover:border-accent/50 hover:text-accent"
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}
