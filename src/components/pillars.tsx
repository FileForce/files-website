"use client";

import { motion, useReducedMotion } from "motion/react";
import { Contrast, Eye, FileImage, FileText, Folder, MousePointer2, Search, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, Grid, Key, Section } from "./primitives";

/** Loops `count` steps every `ms`, frozen at the first one with Reduce motion. */
function useStep(count: number, ms: number) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setStep((step) => (step + 1) % count), ms);
    return () => clearInterval(timer);
  }, [count, ms, reduced]);
  return step;
}

// ------------------------------------------------------------ fast

function InstantSearch() {
  const step = useStep(3, 1600);
  const results = [["vacation", "beach.jpg", "sunset.heic"], ["invoice", "invoice-oct.pdf", "invoice-nov.pdf"], ["main", "main.rs", "main.tsx"]][step];
  return (
    <div className="w-64">
      <div className="flex items-center gap-2 rounded-xl border border-accent/50 bg-background px-3 py-2 text-sm shadow-[0_0_0_4px_rgba(124,116,255,0.12)]">
        <Search className="size-4 text-accent" />
        <motion.span key={results[0]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono">
          {results[0]}
        </motion.span>
        <span className="ml-auto text-[10px] text-faint">12 ms</span>
      </div>
      {results.slice(1).map((name, index) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * index }}
          className="mt-2 flex items-center gap-2 rounded-lg bg-elevated px-3 py-2 text-xs text-muted"
        >
          <FileText className="size-3.5" /> {name}
        </motion.div>
      ))}
    </div>
  );
}

function Shortcuts() {
  const step = useStep(4, 900);
  const combos = [["⌘", "1"], ["⌘", "F"], ["Space"], ["⌘", "⌫"]];
  const labels = ["List view", "Search", "Quick Look", "Move to Trash"];
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {combos[step].map((key) => (
          <motion.div key={`${step}-${key}`} initial={{ y: -6, scale: 0.9 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
            <Key>{key}</Key>
          </motion.div>
        ))}
      </div>
      <motion.p key={labels[step]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted">
        {labels[step]}
      </motion.p>
    </div>
  );
}

function QuickLook() {
  const step = useStep(2, 1800);
  return (
    <div className="relative">
      <div className="flex w-56 items-center gap-2 rounded-lg bg-elevated px-3 py-2 text-xs">
        <FileImage className="size-4 text-pink" /> launch-poster.png
        <span className="ml-auto"><Key>Space</Key></span>
      </div>
      <motion.div
        animate={step === 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="absolute -top-28 left-6 flex h-28 w-44 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-accent to-pink shadow-2xl"
      >
        <Eye className="size-8 text-white/80" />
      </motion.div>
    </div>
  );
}

// ------------------------------------------------------------ accessible

function Toggles() {
  const step = useStep(3, 1200);
  const rows = [
    ["Reduce motion", step >= 1],
    ["High contrast", step >= 2],
    ["Text contrast", true],
  ] as const;
  return (
    <div className="w-60 space-y-3">
      {rows.map(([label, on]) => (
        <div key={label} className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2 text-sm">
          {label}
          <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${on ? "bg-accent" : "bg-border"}`}>
            <motion.span layout className={`size-4 rounded-full bg-white ${on ? "ml-auto" : ""}`} transition={{ type: "spring", stiffness: 600, damping: 30 }} />
          </span>
        </div>
      ))}
    </div>
  );
}

function TextSize() {
  const step = useStep(4, 1100);
  const sizes = [13, 16, 20, 16];
  return (
    <div className="w-60">
      <motion.p animate={{ fontSize: sizes[step] }} className="h-16 font-medium leading-tight">
        Readable at any size
      </motion.p>
      <div className="mt-3 flex items-center gap-3">
        <Type className="size-3 text-faint" />
        <div className="relative h-1.5 flex-1 rounded-full bg-border">
          <motion.div animate={{ width: `${(step === 3 ? 1 : step) * 33 + 10}%` }} className="h-full rounded-full bg-accent" />
        </div>
        <Type className="size-5 text-faint" />
      </div>
    </div>
  );
}

function Outline() {
  const step = useStep(2, 1600);
  return (
    <div className="relative flex h-32 w-60 items-center justify-center overflow-hidden rounded-xl bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><rect width=%2212%22 height=%2212%22 fill=%22%23ffffff%22/><rect x=%2212%22 y=%2212%22 width=%2212%22 height=%2212%22 fill=%22%23ffffff%22/><rect x=%2212%22 width=%2212%22 height=%2212%22 fill=%22%23222%22/><rect y=%2212%22 width=%2212%22 height=%2212%22 fill=%22%23222%22/></svg>')]">
      <motion.span
        animate={{
          textShadow: step === 1 ? "0 0 1px #fff, 0 0 1px #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff" : "none",
        }}
        className="text-xl font-semibold text-black"
      >
        Quarterly-report.pdf
      </motion.span>
      <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white">
        <Contrast className="size-3" /> {step === 1 ? "Text contrast on" : "off"}
      </span>
    </div>
  );
}

// ------------------------------------------------------------ convenient

function DualPane() {
  const step = useStep(3, 1300);
  const moved = step >= 2;
  return (
    <div className="relative flex w-72 gap-2">
      {["~/Downloads", "~/Projects"].map((name, pane) => (
        <div key={name} className={`flex-1 rounded-lg border p-2 text-[11px] ${pane === 1 && step >= 1 ? "border-accent bg-accent/10" : "border-border bg-elevated"}`}>
          <p className="mb-2 font-mono text-faint">{name}</p>
          {pane === 0 && !moved && <div className="flex items-center gap-1 rounded bg-background/60 px-1.5 py-1"><FileText className="size-3" />brief.md</div>}
          {pane === 1 && moved && (
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1 rounded bg-background/60 px-1.5 py-1">
              <FileText className="size-3" />brief.md
            </motion.div>
          )}
          <div className="mt-1 flex items-center gap-1 rounded px-1.5 py-1 text-muted"><Folder className="size-3" />{pane === 0 ? "images" : "src"}</div>
        </div>
      ))}
      <motion.div
        animate={step === 1 ? { x: 150, y: 10, opacity: 1 } : { x: 30, y: 24, opacity: step === 0 ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="pointer-events-none absolute top-0 left-0"
      >
        <MousePointer2 className="size-5 fill-white text-white drop-shadow" />
      </motion.div>
    </div>
  );
}

function ContextMenu() {
  const items = [
    ["Open", "text-foreground"],
    ["Git ▸", "text-orange"],
    ["Fork folder", "text-[#a78bfa]"],
    ["Open in Agents ▸", "text-amber"],
    ["Delete…", "text-red"],
  ] as const;
  return (
    <motion.div variants={{ show: { transition: { staggerChildren: 0.12 } } }} initial="hidden" whileInView="show" className="w-52 rounded-xl border border-border bg-elevated p-1.5 shadow-2xl">
      {items.map(([label, color]) => (
        <motion.div key={label} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }} className={`rounded-md px-3 py-1.5 text-sm hover:bg-accent/15 ${color}`}>
          {label}
        </motion.div>
      ))}
    </motion.div>
  );
}

function Notifications() {
  const step = useStep(3, 1500);
  const toasts = ["Git · Fetch done", "Trash emptied", "Copied 24 items"];
  return (
    <div className="relative h-32 w-64">
      {toasts.slice(0, step + 1).map((text, index) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1 - (step - index) * 0.25, x: 0, y: (step - index) * 38 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="absolute inset-x-0 top-0 flex items-center gap-2 rounded-2xl border border-border bg-elevated px-3 py-2.5 text-sm shadow-xl"
        >
          <span className="size-2 rounded-full bg-green" /> {text}
          <span className="ml-auto text-[10px] text-faint">now</span>
        </motion.div>
      ))}
    </div>
  );
}

export function Pillars() {
  return (
    <>
      <Section id="ease" eyebrow="Fast" title={<>Light on your hands</>} lead="Everything is a keystroke away and answers before you finish typing. Search by name, kind, size, date, tag or permissions.">
        <Grid>
          <Card title="Instant search" text="Fuzzy names plus filters: kind:image size:>10mb modified:<7d tag:work mode:644.">
            <InstantSearch />
          </Card>
          <Card title="Keyboard first" text="Every command has a shortcut, and you can rebind any of them — sequences too, like ⌘N F F.">
            <Shortcuts />
          </Card>
          <Card title="Quick Look" text="Space previews images, PDFs, code, archives and whole folders without opening anything.">
            <QuickLook />
          </Card>
        </Grid>
      </Section>
      <Section id="access" eyebrow="Accessible" title={<>Made for every pair of eyes</>} lead="Follows your macOS accessibility settings, or overrides them: motion, contrast, transparency and text size, plus VoiceOver labels.">
        <Grid>
          <Card title="Your settings, respected" text="Reduce motion, high contrast and reduce transparency follow the system — or set them yourself.">
            <Toggles />
          </Card>
          <Card title="Text that scales" text="Seven text sizes, from compact to large, applied to the whole window at once.">
            <TextSize />
          </Card>
          <Card title="Text contrast" text="An outline around names keeps them readable over see-through panels and busy backgrounds.">
            <Outline />
          </Card>
        </Grid>
      </Section>
      <Section id="comfort" eyebrow="Convenient" title={<>Works the way you do</>} lead="Two folders side by side, menus that tell you what everything is, and notifications that never get in the way.">
        <Grid>
          <Card title="Dual pane" text="Drag between panes, copy or move — even to another window, a server over SSH, or Finder.">
            <DualPane />
          </Card>
          <Card title="Menus with meaning" text="Each extension has its color, so you know where an action comes from at a glance.">
            <ContextMenu />
          </Card>
          <Card title="Quiet notifications" text="Banners like macOS for things that finish in the background; the bell keeps them for later.">
            <Notifications />
          </Card>
        </Grid>
      </Section>
    </>
  );
}
