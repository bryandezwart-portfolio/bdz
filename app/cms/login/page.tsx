"use client";
import { useState } from "react";
import Image from "next/image";
import { cmsConfig } from "@/lib/cms-config";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await fetch("/api/cms/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const d = await r.json();
    setLoading(false);
    if (d.ok) window.location.href = "/cms/dashboard";
    else setError(d.error || "Inloggen mislukt");
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      {/* Achtergrond */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Image src="/cms-login-bg.jpg" alt="" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
      </div>

      {/* Login card */}
      <div style={{
        position: "relative", zIndex: 1,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: 380,
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <Image src={cmsConfig.logo.src} alt={cmsConfig.logo.alt} width={240} height={72} style={{ objectFit: "contain" }} />
        </div>

        <h1 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", textAlign: "center", marginBottom: "0.3rem" }}>Inloggen</h1>
        <p style={{ fontSize: "0.78rem", color: "#666", textAlign: "center", marginBottom: "1.75rem" }}></p>

        {error && (
          <div style={{ background: "#2a1010", border: "1px solid #442222", borderRadius: 8, padding: "0.6rem 0.9rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#f88" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <input
            type="text"
            placeholder="Gebruikersnaam"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", padding: "0.65rem 0.9rem", fontSize: "0.88rem", outline: "none" }}
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", padding: "0.65rem 0.9rem", fontSize: "0.88rem", outline: "none" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ background: "#9ca3af", border: "none", color: "#fff", borderRadius: 8, padding: "0.7rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", marginTop: "0.25rem", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Inloggen..." : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
