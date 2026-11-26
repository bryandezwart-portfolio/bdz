"use client";
import { useEffect, useState } from "react";

const DEFAULT_SUBTITLE = "Radio DJ · Label Owner · Bookings · Tech";
const DEFAULT_LINKS = [
  { label: "BDZ BOOKINGS", href: "https://bdzbookings.nl" },
  { label: "BDZ MUSIC",    href: "https://bdzmusic.nl"   },
  { label: "BDZSCREENS",   href: "https://bdzscreens.nl" },
];

export default function Footer() {
  const [partner,   setPartner]   = useState<string | null>(null);
  const [credit,    setCredit]    = useState<string | null>(null);
  const [copyright, setCopyright] = useState("© 2026 Bryan de Zwart · BDZ Ventures · KvK 98283731");
  const [subtitle,  setSubtitle]  = useState(DEFAULT_SUBTITLE);
  const [links,     setLinks]     = useState(DEFAULT_LINKS);

  useEffect(() => {
    fetch("/api/cms/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        if (s.footerPartner)   setPartner(s.footerPartner);
        if (s.footerCredit)    setCredit(s.footerCredit);
        if (s.footerCopyright) setCopyright(s.footerCopyright);
        if (s.footerSubtitle)  setSubtitle(s.footerSubtitle);

        // Linkparen: als minstens één label/url ingevuld is, vervang de defaults
        const l1 = s.footerLink1Label || s.footerLink1Url ? { label: s.footerLink1Label || "Link 1", href: s.footerLink1Url || "#" } : null;
        const l2 = s.footerLink2Label || s.footerLink2Url ? { label: s.footerLink2Label || "Link 2", href: s.footerLink2Url || "#" } : null;
        const l3 = s.footerLink3Label || s.footerLink3Url ? { label: s.footerLink3Label || "Link 3", href: s.footerLink3Url || "#" } : null;
        const custom = [l1, l2, l3].filter(Boolean) as typeof DEFAULT_LINKS;
        if (custom.length > 0) setLinks(custom);
      })
      .catch(() => {});
  }, []);

  return (
    <footer style={{ padding: "4rem 2.5rem 2.5rem", borderTop: "1px solid var(--glass-border)", textAlign: "center" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <img src="/Bryan-de-Zwart-nl-logo.png" alt="Bryan de Zwart" style={{ height: "44px", width: "auto", objectFit: "contain" }} />
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.06em", marginBottom: "1.5rem" }}>
        {subtitle}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "2.5rem" }}>
        {links.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--muted)", fontSize: "0.72rem", letterSpacing: "0.1em", textDecoration: "none" }}>
            {link.label}
          </a>
        ))}
      </div>
      <p style={{ color: "rgba(240,240,240,0.2)", fontSize: "0.72rem", letterSpacing: "0.06em", marginBottom: partner || credit ? "0.5rem" : 0 }}>
        {copyright}
      </p>
      {(partner || credit) && (
        <p style={{ color: "rgba(240,240,240,0.12)", fontSize: "0.62rem", letterSpacing: "0.06em" }}>
          {partner && <span>{partner}</span>}
          {partner && credit && <span> · </span>}
          {credit && <span>{credit}</span>}
        </p>
      )}
    </footer>
  );
}
