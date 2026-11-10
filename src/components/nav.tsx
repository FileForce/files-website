"use client";

import Image from "next/image";
import Link from "next/link";
import { GithubMark, REPOSITORY } from "./primitives";

export function Nav() {
  return (
    <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/" className="flex items-center gap-2.5 font-semibold">
        <Image src="/logo.svg" alt="" width={32} height={32} priority />
        Files
      </Link>
      <div className="flex items-center gap-1 text-sm text-muted sm:gap-6">
        <Link href="/#ease" className="hidden hover:text-foreground md:inline">Fast</Link>
        <Link href="/#access" className="hidden hover:text-foreground md:inline">Accessible</Link>
        <Link href="/#extensions" className="hidden hover:text-foreground md:inline">Extensions</Link>
        <Link href="/#marketplace" className="hidden hover:text-foreground md:inline">Marketplace</Link>
        <Link href="/blog" className="hover:text-foreground">Blog</Link>
        <Link href="/faq" className="hidden hover:text-foreground sm:inline">FAQ</Link>
        <Link href="/downloads" className="rounded-lg bg-accent/15 px-3 py-1.5 text-accent hover:bg-accent/25">Download</Link>
        <a href={REPOSITORY} className="flex items-center rounded-lg px-2 py-1.5 hover:text-foreground" aria-label="GitHub">
          <GithubMark />
        </a>
      </div>
    </nav>
  );
}
