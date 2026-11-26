"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type Seo = { title?: string; description?: string; keywords?: string };

export default function SeoPage() {
  const [seo, setSeo] = useState<Seo>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((d) => setSeo(d.seo ?? {}));
  }, []);

  function set(key: keyof Seo, value: string) {
    setSeo((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seo }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const accent = cmsConfig.accentColor;
  const titleLen = (seo.title ?? "").length;
  const descLen = (seo.description ?? "").length;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>SEO</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.55rem 1.4rem",
            background: saved ? "#1a7a1a" : accent,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
        </button>
      </div>

      {/* Google preview */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        padding: "1rem 1.25rem",
        marginBottom: "2rem",
        maxWidth: 600,
      }}>
        <p style={{ fontSize: "0.7rem", color: "#202124", margin: "0 0 2px", fontFamily: "arial, sans-serif" }}>
          {typeof window !== "undefined" ? window.location.hostname : "jouwsite.nl"}
        </p>
        <p style={{ fontSize: "1.05rem", color: "#1a0dab", margin: "0 0 4px", fontFamily: "arial, sans-serif", fontWeight: 400 }}>
          {seo.title || "Paginatitel"}
        </p>
        <p style={{ fontSize: "0.82rem", color: "#4d5156", margin: 0, fontFamily: "arial, sans-serif", lineHeight: 1.4 }}>
          {seo.description || "Paginabeschrijving verschijnt hier..."}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Field label={`Paginatitel (${titleLen}/60 tekens)`} warn={titleLen > 60}>
          <input
            type="text"
            value={seo.title ?? ""}
            onChange={(e) => set("title", e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field label={`Meta beschrijving (${descLen}/160 tekens)`} warn={descLen > 160}>
          <textarea
            value={seo.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>

        <Field label="Trefwoorden (komma gescheiden)">
          <input
            type="text"
            value={seo.keywords ?? ""}
            onChange={(e) => set("keywords", e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            style={inputStyle}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children, warn }: { label: string; children: React.ReactNode; warn?: boolean }) {
  return (
    <div>
      <label style={{
        color: warn ? "#9ca3af" : "#aaa",
        fontSize: "0.75rem",
        display: "block",
        marginBottom: 6,
        letterSpacing: "0.05em",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  color: "#fff",
  fontSize: "0.85rem",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
