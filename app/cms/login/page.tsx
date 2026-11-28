"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cmsConfig } from "@/lib/cms-config";

export default function CmsLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/cms/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Inloggen mislukt");
      }
    } finally {
      setLoading(false);
    }
  }

  const accent = cmsConfig.accentColor;

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; }
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('${cmsConfig.login.bgImage}');
          background-size: cover;
          background-position: center;
          font-family: system-ui, sans-serif;
          position: relative;
          overflow: hidden;
        }
        .login-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.58);
        }
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          background: rgba(6,6,10,0.88);
          border-radius: 20px;
          border: 1px solid ${accent}44;
          box-shadow: 0 24px 64px rgba(0,0,0,0.8), inset 0 1px 0 #ffffff08, 0 0 40px ${accent}18;
          backdrop-filter: blur(20px);
          margin: 1rem;
        }
        .login-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #0f0f16;
          border: 1px solid #2a2a38;
          border-radius: 10px;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
          font-family: system-ui, sans-serif;
        }
        .login-input:focus {
          border-color: ${accent};
        }
        .login-btn {
          width: 100%;
          padding: 0.78rem;
          background: #2a2a2a;
          color: #fff;
          border: 1px solid #3a3a3a;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          letter-spacing: 0.02em;
          font-family: system-ui, sans-serif;
          transition: background 0.2s;
        }
        .login-btn:hover { background: #333; }
        .login-btn:disabled { background: #1a1a1a; color: #555; box-shadow: none; cursor: not-allowed; }
      `}</style>

      <div className="login-page">
        <div className="login-overlay" />
        <div className="login-card">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Image
              src={cmsConfig.login.logo}
              alt={cmsConfig.logo.alt}
              width={cmsConfig.login.logoWidth}
              height={cmsConfig.login.logoHeight}
              style={{ objectFit: "contain" }}
            />
          </div>

          <h1 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, textAlign: "center", marginBottom: "2rem", letterSpacing: "0.01em" }}>
            Inloggen
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              className="login-input"
              type="text"
              placeholder="E-mailadres"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <input
              className="login-input"
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <p style={{ color: accent, fontSize: "0.8rem", background: `${accent}18`, border: `1px solid ${accent}44`, borderRadius: 8, padding: "0.6rem 0.85rem", margin: 0 }}>
                {error}
              </p>
            )}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Bezig..." : "Inloggen"}
            </button>

            <div style={{ textAlign: "center", marginTop: "0.25rem" }}>
              <Link href="/cms/login/forgot" style={{ color: "#555", fontSize: "0.78rem", textDecoration: "none" }}>
                Wachtwoord vergeten?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
