import { MotionProvider } from "@/components/motion-provider";
import { Hero } from "@/components/hero";
import { Pillars } from "@/components/pillars";
import { Developers, Extensions } from "@/components/extensions";
import { Download, Footer } from "@/components/download";

export default function Home() {
  return (
    <MotionProvider>
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
