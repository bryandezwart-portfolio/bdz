"use client";
import { useEffect, useRef, useState } from "react";
import { useCmsAccent } from "@/lib/useCmsAccent";

type MediaItem = {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  size?: number;
  uploadedAt?: string;
};

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [items, setItems]         = useState<MediaItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected]   = useState<string | null>(null);
  const [copied, setCopied]       = useState<string | null>(null);
  const [filter, setFilter]       = useState<"all" | "image" | "video">("all");
  const fileRef = useRef<HTMLInputElement>(null);
  const accent = useCmsAccent();

  useEffect(() => {
    fetch("/api/cms/media").then((r) => r.json()).then((d) => {
      setItems(Array.isArray(d?.items) ? d.items : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("file", f));
    const res = await fetch("/api/cms/media", { method: "POST", body: form });
    const json = await res.json();
    if (json.items) setItems((prev) => [...json.items, ...prev]);
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bestand verwijderen?")) return;
    await fetch("/api/cms/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selected === id) setSelected(null);
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const filtered = items.filter((i) => filter === "all" || i.type === filter);
  const selectedItem = items.find((i) => i.id === selected);

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Media</h1>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: "0.55rem 1.4rem", background: accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: uploading ? "not-allowed" : "pointer" }}>
          {uploading ? "Uploaden..." : "Uploaden"}
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={(e) => handleUpload(e.target.files)} />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {(["all", "image", "video"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.35rem 0.9rem", background: filter === f ? accent : "transparent", color: filter === f ? "#fff" : "#555", border: `1px solid ${filter === f ? accent : "#2a2a2a"}`, borderRadius: 20, fontSize: "0.75rem", cursor: "pointer" }}>
            {f === "all" ? "Alles" : f === "image" ? "Afbeeldingen" : "Video's"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", color: "#555", fontSize: "0.75rem", alignSelf: "center" }}>{filtered.length} bestanden</span>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        style={{ display: "grid", gridTemplateColumns: selected ? "1fr 300px" : "1fr", gap: "1.25rem", alignItems: "start" }}
      >
        <div>
          {loading ? (
            <div style={{ color: "#555", fontSize: "0.85rem", textAlign: "center", padding: "3rem" }}>Laden...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#555", border: "2px dashed #222", borderRadius: 12 }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📁</div>
              <div style={{ marginBottom: "0.5rem" }}>Geen bestanden</div>
              <div style={{ fontSize: "0.75rem" }}>Sleep bestanden hierheen of klik Uploaden</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
              {filtered.map((item) => (
                <div key={item.id} onClick={() => setSelected(selected === item.id ? null : item.id)} style={{ background: "#111", border: `2px solid ${selected === item.id ? accent : "#1e1e1e"}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s" }}>
                  {item.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.name} style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", height: 100, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🎬</div>
                  )}
                  <div style={{ padding: "0.5rem" }}>
                    <div style={{ fontSize: "0.68rem", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    {item.size && <div style={{ fontSize: "0.62rem", color: "#555", marginTop: 2 }}>{formatBytes(item.size)}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedItem && (
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, overflow: "hidden", position: "sticky", top: "1rem" }}>
            {selectedItem.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedItem.url} alt={selectedItem.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
            ) : (
              <video src={selectedItem.url} controls style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
            )}
            <div style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.25rem", wordBreak: "break-all" }}>{selectedItem.name}</div>
              {selectedItem.size && <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "0.75rem" }}>{formatBytes(selectedItem.size)}</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button onClick={() => copyUrl(selectedItem.url, selectedItem.id)} style={{ padding: "0.5rem", background: copied === selectedItem.id ? "#1a3a1a" : "#1a1a1a", color: copied === selectedItem.id ? "#4ade80" : "#aaa", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: "0.75rem", cursor: "pointer" }}>
                  {copied === selectedItem.id ? "✓ Gekopieerd" : "URL kopiëren"}
                </button>
                <button onClick={() => handleDelete(selectedItem.id)} style={{ padding: "0.5rem", background: "none", color: "#c44", border: "1px solid #3a1a1a", borderRadius: 8, fontSize: "0.75rem", cursor: "pointer" }}>
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
