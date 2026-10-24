import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { journey } from '../data';
import { ease } from '../lib/scroll';
import { SectionLabel, SplitWords } from './ui/Reveal';

export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="journey" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionLabel index="02" label="Journey" />
        <h2 className="mb-16 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.045em] md:mb-24">
          <SplitWords text="Where I've been *learning* and building." />
        </h2>

        <div ref={ref} className="relative">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-white/10 md:left-[calc(240px+7px)]" />
          <motion.div
            className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent md:left-[calc(240px+7px)]"
            style={{ scaleY: line }}
          />

          <ol className="flex flex-col gap-16 md:gap-24">
            {journey.map((item) => (
              <motion.li
                key={item.title}
                className="relative grid grid-cols-1 gap-3 pl-10 md:grid-cols-[240px_1fr] md:gap-0 md:pl-0"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-120px' }}
              >
                <motion.p
                  className="font-mono text-xs uppercase tracking-widest text-muted md:pt-2 md:text-sm"
                  variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } } }}
                >
                  {item.period}
                </motion.p>

                <motion.span
                  className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 border-accent bg-ink md:left-[240px] md:top-2"
                  variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { type: 'spring', stiffness: 300, damping: 18, delay: 0.1 } } }}
                />

                <motion.div
                  className="md:pl-14"
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.15 } } }}
                >
                  <h3 className="text-2xl font-medium tracking-tight md:text-4xl">{item.title}</h3>
                  <p className="mt-2 font-serif text-xl italic text-accent md:text-2xl">{item.org}</p>
                  {item.description && (
                    <p className="mt-5 max-w-2xl leading-relaxed text-muted md:text-lg">{item.description}</p>
                  )}
                  {item.points && (
                    <ul className="mt-5 flex max-w-2xl flex-col gap-3">
                      {item.points.map((point) => (
                        <li key={point} className="flex gap-3 leading-relaxed text-muted md:text-lg">
                          <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
