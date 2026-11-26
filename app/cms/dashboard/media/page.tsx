"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type MediaItem = { name: string; url: string; type: "image" | "video" };

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/cms/media")
      .then((r) => r.json())
      .then((d) => setItems(d.files ?? []));
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage("");

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/cms/media", { method: "POST", body: form });
    }

    const updated = await fetch("/api/cms/media").then((r) => r.json());
    setItems(updated.files ?? []);
    setUploading(false);
    setMessage("✓ Geüpload");
    setTimeout(() => setMessage(""), 3000);
    e.target.value = "";
  }

  const accent = cmsConfig.accentColor;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Media</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {message && <span style={{ color: "#1a7a1a", fontSize: "0.85rem" }}>{message}</span>}
          <label style={{
            padding: "0.55rem 1.4rem",
            background: uploading ? "#333" : accent,
            color: "#fff",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: uploading ? "not-allowed" : "pointer",
          }}>
            {uploading ? "Uploaden..." : "Upload bestand"}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleUpload}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{
          border: "2px dashed #222",
          borderRadius: 12,
          padding: "3rem",
          textAlign: "center",
          color: "#555",
          fontSize: "0.85rem",
        }}>
          Nog geen bestanden geüpload.<br />
          Klik op "Upload bestand" om te beginnen.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
          {items.map((item) => (
            <div key={item.name} style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.name} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
              ) : (
                <video src={item.url} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} muted />
              )}
              <div style={{ padding: "0.6rem 0.75rem" }}>
                <p style={{ fontSize: "0.72rem", color: "#666", margin: 0, wordBreak: "break-all" }}>{item.name}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(item.url); }}
                  style={{
                    marginTop: 6,
                    fontSize: "0.7rem",
                    color: accent,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Kopieer URL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
