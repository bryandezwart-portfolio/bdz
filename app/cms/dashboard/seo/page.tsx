"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

export default function SeoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/cms/seo").then((r) => r.json()).then((d) => {
      if (d?.title) setTitle(d.title);
      if (d?.description) setDescription(d.description);
      if (d?.ogImage) setOgImage(d.ogImage);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/cms/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, ogImage }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const accent = cmsConfig.accentColor;
  const charCount = description.length;
  const charColor = charCount > 160 ? "#f87171" : charCount > 130 ? "#fbbf24" : "#6f6";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>SEO</h1>
        <button onClick={handleSave} disabled={saving} style={{ padding: "0.55rem 1.4rem", background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>
            PAGINATITEL <span style={{ color: "#555" }}>(browser tab + Google)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
            placeholder="Bryan de Zwart — Radio DJ · Label Owner · Bookings"
            style={{ width: "100%", padding: "0.65rem 0.85rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>
            META DESCRIPTION <span style={{ color: "#555" }}>(Google snippet — max 160 tekens)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setSaved(false); }}
            placeholder="Bryan de Zwart is radio dj, label owner en booking agent. Ontdek zijn werk, releases en projecten."
            rows={3}
            style={{ width: "100%", padding: "0.65rem 0.85rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
          />
          <div style={{ textAlign: "right", fontSize: "0.7rem", color: charColor, marginTop: 4 }}>
            {charCount}/160 tekens
          </div>
        </div>

        <div>
          <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>
            SOCIAL SHARE AFBEELDING <span style={{ color: "#555" }}>(og:image — WhatsApp, Facebook etc.)</span>
          </label>
          <input
            type="text"
            value={ogImage}
            onChange={(e) => { setOgImage(e.target.value); setSaved(false); }}
            placeholder="https://... of /og-image.jpg (1200×630px aanbevolen)"
            style={{ width: "100%", padding: "0.65rem 0.85rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", boxSizing: "border-box" }}
          />
          {ogImage && (
            <img src={ogImage} alt="OG preview" style={{ marginTop: 10, width: "100%", maxWidth: 400, height: "auto", borderRadius: 8, border: "1px solid #2a2a2a" }} />
          )}
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <div style={{ color: "#555", fontSize: "0.7rem", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>GOOGLE VOORBEELD</div>
          <div style={{ background: "#fff", borderRadius: 8, padding: "1rem 1.25rem", maxWidth: 500 }}>
            <div style={{ color: "#1a0dab", fontSize: "0.95rem", fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>
              {title || "Bryan de Zwart — Radio DJ · Label Owner · Bookings"}
            </div>
            <div style={{ color: "#006621", fontSize: "0.72rem", marginBottom: 4 }}>bryandezwart.nl</div>
            <div style={{ color: "#545454", fontSize: "0.78rem", lineHeight: 1.5 }}>
              {description || "Bryan de Zwart is radio dj, label owner en booking agent."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
