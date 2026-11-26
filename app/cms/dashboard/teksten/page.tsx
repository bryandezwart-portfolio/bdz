"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type Texts = Record<string, string>;

const FIELDS = [
  { key: "heroNames", label: "Hero — Roterende namen (komma gescheiden)", placeholder: "Bryan de Zwart, Radio DJ, Label Owner" },
  { key: "heroSubtitle", label: "Hero — Ondertitel", placeholder: "Radio DJ · Label Owner · Bookings · Development" },
  { key: "heroTags", label: "Hero — Tags (komma gescheiden)", placeholder: "Radio Muziekstad, Bryan de Zwart Music, BDZ Bookings" },
  { key: "aboutTitle", label: "Over mij — Titel", placeholder: "Muziek is mijn leven" },
  { key: "aboutIntro", label: "Over mij — Introductietekst", placeholder: "Vijftien jaar oud, mijn eerste mengtafel..." },
  { key: "card1Title", label: "Kaart 1 — Titel", placeholder: "Radio DJ" },
  { key: "card1Sub", label: "Kaart 1 — Subtitel", placeholder: "Radio Muziekstad" },
  { key: "card1Desc", label: "Kaart 1 — Beschrijving", placeholder: "Elke week op de radio..." },
  { key: "card1Link", label: "Kaart 1 — Link", placeholder: "https://radiomuziekstad.nl" },
  { key: "card2Title", label: "Kaart 2 — Titel", placeholder: "Label Owner" },
  { key: "card2Sub", label: "Kaart 2 — Subtitel", placeholder: "Bryan de Zwart Music" },
  { key: "card2Desc", label: "Kaart 2 — Beschrijving", placeholder: "Eigen releases en distributie..." },
  { key: "card2Link", label: "Kaart 2 — Link", placeholder: "https://bdzmusic.nl" },
  { key: "card3Title", label: "Kaart 3 — Titel", placeholder: "Bookings" },
  { key: "card3Sub", label: "Kaart 3 — Subtitel", placeholder: "BDZ Bookings" },
  { key: "card3Desc", label: "Kaart 3 — Beschrijving", placeholder: "Artiestenbureau..." },
  { key: "card3Link", label: "Kaart 3 — Link", placeholder: "https://bdzbookings.nl" },
  { key: "card4Title", label: "Kaart 4 — Titel", placeholder: "Tech" },
  { key: "card4Sub", label: "Kaart 4 — Subtitel", placeholder: "BDZScreens & Planning Totaal" },
  { key: "card4Desc", label: "Kaart 4 — Beschrijving", placeholder: "Software voor narrowcasting..." },
  { key: "card4Link", label: "Kaart 4 — Link", placeholder: "https://bdzscreens.nl" },
];

export default function TekstenPage() {
  const [data, setData] = useState<Texts>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((d) => setData(d ?? {}));
  }, []);

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const accent = cmsConfig.accentColor;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Teksten</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.55rem 1.4rem",
            background: saved ? "#1a7a1a" : accent,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {FIELDS.map(({ key, label, placeholder }) => {
          const value = data[key] ?? "";
          const isLong = placeholder.length > 60 || key.includes("Intro") || key.includes("Desc");
          return (
            <div key={key}>
              <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>
                {label}
              </label>
              {isLong ? (
                <textarea
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  rows={key === "aboutIntro" ? 8 : 3}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: "0.85rem",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
