"use client";
import { useEffect, useState } from "react";

type ReleaseType = "single" | "ep" | "album" | "show";

interface Release {
  id: string;
  type: ReleaseType;
  title: string;
  date: string;
  link?: string;
  cover?: string;
  venue?: string;
}

const TYPE_LABEL: Record<ReleaseType, string> = {
  single: "Single",
  ep: "EP",
  album: "Album",
  show: "Show",
};

const TYPE_COLOR: Record<ReleaseType, string> = {
  single: "#9ca3af",
  ep: "#a78bfa",
  album: "#60a5fa",
  show: "#34d399",
};

export default function Releases() {
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    fetch("/api/cms/releases")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setReleases(d);
      });
  }, []);

  if (releases.length === 0) return null;

  const now = new Date();
  const upcoming = releases.filter((r) => new Date(r.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = releases.filter((r) => new Date(r.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const ordered = [...upcoming, ...past];

  return (
    <section style={{ padding: "5rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
        Releases & Shows
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "2.5rem" }}>
        Muziek, optredens en meer.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {ordered.map((item) => {
          const isPast = new Date(item.date) < now;
          const dateStr = new Date(item.date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
          return (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem 1.25rem", opacity: isPast ? 0.55 : 1 }}>
              {item.cover ? (
                <img src={item.cover} alt={item.title} style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: 8, background: "#1a1a1a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                  {item.type === "show" ? "🎤" : "🎵"}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.title}</span>
                  {item.venue && <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>@ {item.venue}</span>}
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{dateStr}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                <span style={{ background: "transparent", border: `1px solid ${TYPE_COLOR[item.type]}`, color: TYPE_COLOR[item.type], borderRadius: 20, padding: "2px 10px", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em" }}>
                  {TYPE_LABEL[item.type]}
                </span>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: isPast ? "#555" : "#9ca3af", fontSize: "0.78rem", textDecoration: "none", border: isPast ? "none" : "1px solid #333", borderRadius: 6, padding: isPast ? "0" : "4px 10px" }}>
                    {isPast ? "↗" : "Bekijk →"}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
