"use client";
import { useEffect, useRef, useState } from "react";

const ICONS = ["📻", "🎵", "🎤", "💻", "✦"];
const ACCENTS = ["#e63946", "#ff6b35", "#e63946", "#ff6b35", "#e63946"];

const DEFAULT_TITLE = "Muziek is mijn leven";
const DEFAULT_INTRO = "Vijftien jaar oud, mijn eerste mengtafel gekocht en een radiozendertje laten bouwen — en draaien maar.\n\nIk ben Bryan de Zwart (1983) uit Nijmegen. Muziek zit in mijn bloed; mijn hart ligt bij de jaren 80, 90's en house. Sinds die allereerste uitzending op mijn vijftiende ben ik nooit meer gestopt.\n\nVan eind jaren 90 tot begin jaren 2000 draaide ik bij diverse Nijmeegse piratenzenders, puur uit passie. Later richtte ik mijn eigen online radiostation op: BigB21.nl. Inmiddels presenteer ik De Wakker & Wel Show bij Radio Muziekstad, run ik mijn eigen platenlabel (Bryan de Zwart Music) en heb ik een boekingsbureau opgezet.\n\nNaast mijn passie voor muziek heb ik een sterke drive voor techniek en ondernemen. Ik bouw websites en SaaS-oplossingen op maat. Zo begon BDZScreens ooit als een idee en is het nu volwaardige narrowcastingsoftware voor bedrijven. Daarnaast ontwikkel ik momenteel een slimme planningsapp voor salons, klussers en coaches, en help ik via Branding Totaal ondernemers aan websites en webshops op maat.";
const DEFAULT_CARDS = [
  { role: "Radio DJ", sub: "Radio Muziekstad", desc: "Elke week op de radio — live sets, ochtendshows en eigen mixes.", link: "https://radiomuziekstad.nl" },
  { role: "Label Owner", sub: "Bryan de Zwart Music", desc: "Eigen releases en distributie voor artiesten in Nederpop, NL Urban & House.", link: "https://bdzmusic.nl" },
  { role: "Bookings", sub: "BDZ Bookings", desc: "Artiestenbureau — van contract tot optreden, alles geregeld.", link: "https://bdzbookings.nl" },
  { role: "Tech", sub: "BDZScreens & Planning Totaal", desc: "Software voor narrowcasting, coaches, klussers en salons.", link: "https://bdzscreens.nl" },
  { role: "Branding Totaal", sub: "Logo's · Websites · SEO", desc: "Op maat gemaakte logo's, Next.js websites met eigen CRM en SEO. Professioneel online staan zonder gedoe.", link: "https://brandingtotaal.com" },
];

const DEFAULT_LIVE = {
  enabled: true,
  vacation: false,
  startHour: 8,
  endHour: 10,
  days: [1, 2, 3, 4, 5], // 0=zo, 1=ma … 6=za
};

function useLiveStatus(enabled: boolean, vacation: boolean, startHour: number, endHour: number, days: number[]) {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    function check() {
      if (!enabled || vacation) { setIsLive(false); return; }
      const now = new Date();
      const h = now.getHours();
      const d = now.getDay();
      setIsLive(h >= startHour && h < endHour && days.includes(d));
    }
    check();
    const timer = setInterval(check, 60000);
    return () => clearInterval(timer);
  }, [enabled, vacation, startHour, endHour, days]);

  return isLive;
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [intro, setIntro] = useState(DEFAULT_INTRO);
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [extraCards, setExtraCards] = useState<{ role: string; sub: string; desc: string; link: string }[]>([]);
  const [liveConfig, setLiveConfig] = useState(DEFAULT_LIVE);

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((data) => {
        if (data?.aboutTitle) setTitle(data.aboutTitle);
        if (data?.aboutIntro) setIntro(data.aboutIntro);
        setCards([
          {
            role: data?.card1Title ?? DEFAULT_CARDS[0].role,
            sub: data?.card1Sub ?? DEFAULT_CARDS[0].sub,
            desc: data?.card1Desc ?? DEFAULT_CARDS[0].desc,
            link: data?.card1Link ?? DEFAULT_CARDS[0].link,
          },
          {
            role: data?.card2Title ?? DEFAULT_CARDS[1].role,
            sub: data?.card2Sub ?? DEFAULT_CARDS[1].sub,
            desc: data?.card2Desc ?? DEFAULT_CARDS[1].desc,
            link: data?.card2Link ?? DEFAULT_CARDS[1].link,
          },
          {
            role: data?.card3Title ?? DEFAULT_CARDS[2].role,
            sub: data?.card3Sub ?? DEFAULT_CARDS[2].sub,
            desc: data?.card3Desc ?? DEFAULT_CARDS[2].desc,
            link: data?.card3Link ?? DEFAULT_CARDS[2].link,
          },
          {
            role: data?.card4Title ?? DEFAULT_CARDS[3].role,
            sub: data?.card4Sub ?? DEFAULT_CARDS[3].sub,
            desc: data?.card4Desc ?? DEFAULT_CARDS[3].desc,
            link: data?.card4Link ?? DEFAULT_CARDS[3].link,
          },
          DEFAULT_CARDS[4],
        ]);
        if (data.extraCards) {
          setExtraCards(data.extraCards.map((c: { title: string; sub: string; desc: string; link: string }) => ({
            role: c.title, sub: c.sub, desc: c.desc, link: c.link,
          })));
        }
        if (data.live) {
          setLiveConfig((prev) => ({
            ...prev,
            enabled: data.live.enabled ?? DEFAULT_LIVE.enabled,
            vacation: data.live.vacation ?? DEFAULT_LIVE.vacation,
            startHour: data.live.startHour ?? DEFAULT_LIVE.startHour,
            endHour: data.live.endHour ?? DEFAULT_LIVE.endHour,
            days: data.live.days ?? DEFAULT_LIVE.days,
          }));
        }
      })
      .catch(() => {/* geen bestand, gebruik defaults */});
  }, []);

  const isLive = useLiveStatus(liveConfig.enabled, liveConfig.vacation, liveConfig.startHour, liveConfig.endHour, liveConfig.days);

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
        scrollMarginTop: "64px",
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
      <div
        className="fade-up section-text"
        style={{
          textAlign: "center",
          maxWidth: 620,
          margin: "0 auto 2.5rem",
          transitionDelay: "0.2s",
        }}
      >
        {intro.startsWith("<") ? (
          <div dangerouslySetInnerHTML={{ __html: intro }} />
        ) : (
          intro.split("\n\n").map((p, i) => (
            <p key={i} style={{ marginBottom: i < intro.split("\n\n").length - 1 ? "1rem" : 0 }}>{p}</p>
          ))
        )}
      </div>


      {/* Cards grid */}
      <div id="watikdoe"
        className="fade-up"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
          transitionDelay: "0.3s",
          scrollMarginTop: "80px",
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

            {/* Live indicator — alleen op Radio DJ kaart (i === 0) */}
            {i === 0 && isLive && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "0.75rem",
                background: "rgba(230,57,70,0.12)",
                border: "1px solid rgba(230,57,70,0.3)",
                borderRadius: "100px",
                padding: "3px 10px 3px 7px",
              }}>
                <span style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#e63946",
                  boxShadow: "0 0 6px #e63946",
                  animation: "livePulse 1.5s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#e63946",
                  textTransform: "uppercase",
                }}>
                  Nu live
                </span>
              </div>
            )}

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

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}
