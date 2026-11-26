"use client";
import { useEffect, useState } from "react";

export default function InstellingenPage() {
  const [logoSrc, setLogoSrc] = useState("");
  const [logoAlt, setLogoAlt] = useState("");
  const [siteName, setSiteName] = useState("");
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/cms/settings").then((r) => { if (r.status === 403) window.location.href = "/cms/dashboard"; });
    fetch("/api/cms/settings").then((r) => r.json()).then((d) => {
      if (d.settings) { setLogoSrc(d.settings.logoSrc || ""); setLogoAlt(d.settings.logoAlt || ""); setSiteName(d.settings.siteName || ""); }
    });
  }, []);

  const save = async () => {
    const r = await fetch("/api/cms/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ logoSrc, logoAlt, siteName }) });
    const d = await r.json();
    setMsg(d.ok ? "Instellingen opgeslagen ✓" : d.error);
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const r = await fetch("/api/cms/media", { method: "POST", body: form });
    const d = await r.json();
    setUploading(false);
    if (d.url) { setLogoSrc(d.url); setMsg("Logo geüpload ✓"); }
    else setMsg("Upload mislukt");
  };

  const inp = { background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, color: "#fff", padding: "0.45rem 0.75rem", fontSize: "0.85rem", width: "100%" } as React.CSSProperties;

  return (
    <div>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>Instellingen</h1>
      <p style={{ color: "#666", fontSize: "0.82rem", marginBottom: "2rem" }}>Logo en sitenaam voor dit CMS</p>
      {msg && <div style={{ background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8, padding: "0.6rem 1rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#6f6" }}>{msg}</div>}
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 520 }}>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.4rem" }}>Sitenaam</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Mijn Website" style={inp} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.4rem" }}>Logo URL</label>
          <input value={logoSrc} onChange={(e) => setLogoSrc(e.target.value)} placeholder="/logo.png" style={inp} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.4rem" }}>Logo uploaden</label>
          <input type="file" accept="image/*" onChange={uploadLogo} style={{ fontSize: "0.82rem", color: "#aaa" }} />
          {uploading && <p style={{ fontSize: "0.78rem", color: "#888", marginTop: "0.3rem" }}>Uploading...</p>}
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.4rem" }}>Logo alt-tekst</label>
          <input value={logoAlt} onChange={(e) => setLogoAlt(e.target.value)} placeholder="Branding Totaal" style={inp} />
        </div>
        {logoSrc && (
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.4rem" }}>Voorbeeld</label>
            <img src={logoSrc} alt={logoAlt} style={{ maxHeight: 50, maxWidth: 200, objectFit: "contain", background: "#222", padding: "0.5rem", borderRadius: 6 }} />
          </div>
        )}
        <button onClick={save} style={{ background: "#9ca3af", border: "none", color: "#fff", borderRadius: 8, padding: "0.6rem 1.25rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}>Opslaan</button>
      </div>
    </div>
  );
}
