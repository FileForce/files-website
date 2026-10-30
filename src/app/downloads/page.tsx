import type { Metadata } from "next";
import { DownloadsList } from "@/components/downloads-list";
import { Footer } from "@/components/download";
import { MotionProvider } from "@/components/motion-provider";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Download Files — macOS, Windows, Linux",
  description: "Download Files for macOS, Windows or Linux. Every version, with release notes and install steps.",
};

export default function DownloadsPage() {
  return (
    <MotionProvider>
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[500px]" />
      <Nav />
      <main className="relative flex-1 px-4 pt-12 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Download Files</h1>
          <p className="mt-4 text-lg text-muted">Free for macOS, Windows and Linux. Pick your system — or any earlier version.</p>
        </div>
        <div className="mt-12">
          <DownloadsList />
        </div>
      </main>
      <Footer />
    </MotionProvider>
  );
}
