"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";
import { useCmsAccent } from "@/lib/useCmsAccent";

type SocialLink = { platform: string; label: string; placeholder: string; icon: string };

const PLATFORMS: SocialLink[] = [
  { platform: "instagram",  label: "Instagram",   placeholder: "https://instagram.com/...",   icon: "📸" },
  { platform: "facebook",   label: "Facebook",    placeholder: "https://facebook.com/...",    icon: "👤" },
  { platform: "youtube",    label: "YouTube",     placeholder: "https://youtube.com/@...",    icon: "▶️" },
  { platform: "tiktok",     label: "TikTok",      placeholder: "https://tiktok.com/@...",     icon: "🎵" },
  { platform: "spotify",    label: "Spotify",     placeholder: "https://open.spotify.com/...", icon: "🎧" },
  { platform: "soundcloud", label: "SoundCloud",  placeholder: "https://soundcloud.com/...",  icon: "🎶" },
  { platform: "twitter",    label: "X / Twitter", placeholder: "https://x.com/...",           icon: "✖️" },
  { platform: "linkedin",   label: "LinkedIn",    placeholder: "https://linkedin.com/in/...", icon: "💼" },
  { platform: "website",    label: "Website",     placeholder: "https://...",                 icon: "🌐" },
];

export default function SocialsPage() {
  const [data, setData]     = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const accent = useCmsAccent();

  useEffect(() => {
    fetch("/api/cms/save").then((r) => r.json()).then((d) => {
      const socials: Record<string, string> = {};
      PLATFORMS.forEach(({ platform }) => { if (d?.[platform]) socials[platform] = d[platform]; });
      setData(socials);
    });
  }, []);

  function handleChange(platform: string, value: string) {
    setData((prev) => ({ ...prev, [platform]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const payload = await fetch("/api/cms/save").then((r) => r.json()).then((d) => d ?? {});
    PLATFORMS.forEach(({ platform }) => { payload[platform] = data[platform] ?? ""; });
    await fetch("/api/cms/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const enabled = (cmsConfig.enabledFields as Record<string, unknown>).socials;
  if (enabled === false) {
    return (
      <div style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Social Media</h1>
        <div style={{ color: "#555", fontSize: "0.85rem" }}>Social media links zijn niet ingeschakeld voor deze site.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Social Media</h1>
        <button onClick={handleSave} disabled={saving} style={{ padding: "0.55rem 1.4rem", background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {PLATFORMS.map(({ platform, label, placeholder, icon }) => (
          <div key={platform} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 3 }}>{label}</label>
              <input
                type="url"
                value={data[platform] ?? ""}
                onChange={(e) => handleChange(platform, e.target.value)}
                placeholder={placeholder}
                style={{ width: "100%", padding: "0.55rem 0.8rem", background: "#1a1a1a", border: `1px solid ${data[platform] ? accent + "55" : "#2a2a2a"}`, borderRadius: 8, color: "#fff", fontSize: "0.82rem", boxSizing: "border-box" }}
              />
            </div>
            {data[platform] && (
              <a href={data[platform]} target="_blank" rel="noopener noreferrer" style={{ color: accent, fontSize: "0.75rem", textDecoration: "none", flexShrink: 0 }}>Testen →</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
