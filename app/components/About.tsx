import { site } from "@/lib/content";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="over-mij" className="py-24 sm:py-32 border-t border-line">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid sm:grid-cols-[0.3fr,1fr] gap-8 sm:gap-16">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Over mij
            </p>
          </Reveal>
          <div className="max-w-2xl space-y-6">
            {site.bio.map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <p className="text-2xl sm:text-3xl leading-snug tracking-tight text-balance font-medium">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
