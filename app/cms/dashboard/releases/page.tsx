"use client";
import { useEffect, useState } from "react";
import { useCmsAccent } from "@/lib/useCmsAccent";

type Release = {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  coverUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  genre?: string;
  visible: boolean;
};

function newRelease(): Release {
  return { id: Date.now().toString(), title: "", artist: "", releaseDate: new Date().toISOString().split("T")[0], visible: true };
}

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const accent = useCmsAccent();

  useEffect(() => {
    fetch("/api/cms/save").then((r) => r.json()).then((d) => {
      setReleases(Array.isArray(d?.releases) ? d.releases : []);
    });
  }, []);

  function update(id: string, key: keyof Release, value: string | boolean) {
    setReleases((prev) => prev.map((r) => r.id === id ? { ...r, [key]: value } : r));
    setSaved(false);
  }

  function addRelease() {
    const r = newRelease();
    setReleases((prev) => [r, ...prev]);
    setExpanded(r.id);
    setSaved(false);
  }

  function removeRelease(id: string) {
    if (!confirm("Release verwijderen?")) return;
    setReleases((prev) => prev.filter((r) => r.id !== id));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const existing = await fetch("/api/cms/save").then((r) => r.json()).then((d) => d ?? {});
    await fetch("/api/cms/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...existing, releases }) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputStyle = { width: "100%", padding: "0.55rem 0.8rem", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.82rem", boxSizing: "border-box" as const };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Releases</h1>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={addRelease} style={{ padding: "0.45rem 1rem", background: "transparent", color: accent, border: `1px solid ${accent}`, borderRadius: 8, fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>+ Toevoegen</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "0.55rem 1.4rem", background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
          </button>
        </div>
      </div>

      {releases.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#555", border: "1px dashed #222", borderRadius: 12 }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎵</div>
          <div style={{ marginBottom: "0.5rem" }}>Geen releases gevonden</div>
          <button onClick={addRelease} style={{ padding: "0.45rem 1rem", background: accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>Eerste release toevoegen</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {releases.map((r) => (
          <div key={r.id} style={{ background: "#111", border: `1px solid ${expanded === r.id ? accent + "44" : "#1e1e1e"}`, borderRadius: 12, overflow: "hidden" }}>
            <div onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
              {r.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.coverUrl} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 44, height: 44, background: "#1a1a1a", borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🎵</div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.title || <span style={{ color: "#555" }}>Naamloos</span>}</div>
                <div style={{ color: "#666", fontSize: "0.75rem" }}>{r.artist} {r.releaseDate && `· ${r.releaseDate}`}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: 20, background: r.visible ? "#1a3a1a" : "#2a2a2a", color: r.visible ? "#4ade80" : "#555" }}>{r.visible ? "Zichtbaar" : "Verborgen"}</span>
                <span style={{ color: "#555", fontSize: "0.85rem" }}>{expanded === r.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {expanded === r.id && (
              <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem", borderTop: "1px solid #1a1a1a" }}>
                <div style={{ paddingTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div>
                    <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>TITEL</label>
                    <input type="text" value={r.title} onChange={(e) => update(r.id, "title", e.target.value)} placeholder="Titel" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>ARTIEST</label>
                    <input type="text" value={r.artist} onChange={(e) => update(r.id, "artist", e.target.value)} placeholder="Artiestennaam" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>RELEASEDATUM</label>
                    <input type="date" value={r.releaseDate} onChange={(e) => update(r.id, "releaseDate", e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>GENRE</label>
                    <input type="text" value={r.genre ?? ""} onChange={(e) => update(r.id, "genre", e.target.value)} placeholder="House, Techno, Nederpop..." style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>HOES URL</label>
                  <input type="url" value={r.coverUrl ?? ""} onChange={(e) => update(r.id, "coverUrl", e.target.value)} placeholder="https://..." style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div>
                    <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>SPOTIFY LINK</label>
                    <input type="url" value={r.spotifyUrl ?? ""} onChange={(e) => update(r.id, "spotifyUrl", e.target.value)} placeholder="https://open.spotify.com/..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>APPLE MUSIC LINK</label>
                    <input type="url" value={r.appleMusicUrl ?? ""} onChange={(e) => update(r.id, "appleMusicUrl", e.target.value)} placeholder="https://music.apple.com/..." style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid #1a1a1a" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.78rem", color: "#aaa" }}>
                    <input type="checkbox" checked={r.visible} onChange={(e) => update(r.id, "visible", e.target.checked)} style={{ accentColor: accent }} />
                    Zichtbaar op de website
                  </label>
                  <button onClick={() => removeRelease(r.id)} style={{ background: "none", border: "1px solid #3a1a1a", color: "#c44", borderRadius: 8, padding: "0.35rem 0.85rem", fontSize: "0.75rem", cursor: "pointer" }}>Verwijderen</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
