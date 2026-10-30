"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { PLATFORMS, PlatformIcon } from "./platform";
import { GithubMark, REPOSITORY } from "./primitives";

export function Download() {
  return (
    <section id="download" className="relative mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-b from-accent/20 to-surface px-6 py-16 text-center"
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="mx-auto w-fit">
          <Image src="/logo.svg" alt="Files" width={96} height={96} />
        </motion.div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">Get Files</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">Free on all three systems.</p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {PLATFORMS.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <Link
                href={`/downloads#${item.id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-accent"
              >
                <PlatformIcon platform={item.id} className="size-7 text-muted transition group-hover:text-accent" />
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-faint">{item.requirement}</span>
                <span className="mt-1 text-xs text-accent">{item.file}</span>
              </Link>
            </motion.div>
          ))}
        </div>
        <Link href="/downloads" className="mt-6 inline-block text-sm text-muted hover:text-foreground">All versions and release notes →</Link>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-faint sm:flex-row sm:px-6">
        <p className="flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={20} height={20} /> © 2026 FileForce
        </p>
        <div className="flex items-center gap-5">
          <a href={`${REPOSITORY}/blob/main/LICENSE.md`} className="hover:text-muted">License</a>
          <a href={`${REPOSITORY}/releases`} className="hover:text-muted">Releases</a>
          <a href={REPOSITORY} className="flex items-center gap-1.5 hover:text-muted">
            <GithubMark /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
