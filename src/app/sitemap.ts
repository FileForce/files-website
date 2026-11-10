import type { MetadataRoute } from "next";
import { allPosts, TAGS } from "@/lib/blog";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await allPosts();
  const newest = posts[0]?.date ?? new Date().toISOString().slice(0, 10);
  return [
    { url: SITE, lastModified: newest, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/downloads`, lastModified: newest, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/faq`, lastModified: newest, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/blog`, lastModified: newest, changeFrequency: "daily", priority: 0.8 },
    ...TAGS.map((tag) => ({ url: `${SITE}/blog/tag/${tag}`, lastModified: newest, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...posts.map((post) => ({ url: `${SITE}/blog/${post.slug}`, lastModified: post.date, changeFrequency: "monthly" as const, priority: post.tag === "release" ? 0.6 : 0.7 })),
  ];
}
