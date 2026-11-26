"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type Texts = Record<string, string>;

export default function TekstenPage() {
  const [data, setData] = useState<Texts>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((d) => setData(d.texts ?? {}));
  }, []);

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: data }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const accent = cmsConfig.accentColor;
  const fields = Object.entries(data);

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Teksten</h1>
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

      {fields.length === 0 && (
        <p style={{ color: "#555", fontSize: "0.85rem" }}>Geen tekstvelden gevonden in site-content.json.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {fields.map(([key, value]) => (
          <div key={key}>
            <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>
              {key}
            </label>
            {value.length > 80 || value.includes("\n") ? (
              <textarea
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: "0.85rem",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
