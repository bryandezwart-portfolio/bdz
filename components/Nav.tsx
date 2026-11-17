"use client";
import { useState, useEffect } from "react";

const LINKS = [
  { label: "WIE IS BRYAN", href: "#over" },
  { label: "WAT IK DOE", href: "#watikdoe" },
  { label: "MUZIEK", href: "#muziek" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Sluit menu bij klik op link
  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          height: "64px",
          background: scrolled || menuOpen
            ? "rgba(3,5,7,0.97)"
            : "rgba(3,5,7,0.3)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled || menuOpen
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/Bryan-de-Zwart-nl-logo.png"
            alt="Bryan de Zwart"
            style={{ height: "28px", width: "auto", objectFit: "contain" }}
          />
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <ul style={{ display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }}>
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  style={{
                    color: "rgba(240,240,240,0.5)",
                    textDecoration: "none",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,240,240,0.5)")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Hamburger knop */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              alignItems: "flex-end",
            }}
            aria-label="Menu"
          >
            <span style={{
              display: "block",
              width: menuOpen ? "22px" : "22px",
              height: "2px",
              background: "white",
              borderRadius: "2px",
              transition: "transform 0.3s, opacity 0.3s",
              transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
            }} />
            <span style={{
              display: "block",
              width: "16px",
              height: "2px",
              background: "white",
              borderRadius: "2px",
              transition: "opacity 0.3s",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block",
              width: "22px",
              height: "2px",
              background: "white",
              borderRadius: "2px",
              transition: "transform 0.3s, opacity 0.3s",
              transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            }} />
          </button>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 199,
            background: "rgba(3,5,7,0.97)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            maxHeight: menuOpen ? "300px" : "0px",
            transition: "max-height 0.4s ease",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "1rem 0" }}>
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={handleLinkClick}
                  style={{
                    display: "block",
                    padding: "1rem 2rem",
                    color: "rgba(240,240,240,0.7)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                    transition: "color 0.2s, background 0.2s",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.background = "rgba(230,57,70,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(240,240,240,0.7)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
