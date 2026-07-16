import { site } from "@/lib/content";

const tracks = [
  {
    id: "radio",
    side: "A1",
    accent: "text-onair",
    dot: "bg-onair",
    label: site.radio.label,
    title: site.radio.show,
    subtitle: site.radio.name,
    description: site.radio.description,
    url: site.radio.url,
    cta: site.radio.cta,
  },
  {
    id: "label",
    side: "B1",
    accent: "text-gold",
    dot: "bg-gold",
    label: site.label.label,
    title: site.label.name,
    subtitle: "Platenmaatschappij",
    description: site.label.description,
    url: site.label.url,
    cta: site.label.cta,
  },
];

export default function Projects() {
  return (
    <section className="py-24 sm:py-32 border-t border-line">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted mb-10">
          Waar ik aan werk
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {tracks.map((t) => (
            <a
              key={t.id}
              id={t.id}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl glass p-8 sm:p-10 flex flex-col justify-between min-h-[320px] overflow-hidden hover:bg-white/[0.05] transition-colors"
            >
              <div
                className={`absolute -top-10 -right-10 h-40 w-40 rounded-full ${t.dot} opacity-[0.08] blur-3xl group-hover:opacity-[0.14] transition-opacity`}
                aria-hidden="true"
              />

              <div>
                <div className="flex items-center gap-2 mb-8">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${t.dot}`}
                    aria-hidden="true"
                  />
                  <span className={`text-xs font-mono ${t.accent}`}>
                    {t.side}
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em] text-muted">
                    {t.label}
                  </span>
                </div>

                <h3 className="font-display font-bold text-3xl tracking-tight text-balance">
                  {t.title}
                </h3>
                <p className="text-sm text-muted mt-1">{t.subtitle}</p>
                <p className="mt-5 text-base text-muted leading-relaxed max-w-sm">
                  {t.description}
                </p>
              </div>

              <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold">
                {t.cta}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
