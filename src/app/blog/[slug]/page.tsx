import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TagBadge } from "@/components/blog";
import { Footer } from "@/components/download";
import { Nav } from "@/components/nav";
import { REPOSITORY } from "@/components/primitives";
import { JsonLd } from "@/components/json-ld";
import { allPosts, formatDate, loadPost } from "@/lib/blog";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  return (await allPosts()).map((post) => ({ slug: post.slug }));
}


export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadPost(slug);
  if (!loaded) return {};
  const { post } = loaded;
  return {
    title: `${post.title} — Files blog`,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: "article", publishedTime: post.date, images: shareImage(post) },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary, images: shareImage(post) },
  };
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <>
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[500px]" />
      <Nav />
      <main className="relative flex-1 px-4 pt-10 pb-24 sm:px-6">
        <article className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-muted hover:text-foreground">← All posts</Link>
          <Suspense fallback={<PostSkeleton />}>
            <PostBody params={params} />
          </Suspense>
        </article>
      </main>
      <Footer />
    </>
  );
}

function PostSkeleton() {
  return (
    <div className="mt-6 animate-pulse" aria-hidden="true">
      <div className="h-5 w-40 rounded-full bg-elevated" />
      <div className="mt-5 h-12 w-4/5 rounded-xl bg-elevated" />
      <div className="mt-4 h-6 w-3/5 rounded-lg bg-surface" />
      <div className="mt-10 h-80 rounded-3xl border border-border bg-surface" />
    </div>
  );
}

async function PostBody({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const loaded = await loadPost(slug);
  if (!loaded) notFound();
  const { post, Content } = loaded;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          dateModified: post.date,
          image: post.cover ? `${SITE}${pngCover(post.cover)}` : undefined,
          url: `${SITE}/blog/${post.slug}`,
          mainEntityOfPage: `${SITE}/blog/${post.slug}`,
          author: { "@type": "Organization", name: "FileForce", url: SITE },
          publisher: { "@type": "Organization", name: "FileForce", logo: { "@type": "ImageObject", url: `${SITE}/logo.svg` } },
          about: { "@type": "SoftwareApplication", name: "file FORCE", url: SITE },
        }}
      />
      <header className="mt-6">
        <div className="flex items-center gap-3 text-sm text-faint">
          <TagBadge tag={post.tag} />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted">{post.summary}</p>
      </header>
      {post.cover && (
        <div className="mt-10 flex items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-elevated to-surface p-6 sm:p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.coverAlt ?? ""} className="max-h-[420px] max-w-full rounded-xl object-contain" />
        </div>
      )}
      <div className="mt-10">
        <Content />
      </div>
      {post.tag === "release" && post.version && (
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/downloads" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:brightness-110">Download {post.version}</Link>
          <a href={`${REPOSITORY}/releases/tag/v${post.version}`} className="rounded-xl border border-border px-5 py-2.5 text-sm text-muted hover:text-foreground">View on GitHub</a>
        </div>
      )}
    </>
  );
}

/** Social networks show no SVG: the cover's PNG twin (made by scripts/social-icons.py). */
function pngCover(cover: string) {
  return cover.replace(/\.svg$/, ".png");
}

function shareImage(post: { cover?: string; coverAlt?: string; title: string }) {
  return post.cover ? [{ url: pngCover(post.cover), width: 1200, height: 630, alt: post.coverAlt ?? post.title }] : undefined;
}
