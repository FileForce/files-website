"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Apple, Download, FileArchive, FileCode2, FileImage, FileText, Folder, Search, Terminal } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GithubMark, LATEST_RELEASE, REPOSITORY } from "./primitives";

type Row = { name: string; kind: "folder" | "image" | "code" | "text" | "archive"; size: string; modified: string; tags?: string[] };

const ROWS: Row[] = [
  { name: "Projects", kind: "folder", size: "4.2 GB", modified: "Today" },
  { name: "launch-poster.png", kind: "image", size: "18.4 MB", modified: "Today", tags: ["work"] },
  { name: "main.rs", kind: "code", size: "24 KB", modified: "Today" },
  { name: "holiday-2026.heic", kind: "image", size: "12.1 MB", modified: "Yesterday" },
  { name: "release-notes.md", kind: "text", size: "6 KB", modified: "Mon" },
  { name: "dataset.tar.gz", kind: "archive", size: "1.3 GB", modified: "Oct 12" },
  { name: "icon-draft.png", kind: "image", size: "2.4 MB", modified: "Oct 9" },
];

/** What the demo types, and which rows each query keeps. */
const QUERIES: { text: string; keep: (row: Row) => boolean }[] = [
  { text: "kind:image size:>10mb", keep: (row) => row.kind === "image" && row.size.endsWith("MB") && parseFloat(row.size) > 10 },
  { text: "tag:work", keep: (row) => row.tags?.includes("work") ?? false },
  { text: "modified:today", keep: (row) => row.modified === "Today" },
];

const ICONS = {
  folder: <Folder className="size-4 text-accent" />,
  image: <FileImage className="size-4 text-pink" />,
  code: <FileCode2 className="size-4 text-green" />,
  text: <FileText className="size-4 text-muted" />,
  archive: <FileArchive className="size-4 text-amber" />,
};

/** Types a query, filters the list, pauses, clears, then the next one. */
function useTypedQuery(reduced: boolean | null) {
  const [query, setQuery] = useState(0);
  const [typed, setTyped] = useState(reduced ? QUERIES[0].text : "");
  useEffect(() => {
    if (reduced) return;
    const target = QUERIES[query].text;
    if (typed.length < target.length) {
      const timer = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 70);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setTyped("");
      setQuery((query + 1) % QUERIES.length);
    }, 2600);
    return () => clearTimeout(timer);
  }, [typed, query, reduced]);
  const done = typed === QUERIES[query].text;
  return { typed, rows: done ? ROWS.filter(QUERIES[query].keep) : ROWS };
}

function AppWindow() {
  const reduced = useReducedMotion();
  const { typed, rows } = useTypedQuery(reduced);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_40px_120px_-30px_rgba(124,116,255,0.45)]">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-3 rounded-full bg-red/80" />
        <span className="size-3 rounded-full bg-amber/80" />
        <span className="size-3 rounded-full bg-green/80" />
        <div className="ml-4 flex flex-1 items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-muted">
          <Search className="size-3.5" />
          <span className="text-foreground">{typed}</span>
          <motion.span
            className="-ml-1 h-3.5 w-px bg-accent"
            animate={reduced ? undefined : { opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>
      </div>
      <div className="flex">
        {/* sidebar */}
        <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-border p-3 text-xs text-muted sm:flex">
          <p className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-faint">FAVORITES</p>
          {["Home", "Documents", "Downloads", "Pictures"].map((name, index) => (
            <div key={name} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${index === 0 ? "bg-accent/15 text-foreground" : ""}`}>
              <Folder className="size-3.5" /> {name}
            </div>
          ))}
          <p className="px-2 pt-3 pb-1 text-[10px] font-semibold tracking-wider text-faint">AGENTS</p>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <span className="flex size-4 items-center justify-center rounded bg-amber text-[9px] font-bold text-background">C</span>
            Fix the build
            <span className="ml-auto size-1.5 rounded-full bg-green" />
          </div>
          <p className="px-2 pt-3 pb-1 text-[10px] font-semibold tracking-wider text-faint">CONNECTED</p>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <Terminal className="size-3.5" /> me@build-box
          </div>
        </div>
        {/* list */}
        <div className="min-h-[300px] flex-1 p-2 text-sm">
          <div className="grid grid-cols-[1fr_90px_80px] px-3 py-2 text-[10px] font-semibold tracking-wider text-faint">
            <span>NAME</span>
            <span>MODIFIED</span>
            <span className="text-right">SIZE</span>
          </div>
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <motion.div
                key={row.name}
                layout={!reduced}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-[1fr_90px_80px] items-center rounded-lg px-3 py-2 hover:bg-elevated"
              >
                <span className="flex items-center gap-2 truncate">
                  {ICONS[row.kind]}
                  {row.name}
                  {row.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-accent/20 px-1.5 text-[10px] text-accent">
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="text-xs text-muted">{row.modified}</span>
                <span className="text-right text-xs text-muted">{row.size}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-faint">
        <span className="size-1.5 rounded-full bg-green" /> Ready · {rows.length} items
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[700px]" />
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <a href="#" className="flex items-center gap-2.5 font-semibold">
          <Image src="/logo.svg" alt="" width={32} height={32} priority />
          Files
        </a>
        <div className="flex items-center gap-1 text-sm text-muted sm:gap-6">
          <a href="#ease" className="hidden hover:text-foreground sm:inline">Fast</a>
          <a href="#access" className="hidden hover:text-foreground sm:inline">Accessible</a>
          <a href="#comfort" className="hidden hover:text-foreground sm:inline">Convenient</a>
          <a href="#extensions" className="hidden hover:text-foreground sm:inline">Extensions</a>
          <a href={REPOSITORY} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:text-foreground" aria-label="GitHub">
            <GithubMark />
          </a>
        </div>
      </nav>
      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-24 text-center sm:px-6 sm:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs text-muted"
        >
          <span className="size-1.5 rounded-full bg-green" /> Free for macOS and Linux · open source
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-7xl"
        >
          The file explorer that <span className="text-gradient">keeps up with you</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted"
        >
          Instant search, keyboard everything, and the tools you reach for every day — Git, SSH and AI agents — right where your files are.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={LATEST_RELEASE}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-medium text-white shadow-[0_10px_40px_-10px_rgba(124,116,255,0.9)] transition hover:brightness-110"
          >
            <Apple className="size-4" /> Download for macOS
          </a>
          <a href={LATEST_RELEASE} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 font-medium transition hover:bg-elevated">
            <Download className="size-4" /> Linux AppImage
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-4xl text-left"
        >
          <AppWindow />
        </motion.div>
      </div>
    </header>
  );
}
