"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [partner, setPartner] = useState<string | null>(null);
  const [credit, setCredit] = useState<string | null>(null);
  const [copyright, setCopyright] = useState<string>("© 2026 Bryan de Zwart · BDZ Ventures · KvK 98283731");

  useEffect(() => {
    fetch("/api/cms/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings?.footerPartner) setPartner(d.settings.footerPartner);
        if (d.settings?.footerCredit) setCredit(d.settings.footerCredit);
        if (d.settings?.footerCopyright) setCopyright(d.settings.footerCopyright);
      })
      .catch(() => {});
  }, []);

  return (
    <footer style={{ padding: "4rem 2.5rem 2.5rem", borderTop: "1px solid var(--glass-border)", textAlign: "center" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <img src="/Bryan-de-Zwart-nl-logo.png" alt="Bryan de Zwart" style={{ height: "44px", width: "auto", objectFit: "contain" }} />
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.06em", marginBottom: "1.5rem" }}>
        Radio DJ · Label Owner · Bookings · Tech
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "2.5rem" }}>
        {[
          { label: "BDZ BOOKINGS", href: "https://bdzbookings.nl" },
          { label: "BDZ MUSIC", href: "https://bdzmusic.nl" },
          { label: "BDZSCREENS", href: "https://bdzscreens.nl" },
        ].map((link) => (
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
