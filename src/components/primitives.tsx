"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const LATEST_RELEASE = "https://github.com/FileForce/files/releases/latest";
export const REPOSITORY = "https://github.com/FileForce/files";

/** Fades and lifts children in as they scroll into view, one after another. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.p variants={rise} className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </motion.p>
        <motion.h2 variants={rise} className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </motion.h2>
        <motion.p variants={rise} className="mt-5 text-lg text-muted">
          {lead}
        </motion.p>
      </motion.div>
      <div className="mt-16">{children}</div>
    </section>
  );
}

/** A card that rises in on scroll; its demo plays inside. */
export function Card({ title, text, children, className = "" }: { title: string; text: string; children: ReactNode; className?: string }) {
  return (
    <motion.article
      variants={rise}
      className={`group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface/80 ${className}`}
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden border-b border-border bg-gradient-to-b from-elevated to-surface">
        {children}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
      </div>
    </motion.article>
  );
}

export function Grid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className={`grid gap-5 ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
    >
      {children}
    </motion.div>
  );
}

/** A keyboard key. */
export function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-elevated px-2.5 font-mono text-sm text-foreground shadow-[0_2px_0_0_var(--border)]">
      {children}
    </kbd>
  );
}

/** The GitHub mark (lucide has no brand icons). */
export function GithubMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
