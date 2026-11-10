import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";

/** The three kinds of post. */
export const TAGS = ["release", "feature", "tip"] as const;
export type Tag = (typeof TAGS)[number];

export const TAG_LABELS: Record<Tag, { label: string; plural: string; lead: string }> = {
  release: { label: "Release", plural: "Releases", lead: "Every version, the same notes as on GitHub." },
  feature: { label: "Feature", plural: "Features", lead: "One feature at a time, as it ships." },
  tip: { label: "Tip", plural: "Tips", lead: "Things Files does that are easy to miss." },
};

/** The frontmatter every post starts with. */
export type Frontmatter = {
  title: string;
  /** ISO date, e.g. 2026-11-07. */
  date: string;
  tag: Tag;
  summary: string;
  /** A picture in /public, shown on the card and at the top of the post. */
  cover?: string;
  coverAlt?: string;
  /** Releases: the version, e.g. 0.1.15. */
  version?: string;
};

export type Post = Frontmatter & { slug: string };

const DIRECTORY = path.join(process.cwd(), "src/content/blog");

type Module = { default: ComponentType; frontmatter: Frontmatter };

export async function loadPost(slug: string): Promise<{ post: Post; Content: ComponentType } | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const loaded: Module = await import(`@/content/blog/${slug}.mdx`);
    return { post: { ...loaded.frontmatter, slug }, Content: loaded.default };
  } catch {
    return null;
  }
}

/** "0.1.24" → [0, 1, 24], to compare versions as numbers. */
function versionParts(version?: string): number[] {
  return (version ?? "").split(".").map((part) => Number.parseInt(part, 10) || 0);
}

/**
 * Newest first. Several posts share a day (releases go out often): the
 * newest release leads, the others follow by version, then the rest.
 */
export function newestFirst(a: Post, b: Post): number {
  if (a.date !== b.date) return b.date.localeCompare(a.date);
  if (a.version && b.version) {
    const [left, right] = [versionParts(a.version), versionParts(b.version)];
    for (let index = 0; index < Math.max(left.length, right.length); index++) {
      const difference = (right[index] ?? 0) - (left[index] ?? 0);
      if (difference !== 0) return difference;
    }
    return 0;
  }
  if (a.version) return -1;
  if (b.version) return 1;
  return a.title.localeCompare(b.title);
}

/** Every post, newest first. */
export async function allPosts(): Promise<Post[]> {
  // Read at build time: the posts are files in the repository.
  "use cache";
  const files = (await readdir(DIRECTORY)).filter((file) => file.endsWith(".mdx"));
  const posts = await Promise.all(files.map((file) => loadPost(file.replace(/\.mdx$/, ""))));
  return posts
    .filter((loaded) => loaded !== null)
    .map((loaded) => ({ ...loaded.post }))
    .sort(newestFirst);
}

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
