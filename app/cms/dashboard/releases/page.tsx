"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type ReleaseType = "single" | "ep" | "album" | "show";

interface Release {
  id: string;
  type: ReleaseType;
  title: string;
  date: string;
  link?: string;
  cover?: string;
  venue?: string;
}

const EMPTY = (): Release => ({
  id: crypto.randomUUID(),
  type: "single",
  title: "",
  date: new Date().toISOString().split("T")[0],
  link: "",
  cover: "",
  venue: "",
});

const TYPE_COLOR: Record<ReleaseType, string> = {
  single: "#9ca3af",
  ep: "#a78bfa",
  album: "#60a5fa",
  show: "#34d399",
};

export default function ReleasesPage() {
  const [items, setItems] = useState<Release[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Release>(EMPTY());

  const accent = cmsConfig.accentColor;

  useEffect(() => {
    fetch("/api/cms/releases").then((r) => r.json()).then((d) => {
      if (Array.isArray(d)) setItems(d);
    });
  }, []);

  async function save(list: Release[]) {
    setSaving(true);
    await fetch("/api/cms/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function addItem() {
    if (!form.title || !form.date) return;
    const updated = [...items, { ...form, id: crypto.randomUUID() }];
    setItems(updated);
    save(updated);
    setForm(EMPTY());
    setAdding(false);
  }

  function removeItem(id: string) {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    save(updated);
  }

  const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const now = new Date();

  const inp = {
    padding: "0.55rem 0.75rem",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    color: "#fff",
    fontSize: "0.83rem",
    width: "100%",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  };

  return (
    <div style={{ maxWidth: 740, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Releases & Shows</h1>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {saved && <span style={{ color: "#6f6", fontSize: "0.8rem", alignSelf: "center" }}>✓ Opgeslagen</span>}
          <button
            onClick={() => { setAdding((v) => !v); setForm(EMPTY()); }}
            style={{ padding: "0.5rem 1.1rem", background: adding ? "#2a2a2a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}
          >
            {adding ? "Annuleren" : "+ Toevoegen"}
          </button>
        </div>
      </div>

      {/* Formulier */}
      {adding && (
        <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ color: "#aaa", fontSize: "0.72rem", display: "block", marginBottom: 4 }}>TYPE</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ReleaseType })} style={{ ...inp }}>
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
                <option value="show">Show / Optreden</option>
              </select>
            </div>
            <div>
              <label style={{ color: "#aaa", fontSize: "0.72rem", display: "block", marginBottom: 4 }}>DATUM</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inp} />
            </div>
          </div>
          <div>
            <label style={{ color: "#aaa", fontSize: "0.72rem", display: "block", marginBottom: 4 }}>TITEL</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={form.type === "show" ? "Naam van het evenement" : "Naam van de release"} style={inp} />
          </div>
          {form.type === "show" && (
            <div>
              <label style={{ color: "#aaa", fontSize: "0.72rem", display: "block", marginBottom: 4 }}>LOCATIE / VENUE</label>
              <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Club X, Amsterdam" style={inp} />
            </div>
          )}
          <div>
            <label style={{ color: "#aaa", fontSize: "0.72rem", display: "block", marginBottom: 4 }}>LINK <span style={{ color: "#555" }}>(Spotify, ticketshop, etc.)</span></label>
            <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://open.spotify.com/..." style={inp} />
          </div>
          <div>
            <label style={{ color: "#aaa", fontSize: "0.72rem", display: "block", marginBottom: 4 }}>COVER URL <span style={{ color: "#555" }}>(optioneel)</span></label>
            <input type="text" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://... of /cover.jpg" style={inp} />
          </div>
          <button
            onClick={addItem}
            disabled={!form.title || !form.date}
            style={{ alignSelf: "flex-start", padding: "0.55rem 1.3rem", background: !form.title || !form.date ? "#222" : accent, color: !form.title || !form.date ? "#555" : "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.82rem", cursor: !form.title || !form.date ? "not-allowed" : "pointer" }}
          >
            Opslaan
          </button>
        </div>
      )}

      {/* Lijst */}
      {sorted.length === 0 ? (
        <div style={{ color: "#444", fontSize: "0.85rem", textAlign: "center", padding: "3rem 0" }}>
          Nog geen releases of shows. Klik op "+ Toevoegen" om te beginnen.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {sorted.map((item) => {
            const isPast = new Date(item.date) < now;
            const dateStr = new Date(item.date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "0.85rem 1rem", opacity: isPast ? 0.6 : 1 }}>
                {item.cover ? (
                  <img src={item.cover} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 6, background: "#1a1a1a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                    {item.type === "show" ? "🎤" : "🎵"}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 2 }}>{item.title}{item.venue ? ` @ ${item.venue}` : ""}</div>
                  <div style={{ color: "#555", fontSize: "0.73rem" }}>{dateStr}</div>
                </div>
                <span style={{ border: `1px solid ${TYPE_COLOR[item.type]}`, color: TYPE_COLOR[item.type], borderRadius: 20, padding: "2px 9px", fontSize: "0.65rem", fontWeight: 600, flexShrink: 0 }}>
                  {item.type.toUpperCase()}
                </span>
                <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: "1rem", padding: "0.2rem 0.4rem", flexShrink: 0 }} title="Verwijderen">
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
