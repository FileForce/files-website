import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Every crawler welcome, AI search engines named so none holds back. */
export default function robots(): MetadataRoute.Robots {
  const agents = ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot"];
  return {
    rules: agents.map((userAgent) => ({ userAgent, allow: "/", disallow: "/api/" })),
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
