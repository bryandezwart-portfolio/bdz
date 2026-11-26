"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type MediaItem = { name: string; url: string; type: "image" | "video" };
type UsageLabel = { label: string; section: string; color: string };

const FIELD_MAP = [
  { key: "heroVideo",   label: "Hero video",       section: "Homepagina · Hero",   color: "#7c3aed" },
  { key: "heroBgImage", label: "Hero achtergrond", section: "Homepagina · Hero",   color: "#2563eb" },
  { key: "logoSrc",     label: "Logo",             section: "CMS & header",        color: "#b45309" },
  { key: "ogImage",     label: "SEO afbeelding",   section: "Alle paginas · SEO",  color: "#dc2626" },
];

function getUsageLabels(url, content, settings, seo, releases) {
  if (!url) return [];
  const labels = [];
  for (const { key, label, section, color } of FIELD_MAP) {
    const val = content[key] || settings[key] || seo[key];
    if (val && val === url) labels.push({ label, section, color });
  }
  releases.forEach((r) => {
    if (r.cover && r.cover === url) {
      labels.push({ label: "Release cover", section: "Homepagina · Releases" + (r.title ? " · \"" + r.title + "\"" : ""), color: "#0891b2" });
    }
  });
  return labels;
}

export default function MediaPage() {
  const [items, setItems]         = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage]     = useState("");
  const [content, setContent]     = useState({});
  const [settings, setSettings]   = useState({});
  const [seo, setSeo]             = useState({});
  const [releases, setReleases]   = useState([]);

  useEffect(() => {
    fetch("/api/cms/media").then((r) => r.json()).then((d) => setItems(d.files ?? []));
    fetch("/api/cms/save").then((r) => r.json()).then((d) => setContent(d ?? {}));
    fetch("/api/cms/settings").then((r) => r.json()).then((d) => setSettings(d?.settings ?? d ?? {}));
    fetch("/api/cms/seo").then((r) => r.json()).then((d) => setSeo(d ?? {}));
    fetch("/api/cms/releases").then((r) => r.json()).then((d) => setReleases(Array.isArray(d) ? d : []));
  }, []);

  async function handleUpload(e) {
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
    setMessage("Geupload");
    setTimeout(() => setMessage(""), 3000);
    e.target.value = "";
  }

  async function handleDelete(name) {
    if (!confirm("Weet je zeker dat je dit bestand wil verwijderen?")) return;
    await fetch("/api/cms/media?name=" + encodeURIComponent(name), { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.name !== name));
  }

  const accent = cmsConfig.accentColor;

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Media</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {message && <span style={{ color: "#1a7a1a", fontSize: "0.85rem" }}>{message}</span>}
          <label style={{ padding: "0.55rem 1.4rem", background: uploading ? "#333" : accent, color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: uploading ? "not-allowed" : "pointer" }}>
            {uploading ? "Uploaden..." : "Upload bestand"}
            <input type="file" accept="image/*,video/*" multiple onChange={handleUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ border: "2px dashed #222", borderRadius: 12, padding: "3rem", textAlign: "center", color: "#555", fontSize: "0.85rem" }}>
          Nog geen bestanden geupload.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {items.map((item) => {
            const labels = getUsageLabels(item.url, content, settings, seo, releases);
            return (
              <div key={item.name} style={{ background: "#111", border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
                {item.type === "image" ? (
                  <img src={item.url} alt={item.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                ) : (
                  <video src={item.url} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} muted />
                )}
                <div style={{ padding: "0.6rem 0.75rem 0" }}>
                  {labels.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {labels.map(({ label, section, color }) => (
                        <div key={label}>
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 20, background: color + "22", color, border: "1px solid " + color + "44", display: "inline-block" }}>{label}</span>
                          <div style={{ fontSize: "0.62rem", color: "#555", paddingLeft: "0.3rem", marginTop: "0.1rem" }}>{section}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: 20, background: "#ffffff0a", color: "#444", display: "inline-block" }}>Niet in gebruik</span>
                  )}
                </div>
                <div style={{ padding: "0.5rem 0.75rem 0.75rem" }}>
                  <p style={{ fontSize: "0.68rem", color: "#444", margin: "0 0 0.5rem", wordBreak: "break-all" }}>{item.name}</p>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button onClick={() => navigator.clipboard.writeText(item.url)} style={{ fontSize: "0.7rem", color: accent, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Kopieer URL</button>
                    <button onClick={() => handleDelete(item.name)} style={{ fontSize: "0.7rem", color: "#555", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Verwijder</button>
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
