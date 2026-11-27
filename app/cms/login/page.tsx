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
  const hasVideoBg = loginBg && loginBgType === "video";
  // Gebruik vaste fallback achtergrond als er geen custom bg is
  const bgImage = loginBg && loginBgType === "image" ? loginBg : "/login-bg.png";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `url('${bgImage}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Donkere overlay zodat het formulier leesbaar blijft */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(2px)",
      }} />

      {/* Video achtergrond */}
      {hasVideoBg && (
        <video
          src={loginBg}
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
      )}

      {/* Login kaart */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center", padding: "1rem" }}>
        <div style={{
          width: "100%",
          maxWidth: 400,
          padding: "2.5rem",
          background: "rgba(6,6,10,0.90)",
          borderRadius: 20,
          border: `1px solid ${accent}35`,
          boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px #ffffff06, inset 0 1px 0 #ffffff08, 0 0 40px ${accent}12`,
          backdropFilter: "blur(24px)",
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

          <h1 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, textAlign: "center", marginBottom: "2rem", letterSpacing: "0.01em" }}>
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
              style={{ width: "100%", padding: "0.75rem 1rem", background: "#0f0f16", border: "1px solid #2a2a38", borderRadius: 10, color: "#fff", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = accent}
              onBlur={(e) => e.target.style.borderColor = "#2a2a38"}
            />
            <input
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: "100%", padding: "0.75rem 1rem", background: "#0f0f16", border: "1px solid #2a2a38", borderRadius: 10, color: "#fff", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = accent}
              onBlur={(e) => e.target.style.borderColor = "#2a2a38"}
            />

            {error && (
              <p style={{ color: accent, fontSize: "0.8rem", background: `${accent}18`, border: `1px solid ${accent}44`, borderRadius: 8, padding: "0.6rem 0.85rem", margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.78rem",
                background: loading ? "#333" : accent,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : `0 4px 24px ${accent}50`,
                letterSpacing: "0.02em",
              }}
            >
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
    </div>
  );
}
