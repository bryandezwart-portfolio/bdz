"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { cmsConfig } from "@/lib/cms-config";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("Ongeldige resetlink. Vraag een nieuwe aan.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens zijn.");
      return;
    }
    if (password !== confirm) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/cms/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Er is iets misgegaan.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setTimeout(() => router.push("/cms/login"), 2500);
    } catch {
      setError("Netwerkfout. Probeer het opnieuw.");
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
        background: "#f4f4f5",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        {cmsConfig.logo && (
          <Image
            src={cmsConfig.logo.src}
            alt={cmsConfig.logo.alt}
            width={180}
            height={60}
            style={{ objectFit: "contain" }}
          />
        )}

        <div style={{ width: "100%", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0 0 0.25rem" }}>
            Nieuw wachtwoord
          </h1>
          <p style={{ color: "#888", fontSize: "0.9rem", margin: 0 }}>
            Kies een nieuw wachtwoord voor je account.
          </p>
        </div>

        {status === "success" ? (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 10,
              padding: "1rem",
              color: "#166534",
              textAlign: "center",
              width: "100%",
            }}
          >
            ✓ Wachtwoord succesvol ingesteld! Je wordt doorgestuurd naar de loginpagina…
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                Nieuw wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimaal 8 tekens"
                required
                minLength={8}
                disabled={status === "loading" || !token}
                style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: 8,
                  border: "1.5px solid #e2e8f0",
                  fontSize: "0.95rem",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                Herhaal wachtwoord
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Herhaal wachtwoord"
                required
                minLength={8}
                disabled={status === "loading" || !token}
                style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: 8,
                  border: "1.5px solid #e2e8f0",
                  fontSize: "0.95rem",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "0.65rem 0.85rem",
                  color: "#b91c1c",
                  fontSize: "0.88rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !token}
              style={{
                background: cmsConfig.accentColor ?? "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0.75rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: status === "loading" || !token ? "not-allowed" : "pointer",
                opacity: status === "loading" || !token ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {status === "loading" ? "Bezig…" : "Wachtwoord instellen"}
            </button>

            <a
              href="/cms/login"
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#888",
                textDecoration: "none",
              }}
            >
              ← Terug naar inloggen
            </a>
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
