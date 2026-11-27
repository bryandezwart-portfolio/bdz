"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";
import { useCmsAccent } from "@/lib/useCmsAccent";

type SeoData = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
};

export default function SeoPage() {
  const [data, setData] = useState<SeoData>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const accent = useCmsAccent();

  useEffect(() => {
    fetch("/api/cms/save").then((r) => r.json()).then((d) => setData(d ?? {}));
  }, []);

  function handleChange(key: keyof SeoData, value: string | boolean) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/cms/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputStyle = { width: "100%", padding: "0.65rem 0.85rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", boxSizing: "border-box" as const };
  const labelStyle = { color: "#aaa", fontSize: "0.75rem", display: "block" as const, marginBottom: 6, letterSpacing: "0.05em" };
  const hintStyle = { color: "#555", fontSize: "0.68rem", marginTop: 4 };

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>SEO</h1>
        <button onClick={handleSave} disabled={saving} style={{ padding: "0.55rem 1.4rem", background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1rem" }}>ZOEKMACHINES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Meta titel</label>
              <input type="text" value={data.metaTitle ?? ""} onChange={(e) => handleChange("metaTitle", e.target.value)} placeholder={cmsConfig.siteName} style={inputStyle} />
              <div style={hintStyle}>{(data.metaTitle ?? "").length}/60 tekens aanbevolen</div>
            </div>
            <div>
              <label style={labelStyle}>Meta beschrijving</label>
              <textarea value={data.metaDescription ?? ""} onChange={(e) => handleChange("metaDescription", e.target.value)} placeholder="Korte beschrijving van de pagina voor zoekmachines..." rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />
              <div style={hintStyle}>{(data.metaDescription ?? "").length}/160 tekens aanbevolen</div>
            </div>
            <div>
              <label style={labelStyle}>Canonical URL</label>
              <input type="url" value={data.canonicalUrl ?? ""} onChange={(e) => handleChange("canonicalUrl", e.target.value)} placeholder={cmsConfig.siteUrl} style={inputStyle} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input type="checkbox" id="robotsIndex" checked={data.robotsIndex !== false} onChange={(e) => handleChange("robotsIndex", e.target.checked)} style={{ width: 16, height: 16, accentColor: accent }} />
              <label htmlFor="robotsIndex" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}>Indexeren door zoekmachines toestaan</label>
            </div>
          </div>
        </div>

        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1rem" }}>SOCIAL MEDIA (OG TAGS)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>OG Titel</label>
              <input type="text" value={data.ogTitle ?? ""} onChange={(e) => handleChange("ogTitle", e.target.value)} placeholder={data.metaTitle || cmsConfig.siteName} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>OG Beschrijving</label>
              <textarea value={data.ogDescription ?? ""} onChange={(e) => handleChange("ogDescription", e.target.value)} placeholder={data.metaDescription || "Beschrijving voor social media..."} rows={3} style={{ ...inputStyle, resize: "vertical" as const }} />
            </div>
            <div>
              <label style={labelStyle}>OG Afbeelding URL</label>
              <input type="url" value={data.ogImage ?? ""} onChange={(e) => handleChange("ogImage", e.target.value)} placeholder="https://..." style={inputStyle} />
              <div style={hintStyle}>Aanbevolen: 1200×630px</div>
            </div>
          </div>
        </div>

        {data.ogImage && (
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1.25rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#555", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>VOORBEELD SOCIAL PREVIEW</div>
            <div style={{ background: "#1a1a1a", borderRadius: 8, overflow: "hidden", maxWidth: 400 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.ogImage} alt="OG preview" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "0.75rem" }}>
                <div style={{ fontSize: "0.78rem", color: "#888", marginBottom: "0.2rem" }}>{cmsConfig.siteUrl.replace(/^https?:\/\//, "")}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>{data.ogTitle || data.metaTitle || cmsConfig.siteName}</div>
                <div style={{ fontSize: "0.75rem", color: "#666", lineClamp: 2 }}>{data.ogDescription || data.metaDescription || ""}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
