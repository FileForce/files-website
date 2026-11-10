import { MotionProvider } from "@/components/motion-provider";
import { Hero } from "@/components/hero";
import { Pillars } from "@/components/pillars";
import { Developers, Extensions } from "@/components/extensions";
import { Download, Footer } from "@/components/download";
import { JsonLd } from "@/components/json-ld";
import { allPosts } from "@/lib/blog";
import { FACTS, NAME, REPOSITORY, SITE, TAGLINE } from "@/lib/site";

export default async function Home() {
  // The newest release, as the app's version.
  const version = (await allPosts()).find((post) => post.tag === "release")?.version;
  return (
    <MotionProvider>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "@id": `${SITE}/#app`,
              name: NAME,
              alternateName: "Files",
              description: TAGLINE,
              applicationCategory: "UtilitiesApplication",
              applicationSubCategory: "File manager",
              operatingSystem: "macOS 13+, Windows 10, Windows 11, Linux",
              softwareVersion: version,
              downloadUrl: `${SITE}/downloads`,
              url: SITE,
              license: `${REPOSITORY}/blob/main/LICENSE.md`,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              featureList: FACTS,
              publisher: { "@id": `${SITE}/#org` },
              sameAs: [REPOSITORY],
            },
            { "@type": "Organization", "@id": `${SITE}/#org`, name: "FileForce", url: SITE, logo: `${SITE}/logo.svg`, sameAs: ["https://github.com/FileForce"] },
            { "@type": "WebSite", "@id": `${SITE}/#site`, name: NAME, url: SITE, publisher: { "@id": `${SITE}/#org` } },
          ],
        }}
      />
      <Hero />
      <main className="flex-1">
        <Pillars />
        <Extensions />
        <Developers />
        <Download />
      </main>
      <Footer />
    </MotionProvider>
  );
}
