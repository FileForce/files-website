"use client";

import { motion, useReducedMotion } from "motion/react";
import { FileArchive, FileText, GitBranch, KeyRound, LockKeyhole, ShieldCheck, SquareTerminal } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, Grid, Section } from "./primitives";

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

function GitDemo() {
  const step = useStep(4, 1000);
  const commits = ["Add dark theme", "Fix SSH sign-in", "Agents usage", "Release 0.2"];
  return (
    <div className="w-64 space-y-2">
      {commits.slice(0, step + 1).reverse().map((subject, index) => (
        <motion.div key={subject} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-xs">
          <span className={`size-2.5 rounded-full ${index === 0 ? "bg-orange ring-4 ring-orange/20" : "bg-border"}`} />
          <span className="font-mono text-faint">{(0x3f2a + index * 997).toString(16)}</span>
          <span className="truncate">{subject}</span>
          {index === 0 && <span className="ml-auto rounded bg-orange/20 px-1.5 text-[10px] text-orange">main</span>}
        </motion.div>
      ))}
    </div>
  );
}

function SshDemo() {
  const step = useStep(4, 1100);
  const lines = ["$ ssh me@build-box", "Tailscale: approve in your browser…", "✓ connected · /home/me", "projects  logs  deploy.sh"];
  return (
    <div className="w-72 rounded-xl border border-border bg-background p-3 font-mono text-[11px]">
      {lines.slice(0, step + 1).map((line, index) => (
        <motion.p key={line} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={index === 2 ? "text-green" : index === 1 ? "text-amber" : "text-muted"}>
          {line}
        </motion.p>
      ))}
    </div>
  );
}

function AgentsDemo() {
  const reply = "Found it: the build uses debug assertions. Switching the profile…";
  const reduced = useReducedMotion();
  const [length, setLength] = useState(reduced ? reply.length : 0);
  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(() => setLength(length >= reply.length + 30 ? 0 : length + 1), 35);
    return () => clearTimeout(timer);
  }, [length, reduced]);
  return (
    <div className="w-72 space-y-2 text-xs">
      <div className="ml-auto w-fit rounded-2xl bg-accent/25 px-3 py-2">Why is CI slow?</div>
      <div className="w-fit max-w-[90%] rounded-2xl border border-border bg-elevated px-3 py-2">
        {reply.slice(0, length)}
        {length < reply.length && <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-amber align-middle" />}
      </div>
      <div className="flex items-center gap-2 pt-1 text-[10px] text-faint">
        <span className="rounded bg-amber/20 px-1 text-amber">Claude</span>
        <span className="rounded bg-green/20 px-1 text-green">Codex</span>
        <span className="rounded bg-pink/20 px-1 text-pink">OpenCode</span>
        <span className="ml-auto">in 12.4K · out 1.1K</span>
      </div>
    </div>
  );
}

function ArchiveDemo() {
  const step = useStep(3, 1100);
  return (
    <div className="flex items-center gap-6">
      <motion.div animate={{ scale: step === 1 ? 0.85 : 1, rotate: step === 1 ? -6 : 0 }}>
        <FileArchive className="size-12 text-amber" />
      </motion.div>
      <div className="space-y-1.5">
        {["docs/", "src/", "README.md"].map((name, index) => (
          <motion.div
            key={name}
            animate={step === 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ delay: step === 2 ? index * 0.12 : 0 }}
            className="flex items-center gap-1.5 rounded bg-elevated px-2 py-1 text-xs"
          >
            <FileText className="size-3" /> {name}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ForksDemo() {
  const step = useStep(3, 1300);
  return (
    <svg viewBox="0 0 240 120" className="h-36 w-64">
      <path d="M20 60 H220" stroke="var(--border)" strokeWidth="4" strokeLinecap="round" />
      <motion.path
        d="M70 60 C 100 60, 100 25, 130 25 H 180 C 200 25, 200 60, 220 60"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: step === 0 ? 0.2 : step === 1 ? 0.7 : 1 }}
        transition={{ duration: 1 }}
      />
      <circle cx="70" cy="60" r="7" fill="#a78bfa" />
      <text x="128" y="16" fill="var(--muted)" fontSize="10" fontFamily="var(--font-geist-mono)">
        fork · try anything
      </text>
      <motion.circle cx="220" cy="60" r="7" fill="var(--green)" animate={{ opacity: step === 2 ? 1 : 0.2 }} />
      <text x="168" y="88" fill="var(--muted)" fontSize="10" fontFamily="var(--font-geist-mono)">
        {step === 2 ? "applied ✓" : "…"}
      </text>
    </svg>
  );
}

function TerminalDemo() {
  const step = useStep(2, 1400);
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div animate={{ y: step === 1 ? -4 : 0 }} className="rounded-xl border border-border bg-elevated px-3 py-2 text-xs">
        Open in Terminal
      </motion.div>
      <motion.div animate={{ opacity: step === 1 ? 1 : 0.3, scale: step === 1 ? 1 : 0.95 }} className="flex items-center gap-2 rounded-xl bg-background px-3 py-2 font-mono text-[11px] text-green">
        <SquareTerminal className="size-4" /> ~/Projects/files ❯
      </motion.div>
    </div>
  );
}

function ProDemo() {
  const step = useStep(3, 1300);
  return (
    <div className="flex items-center gap-5">
      <motion.div animate={step >= 1 ? { x: 0, opacity: 1 } : { x: -40, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
        <KeyRound className="size-8 text-amber" />
      </motion.div>
      <motion.div animate={{ rotate: step === 2 ? [0, -12, 0] : 0 }} className="relative">
        <LockKeyhole className={`size-12 transition-colors ${step === 2 ? "text-green" : "text-faint"}`} />
      </motion.div>
      <motion.div animate={{ opacity: step === 2 ? 1 : 0, y: step === 2 ? 0 : 8 }} className="rounded-lg bg-green/15 px-2 py-1 text-xs text-green">
        Kubernetes unlocked
      </motion.div>
    </div>
  );
}

export function Extensions() {
  return (
    <Section
      id="extensions"
      eyebrow="Extensions"
      title={<>Your tools, where your files are</>}
      lead="Turn on what you use. Every extension asks for the permissions it needs — network, Keychain, background work — and you can take any of them back."
    >
      <Grid>
        <Card title="Git" text="Commit just the files you tick, browse the log, diff, pull, push, switch branches and stash — from the context menu.">
          <GitDemo />
        </Card>
        <Card title="SSH" text="Browse servers with your own ~/.ssh/config, keys and agent. Tailscale sign-in links, passwords in Keychain.">
          <SshDemo />
        </Card>
        <Card title="AI agents" text="Claude Code, Codex and OpenCode sessions in the sidebar: live chats, replies with your model and effort, tokens and limits.">
          <AgentsDemo />
        </Card>
        <Card title="Archives" text="Browse ZIP, TAR and GZ without unpacking; extract with conflict handling; create ZIP, 7z, TAR.GZ.">
          <ArchiveDemo />
        </Card>
        <Card title="Forks" text="Copy-on-write forks of any folder: experiment freely, then apply the changes or throw them away.">
          <ForksDemo />
        </Card>
        <Card title="Terminal" text="Open any folder — or a server folder over SSH — in Terminal, iTerm, Warp or Ghostty.">
          <TerminalDemo />
        </Card>
      </Grid>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-5 grid items-center gap-8 overflow-hidden rounded-3xl border border-amber/30 bg-gradient-to-br from-amber/10 via-surface to-surface p-8 md:grid-cols-2"
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber">Pro extensions</p>
          <h3 className="mt-3 text-2xl font-semibold">Kubernetes, and more on the way</h3>
          <p className="mt-3 text-muted">
            Paid extensions are signed packages unlocked by a license key, checked on your Mac with no account and no server. Everything above stays free.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-faint">
            <ShieldCheck className="size-4 text-green" /> Signed with Ed25519 · nothing loads unless it is genuine
          </p>
        </div>
        <div className="flex justify-center">
          <ProDemo />
        </div>
      </motion.div>
    </Section>
  );
}

export function Developers() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid gap-8 rounded-3xl border border-border bg-surface p-8 md:grid-cols-[1.2fr_1fr]"
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">For developers</p>
          <h3 className="mt-3 text-2xl font-semibold">Build your own extension</h3>
          <p className="mt-3 text-muted">
            A Rust SDK with context-menu items, sidebar sections, permissions, Keychain secrets and a developer console that shows every call your extension makes.
          </p>
        </div>
        <pre className="overflow-x-auto rounded-2xl bg-background p-5 font-mono text-xs leading-relaxed text-muted">
          <code>
            <span className="text-accent">impl</span> Plugin <span className="text-accent">for</span> Kube {"{"}
            {"\n"}  <span className="text-accent">fn</span> run(&amp;self, cmd: &amp;str, ctx: &amp;Context)
            {"\n"}      -&gt; Result&lt;Outcome, String&gt; {"{"}
            {"\n"}    <span className="text-green">{"// your code"}</span>
            {"\n"}  {"}"}
            {"\n"}{"}"}
            {"\n"}files_sdk::export_plugin!(Kube);
          </code>
        </pre>
      </motion.div>
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-faint">
        <GitBranch className="size-4" /> Source on GitHub under FSL-1.1 · becomes MIT after two years
      </p>
    </section>
  );
}
