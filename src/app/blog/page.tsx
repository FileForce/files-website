import type { Metadata } from "next";
import { PostGrid, TagFilter } from "@/components/blog";
import { Footer } from "@/components/download";
import { Nav } from "@/components/nav";
import { allPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Files",
  description: "Releases, features and tips for Files, the file explorer for macOS, Windows and Linux.",
};

export default async function BlogPage() {
  const posts = await allPosts();
  return (
    <>
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[500px]" />
      <Nav />
      <main className="relative flex-1 px-4 pt-12 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Blog</h1>
          <p className="mt-4 text-lg text-muted">What&apos;s new in Files: releases, features as they ship, and tips that are easy to miss.</p>
        </div>
        <div className="mt-10">
          <TagFilter />
        </div>
        <div className="mt-12">
          <PostGrid posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
