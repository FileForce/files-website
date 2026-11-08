import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostGrid, TagFilter } from "@/components/blog";
import { Footer } from "@/components/download";
import { Nav } from "@/components/nav";
import { allPosts, type Tag, TAG_LABELS, TAGS } from "@/lib/blog";

export function generateStaticParams() {
  return TAGS.map((tag) => ({ tag }));
}


function isTag(value: string): value is Tag {
  return (TAGS as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  return isTag(tag) ? { title: `${TAG_LABELS[tag].plural} — Files blog`, description: TAG_LABELS[tag].lead } : {};
}

export default function TagPage({ params }: PageProps<"/blog/tag/[tag]">) {
  return (
    <>
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[500px]" />
      <Nav />
      <main className="relative flex-1 px-4 pt-12 pb-24 sm:px-6">
        <Suspense fallback={<TagSkeleton />}>
          <TagBody params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function TagSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse text-center" aria-hidden="true">
      <div className="mx-auto h-4 w-16 rounded-full bg-elevated" />
      <div className="mx-auto mt-4 h-14 w-64 rounded-xl bg-elevated" />
      <div className="mx-auto mt-5 h-6 w-80 rounded-lg bg-surface" />
    </div>
  );
}

async function TagBody({ params }: Pick<PageProps<"/blog/tag/[tag]">, "params">) {
  const { tag } = await params;
  if (!isTag(tag)) notFound();
  const posts = (await allPosts()).filter((post) => post.tag === tag);
  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Blog</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{TAG_LABELS[tag].plural}</h1>
        <p className="mt-4 text-lg text-muted">{TAG_LABELS[tag].lead}</p>
      </div>
      <div className="mt-10">
        <TagFilter current={tag} />
      </div>
      <div className="mt-12">
        <PostGrid posts={posts} />
      </div>
    </>
  );
}
