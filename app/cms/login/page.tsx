"use client";
import { useState, useEffect } from "react";
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
  const [loginBg, setLoginBg] = useState<string | null>(null);
  const [loginBgType, setLoginBgType] = useState<"image" | "video">("image");

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((data) => {
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
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Image
              src={cmsConfig.logo.src}
              alt={cmsConfig.logo.alt}
              width={240}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </div>

          <h1 style={{
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "2rem",
          }}>
            Inloggen
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              placeholder="E-mailadres"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <input
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {error && (
              <p style={{
                color: accent,
                fontSize: "0.8rem",
                background: `${accent}18`,
                border: `1px solid ${accent}44`,
                borderRadius: 8,
                padding: "0.6rem 0.85rem",
                margin: 0,
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem",
                background: loading ? "#333" : accent,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Bezig..." : "Inloggen"}
            </button>

            <div style={{ textAlign: "center", marginTop: "0.25rem" }}>
              <Link
                href="/cms/login/forgot"
                style={{ color: "#666", fontSize: "0.78rem", textDecoration: "none" }}
              >
                Wachtwoord vergeten?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
