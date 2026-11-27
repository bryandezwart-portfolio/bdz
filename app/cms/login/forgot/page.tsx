"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cmsConfig } from "@/lib/cms-config";

export default function ForgotPage() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [accentColor, setAccentColor] = useState(cmsConfig.accentColor);
  const [loginBg, setLoginBg] = useState<string | null>(null);
  const [loginBgType, setLoginBgType] = useState<"image" | "video">("image");

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((data) => {
        if (data.accentColor) setAccentColor(data.accentColor);
        if (data.loginBackground) {
          setLoginBg(data.loginBackground);
          const ext = data.loginBackground.split(".").pop()?.toLowerCase() ?? "";
          setLoginBgType(["mp4", "webm", "mov"].includes(ext) ? "video" : "image");
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/cms/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Er is iets misgegaan");
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch {
      setError("Kan geen verbinding maken");
      setStatus("error");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
      backgroundImage: loginBg && loginBgType === "image" ? `url('${loginBg}')` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {loginBg && loginBgType === "video" && (
        <video
          src={loginBg}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{
          width: "100%",
          maxWidth: 400,
          padding: "2.5rem",
          background: "rgba(10,10,10,0.92)",
          borderRadius: 16,
          border: "1px solid #222",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: accentColor, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0, color: "#fff" }}>Wachtwoord vergeten</h1>
          </div>

          {status === "done" ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#22c55e", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p style={{ color: "#fff", marginBottom: "0.5rem", fontWeight: 600 }}>E-mail verstuurd!</p>
              <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Als er een account bestaat voor <strong style={{ color: "#fff" }}>{username}</strong>, is er een reset-link verstuurd. Controleer ook je spam.
              </p>
              <Link href="/cms/login" style={{ color: accentColor, fontWeight: 600, textDecoration: "none" }}>← Terug naar inloggen</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1.5rem", textAlign: "center" }}>
                Vul je e-mailadres in. We sturen een reset-link naar dat adres.
              </p>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.85rem", color: "#ccc" }}>E-mailadres</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="jouw@emailadres.nl"
                style={{ width: "100%", padding: "0.75rem 1rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }}
              />
              {status === "error" && <p style={{ color: "#e63946", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                style={{ width: "100%", padding: "0.75rem", background: status === "loading" ? "#333" : accentColor, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.9rem", cursor: status === "loading" ? "not-allowed" : "pointer", marginBottom: "1rem" }}
              >
                {status === "loading" ? "Versturen…" : "Reset-link sturen"}
              </button>
              <div style={{ textAlign: "center" }}>
                <Link href="/cms/login" style={{ color: "#666", fontSize: "0.78rem", textDecoration: "none" }}>← Terug naar inloggen</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
