import Link from "next/link";
import { formatDate, type Post, type Tag, TAG_LABELS, TAGS } from "@/lib/blog";

const TAG_COLORS: Record<Tag, string> = {
  release: "border-green/30 bg-green/10 text-green",
  feature: "border-accent/30 bg-accent/10 text-accent",
  tip: "border-amber/30 bg-amber/10 text-amber",
};

export function TagBadge({ tag, link = true }: { tag: Tag; link?: boolean }) {
  const className = `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[tag]}`;
  return link ? (
    <Link href={`/blog/tag/${tag}`} className={`${className} hover:brightness-125`}>{TAG_LABELS[tag].label}</Link>
  ) : (
    <span className={className}>{TAG_LABELS[tag].label}</span>
  );
}

/** All, Releases, Features, Tips: the current one filled. */
export function TagFilter({ current }: { current?: Tag }) {
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${active ? "border-accent bg-accent/15 text-accent" : "border-border text-muted hover:border-accent/50 hover:text-foreground"}`;
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Link href="/blog" className={chip(!current)}>All</Link>
      {TAGS.map((tag) => (
        <Link key={tag} href={`/blog/tag/${tag}`} className={chip(current === tag)}>{TAG_LABELS[tag].plural}</Link>
      ))}
    </div>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface/80 transition-colors hover:border-accent/40">
      {post.cover && (
        <div className="flex h-48 items-center justify-center overflow-hidden border-b border-border bg-gradient-to-b from-elevated to-surface p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.coverAlt ?? ""} className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-faint">
          <TagBadge tag={post.tag} link={false} />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h2 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{post.summary}</p>
      </div>
    </article>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-muted">Nothing here yet.</p>;
  }
  return (
    <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
