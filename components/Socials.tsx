"use client";
import { useEffect, useRef, useState } from "react";

const VIDEO_URL = "/bdz-nov.mp4";
const DEFAULT_PLAYLIST_ID = "37i9dQZF1DXcBWIGoYBM5M";

export default function Socials() {
  const ref = useRef<HTMLDivElement>(null);
  const [playlistId, setPlaylistId] = useState(DEFAULT_PLAYLIST_ID);

  useEffect(() => {
    fetch("/site-content.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.media?.spotifyPlaylistId) {
          setPlaylistId(data.media.spotifyPlaylistId);
        }
      })
      .catch(() => {});
  }, []);

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
            {/* Neon gloed wrapper */}
            <div style={{
              borderRadius: "20px",
              padding: "3px",
              background: "linear-gradient(135deg, rgba(230,57,70,0.6) 0%, rgba(230,57,70,0.1) 50%, rgba(230,57,70,0.4) 100%)",
              boxShadow: "0 0 30px rgba(230,57,70,0.25), 0 0 60px rgba(230,57,70,0.1)",
            }}>
              <iframe
                style={{
                  borderRadius: "17px",
                  width: "100%",
                  height: "380px",
                  border: "none",
                  display: "block",
                }}
                src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
