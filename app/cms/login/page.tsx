"use client";
import { useEffect, useRef, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

export default function InstellingenPage() {
  const [current, setCurrent] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<"image" | "video">("image");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const accent = cmsConfig.accentColor;

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((data) => {
        if (data.loginBackground) {
          setCurrent(data.loginBackground);
          const ext = data.loginBackground.split(".").pop()?.toLowerCase() ?? "";
          setCurrentType(["mp4", "webm", "mov"].includes(ext) ? "video" : "image");
        }
      });
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess("");

    const form = new FormData();
    form.append("file", file);

    const upload = await fetch("/api/cms/media", { method: "POST", body: form });
    const uploadData = await upload.json();

    if (!upload.ok) {
      setError(uploadData.error || "Upload mislukt");
      setUploading(false);
      return;
    }

    const url = uploadData.url as string;
    const save = await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginBackground: url }),
    });

    if (save.ok) {
      setCurrent(url);
      const ext = url.split(".").pop()?.toLowerCase() ?? "";
      setCurrentType(["mp4", "webm", "mov"].includes(ext) ? "video" : "image");
      setSuccess("Achtergrond opgeslagen!");
    } else {
      setError("Opslaan mislukt");
    }
    setUploading(false);
  }

  async function handleRemove() {
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginBackground: null }),
    });
    setCurrent(null);
    setSuccess("Achtergrond verwijderd");
  }

  const cardStyle: React.CSSProperties = {
    background: "#111",
    borderRadius: 12,
    border: "1px solid #222",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem", color: "#fff" }}>
        Instellingen
      </h1>

      {/* Login achtergrond */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginTop: 0, marginBottom: "0.4rem" }}>
          Loginpagina achtergrond
        </h2>
        <p style={{ fontSize: "0.82rem", color: "#666", marginTop: 0, marginBottom: "1.25rem" }}>
          Upload een foto of video die achter het inlogformulier verschijnt.
        </p>

        {/* Huidige achtergrond preview */}
        {current && (
          <div style={{ marginBottom: "1.25rem", borderRadius: 10, overflow: "hidden", position: "relative", height: 180 }}>
            {currentType === "video" ? (
              <video
                src={current}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current}
                alt="Login achtergrond"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
              display: "flex", alignItems: "flex-end", padding: "0.75rem",
            }}>
              <span style={{ fontSize: "0.75rem", color: "#ccc" }}>
                Huidige achtergrond ({currentType === "video" ? "video" : "afbeelding"})
              </span>
            </div>
          </div>
        )}

        {/* Upload knop */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              padding: "0.6rem 1.2rem",
              background: uploading ? "#333" : accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploaden…" : current ? "Vervangen" : "Achtergrond uploaden"}
          </button>

          {current && (
            <button
              onClick={handleRemove}
              style={{
                padding: "0.6rem 1.2rem",
                background: "transparent",
                color: "#e63946",
                border: "1px solid #e63946",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
              }}
            >
              Verwijderen
            </button>
          )}

          <span style={{ fontSize: "0.75rem", color: "#555" }}>
            JPG, PNG, MP4, WebM — max 50 MB
          </span>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          style={{ display: "none" }}
          onChange={handleUpload}
        />

        {success && (
          <p style={{ color: "#16a34a", fontSize: "0.82rem", marginTop: "0.75rem", marginBottom: 0 }}>
            ✓ {success}
          </p>
        )}
        {error && (
          <p style={{ color: "#e63946", fontSize: "0.82rem", marginTop: "0.75rem", marginBottom: 0 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
