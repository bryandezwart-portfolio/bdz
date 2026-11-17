"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Verkeerd wachtwoord");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030507",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "3rem",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/Bryan-de-Zwart-nl-logo.png" alt="Bryan de Zwart" style={{ height: "40px" }} />
          <p style={{ color: "rgba(240,240,240,0.4)", fontSize: "0.8rem", marginTop: "0.75rem", letterSpacing: "0.1em" }}>
            BEHEER
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", color: "rgba(240,240,240,0.5)", fontSize: "0.75rem", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
              WACHTWOORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "0.85rem 1rem",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#e63946", fontSize: "0.8rem", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#e63946",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "0.9rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "BEZIG..." : "INLOGGEN"}
          </button>
        </form>
      </div>
    </div>
  );
}
