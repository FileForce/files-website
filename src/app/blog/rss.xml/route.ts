import { allPosts } from "@/lib/blog";
import { NAME, SITE, TAGLINE } from "@/lib/site";

function escape(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function feed(): Promise<string> {
  "use cache";
  const posts = await allPosts();
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid>${SITE}/blog/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
      <category>${post.tag}</category>
      <description>${escape(post.summary)}</description>
    </item>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(NAME)} blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escape(TAGLINE)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}

export async function GET() {
  return new Response(await feed(), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
