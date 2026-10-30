"use client";

import { Apple, Terminal } from "lucide-react";
import { useSyncExternalStore } from "react";

export type Platform = "macos" | "windows" | "linux";

export const PLATFORMS: { id: Platform; name: string; requirement: string; file: string }[] = [
  { id: "macos", name: "macOS", requirement: "macOS 13 or later · Apple silicon", file: ".dmg" },
  { id: "windows", name: "Windows", requirement: "Windows 10 or 11 · 64-bit", file: ".msi" },
  { id: "linux", name: "Linux", requirement: "x86_64 · any distribution", file: ".AppImage" },
];

/** The Windows logo (lucide has no brand icons). */
export function WindowsMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 5.1 10.4 4v7.2H3V5.1Zm0 13.8L10.4 20v-7.1H3v6Zm8.3 1.2L21 21.5v-8.6h-9.7v7.2Zm0-16.2v7.3H21V2.5l-9.7 1.4Z" />
    </svg>
  );
}

export function PlatformIcon({ platform, className = "size-4" }: { platform: Platform; className?: string }) {
  if (platform === "macos") return <Apple className={className} />;
  if (platform === "windows") return <WindowsMark className={className} />;
  return <Terminal className={className} />;
}

function detect(): Platform {
  const agent = navigator.userAgent.toLowerCase();
  if (agent.includes("windows")) return "windows";
  if (agent.includes("mac os") || agent.includes("macintosh")) return "macos";
  return "linux";
}

const subscribe = () => () => {};

/** The visitor's platform; macOS while rendering on the server. */
export function usePlatform(): Platform {
  return useSyncExternalStore(subscribe, detect, () => "macos");
}

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** The platform named in the URL (`/downloads#windows`), if any. */
export function useHashPlatform(): Platform | null {
  return useSyncExternalStore(
    subscribeHash,
    () => {
      const hash = window.location.hash.slice(1);
      return PLATFORMS.some((item) => item.id === hash) ? (hash as Platform) : null;
    },
    () => null,
  );
}

export function platformName(platform: Platform) {
  return PLATFORMS.find((item) => item.id === platform)?.name ?? "macOS";
}
