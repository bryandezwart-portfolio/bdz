"use client";
import { useEffect, useRef, useState } from "react";

const DEFAULT_NAMES = ["Bryan de Zwart", "Radio DJ", "Label Owner", "BDZ Bookings", "Development"];
const DEFAULT_SUBTITLE = "Radio DJ · Label Owner · Bookings · Development";
const DEFAULT_TAGS = ["Radio Muziekstad", "Bryan de Zwart Music", "BDZ Bookings", "BDZScreens", "Development"];

const SOCIALS = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/bryandezwart.nl",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Facebook Music",
    url: "https://www.facebook.com/BryanDeZwartMusic",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/bdzmusic.nl",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/@BryanDeZwartMusic",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    url: "https://www.tiktok.com/@bdzmusic.nl",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label: "Threads",
    url: "https://www.threads.com/@bdzmusic.nl",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 012.325.111c-.1-.609-.3-1.07-.62-1.372-.399-.376-.985-.568-1.74-.574h-.047c-.64 0-1.68.173-2.3 1.179l-1.755-1.133C8.084 5.65 9.531 5.025 11.3 4.998h.07c1.37.01 2.528.37 3.44 1.07 1.034.79 1.67 1.99 1.887 3.57.063.447.098.908.106 1.378.52.293.993.637 1.406 1.038 1.003.966 1.598 2.18 1.72 3.52.173 1.956-.38 3.918-1.714 5.388-1.47 1.618-3.597 2.44-6.03 2.458z"/>
      </svg>
    ),
  },
];

export default function Hero() {
  const elRef = useRef<HTMLHeadingElement>(null);
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
  const [loaded, setLoaded] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

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
          fontSize: "clamp(24px, 8vw, 110px)",
          fontWeight: 900, lineHeight: 1,
          color: "white",
          textShadow: "0 0 60px rgba(230,57,70,0.3)",
          letterSpacing: -2,
          minHeight: "1.2em",
        }} />

        <p style={{
          marginTop: 20,
          fontSize: "clamp(10px, 3vw, 16px)",
          color: "rgba(240,240,240,0.5)",
          letterSpacing: 2, textTransform: "uppercase", fontWeight: 300,
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 0",
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

        {/* SOCIAL ICONS */}
        <div style={{
          marginTop: 36,
          display: "flex", gap: 16, justifyContent: "center", alignItems: "center",
        }}>
          {SOCIALS.map((social, i) => (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              onMouseEnter={() => setHoveredSocial(i)}
              onMouseLeave={() => setHoveredSocial(null)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 42, height: 42,
                borderRadius: "50%",
                border: `1px solid ${hoveredSocial === i ? "rgba(230,57,70,0.6)" : "rgba(255,255,255,0.1)"}`,
                background: hoveredSocial === i ? "rgba(230,57,70,0.12)" : "rgba(255,255,255,0.04)",
                color: hoveredSocial === i ? "var(--neon)" : "rgba(240,240,240,0.45)",
                backdropFilter: "blur(10px)",
                transition: "all 0.25s ease",
                boxShadow: hoveredSocial === i ? "0 0 16px rgba(230,57,70,0.25)" : "none",
                textDecoration: "none",
              }}
            >
              {social.icon}
            </a>
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
