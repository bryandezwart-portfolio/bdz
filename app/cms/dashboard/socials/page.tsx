"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

const PLATFORMS = [
  { key: "socialYoutube",    label: "YouTube",     placeholder: "https://youtube.com/@jouwkanaal",     icon: "▶" },
  { key: "socialInstagram",  label: "Instagram",   placeholder: "https://instagram.com/jouwprofiel",   icon: "📷" },
  { key: "socialTiktok",     label: "TikTok",      placeholder: "https://tiktok.com/@jouwprofiel",     icon: "♪" },
  { key: "socialFacebook",   label: "Facebook",    placeholder: "https://facebook.com/jouwpagina",     icon: "f" },
  { key: "socialThreads",    label: "Threads",     placeholder: "https://threads.net/@jouwprofiel",    icon: "@" },
  { key: "socialX",          label: "X / Twitter", placeholder: "https://x.com/jouwprofiel",           icon: "𝕏" },
  { key: "socialWhatsapp",   label: "WhatsApp",    placeholder: "https://wa.me/31612345678",            icon: "💬" },
  { key: "socialSpotify",    label: "Spotify",     placeholder: "https://open.spotify.com/artist/...", icon: "♫" },
  { key: "socialSoundcloud", label: "SoundCloud",  placeholder: "https://soundcloud.com/jouwprofiel",  icon: "☁" },
  { key: "socialLinkedin",   label: "LinkedIn",    placeholder: "https://linkedin.com/in/jouwprofiel", icon: "in" },
];

type SocialsData = Record<string, string>;

export default function SocialsPage() {
  const [data,    setData]    = useState<SocialsData>({});
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);

  const accent = cmsConfig.accentColor;

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((d) => {
        const socials: SocialsData = {};
        PLATFORMS.forEach(({ key }) => { socials[key] = d?.[key] || ""; });
        setData(socials);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/cms/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    setSaving(false);
  }

  if (loading) return <div style={{ color: "#555", fontSize: "0.85rem", paddingTop: "2rem" }}>Laden…</div>;

  const filledCount = PLATFORMS.filter(({ key }) => data[key]?.trim()).length;

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.2rem" }}>Socials</h1>
          <p style={{ color: "#555", fontSize: "0.78rem" }}>
            Vul alleen de platformen in die je wilt tonen. Lege velden worden niet weergegeven.
            {filledCount > 0 && <span style={{ marginLeft: "0.5rem", color: "#9ca3af" }}>({filledCount} actief)</span>}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {saved && <span style={{ color: "#6f6", fontSize: "0.78rem" }}>✓ Opgeslagen</span>}
          <button onClick={handleSave} disabled={saving} style={{ background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, padding: "0.55rem 1.4rem", fontSize: "0.85rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Opslaan…" : "Opslaan"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {PLATFORMS.map(({ key, label, placeholder, icon }) => {
          const filled = !!data[key]?.trim();
          return (
            <div key={key}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", letterSpacing: "0.06em", color: filled ? "#9ca3af" : "#555", marginBottom: "0.35rem" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: filled ? "rgba(156,163,175,0.2)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", flexShrink: 0 }}>
                  {icon}
                </span>
                {label}
                {filled && <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "#6ee7b7", letterSpacing: "0.08em" }}>ACTIEF</span>}
              </label>
              <input
                type="url"
                value={data[key] || ""}
                onChange={(e) => setData((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: "100%", background: "#1a1a1a", border: filled ? "1px solid rgba(156,163,175,0.35)" : "1px solid #2a2a2a", borderRadius: 8, padding: "0.6rem 0.9rem", color: "#f0f0f0", fontSize: "0.82rem", boxSizing: "border-box" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
