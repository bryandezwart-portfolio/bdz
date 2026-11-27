"use client";
import { useEffect, useRef, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type Settings = {
  siteName?: string;
  siteUrl?: string;
  accentColor?: string;
  logoUrl?: string;
  loginBackground?: string;
};

export default function InstellingenPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const logoRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);
  const accent = settings.accentColor ?? cmsConfig.accentColor;

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          siteName: data.siteName ?? cmsConfig.siteName,
          siteUrl: data.siteUrl ?? cmsConfig.siteUrl,
          accentColor: data.accentColor ?? cmsConfig.accentColor,
          logoUrl: data.logoUrl ?? cmsConfig.logo.src,
          loginBackground: data.loginBackground ?? null,
        });
      });
  }, []);

  function update(key: keyof Settings, value: string) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setSuccess("");
    setError("");
    const res = await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) setSuccess("Instellingen opgeslagen!");
    else setError("Opslaan mislukt");
  }

  async function uploadFile(
    file: File,
    key: "logoUrl" | "loginBackground",
    setUploading: (v: boolean) => void
  ) {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/cms/media", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error || "Upload mislukt"); return; }
    const newSettings = { ...settings, [key]: data.url };
    setSettings(newSettings);
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });
    setSuccess("Opgeslagen!");
  }

  async function removeBg() {
    const newSettings = { ...settings, loginBackground: undefined };
    setSettings(newSettings);
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSettings, loginBackground: null }),
    });
    setSuccess("Achtergrond verwijderd");
  }

  const cardStyle: React.CSSProperties = {
    background: "#111",
    borderRadius: 12,
    border: "1px solid #222",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#999",
    display: "block",
    marginBottom: 6,
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.85rem",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 8,
    color: "#fff",
    fontSize: "0.88rem",
    boxSizing: "border-box",
    outline: "none",
  };

  const bgIsVideo = settings.loginBackground
    ? ["mp4", "webm", "mov"].includes(settings.loginBackground.split(".").pop()?.toLowerCase() ?? "")
    : false;

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem", color: "#fff" }}>
        Instellingen
      </h1>

      {/* ── Algemeen ── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginTop: 0, marginBottom: "1.25rem" }}>
          Algemeen
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Sitenaam</label>
            <input
              style={inputStyle}
              value={settings.siteName ?? ""}
              onChange={(e) => update("siteName", e.target.value)}
              placeholder="Mijn Website"
            />
          </div>
          <div>
            <label style={labelStyle}>Site URL (voor "Bekijk live" knop)</label>
            <input
              style={inputStyle}
              value={settings.siteUrl ?? ""}
              onChange={(e) => update("siteUrl", e.target.value)}
              placeholder="https://www.jouwsite.nl"
            />
          </div>
        </div>
      </div>

      {/* ── Logo ── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginTop: 0, marginBottom: "0.4rem" }}>
          Logo
        </h2>
        <p style={{ fontSize: "0.82rem", color: "#666", marginTop: 0, marginBottom: "1.25rem" }}>
          Verschijnt in de topbalk en op de loginpagina.
        </p>

        {settings.logoUrl && (
          <div style={{ marginBottom: "1rem", padding: "1rem", background: "#0a0a0a", borderRadius: 8, display: "inline-block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logoUrl} alt="Logo" style={{ height: 48, objectFit: "contain" }} />
          </div>
        )}

        <div>
          <button
            onClick={() => logoRef.current?.click()}
            disabled={uploadingLogo}
            style={{
              padding: "0.6rem 1.2rem",
              background: uploadingLogo ? "#333" : accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: uploadingLogo ? "not-allowed" : "pointer",
            }}
          >
            {uploadingLogo ? "Uploaden…" : "Logo uploaden"}
          </button>
          <span style={{ fontSize: "0.75rem", color: "#555", marginLeft: "0.75rem" }}>PNG, SVG, WebP</span>
          <input
            ref={logoRef}
            type="file"
            accept="image/png,image/svg+xml,image/webp,image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "logoUrl", setUploadingLogo); }}
          />
        </div>
      </div>

      {/* ── Kleuren ── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginTop: 0, marginBottom: "1.25rem" }}>
          Kleuren
        </h2>
        <div>
          <label style={labelStyle}>Accentkleur (knoppen, hover, badges)</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <input
              type="color"
              value={settings.accentColor ?? "#e63946"}
              onChange={(e) => update("accentColor", e.target.value)}
              style={{ width: 48, height: 40, border: "1px solid #333", borderRadius: 8, background: "none", cursor: "pointer", padding: 2 }}
            />
            <input
              style={{ ...inputStyle, width: 140 }}
              value={settings.accentColor ?? "#e63946"}
              onChange={(e) => update("accentColor", e.target.value)}
              placeholder="#e63946"
              maxLength={7}
            />
            <span style={{ fontSize: "0.78rem", color: "#555" }}>CMS + website</span>
          </div>
        </div>
      </div>

      {/* ── Loginpagina achtergrond ── */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginTop: 0, marginBottom: "0.4rem" }}>
          Loginpagina achtergrond
        </h2>
        <p style={{ fontSize: "0.82rem", color: "#666", marginTop: 0, marginBottom: "1.25rem" }}>
          Foto of video achter het inlogformulier.
        </p>

        {settings.loginBackground && (
          <div style={{ marginBottom: "1.25rem", borderRadius: 10, overflow: "hidden", position: "relative", height: 160 }}>
            {bgIsVideo ? (
              <video src={settings.loginBackground} autoPlay muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.loginBackground} alt="Achtergrond"
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
              display: "flex", alignItems: "flex-end", padding: "0.75rem",
            }}>
              <span style={{ fontSize: "0.75rem", color: "#ccc" }}>
                Huidige achtergrond ({bgIsVideo ? "video" : "afbeelding"})
              </span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => bgRef.current?.click()}
            disabled={uploadingBg}
            style={{
              padding: "0.6rem 1.2rem",
              background: uploadingBg ? "#333" : accent,
              color: "#fff", border: "none", borderRadius: 8,
              fontWeight: 600, fontSize: "0.88rem",
              cursor: uploadingBg ? "not-allowed" : "pointer",
            }}
          >
            {uploadingBg ? "Uploaden…" : settings.loginBackground ? "Vervangen" : "Achtergrond uploaden"}
          </button>
          {settings.loginBackground && (
            <button onClick={removeBg} style={{
              padding: "0.6rem 1.2rem", background: "transparent",
              color: "#e63946", border: "1px solid #e63946",
              borderRadius: 8, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
            }}>
              Verwijderen
            </button>
          )}
          <span style={{ fontSize: "0.75rem", color: "#555" }}>JPG, PNG, MP4, WebM — max 50 MB</span>
        </div>
        <input
          ref={bgRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "loginBackground", setUploadingBg); }}
        />
      </div>

      {/* ── Opslaan ── */}
      {success && <p style={{ color: "#16a34a", fontSize: "0.85rem", marginBottom: "0.75rem" }}>✓ {success}</p>}
      {error && <p style={{ color: "#e63946", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>}

      <button
        onClick={save}
        disabled={saving}
        style={{
          padding: "0.75rem 2rem",
          background: saving ? "#333" : accent,
          color: "#fff", border: "none", borderRadius: 10,
          fontWeight: 700, fontSize: "0.95rem",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Opslaan…" : "Instellingen opslaan"}
      </button>
    </div>
  );
}
