"use client";
import { useEffect, useRef } from "react";

// Video en Spotify ID — later via admin/site-content.json instelbaar
const VIDEO_URL = "/bdz-nov.mp4";
const SPOTIFY_PLAYLIST_ID = "37i9dQZF1DXcBWIGoYBM5M";

export default function Socials() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll(".fade-up");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {/* ── MUZIEK SECTIE met video achtergrond ── */}
      <section
        id="muziek"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "9rem 2.5rem",
        }}
      >
        {/* Video achtergrond */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: 0.18,
            filter: "blur(2px) brightness(0.7)",
            pointerEvents: "none",
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Donkere overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(3,5,7,0.6) 0%, rgba(3,5,7,0.5) 50%, rgba(3,5,7,0.8) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <p className="fade-up section-label">MUZIEK</p>
          <h2
            className="fade-up section-title"
            style={{ transitionDelay: "0.1s" }}
          >
            Mijn favoriete{" "}
            <span style={{ color: "var(--neon)" }}>tracks</span>
          </h2>
          <div
            className="fade-up"
            style={{ marginTop: "2.5rem", transitionDelay: "0.2s" }}
          >
            <iframe
              style={{
                borderRadius: "16px",
                width: "100%",
                height: "380px",
                border: "none",
              }}
              src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
