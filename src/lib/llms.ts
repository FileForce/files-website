import { allPosts } from "@/lib/blog";
import { FACTS, FAQS, NAME, REPOSITORY, SITE, TAGLINE } from "@/lib/site";

/** llms.txt (https://llmstxt.org): what Files is, for language models. */
export async function llms(full: boolean): Promise<string> {
  "use cache";
  const posts = await allPosts();
  const lines = [
    `# ${NAME}`,
    "",
    `> ${TAGLINE}`,
    "",
    "## Facts",
    ...FACTS.map((fact) => `- ${fact}`),
    "",
    "## Pages",
    `- [Download](${SITE}/downloads): macOS (.dmg), Windows (.msi), Linux (.AppImage)`,
    `- [FAQ](${SITE}/faq): common questions, answered`,
    `- [Blog](${SITE}/blog): releases, features, tips`,
    `- [Source and issues](${REPOSITORY})`,
    "",
    "## Posts",
    ...posts.map((post) => `- [${post.title}](${SITE}/blog/${post.slug}) (${post.date}, ${post.tag}): ${post.summary}`),
  ];
  if (full) {
    lines.push("", "## FAQ", ...FAQS.flatMap((faq) => ["", `### ${faq.question}`, faq.answer]));
  }
  return lines.join("\n") + "\n";
}
