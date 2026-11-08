import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ReactNode } from "react";

/** A picture with a caption, framed like the app's windows. */
export function Figure({ src, alt, caption, narrow = false }: { src: string; alt: string; caption?: ReactNode; narrow?: boolean }) {
  return (
    <figure className={`my-8 ${narrow ? "mx-auto max-w-sm" : ""}`}>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Plain img: post pictures come in any size. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-auto w-full" loading="lazy" />
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-faint">{caption}</figcaption>}
    </figure>
  );
}

/** A highlighted note. */
export function Callout({ children, title = "Good to know" }: { children: ReactNode; title?: string }) {
  return (
    <aside className="my-8 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4">
      <p className="text-sm font-semibold text-accent">{title}</p>
      <div className="mt-1 text-[15px] leading-relaxed text-foreground/90 [&>p]:m-0">{children}</div>
    </aside>
  );
}

/** A keyboard key. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-elevated px-1.5 font-mono text-[13px] text-foreground shadow-[0_1px_0_0_var(--border)]">
      {children}
    </kbd>
  );
}

const components: MDXComponents = {
  h2: ({ children }) => <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 mb-3 text-lg font-semibold">{children}</h3>,
  p: ({ children }) => <p className="my-4 text-[17px] leading-relaxed text-foreground/85">{children}</p>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-foreground/85 marker:text-accent">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 text-[17px] leading-relaxed text-foreground/85 marker:text-accent">{children}</ol>,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-accent underline-offset-4 hover:underline">{children}</Link>
    ) : (
      <a href={href} className="text-accent underline-offset-4 hover:underline">{children}</a>
    ),
  code: ({ children }) => <code className="rounded-md border border-border bg-elevated px-1.5 py-0.5 font-mono text-[0.88em] text-foreground">{children}</code>,
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-border bg-surface p-4 font-mono text-sm leading-relaxed [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0">{children}</pre>
  ),
  blockquote: ({ children }) => <blockquote className="my-6 border-l-2 border-accent pl-4 text-muted">{children}</blockquote>,
  hr: () => <hr className="my-10 border-border" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-border bg-surface px-4 py-2.5 font-medium text-muted">{children}</th>,
  td: ({ children }) => <td className="border-b border-border/60 px-4 py-2.5 text-foreground/85">{children}</td>,
  img: ({ src, alt }) => <Figure src={typeof src === "string" ? src : ""} alt={alt ?? ""} />,
  Figure,
  Callout,
  Kbd,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
