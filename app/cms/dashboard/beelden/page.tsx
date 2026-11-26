"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type SlotKey = "heroVideo" | "heroBgImage";

const SECTIONS: { key: SlotKey; label: string; icon: string; description: string; accept: string; isVideo: boolean }[] = [
  { key: "heroVideo",   label: "Hero video",       icon: "🎬", description: "De video op de achtergrond van de homepagina", accept: "video/*", isVideo: true  },
  { key: "heroBgImage", label: "Hero achtergrond", icon: "🖼️", description: "Achtergrondafbeelding als er geen video is",   accept: "image/*", isVideo: false },
];

export default function BeldenPage() {
  const [data, setData]       = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/cms/save").then((r) => r.json()).then((d) => { setData(d ?? {}); setLoading(false); });
  }, []);

  function setMsg(key: string, msg: string) {
    setStatus((p) => ({ ...p, [key]: msg }));
    setTimeout(() => setStatus((p) => ({ ...p, [key]: "" })), 3000);
  }

  async function saveField(key: string, value: string) {
    await fetch("/api/cms/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [key]: value }) });
    setData((p) => ({ ...p, [key]: value }));
  }

  async function handleUpload(slotKey: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(slotKey, "Uploaden...");
    const form = new FormData();
    form.append("file", file);
    const r = await fetch("/api/cms/media", { method: "POST", body: form });
    const d = await r.json();
    if (!d.url) { setMsg(slotKey, "Upload mislukt"); return; }
    await saveField(slotKey, d.url);
    setMsg(slotKey, "Geupload en actief ✓");
    e.target.value = "";
  }

  async function handleSelect(key: SlotKey, url: string) {
    await saveField(key, url);
    setMsg(key, "Actief ✓");
  }

  async function handleDelete(slotKey: string) {
    if (!confirm("Weet je zeker dat je deze upload wil verwijderen?")) return;
    await saveField(slotKey, "");
    setMsg(slotKey, "Verwijderd");
  }

  const accent = cmsConfig.accentColor;
  if (loading) return <div style={{ color: "#555", padding: "2rem" }}>Laden...</div>;

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Beelden</h1>
      <p style={{ color: "#555", fontSize: "0.82rem", marginBottom: "2rem" }}>Selecteer of upload een video of afbeelding per sectie</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {SECTIONS.map(({ key, label, icon, description, accept, isVideo }) => {
          const activeUrl  = data[key] ?? "";
          const defaultUrl = cmsConfig.defaultMedia[key];
          const uploadKey1 = key + "_upload1";
          const uploadKey2 = key + "_upload2";
          const upload1    = data[uploadKey1] ?? "";
          const upload2    = data[uploadKey2] ?? "";
          const maxUploads = cmsConfig.maxClientUploads[key];
          const msg        = status[key] ?? "";

          const options: { id: string; url: string; labelText: string; deletable: boolean }[] = [
            { id: "default", url: defaultUrl, labelText: "Standaard (Branding Totaal)", deletable: false },
            ...(upload1 ? [{ id: uploadKey1, url: upload1, labelText: "Jouw upload 1", deletable: true }] : []),
            ...(upload2 && maxUploads >= 2 ? [{ id: uploadKey2, url: upload2, labelText: "Jouw upload 2", deletable: true }] : []),
          ].filter((o) => o.url);

          const activeOption = options.find((o) => o.url === activeUrl) ?? options[0];
          const canUploadMore = (maxUploads >= 1 && !upload1) || (maxUploads >= 2 && upload1 && !upload2);
          const nextUploadKey = !upload1 ? uploadKey1 : uploadKey2;

          return (
            <div key={key} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{icon} {label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#555", marginTop: "0.2rem" }}>{description}</div>
                </div>
                {msg && <span style={{ fontSize: "0.75rem", color: msg.includes("✓") ? "#4ade80" : "#888" }}>{msg}</span>}
              </div>

              {/* Actieve preview */}
              <div style={{ background: "#0a0a0a", minHeight: 180, position: "relative" }}>
                {activeOption?.url ? (
                  isVideo ? (
                    <video src={activeOption.url} style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} muted controls />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeOption.url} alt={label} style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
                  )
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, color: "#333", fontSize: "0.8rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
                    Nog geen {isVideo ? "video" : "afbeelding"} ingesteld
                  </div>
                )}
                {activeOption && (
                  <div style={{ position: "absolute", bottom: 8, left: 8, background: "#00000099", borderRadius: 6, padding: "0.2rem 0.6rem", fontSize: "0.65rem", color: "#aaa" }}>
                    Actief: {activeOption.labelText}
                  </div>
                )}
              </div>

              {/* Opties om te selecteren */}
              {options.length > 1 && (
                <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid #1a1a1a", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ fontSize: "0.72rem", color: "#555", marginBottom: "0.25rem", letterSpacing: "0.08em" }}>SELECTEER</div>
                  {options.map((opt) => {
                    const isActive = activeUrl === opt.url || (!activeUrl && opt.id === "default");
                    return (
                      <div key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", background: isActive ? accent + "18" : "#0a0a0a", border: `1px solid ${isActive ? accent + "44" : "#1a1a1a"}`, borderRadius: 8 }}>
                        <div style={{ width: 40, height: 28, borderRadius: 4, overflow: "hidden", flexShrink: 0, background: "#1a1a1a" }}>
                          {isVideo ? (
                            <video src={opt.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={opt.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          )}
                        </div>
                        <span style={{ flex: 1, fontSize: "0.78rem", color: isActive ? "#fff" : "#666" }}>{opt.labelText}</span>
                        {!isActive && (
                          <button onClick={() => handleSelect(key, opt.url)} style={{ fontSize: "0.72rem", color: accent, background: "none", border: `1px solid ${accent}44`, borderRadius: 6, padding: "0.2rem 0.6rem", cursor: "pointer" }}>
                            Selecteer
                          </button>
                        )}
                        {isActive && <span style={{ fontSize: "0.68rem", color: accent }}>✓ Actief</span>}
                        {opt.deletable && (
                          <button onClick={() => handleDelete(opt.id)} style={{ fontSize: "0.68rem", color: "#444", background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "0.25rem" }}>
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Upload knop */}
              <div style={{ padding: "0.75rem 1.25rem 1rem", borderTop: "1px solid #1a1a1a" }}>
                {canUploadMore ? (
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#1a1a1a", border: "1px solid #333", color: "#aaa", borderRadius: 8, fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
                    ↑ Upload nieuwe {isVideo ? "video" : "afbeelding"}
                    <input type="file" accept={accept} onChange={(e) => handleUpload(nextUploadKey, e)} style={{ display: "none" }} />
                  </label>
                ) : (
                  <div style={{ fontSize: "0.75rem", color: "#444" }}>
                    Maximum aantal uploads bereikt ({maxUploads}). Verwijder een upload om een nieuwe toe te voegen.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
