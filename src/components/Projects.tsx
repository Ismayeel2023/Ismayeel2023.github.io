import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { featuredProjects, otherProjects, profile, type Project } from '../data';
import { ease } from '../lib/scroll';
import { SectionLabel, SplitWords } from './ui/Reveal';
import { Magnetic } from './ui/Magnetic';

export function Projects() {
  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionLabel index="04" label="Selected work" />
        <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <h2 className="max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.045em]">
            <SplitWords text="Things I've *built* recently." />
          </h2>
          <p className="max-w-sm text-muted">
            A few projects from my GitHub — web apps, automation and deep learning.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:gap-12">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <div className="mt-24 md:mt-32">
          <h3 className="mb-6 text-sm uppercase tracking-[0.25em] text-muted">More on GitHub</h3>
          <ul className="border-t border-white/10">
            {otherProjects.map((p, i) => (
              <motion.li
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                className="border-b border-white/10"
              >
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center gap-4 overflow-hidden py-6 md:gap-8 md:py-8"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-white/[0.03] transition-transform duration-500 ease-out group-hover:scale-y-100" />
                  <span className="relative w-12 font-mono text-xs text-muted md:w-20">{p.year}</span>
                  <span className="relative flex-1 text-2xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">
                    {p.title}
                  </span>
                  <span className="relative hidden text-sm text-muted sm:block">{p.tech}</span>
                  <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>

          <div className="mt-14 flex justify-center">
            <Magnetic>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-full border border-white/15 px-7 py-4 text-sm font-medium transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.04]"
              >
                <Github className="h-4 w-4" />
                See everything on GitHub
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 ? 3 : -3, index % 2 ? -3 : 3]);
  const flip = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease }}
      className="group grid grid-cols-1 gap-6 rounded-[28px] border border-white/[0.08] bg-surface/50 p-3 transition-colors duration-500 hover:border-white/15 md:p-4 lg:grid-cols-2 lg:gap-10"
    >
      <div
        className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] lg:aspect-auto lg:min-h-[440px] ${flip ? 'lg:order-2' : ''}`}
        style={{
          background: `radial-gradient(110% 90% at ${flip ? '100%' : '0%'} 0%, ${project.glow}38, transparent 60%), radial-gradient(80% 80% at ${flip ? '0%' : '100%'} 100%, ${project.glow}14, transparent 60%), #0D0D10`,
        }}
      >
        <div className="bg-grid absolute inset-0 opacity-60" />
        <motion.div style={{ y, rotate }} className="relative w-[86%] max-w-[480px]">
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            <CodeWindow project={project} />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col justify-between gap-10 p-3 md:p-6">
        <div>
          <div className="mb-8 flex items-center justify-between text-xs text-muted">
            <span className="font-mono">0{index + 1} / 0{featuredProjects.length}</span>
            <span className="uppercase tracking-[0.2em]">{project.year}</span>
          </div>
          <p className="mb-3 text-sm" style={{ color: project.glow }}>
            {project.category}
          </p>
          <h3 className="text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            {project.title}
          </h3>
          <p className="mt-5 max-w-lg leading-relaxed text-muted md:text-lg">{project.description}</p>
        </div>

        <div className="flex flex-col gap-8">
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-fg/80">
                {t}
              </li>
            ))}
          </ul>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="group/link flex w-fit items-center gap-3 text-sm font-medium"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-fg text-ink transition-all duration-500 group-hover/link:rotate-45 group-hover/link:bg-accent">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="link-underline pb-0.5">View source on GitHub</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}

const KEYWORDS = 'const|await|return|for|in|public|function|def|import|from|new|static|if|else';
const TOKEN = new RegExp(`(\\b(?:${KEYWORDS})\\b|"[^"]*"|\\$\\w+|\\b\\d+(?:\\.\\d+)?\\b)`);
const KEYWORD = new RegExp(`^(?:${KEYWORDS})$`);

/** Tiny syntax colouring for the decorative code previews. */
function highlight(line: string, glow: string) {
  if (!line) return ' ';
  return line.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('"')) return <span key={i} className="text-[#E7C887]">{part}</span>;
    if (part.startsWith('$') || /^\d/.test(part)) return <span key={i} className="text-[#F0A3B5]">{part}</span>;
    if (KEYWORD.test(part)) return <span key={i} style={{ color: glow }}>{part}</span>;
    return <span key={i}>{part}</span>;
  });
}

function CodeWindow({ project }: { project: Project }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0E]/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 font-mono text-[11px] text-muted">{project.file}</span>
      </div>
      <motion.pre
        className="overflow-hidden p-4 font-mono text-[10.5px] leading-[1.75] text-fg/85 sm:text-xs md:p-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
      >
        {project.code.map((line, i) => (
          <motion.div
            key={i}
            className="flex whitespace-pre"
            variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
          >
            <span className="mr-4 w-4 select-none text-right text-white/20">{i + 1}</span>
            <code>{highlight(line, project.glow)}</code>
          </motion.div>
        ))}
      </motion.pre>
    </div>
  );
}
