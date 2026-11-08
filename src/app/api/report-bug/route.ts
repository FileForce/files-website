/**
 * Bug reports from the app (Help → Report a Bug…) become GitHub issues,
 * filed with the site's token so reporters need no GitHub account.
 *
 * Needs FILEFORCE_ISSUES_TOKEN in the Vercel project: a fine-grained token
 * with "Issues: read and write" on FileForce/files only.
 */

const REPOSITORY = "FileForce/files";
const MAX_TITLE = 200;
const MAX_BODY = 20_000;
/** Reports per address per hour: enough for people, not for spam. */
const PER_HOUR = 5;

const recent = new Map<string, number[]>();

function limited(address: string): boolean {
  const now = Date.now();
  const times = (recent.get(address) ?? []).filter((time) => now - time < 3_600_000);
  times.push(now);
  recent.set(address, times);
  return times.length > PER_HOUR;
}

function answer(status: number, body: Record<string, string>) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const token = process.env.FILEFORCE_ISSUES_TOKEN;
  if (!token) return answer(503, { error: "Reports are not set up on the website yet" });

  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(address)) return answer(429, { error: "Too many reports from here; try again in an hour" });

  let report: { title?: unknown; body?: unknown };
  try {
    report = await request.json();
  } catch {
    return answer(400, { error: "Not a report" });
  }
  const title = typeof report.title === "string" ? report.title.trim().slice(0, MAX_TITLE) : "";
  const body = typeof report.body === "string" ? report.body.slice(0, MAX_BODY) : "";
  if (!title || !body.trim()) return answer(400, { error: "A title and a description are needed" });

  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/issues`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "fileforce-bug-reports",
    },
    body: JSON.stringify({ title, body, labels: ["bug", "from-app"] }),
  });
  if (!response.ok) {
    console.error("GitHub refused the issue", response.status, await response.text());
    return answer(502, { error: "GitHub did not take the report" });
  }
  const issue: { html_url: string; number: number } = await response.json();
  return answer(201, { url: issue.html_url, number: String(issue.number) });
}
