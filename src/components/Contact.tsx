import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { profile } from '../data';
import { ease } from '../lib/scroll';
import { Reveal, SectionLabel, SplitWords } from './ui/Reveal';
import { Magnetic } from './ui/Magnetic';

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: 'Phone', value: profile.phone, href: profile.phoneHref, icon: Phone },
  { label: 'GitHub', value: profile.githubHandle, href: profile.github, icon: Github },
  { label: 'LinkedIn', value: 'Maheen Mohamed Ismayeel', href: profile.linkedin, icon: Linkedin },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div className="absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 animate-drift rounded-full bg-accent/[0.07] blur-[160px]" />

      <div className="container-x relative">
        <SectionLabel index="05" label="Contact" />

        <h2 className="text-[clamp(3rem,10vw,9.5rem)] font-medium leading-[0.95] tracking-[-0.055em]">
          <SplitWords text={"Let's build\nsomething *great.*"} stagger={0.08} />
        </h2>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 md:mt-20 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              I'm currently a full stack developer at Pricol, and always happy to talk about interesting projects and collaborations. Have an idea? My inbox
              is always open — I'll get back to you quickly.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={copyEmail}
                className="group flex items-center gap-3 rounded-full border border-white/15 py-2 pl-5 pr-2 text-sm transition-colors duration-300 hover:border-white/40"
              >
                <span className="font-mono">{profile.email}</span>
                <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white/[0.06]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'done' : 'copy'}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    className="text-sm text-accent"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Copied to clipboard
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          <motion.div
            className="justify-self-start lg:justify-self-end"
            initial={{ scale: 0, rotate: -30 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.2 }}
          >
            <Magnetic strength={0.45}>
              <a
                href={`mailto:${profile.email}`}
                className="group relative grid h-40 w-40 place-items-center overflow-hidden rounded-full bg-accent text-ink md:h-52 md:w-52"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-fg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative flex flex-col items-center gap-1 text-base font-semibold md:text-lg">
                  <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45" />
                  Say hello
                </span>
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <ul className="mt-20 grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 md:mt-28">
          {channels.map((c, i) => (
            <motion.li
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="border-b border-white/10 sm:odd:border-r sm:odd:pr-8 sm:even:pl-8"
            >
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 py-6"
              >
                <span className="flex items-center gap-4">
                  <c.icon className="h-4 w-4 text-muted transition-colors duration-300 group-hover:text-accent" />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.2em] text-muted">{c.label}</span>
                    <span className="link-underline mt-1 inline-block text-base md:text-lg">{c.value}</span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-fg" />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
