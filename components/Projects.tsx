"use client";
import { useEffect, useRef, useState } from "react";

const cards = [
  {
    id: "bookings",
    icon: "🎤",
    title: "BRYAN DE ZWART BOOKINGS",
    text: "Een jong en groeiend artiestenbureau. Van Nederpop tot NL Urban — ik regel alles van het eerste telefoontje tot het laatste nummer. Persoonlijk, snel en professioneel.",
    link: "https://bdzbookings.nl",
    linkLabel: "BEKIJK BUREAU →",
  },
  {
    id: "radio",
    icon: "📻",
    title: "RADIO MUZIEKSTAD",
    text: "7 dagen per week op de radio met De Wakker & Wel Show. Studioopnames 's avonds voor het ochtendprogramma — altijd die perfecte mix klaar voor je ochtend.",
    link: "https://radiomuziekstad.nl",
    linkLabel: null,
  },
  {
    id: "music",
    icon: "🎵",
    title: "BRYAN DE ZWART MUSIC",
    text: "Mijn platenlabel. Ik distribueer House Muziek, Nederpop en NL Urban artiesten via Boep.nl en breng zelf techno releases uit. Klaar om jouw muziek de wereld in te sturen? Neem een kijkje.",
    link: "https://bdzmusic.nl",
    linkLabel: "NAAR LABEL →",
  },
  {
    id: "branding",
    icon: "✦",
    title: "BRANDING TOTAAL",
    text: "Logo's, Next.js websites met op maat CRM en SEO — alles onder één dak. Professioneel online staan zonder gedoe. SEO alleen in combinatie met een Branding Totaal website.",
    link: "https://claude.ai/artifact/9N8Rhmqs4xqedZ52xXU3q1",
    linkLabel: "BEKIJK DIENSTEN →",
  },
];

function Card({ card }: { card: (typeof cards)[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(230,57,70,0.05)" : "var(--glass)",
        border: `1px solid ${hovered ? "rgba(230,57,70,0.3)" : "var(--glass-border)"}`,
        borderRadius: "16px",
        padding: "2rem",
        transition: "all 0.3s",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.icon}</div>
      <h3
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          color: "var(--neon)",
          fontWeight: 700,
          marginBottom: "0.75rem",
        }}
      >
        {card.title}
      </h3>
      <p
        style={{
          color: "rgba(240,240,240,0.65)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          marginBottom: "1.25rem",
        }}
      >
        {card.text}
      </p>
      {card.linkLabel && (
        <a
          href={card.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--neon)",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          {card.linkLabel}
        </a>
      )}
    </div>
  );
}

export default function Projects() {
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
    <section
      id="watikdoe"
      ref={ref}
      style={{
        padding: "8rem 2.5rem",
        background: "var(--dark2)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p className="fade-up section-label">WAT IK DOE</p>
        <h2
          className="fade-up section-title"
          style={{ transitionDelay: "0.1s" }}
        >
          Alles onder{" "}
          <span style={{ color: "var(--neon)" }}>één dak</span>
        </h2>

        <div
          className="fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            marginTop: "3rem",
            transitionDelay: "0.2s",
          }}
        >
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
