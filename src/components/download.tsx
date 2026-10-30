"use client";

import { motion } from "motion/react";
import { Apple, Download as DownloadIcon } from "lucide-react";
import Image from "next/image";
import { GithubMark, LATEST_RELEASE, REPOSITORY } from "./primitives";

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
        <p className="mx-auto mt-4 max-w-xl text-muted">Free for macOS 13+ on Apple silicon, and Linux.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={LATEST_RELEASE} className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-medium text-white transition hover:brightness-110">
            <Apple className="size-4" /> Download for macOS
          </a>
          <a href={LATEST_RELEASE} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 font-medium transition hover:bg-elevated">
            <DownloadIcon className="size-4" /> Linux AppImage
          </a>
        </div>
        <details className="mx-auto mt-8 max-w-xl text-left text-sm text-muted">
          <summary className="cursor-pointer text-center text-faint hover:text-muted">macOS says it cannot verify the app?</summary>
          <p className="mt-3">
            Files is not notarized by Apple yet. Open it once, then go to <b className="text-foreground">System Settings → Privacy &amp; Security</b> and click{" "}
            <b className="text-foreground">Open Anyway</b>. Or in Terminal:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-background p-3 font-mono text-xs">xattr -dr com.apple.quarantine /Applications/Files.app</pre>
        </details>
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
