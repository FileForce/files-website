import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://fileforce.vercel.app"),
  title: "file FORCE — the free file manager for macOS, Windows and Linux",
  description:
    "file FORCE (Files) is a free, fast file manager for macOS, Windows and Linux: a Finder and Explorer alternative with Git, SSH, Quick Look, Quick Actions, mail and music built in. Rust and GPU-drawn.",
  applicationName: "file FORCE",
  keywords: ["file manager", "Finder alternative", "Explorer alternative", "macOS", "Windows", "Linux", "Rust", "Git", "SSH", "Quick Actions"],
  alternates: { canonical: "/", types: { "application/rss+xml": "/blog/rss.xml" } },
  openGraph: {
    title: "file FORCE — the free file manager for macOS, Windows and Linux",
    description: "Fast, free, extensible. Git, SSH, Quick Look and Quick Actions built in.",
    type: "website",
    siteName: "file FORCE",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
