"use client";
import { useState, useEffect } from "react";

function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          color: hovered ? "white" : "rgba(240,240,240,0.5)",
          textDecoration: "none",
          fontSize: "0.65rem",
          letterSpacing: "0.06em",
          fontWeight: 600,
          transition: "color 0.2s",
        }}
      >
        {label}
      </a>
    </li>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem",
        height: "64px",
        background: scrolled
          ? "rgba(3,5,7,0.95)"
          : "rgba(3,5,7,0.3)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      {/* Logo afbeelding */}
      <a href="#" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/Bryan-de-Zwart-nl-logo.png"
          alt="Bryan de Zwart"
          style={{ height: "28px", width: "auto", objectFit: "contain" }}
        />
      </a>

      <ul
        style={{
          display: "flex",
          gap: "1.2rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <NavLink label="WIE IS BRYAN" href="#over" />
        <NavLink label="WAT IK DOE" href="#watikdoe" />
        <NavLink label="MUZIEK" href="#muziek" />
      </ul>
    </nav>
  );
}
