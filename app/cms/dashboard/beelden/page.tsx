"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type Section = {
  key: string;
  label: string;
  icon: string;
  description: string;
  accept: string;
  isVideo?: boolean;
};

const SECTIONS: Section[] = [
  { key: "heroVideo",    label: "Hero video",          icon: "🎬", description: "De video op de achtergrond van de homepagina",      accept: "video/*",        isVideo: true  },
  { key: "heroBgImage",  label: "Hero achtergrond",    icon: "🖼️", description: "Achtergrondafbeelding als er geen video is",        accept: "image/*",        isVideo: false },
];

export default function BeldenPage() {
  const [data, setData]       = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/cms/save").then((r) => r.json()).then((d) => {
      setData(d ?? {});
      setLoading(false);
    });
  }, []);

  function setMsg(key: string, msg: string) {
    setStatus((prev) => ({ ...prev, [key]: msg }));
    setTimeout(() => setStatus((prev) => ({ ...prev, [key]: "" })), 3000);
  }

  async function handleUpload(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(key, "Uploaden...");
    const form = new FormData();
    form.append("file", file);
    const r = await fetch("/api/cms/media", { method: "POST", body: form });
    const d = await r.json();
    if (!d.url) { setMsg(key, "Upload mislukt"); return; }
    await saveField(key, d.url);
    setData((prev) => ({ ...prev, [key]: d.url }));
    setMsg(key, "Opgeslagen ✓");
    e.target.value = "";
  }

  async function handleUrlChange(key: string, url: string) {
    setData((prev) => ({ ...prev, [key]: url }));
  }

  async function saveField(key: string, value: string) {
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
  }

  async function handleUrlSave(key: string) {
    await saveField(key, data[key] ?? "");
    setMsg(key, "Opgeslagen ✓");
  }

  async function handleRemove(key: string) {
    if (!confirm("Weet je zeker dat je dit wil verwijderen?")) return;
    await saveField(key, "");
    setData((prev) => ({ ...prev, [key]: "" }));
    setMsg(key, "Verwijderd ✓");
  }

  const accent = cmsConfig.accentColor;

  if (loading) return <div style={{ color: "#555", padding: "2rem" }}>Laden...</div>;

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Beelden</h1>
      <p style={{ color: "#555", fontSize: "0.82rem", marginBottom: "2rem" }}>Upload of wijzig video&apos;s en afbeeldingen per sectie</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {SECTIONS.map(({ key, label, icon, description, accept, isVideo }) => {
          const current = data[key] ?? "";
          const msg = status[key] ?? "";
          return (
            <div key={key} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
              {/* Sectie header */}
              <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{icon} {label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#555", marginTop: "0.2rem" }}>{description}</div>
                </div>
                {msg && <span style={{ fontSize: "0.75rem", color: msg.includes("✓") ? "#1a7a1a" : "#888" }}>{msg}</span>}
              </div>

              {/* Preview */}
              <div style={{ background: "#0a0a0a", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {current ? (
                  isVideo ? (
                    <video
                      src={current}
                      style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }}
                      muted
                      controls
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current}
                      alt={label}
                      style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }}
                    />
                  )
                ) : (
                  <div style={{ color: "#333", fontSize: "0.8rem", textAlign: "center", padding: "2rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
                    Nog geen {isVideo ? "video" : "afbeelding"} ingesteld
                  </div>
                )}
              </div>

              {/* Acties */}
              <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Upload */}
                <label style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: accent,
                  color: "#fff",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  width: "fit-content",
                }}>
                  ↑ Upload {isVideo ? "video" : "afbeelding"}
                  <input type="file" accept={accept} onChange={(e) => handleUpload(key, e)} style={{ display: "none" }} />
                </label>

                {/* URL invoer */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={current}
                    onChange={(e) => handleUrlChange(key, e.target.value)}
                    placeholder={isVideo ? "/video.mp4 of https://..." : "https://... of /foto.jpg"}
                    style={{ flex: 1, padding: "0.45rem 0.75rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, color: "#fff", fontSize: "0.8rem" }}
                  />
                  <button
                    onClick={() => handleUrlSave(key)}
                    style={{ padding: "0.45rem 0.9rem", background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, color: "#aaa", fontSize: "0.8rem", cursor: "pointer" }}
                  >
                    Sla op
                  </button>
                </div>

                {/* Verwijder */}
                {current && (
                  <button
                    onClick={() => handleRemove(key)}
                    style={{ background: "none", border: "none", color: "#444", fontSize: "0.75rem", cursor: "pointer", padding: 0, textAlign: "left", width: "fit-content" }}
                  >
                    Verwijder huidige {isVideo ? "video" : "afbeelding"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
