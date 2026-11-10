import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/download";
import { JsonLd } from "@/components/json-ld";
import { Nav } from "@/components/nav";
import { FAQS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — file FORCE, the free file manager",
  description: "Answers about file FORCE: is it free, a Finder or Explorer alternative, Git and SSH, the files command, HEIC conversion, Quick Actions, previews and speed.",
  alternates: { canonical: `${SITE}/faq` },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
        }}
      />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[500px]" />
      <Nav />
      <main className="relative flex-1 px-4 pt-12 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">FAQ</h1>
          <p className="mt-4 text-lg text-muted">What people ask about file FORCE.</p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-border bg-surface/80 px-6 py-5 open:border-accent/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                <h2>{faq.question}</h2>
                <span className="text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[17px] leading-relaxed text-foreground/85">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-muted">
          Something else? <Link href="https://github.com/FileForce/files/issues" className="text-accent hover:underline">Ask on GitHub</Link> or read the <Link href="/blog" className="text-accent hover:underline">blog</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
