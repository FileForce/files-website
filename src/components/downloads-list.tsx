"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Download, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PLATFORMS, type Platform, PlatformIcon, platformName, useHashPlatform, usePlatform } from "./platform";
import { GithubMark, REPOSITORY } from "./primitives";

type Asset = { name: string; browser_download_url: string; size: number };
type Release = { tag_name: string; name: string; body: string; published_at: string; html_url: string; prerelease: boolean; assets: Asset[] };

const API = "https://api.github.com/repos/FileForce/files/releases?per_page=30";

/** Which of a release's files is the installer for `platform`. */
function assetFor(release: Release, platform: Platform): Asset | undefined {
  const ending = PLATFORMS.find((item) => item.id === platform)!.file.toLowerCase();
  return release.assets.find((asset) => asset.name.toLowerCase().endsWith(ending));
}

function megabytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function date(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const INSTALL: Record<Platform, { title: string; steps: string[] }> = {
  macos: {
    title: "Install on macOS",
    steps: [
      "Open the .dmg and drag Files into Applications.",
      "First launch: macOS may say it cannot verify the developer. Open System Settings → Privacy & Security and click Open Anyway.",
      "Or in Terminal: xattr -dr com.apple.quarantine /Applications/Files.app",
    ],
  },
  windows: {
    title: "Install on Windows",
    steps: [
      "Run the .msi and follow the installer; Files appears in the Start menu.",
      "If SmartScreen says it protected your PC, click More info → Run anyway.",
      "New versions install over the old one; uninstall from Settings → Apps.",
    ],
  },
  linux: {
    title: "Run on Linux",
    steps: ["Make it executable: chmod +x Files-*.AppImage", "Run it: ./Files-*.AppImage", "Older distributions may need libfuse2 for AppImages."],
  },
};

export function DownloadsList() {
  const detected = usePlatform();
  // /downloads#windows opens that tab; a click on a tab wins.
  const fromUrl = useHashPlatform();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const chosen = platform ?? fromUrl ?? detected;
  const [releases, setReleases] = useState<Release[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch(API, { headers: { Accept: "application/vnd.github+json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
        return (await response.json()) as Release[];
      })
      .then(setReleases)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const stable = releases?.filter((release) => !release.prerelease) ?? [];
  const latest = stable[0] ?? releases?.[0];
  const asset = latest && assetFor(latest, chosen);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Platform tabs */}
      <div className="mx-auto flex w-fit gap-1 rounded-2xl border border-border bg-surface p-1">
        {PLATFORMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setPlatform(item.id)}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${chosen === item.id ? "text-white" : "text-muted hover:text-foreground"}`}
          >
            {chosen === item.id && <motion.span layoutId="platform-tab" className="absolute inset-0 rounded-xl bg-accent" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="relative flex items-center gap-2">
              <PlatformIcon platform={item.id} /> {item.name}
            </span>
          </button>
        ))}
      </div>

      {/* Latest for the chosen platform */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chosen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-8 grid gap-6 rounded-3xl border border-border bg-surface p-8 md:grid-cols-[1.1fr_1fr]"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <PlatformIcon platform={chosen} className="size-6" />
              </span>
              <div>
                <p className="text-xl font-semibold">Files for {platformName(chosen)}</p>
                <p className="text-sm text-faint">{PLATFORMS.find((item) => item.id === chosen)!.requirement}</p>
              </div>
            </div>
            <div className="mt-6">
              {releases === null && !error && (
                <p className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="size-4 animate-spin" /> Looking for the latest release…
                </p>
              )}
              {error && (
                <p className="text-sm text-muted">
                  Could not reach GitHub ({error}).{" "}
                  <a className="text-accent underline" href={`${REPOSITORY}/releases`}>
                    Open the releases page
                  </a>
                </p>
              )}
              {releases && !latest && (
                <p className="text-sm text-muted">
                  No release yet — the first one is on its way.{" "}
                  <a className="text-accent underline" href={REPOSITORY}>
                    Watch the repository
                  </a>{" "}
                  to hear about it.
                </p>
              )}
              {latest && asset && (
                <a
                  href={asset.browser_download_url}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-medium text-white shadow-[0_10px_40px_-10px_rgba(124,116,255,0.9)] transition hover:brightness-110"
                >
                  <Download className="size-4" /> Download {latest.tag_name} · {megabytes(asset.size)}
                </a>
              )}
              {latest && !asset && (
                <p className="text-sm text-muted">
                  {latest.tag_name} has no {platformName(chosen)} build.{" "}
                  <a className="text-accent underline" href={latest.html_url}>
                    See its files
                  </a>
                </p>
              )}
              {latest && <p className="mt-3 text-xs text-faint">Released {date(latest.published_at)} · free · signed updates inside the app</p>}
            </div>
          </div>
          <div className="rounded-2xl bg-elevated p-5">
            <p className="font-medium">{INSTALL[chosen].title}</p>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              {INSTALL[chosen].steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] text-accent">{index + 1}</span>
                  <span className={step.includes("xattr") || step.startsWith("Make it") || step.startsWith("Run it") ? "font-mono text-xs leading-5" : ""}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Every version */}
      {releases && releases.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold">All versions</h2>
          <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {releases.map((release) => {
              const expanded = open === release.tag_name;
              return (
                <div key={release.tag_name}>
                  <button onClick={() => setOpen(expanded ? null : release.tag_name)} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-elevated">
                    <span className="font-mono font-medium">{release.tag_name}</span>
                    {release === latest && <span className="rounded-full bg-green/15 px-2 py-0.5 text-[11px] text-green">latest</span>}
                    {release.prerelease && <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] text-amber">beta</span>}
                    <span className="text-sm text-faint">{date(release.published_at)}</span>
                    <span className="ml-auto flex gap-2">
                      {PLATFORMS.map((item) => {
                        const file = assetFor(release, item.id);
                        return file ? (
                          <a
                            key={item.id}
                            href={file.browser_download_url}
                            onClick={(event) => event.stopPropagation()}
                            title={`${item.name} · ${megabytes(file.size)}`}
                            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted hover:border-accent hover:text-accent"
                          >
                            <PlatformIcon platform={item.id} />
                          </a>
                        ) : null;
                      })}
                    </span>
                    <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
                      <ChevronDown className="size-4 text-faint" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5 text-sm text-muted">
                          <pre className="font-sans whitespace-pre-wrap">{release.body?.trim() || "No release notes."}</pre>
                          <a href={release.html_url} className="mt-3 inline-flex items-center gap-1.5 text-accent hover:underline">
                            <GithubMark className="size-3.5" /> Release on GitHub <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
