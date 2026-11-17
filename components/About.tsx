"use client";
import { useEffect, useRef, useState } from "react";

const ICONS = ["📻", "🎵", "🎤", "💻"];
const ACCENTS = ["#e63946", "#ff6b35", "#e63946", "#ff6b35"];

const DEFAULT_TITLE = "Muziek is mijn leven";
const DEFAULT_INTRO = "Begonnen als DJ op mijn vijftiende — sindsdien nooit meer gestopt. Van schoolfeesten tot radio, label en tech: ik bouw aan iets groots, stap voor stap.";
const DEFAULT_CARDS = [
  { role: "Radio DJ", sub: "Radio Muziekstad", desc: "Elke week op de radio — live sets, ochtendshows en eigen mixes.", link: "https://radiomuziekstad.nl" },
  { role: "Label Owner", sub: "Bryan de Zwart Music", desc: "Eigen releases en distributie voor artiesten in Nederpop, NL Urban & House.", link: "https://bdzmusic.nl" },
  { role: "Bookings", sub: "BDZ Bookings", desc: "Artiestenbureau — van contract tot optreden, alles geregeld.", link: "https://bdzbookings.nl" },
  { role: "Tech", sub: "BDZScreens & Planning Totaal", desc: "Software voor narrowcasting, coaches, klussers en salons.", link: "https://bdzscreens.nl" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [intro, setIntro] = useState(DEFAULT_INTRO);
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [extraCards, setExtraCards] = useState<{ role: string; sub: string; desc: string; link: string }[]>([]);

  useEffect(() => {
    fetch("/site-content.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.texts?.aboutTitle) setTitle(data.texts.aboutTitle);
        if (data.texts?.aboutIntro) setIntro(data.texts.aboutIntro);
        setCards([
          {
            role: data.texts?.card1Title ?? DEFAULT_CARDS[0].role,
            sub: data.texts?.card1Sub ?? DEFAULT_CARDS[0].sub,
            desc: data.texts?.card1Desc ?? DEFAULT_CARDS[0].desc,
            link: data.texts?.card1Link ?? DEFAULT_CARDS[0].link,
          },
          {
            role: data.texts?.card2Title ?? DEFAULT_CARDS[1].role,
            sub: data.texts?.card2Sub ?? DEFAULT_CARDS[1].sub,
            desc: data.texts?.card2Desc ?? DEFAULT_CARDS[1].desc,
            link: data.texts?.card2Link ?? DEFAULT_CARDS[1].link,
          },
          {
            role: data.texts?.card3Title ?? DEFAULT_CARDS[2].role,
            sub: data.texts?.card3Sub ?? DEFAULT_CARDS[2].sub,
            desc: data.texts?.card3Desc ?? DEFAULT_CARDS[2].desc,
            link: data.texts?.card3Link ?? DEFAULT_CARDS[2].link,
          },
          {
            role: data.texts?.card4Title ?? DEFAULT_CARDS[3].role,
            sub: data.texts?.card4Sub ?? DEFAULT_CARDS[3].sub,
            desc: data.texts?.card4Desc ?? DEFAULT_CARDS[3].desc,
            link: data.texts?.card4Link ?? DEFAULT_CARDS[3].link,
          },
        ]);
        if (data.extraCards) {
          setExtraCards(data.extraCards.map((c: { title: string; sub: string; desc: string; link: string }) => ({
            role: c.title, sub: c.sub, desc: c.desc, link: c.link,
          })));
        }
      })
      .catch(() => {/* geen bestand, gebruik defaults */});
  }, []);

  const allCards = [
    ...cards,
    ...extraCards.map((c) => ({ role: c.role, sub: c.sub, desc: c.desc, link: c.link })),
  ];
  const EXTRA_ICONS = ["🚀", "⭐"];
  const EXTRA_ACCENTS = ["#e63946", "#ff6b35"];

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
      id="over"
      ref={ref}
      style={{
        position: "relative",
        zIndex: 1,
        padding: "2rem 2.5rem 8rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <p className="fade-up section-label" style={{ textAlign: "center" }}>
        OVER MIJ
      </p>
      <h2
        className="fade-up section-title"
        style={{
          textAlign: "center",
          transitionDelay: "0.1s",
          marginBottom: "1rem",
        }}
      >
        {title.split(" ").slice(0, -1).join(" ")}{" "}
        <span style={{ color: "var(--neon)" }}>{title.split(" ").slice(-1)[0]}</span>
      </h2>
      <p
        className="fade-up section-text"
        style={{
          textAlign: "center",
          maxWidth: 620,
          margin: "0 auto 2.5rem",
          transitionDelay: "0.2s",
        }}
      >
        {intro}
      </p>


      {/* Cards grid */}
      <div id="watikdoe"
        className="fade-up"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
          transitionDelay: "0.3s",
        }}
      >
        {allCards.map((card, i) => (
          <a
            key={card.role}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "relative",
              flex: "0 0 260px",
              width: "260px",
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
              borderRadius: "16px",
              padding: "2rem 1.75rem",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              display: "block",
              textDecoration: "none",
              color: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-6px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 20px 40px #e6394633`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            {/* Glow accent top-left */}
            <div
              style={{
                position: "absolute",
                top: -40,
                left: -40,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: i < ACCENTS.length ? ACCENTS[i] : EXTRA_ACCENTS[i - ACCENTS.length],
                opacity: 0.08,
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            {/* Icon */}
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              {i < ICONS.length ? ICONS[i] : EXTRA_ICONS[i - ICONS.length]}
            </div>

            {/* Role */}
            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "0.25rem",
                fontFamily: "var(--font-orbitron)",
                letterSpacing: "0.02em",
              }}
            >
              {card.role}
            </h3>

            {/* Sub */}
            <p
              style={{
                fontSize: "0.72rem",
                color: i < ACCENTS.length ? ACCENTS[i] : EXTRA_ACCENTS[i - ACCENTS.length],
                letterSpacing: "0.1em",
                fontWeight: 600,
                marginBottom: "0.9rem",
                textTransform: "uppercase",
              }}
            >
              {card.sub}
            </p>

            {/* Desc */}
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                lineHeight: 1.6,
              }}
            >
              {card.desc}
            </p>

            {/* Bottom accent line */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(to right, ${i < ACCENTS.length ? ACCENTS[i] : EXTRA_ACCENTS[i - ACCENTS.length]}, transparent)`,
                opacity: 0.5,
              }}
            />

            {/* Pijltje rechtsboven */}
            <div style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              color: i < ACCENTS.length ? ACCENTS[i] : EXTRA_ACCENTS[i - ACCENTS.length],
              fontSize: "0.85rem",
              opacity: 0.6,
            }}>
              ↗
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
