"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type MediaItem = { name: string; url: string; type: "image" | "video" };

type UsageLabel = { label: string; color: string };

function getUsageLabels(url: string, settings: Record<string, string>, content: Record<string, string>): UsageLabel[] {
  const labels: UsageLabel[] = [];
  if (!url) return labels;

  const checks: { key: string; label: string; color: string }[] = [
    { key: "heroVideo",      label: "Hero video",         color: "#7c3aed" },
    { key: "heroBgImage",    label: "Hero achtergrond",   color: "#2563eb" },
    { key: "photo",          label: "Profielfoto",        color: "#059669" },
    { key: "logo",           label: "Logo",               color: "#b45309" },
    { key: "ogImage",        label: "SEO afbeelding",     color: "#dc2626" },
  ];

  for (const { key, label, color } of checks) {
    const val = settings[key] || content[key];
    if (val && val.includes(url.split("/").pop() ?? "")) {
      labels.push({ label, color });
    }
  }

  // Check releases cover images
  if ((settings["releasesJson"] ?? "").includes(url.split("/").pop() ?? "")) {
    labels.push({ label: "Release cover", color: "#0891b2" });
  }

  return labels;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [content, setContent] = useState<Record<string, string>>({});
  const [releasesJson, setReleasesJson] = useState("");

  useEffect(() => {
    fetch("/api/cms/media").then((r) => r.json()).then((d) => setItems(d.files ?? []));
    fetch("/api/cms/settings").then((r) => r.json()).then((d) => setSettings(d ?? {}));
    fetch("/api/cms/content").then((r) => r.json()).then((d) => setContent(d ?? {}));
    fetch("/api/cms/releases").then((r) => r.json()).then((d) => setReleasesJson(JSON.stringify(d)));
  }, []);

  const settingsWithReleases = { ...settings, releasesJson };

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

  async function handleDelete(name: string) {
    if (!confirm(`Weet je zeker dat je "${name}" wil verwijderen?`)) return;
    await fetch(`/api/cms/media?name=${encodeURIComponent(name)}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.name !== name));
  }

  const accent = cmsConfig.accentColor;

  return (
    <div style={{ maxWidth: 980 }}>
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
          Klik op &quot;Upload bestand&quot; om te beginnen.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
          {items.map((item) => {
            const labels = getUsageLabels(item.url, settingsWithReleases, content);
            return (
              <div key={item.name} style={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: 10,
                overflow: "hidden",
              }}>
                {/* Preview */}
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.name}
                    style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <video
                    src={item.url}
                    style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                    muted
                  />
                )}

                {/* Usage labels */}
                {labels.length > 0 && (
                  <div style={{ padding: "0.5rem 0.75rem 0", display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {labels.map(({ label, color }) => (
                      <span key={label} style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        padding: "0.2rem 0.5rem",
                        borderRadius: 20,
                        background: color + "22",
                        color,
                        border: `1px solid ${color}44`,
                      }}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}
                {labels.length === 0 && (
                  <div style={{ padding: "0.5rem 0.75rem 0" }}>
                    <span style={{
                      fontSize: "0.65rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: 20,
                      background: "#ffffff11",
                      color: "#555",
                    }}>
                      Niet in gebruik
                    </span>
                  </div>
                )}

                {/* Info + actions */}
                <div style={{ padding: "0.5rem 0.75rem 0.75rem" }}>
                  <p style={{ fontSize: "0.72rem", color: "#555", margin: "0 0 0.5rem", wordBreak: "break-all" }}>
                    {item.name}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <button
                      onClick={() => { navigator.clipboard.writeText(item.url); }}
                      style={{
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
                    <button
                      onClick={() => handleDelete(item.name)}
                      style={{
                        fontSize: "0.7rem",
                        color: "#555",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Verwijder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
