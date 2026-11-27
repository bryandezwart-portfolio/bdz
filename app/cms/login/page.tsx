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
    <>
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-20px) scale(1.05); }
        }
        .orb1 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, ${accent}33 0%, transparent 70%);
          top: -100px;
          left: -100px;
          animation: float 8s ease-in-out infinite;
          pointer-events: none;
        }
        .orb2 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, ${accent}22 0%, transparent 70%);
          bottom: -80px;
          right: -80px;
          animation: float 10s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .orb3 {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffffff08 0%, transparent 70%);
          top: 40%;
          left: 60%;
          animation: float 12s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: loginBg && loginBgType === "image"
          ? `url('${loginBg}') center/cover`
          : "linear-gradient(135deg, #060608 0%, #0d0d14 25%, #080810 50%, #0a0a0d 75%, #060608 100%)",
        backgroundSize: loginBg && loginBgType === "image" ? "cover" : "400% 400%",
        animation: !loginBg ? "gradientShift 15s ease infinite" : undefined,
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Animated orbs — alleen als er geen eigen achtergrond is */}
        {!loginBg && (
          <>
            <div className="orb1" />
            <div className="orb2" />
            <div className="orb3" />
          </>
        )}

        {/* Video achtergrond */}
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

        {/* Grid overlay voor texture */}
        {!loginBg && (
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }} />
        )}

        <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center", padding: "1rem" }}>
          <div style={{
            width: "100%",
            maxWidth: 400,
            padding: "2.5rem",
            background: "rgba(8,8,12,0.88)",
            borderRadius: 20,
            border: `1px solid ${accent}30`,
            boxShadow: `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px #ffffff08, inset 0 1px 0 #ffffff0a`,
            backdropFilter: "blur(20px)",
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
              letterSpacing: "0.01em",
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
                  background: "#0f0f14",
                  border: "1px solid #2a2a35",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = accent}
                onBlur={(e) => e.target.style.borderColor = "#2a2a35"}
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
                  background: "#0f0f14",
                  border: "1px solid #2a2a35",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = accent}
                onBlur={(e) => e.target.style.borderColor = "#2a2a35"}
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
                  padding: "0.78rem",
                  background: loading ? "#333" : `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s, transform 0.1s",
                  boxShadow: loading ? "none" : `0 4px 20px ${accent}44`,
                  letterSpacing: "0.02em",
                }}
                onMouseOver={(e) => { if (!loading) (e.target as HTMLButtonElement).style.opacity = "0.9"; }}
                onMouseOut={(e) => { (e.target as HTMLButtonElement).style.opacity = "1"; }}
              >
                {loading ? "Bezig..." : "Inloggen"}
              </button>

              <div style={{ textAlign: "center", marginTop: "0.25rem" }}>
                <Link
                  href="/cms/login/forgot"
                  style={{ color: "#555", fontSize: "0.78rem", textDecoration: "none" }}
                >
                  Wachtwoord vergeten?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
