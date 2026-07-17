import Image from "next/image";
import { site } from "@/lib/content";
import Waveform from "./Waveform";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-64 pb-24 sm:pt-80 sm:pb-32">
      <div className="absolute inset-0 bg-studio-glow" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid sm:grid-cols-[1.1fr,0.9fr] gap-14 items-center">
          <div className="animate-blur-up">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-onair animate-pulse-dot" />
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-muted">
                On air &middot; {site.radio.show}
              </span>
              <Waveform />
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl leading-[1.03] tracking-tight text-balance">
              {site.name}
            </h1>

            <ul className="mt-5 space-y-1.5">
              {site.titles.map((t) => (
                <li key={t} className="text-lg sm:text-xl text-muted font-medium">
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href={site.radio.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-onair text-white text-sm font-semibold px-6 py-3 hover:brightness-110 transition-all">
                {site.radio.cta}
              </a>
              <a href={site.label.url} target="_blank" rel="noopener noreferrer" className="rounded-full glass text-ink text-sm font-semibold px-6 py-3 hover:bg-white/[0.06] transition-colors">
                {site.label.cta}
              </a>
            </div>
          </div>

          <div className="relative animate-blur-up [animation-delay:250ms]">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-onair/25 via-gold/10 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[2rem] overflow-hidden glass aspect-[4/5]">
              <Image src={site.photo.src} alt={site.photo.alt} fill priority sizes="(max-width: 640px) 90vw, 420px" className="object-cover object-top" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
