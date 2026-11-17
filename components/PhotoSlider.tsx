"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const COLORS = ["#3b82f6", "#ff6b35", "#e63946", "#ffffff"];
const WORD = "Zwart";

export default function PhotoSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const [displayed, setDisplayed] = useState(WORD);
  const [deleting, setDeleting] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((activeSlide + 1) % 2);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeSlide]);

  function goTo(index: number) {
    if (transitioning || index === activeSlide) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveSlide(index);
      setTransitioning(false);
    }, 700);
  }

  useEffect(() => {
    function tick() {
      if (!deleting) {
        if (displayed.length < WORD.length) {
          timeoutRef.current = setTimeout(() => {
            setDisplayed(WORD.slice(0, displayed.length + 1));
          }, 100);
        } else {
          timeoutRef.current = setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (displayed.length > 0) {
          timeoutRef.current = setTimeout(() => {
            setDisplayed(displayed.slice(0, -1));
          }, 60);
        } else {
          setColorIndex((c) => (c + 1) % COLORS.length);
          setDeleting(false);
        }
      }
    }
    tick();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, deleting]);

  const currentColor = COLORS[colorIndex];

  return (
    <section style={{
      padding: "100px 24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(230,57,70,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Label */}
      <p style={{
        fontSize: 11,
        letterSpacing: "0.2em",
        color: "var(--neon)",
        textTransform: "uppercase",
        marginBottom: 12,
        fontFamily: "var(--font-orbitron)",
      }}>
        DE MAN ACHTER HET MERK
      </p>

      {/* Title */}
      <h2 style={{
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        fontWeight: 800,
        marginBottom: 48,
        color: "var(--text)",
      }}>
        Bryan de{" "}
        <span style={{
          color: currentColor,
          transition: "color 0.3s ease",
          borderRight: (displayed.length < WORD.length || deleting)
            ? `3px solid ${currentColor}` : "none",
          paddingRight: 2,
        }}>
          {displayed}
        </span>
      </h2>

      {/* Slider */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ position: "relative", width: 340, height: 340, margin: "0 auto" }}>

          {/* Slide 0: Quote */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: "3px solid rgba(230,57,70,0.4)",
            boxShadow: "0 0 50px rgba(230,57,70,0.25)",
            background: "linear-gradient(135deg, #0a0d12 0%, #12161e 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 40px",
            opacity: activeSlide === 0 ? (transitioning ? 0 : 1) : 0,
            transform: activeSlide === 0 ? (transitioning ? "scale(0.96)" : "scale(1)") : "scale(0.96)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}>
            <span style={{ fontSize: 36, color: "var(--neon)", lineHeight: 1, marginBottom: 10 }}>"</span>
            <p style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--text)",
              lineHeight: 1.5,
              textAlign: "center",
              margin: 0,
            }}>
              Ik ga door totdat<br />het perfect is!
            </p>
            <p style={{
              marginTop: 14,
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              color: "var(--neon)",
              textTransform: "uppercase",
              fontFamily: "var(--font-orbitron)",
            }}>
              — Bryan de Zwart
            </p>
          </div>

          {/* Slide 1: Foto */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid rgba(230,57,70,0.4)",
            boxShadow: "0 0 50px rgba(230,57,70,0.25)",
            opacity: activeSlide === 1 ? (transitioning ? 0 : 1) : 0,
            transform: activeSlide === 1 ? (transitioning ? "scale(0.96)" : "scale(1)") : "scale(0.96)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}>
            <div
              style={{ position: "absolute", inset: 0, zIndex: 2, background: "transparent" }}
              onContextMenu={(e) => e.preventDefault()}
            />
            <Image
              src="/bryandezwart-official.avif"
              alt="Bryan de Zwart"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "top center",
                pointerEvents: "none",
                userSelect: "none",
              }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              draggable={false}
            />
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: activeSlide === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: activeSlide === i ? "var(--neon)" : "rgba(255,255,255,0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
