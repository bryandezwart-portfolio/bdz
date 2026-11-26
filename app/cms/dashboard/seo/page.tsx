"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

export default function SeoPage() {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [ogImage,     setOgImage]     = useState("");
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [msg,         setMsg]         = useState("");

  const siteUrl  = cmsConfig.siteUrl.replace(/\/$/, "");
  const accent   = cmsConfig.accentColor;

  useEffect(() => {
    fetch("/api/cms/seo").then((r) => r.json()).then((d) => {
      if (d?.title)       setTitle(d.title);
      if (d?.description) setDescription(d.description);
      if (d?.ogImage)     setOgImage(d.ogImage);
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

  async function uploadOgImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const r = await fetch("/api/cms/media", { method: "POST", body: form });
    const d = await r.json();
    setUploading(false);
    if (d.url) { setOgImage(d.url); setMsg("Afbeelding geüpload ✓"); setSaved(false); }
    else setMsg("Upload mislukt");
  }

  const charCount  = description.length;
  const charColor  = charCount  > 160 ? "#f87171" : charCount  > 130 ? "#fbbf24" : "#6f6";
  const titleCount = title.length;
  const titleColor = titleCount > 60  ? "#f87171" : titleCount > 50  ? "#fbbf24" : "#6f6";
  const inp = { width: "100%", padding: "0.65rem 0.85rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", boxSizing: "border-box" } as React.CSSProperties;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>SEO</h1>
        <button onClick={handleSave} disabled={saving} style={{ padding: "0.55rem 1.4rem", background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
        </button>
      </div>

      {msg && <div style={{ background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8, padding: "0.6rem 1rem", marginBottom: "1.25rem", fontSize: "0.82rem", color: "#6f6" }}>{msg}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        <div>
          <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>PAGINATITEL <span style={{ color: "#555" }}>(browser tab + Google)</span></label>
          <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false); }} placeholder={`${cmsConfig.siteName}`} style={inp} />
          <div style={{ textAlign: "right", fontSize: "0.7rem", color: titleColor, marginTop: 4 }}>{titleCount}/60 tekens</div>
        </div>

        <div>
          <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>META DESCRIPTION <span style={{ color: "#555" }}>(Google snippet — max 160 tekens)</span></label>
          <textarea value={description} onChange={(e) => { setDescription(e.target.value); setSaved(false); }} placeholder="Korte beschrijving die in Google verschijnt..." rows={3} style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ textAlign: "right", fontSize: "0.7rem", color: charColor, marginTop: 4 }}>{charCount}/160 tekens</div>
        </div>

        <div>
          <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>SOCIAL SHARE AFBEELDING <span style={{ color: "#555" }}>(og:image — WhatsApp, Facebook, 1200×630px)</span></label>
          <input type="text" value={ogImage} onChange={(e) => { setOgImage(e.target.value); setSaved(false); }} placeholder="https://... of /og-image.jpg" style={{ ...inp, marginBottom: "0.5rem" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <input type="file" accept="image/*" onChange={uploadOgImage} style={{ fontSize: "0.82rem", color: "#aaa" }} />
            {uploading && <span style={{ fontSize: "0.78rem", color: "#888" }}>Uploading...</span>}
          </div>
          {ogImage && <img src={ogImage} alt="OG preview" style={{ marginTop: 10, width: "100%", maxWidth: 400, borderRadius: 8, border: "1px solid #2a2a2a", objectFit: "cover" }} />}
        </div>

        <div>
          <div style={{ color: "#555", fontSize: "0.7rem", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>GOOGLE VOORBEELD</div>
          <div style={{ background: "#fff", borderRadius: 8, padding: "1rem 1.25rem", maxWidth: 500 }}>
            <div style={{ color: "#202124", fontSize: "0.72rem", marginBottom: 2 }}><span style={{ color: "#1a0dab" }}>{siteUrl}</span></div>
            <div style={{ color: "#1a0dab", fontSize: "1rem", fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>{title || cmsConfig.siteName}</div>
            <div style={{ color: "#545454", fontSize: "0.82rem", lineHeight: 1.5 }}>{description || "Meta description verschijnt hier..."}</div>
          </div>
        </div>

        {ogImage && (
          <div>
            <div style={{ color: "#555", fontSize: "0.7rem", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>SOCIAL SHARE VOORBEELD</div>
            <div style={{ background: "#1e1e1e", borderRadius: 8, overflow: "hidden", maxWidth: 400, border: "1px solid #333" }}>
              <img src={ogImage} alt="Social preview" style={{ width: "100%", display: "block", aspectRatio: "1200/630", objectFit: "cover" }} />
              <div style={{ padding: "0.75rem 1rem" }}>
                <div style={{ color: "#888", fontSize: "0.65rem", textTransform: "uppercase", marginBottom: 2 }}>{siteUrl.replace("https://", "")}</div>
                <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>{title || cmsConfig.siteName}</div>
                <div style={{ color: "#aaa", fontSize: "0.75rem", marginTop: 2 }}>{description}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
