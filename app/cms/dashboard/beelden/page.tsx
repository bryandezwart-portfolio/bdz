"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type SlotKey = "heroVideo" | "heroBgImage" | "profilePhoto";

const ALL_SECTIONS: { key: SlotKey; label: string; icon: string; description: string; allowToggle?: boolean }[] = [
  { key: "heroVideo",    label: "Hero video",       icon: "🎬", description: "De video op de achtergrond van de homepagina" },
  { key: "heroBgImage",  label: "Hero achtergrond", icon: "🖼️", description: "Achtergrond als er geen video is — kies foto of video", allowToggle: true },
  { key: "profilePhoto", label: "Profielfoto",      icon: "🧑", description: "De ronde profielfoto in de Over-sectie" },
];

const SECTIONS = ALL_SECTIONS.filter((s) => cmsConfig.enabledSections[s.key]);

export default function BeldenPage() {
  const [data, setData]       = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState<Record<string, string>>({});
  const [bgType, setBgType]   = useState<"image" | "video">("image");
  const [accent, setAccent]   = useState(cmsConfig.accentColor);

  useEffect(() => {
    fetch("/api/cms/save").then((r) => r.json()).then((d) => {
      setData(d ?? {});
      if (d?.accentColor) setAccent(d.accentColor);
      setLoading(false);
    });
  }, []);

  function setMsg(key: string, msg: string) {
    setStatus((p) => ({ ...p, [key]: msg }));
    setTimeout(() => setStatus((p) => ({ ...p, [key]: "" })), 3000);
  }

  async function saveField(key: string, value: string) {
    await fetch("/api/cms/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [key]: value }) });
    setData((p) => ({ ...p, [key]: value }));
  }

  async function handleAltSave(key: SlotKey, value: string) {
    const altKey = key + "_alt";
    await saveField(altKey, value);
    setMsg(key + "_alt", "Alt-tekst opgeslagen ✓");
  }

  async function handleUpload(slotKey: string, fieldKey: SlotKey, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(fieldKey, "Uploaden...");
    const form = new FormData();
    form.append("file", file);
    const r = await fetch("/api/cms/media", { method: "POST", body: form });
    const d = await r.json();
    if (!d.url) { setMsg(fieldKey, "Upload mislukt"); return; }
    await saveField(slotKey, d.url);
    await saveField(fieldKey, d.url);
    setMsg(fieldKey, "Geüpload en actief ✓");
    e.target.value = "";
  }

  async function handleDelete(slotKey: string, fieldKey: SlotKey) {
    if (!confirm("Weet je zeker dat je deze upload wil verwijderen?")) return;
    await saveField(slotKey, "");
    await saveField(fieldKey, "");
    setMsg(fieldKey, "Verwijderd");
  }

  if (loading) return <div style={{ color: "#555", padding: "2rem" }}>Laden...</div>;

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>Beelden</h1>
      <p style={{ color: "#555", fontSize: "0.82rem", marginBottom: "2rem" }}>Upload of vervang afbeeldingen en video's per sectie</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {SECTIONS.map(({ key, label, icon, description, allowToggle }) => {
          const activeUrl  = data[key] ?? "";
          const upload1    = data[key + "_upload1"] ?? "";
          const altValue   = data[key + "_alt"] ?? "";
          const altMsg     = status[key + "_alt"] ?? "";
          const maxUploads = cmsConfig.maxClientUploads[key];
          const msg        = status[key] ?? "";

          const isVideo = key === "heroVideo"
            ? true
            : key === "heroBgImage"
              ? bgType === "video"
              : false;

          const accept = isVideo ? "video/*" : "image/*";
          const canUpload = maxUploads >= 1 && !upload1 || (maxUploads >= 1 && upload1 && upload1 !== activeUrl);
          const nextUploadKey = key + "_upload1";

          const urlIsVideo = activeUrl && ["mp4","webm","mov"].includes(activeUrl.split(".").pop()?.toLowerCase() ?? "");

          return (
            <div key={key} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "1rem 1.25rem 0.75rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{icon} {label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#555", marginTop: "0.2rem" }}>{description}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {msg && <span style={{ fontSize: "0.75rem", color: msg.includes("✓") ? "#4ade80" : "#888" }}>{msg}</span>}
                  {allowToggle && (
                    <div style={{ display: "flex", background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
                      {(["image", "video"] as const).map((t) => (
                        <button key={t} onClick={() => setBgType(t)} style={{ padding: "0.3rem 0.7rem", fontSize: "0.72rem", background: bgType === t ? accent : "transparent", color: bgType === t ? "#fff" : "#555", border: "none", cursor: "pointer", fontWeight: bgType === t ? 700 : 400 }}>
                          {t === "image" ? "Foto" : "Video"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div style={{ background: "#0a0a0a", minHeight: 180, position: "relative" }}>
                {activeUrl ? (
                  urlIsVideo ? (
                    <video src={activeUrl} style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} muted controls />
                  ) : key === "profilePhoto" ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activeUrl} alt={altValue || label} style={{ width: 160, height: 160, objectFit: "cover", borderRadius: "50%", border: `3px solid ${accent}`, boxShadow: `0 0 24px ${accent}66` }} />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeUrl} alt={altValue || label} style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
                  )
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, color: "#333", fontSize: "0.8rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
                    Nog geen {isVideo ? "video" : "afbeelding"} ingesteld
                  </div>
                )}
              </div>

              {/* Alt-tekst veld */}
              <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid #1a1a1a", background: "#0d0d0d" }}>
                <label style={{ display: "block", fontSize: "0.72rem", color: "#555", marginBottom: "0.4rem", fontWeight: 600 }}>
                  ALT-TEKST {isVideo ? "(video beschrijving)" : "(afbeelding beschrijving)"}
                </label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="text"
                    value={altValue}
                    onChange={(e) => setData((p) => ({ ...p, [key + "_alt"]: e.target.value }))}
                    placeholder={isVideo ? `Bijv. "Achtergrondvideo van ${label.toLowerCase()}"` : `Bijv. "Foto van ${label.toLowerCase()}"`}
                    style={{
                      flex: 1,
                      background: "#111",
                      border: "1px solid #2a2a2a",
                      borderRadius: 6,
                      color: "#ddd",
                      padding: "0.45rem 0.75rem",
                      fontSize: "0.8rem",
                      outline: "none",
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAltSave(key, (e.target as HTMLInputElement).value); }}
                  />
                  <button
                    onClick={() => handleAltSave(key, altValue)}
                    style={{ padding: "0.45rem 0.9rem", background: accent, border: "none", borderRadius: 6, color: "#fff", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    Opslaan
                  </button>
                  {altMsg && <span style={{ fontSize: "0.72rem", color: "#4ade80", whiteSpace: "nowrap" }}>{altMsg}</span>}
                </div>
                <div style={{ fontSize: "0.68rem", color: "#3a3a3a", marginTop: "0.3rem" }}>
                  Alt-tekst wordt gebruikt door zoekmachines en schermleessoftware
                </div>
              </div>

              {/* Acties */}
              <div style={{ padding: "0.75rem 1.25rem 1rem", borderTop: "1px solid #1a1a1a", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#1a1a1a", border: "1px solid #333", color: "#aaa", borderRadius: 8, fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
                  ↑ {activeUrl ? "Vervangen" : `Upload ${isVideo ? "video" : "foto"}`}
                  <input type="file" accept={accept} onChange={(e) => handleUpload(nextUploadKey, key, e)} style={{ display: "none" }} />
                </label>

                {activeUrl && (
                  <button onClick={() => handleDelete(nextUploadKey, key)} style={{ padding: "0.5rem 1rem", background: "none", border: "1px solid #333", color: "#555", borderRadius: 8, fontSize: "0.78rem", cursor: "pointer" }}>
                    ✕ Verwijderen
                  </button>
                )}

                {activeUrl && (
                  <span style={{ fontSize: "0.7rem", color: "#444", marginLeft: "auto" }}>
                    Actief: {activeUrl.split("/").pop()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
