"use client";
import { useEffect, useRef, useState } from "react";

const DEFAULT_NAMES = ["Bryan de Zwart", "Radio DJ", "Label Owner", "BDZ Bookings", "Development"];
const DEFAULT_SUBTITLE = "Radio DJ · Label Owner · Bookings · Tech · Development";
const DEFAULT_TAGS = ["Radio Muziekstad", "Bryan de Zwart Music", "BDZ Bookings", "BDZScreens", "Development"];

export default function Hero() {
  const elRef = useRef<HTMLHeadingElement>(null);
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/site-content.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.texts?.heroNames) {
          setNames(data.texts.heroNames.split(",").map((s: string) => s.trim()).filter(Boolean));
        }
        if (data.texts?.heroSubtitle) setSubtitle(data.texts.heroSubtitle);
        if (data.texts?.heroTags) {
          setTags(data.texts.heroTags.split(",").map((s: string) => s.trim()).filter(Boolean));
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    let ni = 0, ci = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    function type() {
      if (!elRef.current) return;
      const current = names[ni];
      if (!deleting) {
        elRef.current.textContent = current.slice(0, ++ci);
        if (ci === current.length) {
          deleting = true;
          timer = setTimeout(type, ni === 0 ? 3000 : 1800);
          return;
        }
        timer = setTimeout(type, 80);
      } else {
        elRef.current.textContent = current.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          ni = (ni + 1) % names.length;
          timer = setTimeout(type, 400);
          return;
        }
        timer = setTimeout(type, 40);
      }
    }
    timer = setTimeout(type, 800);
    return () => clearTimeout(timer);
  }, [loaded, names]);

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* VIDEO */}
      <video
        autoPlay muted loop playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
      >
        <source src="/bdz-nov.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(3,5,7,0.75) 0%, rgba(230,57,70,0.08) 50%, rgba(3,5,7,0.85) 100%)",
      }} />

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px" }}>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 11, letterSpacing: 6, color: "var(--neon)",
          textTransform: "uppercase", marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <span style={{ display: "inline-block", width: 40, height: 1, background: "var(--neon)", opacity: 0.5 }} />
          Official
          <span style={{ display: "inline-block", width: 40, height: 1, background: "var(--neon)", opacity: 0.5 }} />
        </div>

        <h1 ref={elRef} style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(40px, 9vw, 110px)",
          fontWeight: 900, lineHeight: 1,
          color: "white",
          textShadow: "0 0 60px rgba(230,57,70,0.3)",
          letterSpacing: -2,
          minHeight: "1.2em",
        }} />

        <p style={{
          marginTop: 20, fontSize: 16, color: "rgba(240,240,240,0.5)",
          letterSpacing: 2, textTransform: "uppercase", fontWeight: 300,
        }}>
          {subtitle.split("·").map((s, i, arr) => (
            <span key={i}>{s.trim()}{i < arr.length - 1 ? <>&nbsp;·&nbsp;</> : null}</span>
          ))}
        </p>

        <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {tags.map(tag => (
            <span key={tag} style={{
              padding: "8px 20px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 100, fontSize: 12, letterSpacing: 1,
              color: "rgba(240,240,240,0.5)",
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.04)",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        color: "rgba(240,240,240,0.4)", fontSize: 11, letterSpacing: 2,
      }}>
        <span>Scroll</span>
        <div style={{
          width: 1, height: 60,
          background: "linear-gradient(to bottom, var(--neon), transparent)",
          animation: "scrollAnim 2s infinite",
        }} />
      </div>

      <style>{`
        @keyframes scrollAnim {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}
