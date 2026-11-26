"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cmsConfig } from "@/lib/cms-config";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("Geen geldige reset-link. Vraag een nieuwe aan.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }
    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens zijn");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/cms/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Er is iets misgegaan");
        setStatus("error");
      } else {
        setStatus("done");
        setTimeout(() => router.push("/cms/login"), 2500);
      }
    } catch {
      setError("Kan geen verbinding maken");
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "2.5rem",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: cmsConfig.accentColor,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "#111" }}>
            Nieuw wachtwoord instellen
          </h1>
        </div>

        {status === "done" ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ color: "#333", fontWeight: 600, marginBottom: "0.5rem" }}>
              Wachtwoord gewijzigd!
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Je wordt doorgestuurd naar de loginpagina…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {!token ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#e63946", marginBottom: "1rem" }}>{error}</p>
                <Link
                  href="/cms/login/forgot"
                  style={{ color: cmsConfig.accentColor, fontWeight: 600, textDecoration: "none" }}
                >
                  Nieuwe reset-link aanvragen
                </Link>
              </div>
            ) : (
              <>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                  Nieuw wachtwoord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Minimaal 8 tekens"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid #ddd",
                    borderRadius: 8,
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: "1rem",
                  }}
                />

                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                  Herhaal wachtwoord
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Zelfde wachtwoord"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid #ddd",
                    borderRadius: 8,
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: "1rem",
                  }}
                />

                {error && (
                  <p style={{ color: "#e63946", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    background: cmsConfig.accentColor,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.7 : 1,
                    marginBottom: "1rem",
                  }}
                >
                  {status === "loading" ? "Opslaan…" : "Wachtwoord opslaan"}
                </button>

                <div style={{ textAlign: "center" }}>
                  <Link
                    href="/cms/login"
                    style={{ color: "#666", fontSize: "0.85rem", textDecoration: "none" }}
                  >
                    ← Terug naar inloggen
                  </Link>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
