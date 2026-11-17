"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const defaultSEO = {
  title: "Bryan de Zwart — Radio DJ · Label Owner · Bookings · Tech",
  description: "Bryan de Zwart: Radio DJ bij Radio Muziekstad, eigenaar van Bryan de Zwart Bookings en Bryan de Zwart Music. Narrowcasting via BDZScreens.",
  keywords: "Bryan de Zwart, Radio DJ, Muziekstad, BDZ Bookings, artiestenbureau, platenlabel, BDZScreens, narrowcasting",
};

const defaultTexts = {
  // Hero sectie
  heroNames: "Bryan de Zwart, Radio DJ, Label Owner, BDZ Bookings, Development",
  heroSubtitle: "Radio DJ · Label Owner · Bookings · Tech · Development",
  heroTags: "Radio Muziekstad, Bryan de Zwart Music, BDZ Bookings, BDZScreens, Development",
  // Over mij sectie
  aboutTitle: "Muziek is mijn leven",
  aboutIntro: "Begonnen als DJ op mijn vijftiende — sindsdien nooit meer gestopt. Van schoolfeesten tot radio, label en tech: ik bouw aan iets groots, stap voor stap.",
  // Over mij cards
  card1Title: "Radio DJ",
  card1Sub: "Radio Muziekstad",
  card1Desc: "Elke week op de radio — live sets, ochtendshows en eigen mixes.",
  card1Link: "https://radiomuziekstad.nl",
  card2Title: "Label Owner",
  card2Sub: "Bryan de Zwart Music",
  card2Desc: "Eigen releases en distributie voor artiesten in Nederpop, NL Urban & House.",
  card2Link: "https://bdzmusic.nl",
  card3Title: "Bookings",
  card3Sub: "BDZ Bookings",
  card3Desc: "Artiestenbureau — van contract tot optreden, alles geregeld.",
  card3Link: "https://bdzbookings.nl",
  card4Title: "Tech",
  card4Sub: "BDZScreens & Planning Totaal",
  card4Desc: "Software voor narrowcasting, coaches, klussers en salons.",
  card4Link: "https://bdzscreens.nl",
  // Projects sectie
  bookingsText: "Een jong en groeiend artiestenbureau. Van Nederpop tot NL Urban — ik regel alles van het eerste telefoontje tot het laatste nummer. Persoonlijk, snel en professioneel.",
  radioText: "7 dagen per week op de radio met De Wakker & Wel Show. Studioopnames 's avonds voor het ochtendprogramma — altijd die perfecte mix klaar voor je ochtend.",
  musicText: "Mijn platenlabel. Ik distribueer House Muziek, Nederpop en NL Urban artiesten via Boep.nl en breng zelf techno releases uit. Klaar om jouw muziek de wereld in te sturen? Neem een kijkje.",
  textBlock: "",
  screensText: "Digitale schermen voor salons, scholen, horecabedrijven, praktijken en winkels. Beheer al je schermen vanuit één dashboard. Simpel, modern en effectief.",
};

const defaultExtraCards: { title: string; sub: string; desc: string; link: string }[] = [];

const defaultMedia = {
  spotifyPlaylistId: "37i9dQZF1DXcBWIGoYBM5M",
  videoUrl: "/bdz-nov.mp4",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem" }}>
      <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "0.06em" }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, multiline, maxLength, hint }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; maxLength?: number; hint?: string;
}) {
  const len = value.length;
  const over = maxLength && len > maxLength;
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <label style={{ color: "rgba(240,240,240,0.5)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>{label}</label>
        {maxLength && (
          <span style={{ fontSize: "0.72rem", color: over ? "#e63946" : "rgba(240,240,240,0.3)" }}>
            {len}/{maxLength}
          </span>
        )}
      </div>
      {hint && <p style={{ color: "rgba(240,240,240,0.3)", fontSize: "0.7rem", marginBottom: "0.4rem" }}>{hint}</p>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${over ? "#e63946" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", padding: "0.75rem 1rem", color: "white", fontSize: "0.875rem", resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${over ? "#e63946" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", padding: "0.75rem 1rem", color: "white", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [seo, setSeo] = useState(defaultSEO);
  const [texts, setTexts] = useState(defaultTexts);
  const [media, setMedia] = useState(defaultMedia);
  const [extraCards, setExtraCards] = useState(defaultExtraCards);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"seo" | "teksten" | "media">("seo");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Laad de bestaande site-content.json bij opstart
  useEffect(() => {
    fetch("/site-content.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.seo) setSeo((prev) => ({ ...prev, ...data.seo }));
        if (data.texts) setTexts((prev) => ({ ...prev, ...data.texts }));
        if (data.media) setMedia((prev) => ({ ...prev, ...data.media }));
        if (data.extraCards) setExtraCards(data.extraCards);
      })
      .catch(() => {/* geen bestand aanwezig, gebruik defaults */})
      .finally(() => setLoading(false));
  }, []);

  function addExtraCard() {
    if (extraCards.length >= 2) return;
    setExtraCards((prev) => [...prev, { title: "", sub: "", desc: "", link: "" }]);
    setSaved(false);
  }
  function updateExtraCard(idx: number, field: string, val: string) {
    setExtraCards((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));
    setSaved(false);
  }
  function removeExtraCard(idx: number) {
    setExtraCards((prev) => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }

  function updateSeo(key: keyof typeof defaultSEO, val: string) {
    setSeo((s) => ({ ...s, [key]: val }));
    setSaved(false);
  }
  function updateText(key: keyof typeof defaultTexts, val: string) {
    setTexts((t) => ({ ...t, [key]: val }));
    setSaved(false);
  }
  function updateMedia(key: keyof typeof defaultMedia, val: string) {
    setMedia((m) => ({ ...m, [key]: val }));
    setSaved(false);
  }

  async function handleSave() {
    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seo, texts, media, extraCards }),
    });
    if (res.ok) setSaved(true);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const tabStyle = (active: boolean) => ({
    padding: "0.6rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    background: active ? "#e63946" : "rgba(255,255,255,0.06)",
    color: "white",
  });

  // Extract ID from full URL if pasted
  const spotifyPreviewId = media.spotifyPlaylistId.includes("spotify.com")
    ? media.spotifyPlaylistId.split("/playlist/")[1]?.split("?")[0] ?? media.spotifyPlaylistId
    : media.spotifyPlaylistId;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#030507", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", fontSize: "0.8rem" }}>LADEN…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030507", fontFamily: "Inter, sans-serif", padding: "0 0 4rem" }}>
      {/* Header */}
      <div style={{ background: "rgba(3,5,7,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/Bryan-de-Zwart-nl-logo.png" alt="Bryan de Zwart" style={{ height: "32px" }} />
          <span style={{ color: "rgba(240,240,240,0.4)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>BEHEER</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/" target="_blank" style={{ color: "rgba(240,240,240,0.4)", fontSize: "0.75rem", textDecoration: "none", letterSpacing: "0.08em" }}>
            BEKIJK SITE →
          </a>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,240,240,0.4)", borderRadius: "8px", padding: "0.4rem 1rem", fontSize: "0.75rem", cursor: "pointer", letterSpacing: "0.08em" }}>
            UITLOGGEN
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 2rem 0" }}>
        <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Bryan de Zwart</h1>
        <p style={{ color: "rgba(240,240,240,0.4)", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Pas hier teksten, SEO en media aan. Sla op en push naar GitHub om live te zetten.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          <button style={tabStyle(activeTab === "seo")} onClick={() => setActiveTab("seo")}>SEO</button>
          <button style={tabStyle(activeTab === "teksten")} onClick={() => setActiveTab("teksten")}>TEKSTEN</button>
          <button style={tabStyle(activeTab === "media")} onClick={() => setActiveTab("media")}>MEDIA</button>
        </div>

        {activeTab === "seo" && (
          <Section title="SEO & Zoekmachines">
            <Field label="PAGINATITEL" value={seo.title} onChange={(v) => updateSeo("title", v)} maxLength={60} hint="50–60 tekens voor Google" />
            <Field label="META-OMSCHRIJVING" value={seo.description} onChange={(v) => updateSeo("description", v)} multiline maxLength={160} hint="140–160 tekens" />
            <Field label="KEYWORDS (komma-gescheiden)" value={seo.keywords} onChange={(v) => updateSeo("keywords", v)} multiline />
          </Section>
        )}

        {activeTab === "teksten" && (
          <>
            <Section title="Hero — Typemachine & ondertitel">
              <Field
                label="TYPEMACHINE WOORDEN (komma-gescheiden)"
                value={texts.heroNames}
                onChange={(v) => updateText("heroNames", v)}
                hint='Bijv. "Bryan de Zwart, Radio DJ, Label Owner" — roteert automatisch'
              />
              <Field
                label="ONDERTITEL (de rij onder de typemachine)"
                value={texts.heroSubtitle}
                onChange={(v) => updateText("heroSubtitle", v)}
                hint='Bijv. "Radio DJ · Label Owner · Bookings · Tech"'
              />
              <Field
                label="TAGS (komma-gescheiden)"
                value={texts.heroTags}
                onChange={(v) => updateText("heroTags", v)}
                hint='Bijv. "Radio Muziekstad, BDZ Bookings" — de knopjes onderaan de hero'
              />
            </Section>

            <Section title="Over mij — Titel & intro">
              <Field label="HOOFDTITEL (groot)" value={texts.aboutTitle} onChange={(v) => updateText("aboutTitle", v)} hint='Bijv. "Muziek is mijn leven" — het rode woord is het laatste woord' />
              <Field label="INTRO TEKST" value={texts.aboutIntro} onChange={(v) => updateText("aboutIntro", v)} multiline />
            </Section>

            <Section title="Over mij — Card 1: Radio DJ">
              <Field label="TITEL" value={texts.card1Title} onChange={(v) => updateText("card1Title", v)} />
              <Field label="SUBTITEL" value={texts.card1Sub} onChange={(v) => updateText("card1Sub", v)} />
              <Field label="BESCHRIJVING" value={texts.card1Desc} onChange={(v) => updateText("card1Desc", v)} multiline />
              <Field label="LINK (URL)" value={texts.card1Link} onChange={(v) => updateText("card1Link", v)} hint="Bijv. https://radiomuziekstad.nl — klikbaar op de card" />
            </Section>

            <Section title="Over mij — Card 2: Label Owner">
              <Field label="TITEL" value={texts.card2Title} onChange={(v) => updateText("card2Title", v)} />
              <Field label="SUBTITEL" value={texts.card2Sub} onChange={(v) => updateText("card2Sub", v)} />
              <Field label="BESCHRIJVING" value={texts.card2Desc} onChange={(v) => updateText("card2Desc", v)} multiline />
              <Field label="LINK (URL)" value={texts.card2Link} onChange={(v) => updateText("card2Link", v)} hint="Bijv. https://bdzmusic.nl" />
            </Section>

            <Section title="Over mij — Card 3: Bookings">
              <Field label="TITEL" value={texts.card3Title} onChange={(v) => updateText("card3Title", v)} />
              <Field label="SUBTITEL" value={texts.card3Sub} onChange={(v) => updateText("card3Sub", v)} />
              <Field label="BESCHRIJVING" value={texts.card3Desc} onChange={(v) => updateText("card3Desc", v)} multiline />
              <Field label="LINK (URL)" value={texts.card3Link} onChange={(v) => updateText("card3Link", v)} hint="Bijv. https://bdzbookings.nl" />
            </Section>

            <Section title="Over mij — Card 4: Tech">
              <Field label="TITEL" value={texts.card4Title} onChange={(v) => updateText("card4Title", v)} />
              <Field label="SUBTITEL" value={texts.card4Sub} onChange={(v) => updateText("card4Sub", v)} />
              <Field label="BESCHRIJVING" value={texts.card4Desc} onChange={(v) => updateText("card4Desc", v)} multiline />
              <Field label="LINK (URL)" value={texts.card4Link} onChange={(v) => updateText("card4Link", v)} hint="Bijv. https://bdzscreens.nl" />
            </Section>

            {/* Extra cards */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.06em", margin: 0 }}>
                  Extra cards ({extraCards.length}/2)
                </h2>
                {extraCards.length < 2 && (
                  <button
                    onClick={addExtraCard}
                    style={{ background: "#e63946", color: "white", border: "none", borderRadius: "8px", padding: "0.5rem 1.25rem", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}
                  >
                    + CARD TOEVOEGEN
                  </button>
                )}
              </div>
              {extraCards.length === 0 && (
                <p style={{ color: "rgba(240,240,240,0.3)", fontSize: "0.8rem" }}>Nog geen extra cards. Klik op "+ CARD TOEVOEGEN" om er een toe te voegen.</p>
              )}
              {extraCards.map((card, idx) => (
                <div key={idx} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ color: "rgba(240,240,240,0.5)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>EXTRA CARD {idx + 1}</span>
                    <button
                      onClick={() => removeExtraCard(idx)}
                      style={{ background: "none", border: "1px solid rgba(230,57,70,0.4)", color: "#e63946", borderRadius: "6px", padding: "0.3rem 0.75rem", fontSize: "0.72rem", cursor: "pointer" }}
                    >
                      VERWIJDEREN
                    </button>
                  </div>
                  <Field label="TITEL" value={card.title} onChange={(v) => updateExtraCard(idx, "title", v)} hint='Bijv. "Planning Totaal"' />
                  <Field label="SUBTITEL" value={card.sub} onChange={(v) => updateExtraCard(idx, "sub", v)} hint='Bijv. "Software voor coaches"' />
                  <Field label="BESCHRIJVING" value={card.desc} onChange={(v) => updateExtraCard(idx, "desc", v)} multiline />
                  <Field label="LINK (URL)" value={card.link} onChange={(v) => updateExtraCard(idx, "link", v)} hint="Bijv. https://planningtotaal.nl" />
                </div>
              ))}
            </div>

            <Section title="Vrije tekst (optioneel)">
              <Field label="TEKST" value={texts.textBlock} onChange={(v) => updateText("textBlock", v)} multiline hint="Verschijnt tussen de Over-kaarten en de Muziek sectie. Laat leeg om te verbergen." />
            </Section>
          </>
        )}

        {activeTab === "media" && (
          <>
            <Section title="Spotify Playlist">
              <Field
                label="PLAYLIST ID OF VOLLEDIGE URL"
                value={media.spotifyPlaylistId}
                onChange={(v) => updateMedia("spotifyPlaylistId", v)}
                hint="Bijv. 37i9dQZF1DXcBWIGoYBM5M — of plak de volledige Spotify-link"
              />
              {spotifyPreviewId && (
                <div style={{ marginTop: "1rem" }}>
                  <p style={{ color: "rgba(240,240,240,0.4)", fontSize: "0.72rem", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>VOORBEELD</p>
                  <iframe
                    style={{ borderRadius: "12px", width: "100%", height: "200px", border: "none" }}
                    src={`https://open.spotify.com/embed/playlist/${spotifyPreviewId}?utm_source=generator&theme=0`}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              )}
            </Section>

            <Section title="Achtergrondvideo (muziek sectie)">
              <Field
                label="VIDEO BESTANDSNAAM (in /public)"
                value={media.videoUrl}
                onChange={(v) => updateMedia("videoUrl", v)}
                hint="Bijv. /bdz-nov.mp4 — upload de video naar de public map van het project"
              />
              <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ color: "rgba(240,240,240,0.4)", fontSize: "0.72rem", margin: 0 }}>
                  💡 Zet het videobestand in de <code style={{ color: "var(--neon)" }}>public/</code> map van je project en gebruik de bestandsnaam hier.
                </p>
              </div>
            </Section>
          </>
        )}

        {/* Opslaan */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={handleSave}
            style={{ background: "#e63946", color: "white", border: "none", borderRadius: "10px", padding: "0.9rem 2.5rem", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}
          >
            OPSLAAN
          </button>
          {saved && (
            <span style={{ color: "#4ade80", fontSize: "0.8rem" }}>✓ Opgeslagen</span>
          )}
          <span style={{ color: "rgba(240,240,240,0.3)", fontSize: "0.75rem" }}>
            Push daarna naar GitHub → Vercel zet het live
          </span>
        </div>
      </div>
    </div>
  );
}
