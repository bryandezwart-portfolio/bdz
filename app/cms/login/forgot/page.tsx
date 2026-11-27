"use client";
import { useState } from "react";
import Link from "next/link";
import { cmsConfig } from "@/lib/cms-config";

export default function ForgotPage() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: cmsConfig.accentColor, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "#111" }}>Wachtwoord vergeten</h1>
        </div>
        {status === "done" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#22c55e", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p style={{ color: "#333", marginBottom: "0.5rem", fontWeight: 600 }}>E-mail verstuurd!</p>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Als er een account bestaat voor <strong>{username}</strong>, is er een reset-link verstuurd. Controleer ook je spam.
            </p>
            <Link href="/cms/login" style={{ color: cmsConfig.accentColor, fontWeight: 600, textDecoration: "none" }}>← Terug naar inloggen</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.5rem", textAlign: "center" }}>
              Vul je e-mailadres in. We sturen een reset-link naar dat adres.
            </p>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9rem" }}>E-mailadres</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="jouw@emailadres.nl"
              style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #ddd", borderRadius: 8, fontSize: "1rem", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }}
            />
            {status === "error" && <p style={{ color: "#e63946", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}
            <button type="submit" disabled={status === "loading"} style={{ width: "100%", padding: "0.8rem", background: cmsConfig.accentColor, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1rem", cursor: status === "loading" ? "not-allowed" : "pointer", opacity: status === "loading" ? 0.7 : 1, marginBottom: "1rem" }}>
              {status === "loading" ? "Versturen…" : "Reset-link sturen"}
            </button>
            <div style={{ textAlign: "center" }}>
              <Link href="/cms/login" style={{ color: "#666", fontSize: "0.85rem", textDecoration: "none" }}>← Terug naar inloggen</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
