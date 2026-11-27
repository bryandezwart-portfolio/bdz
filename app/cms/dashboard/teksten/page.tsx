"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cmsConfig } from "@/lib/cms-config";
import { useCmsAccent } from "@/lib/useCmsAccent";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

type Texts = Record<string, string>;

const ef = cmsConfig.enabledFields;
const cardsCount = ef.cardsCount ?? 4;

const FIELDS: { key: string; label: string; placeholder: string; rich: boolean }[] = [
  ...(ef.heroNames    ? [{ key: "heroNames",    label: "Hero — Roterende namen (komma gescheiden)", placeholder: "Bryan de Zwart, Radio DJ, Label Owner", rich: false }] : []),
  ...(ef.heroSubtitle ? [{ key: "heroSubtitle", label: "Hero — Ondertitel",                         placeholder: "Radio DJ · Label Owner · Bookings",     rich: false }] : []),
  ...(ef.heroTags     ? [{ key: "heroTags",     label: "Hero — Tags (komma gescheiden)",             placeholder: "Radio Muziekstad, BDZ Music",           rich: false }] : []),
  ...(ef.aboutTitle   ? [{ key: "aboutTitle",   label: "Over — Titel",                               placeholder: "Muziek is mijn leven",                  rich: false }] : []),
  ...(ef.aboutIntro   ? [{ key: "aboutIntro",   label: "Over — Introductietekst",                    placeholder: "Schrijf hier een introductie...",        rich: true  }] : []),
  ...(ef.cards ? Array.from({ length: cardsCount }, (_, i) => {
    const n = i + 1;
    return [
      { key: `card${n}Title`, label: `Kaart ${n} — Titel`,        placeholder: `Titel kaart ${n}`,        rich: false },
      { key: `card${n}Sub`,   label: `Kaart ${n} — Subtitel`,     placeholder: `Subtitel kaart ${n}`,     rich: false },
      { key: `card${n}Desc`,  label: `Kaart ${n} — Beschrijving`, placeholder: `Beschrijving kaart ${n}`, rich: true  },
      { key: `card${n}Link`,  label: `Kaart ${n} — Link`,         placeholder: "https://...",             rich: false },
    ];
  }).flat() : []),
];

function LivePreview({ data }: { data: Texts }) {
  const heroNames    = (data.heroNames || "Sitenaam").split(",").map((s) => s.trim()).filter(Boolean);
  const heroSubtitle = data.heroSubtitle || "";
  const heroTags     = (data.heroTags || "").split(",").map((s) => s.trim()).filter(Boolean);
  const aboutTitle   = data.aboutTitle || "";
  const aboutIntro   = data.aboutIntro || "";
  const cards = Array.from({ length: cardsCount }, (_, i) => {
    const n = i + 1;
    return { title: data[`card${n}Title`] || `Kaart ${n}`, sub: data[`card${n}Sub`] || "", desc: data[`card${n}Desc`] || "" };
  });

  return (
    <div style={{ background: "#0a0a0a", borderRadius: 12, border: "1px solid #222", overflow: "hidden", fontSize: "0.78rem", color: "#fff", position: "sticky", top: "1rem", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
      <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "0.5rem 1rem", fontSize: "0.68rem", color: "#555", letterSpacing: "0.08em" }}>LIVE VOORBEELD</div>
      {(ef.heroNames || ef.heroSubtitle || ef.heroTags) && (
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: "0.62rem", color: "#555", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>HERO</div>
          {ef.heroNames && <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.3rem" }}>{heroNames[0]}{heroNames.length > 1 && <span style={{ color: "#555", fontSize: "0.75rem", marginLeft: "0.4rem" }}>+{heroNames.length - 1} namen</span>}</div>}
          {ef.heroSubtitle && <div style={{ color: "#666", fontSize: "0.72rem", marginBottom: "0.5rem" }}>{heroSubtitle}</div>}
          {ef.heroTags && heroTags.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>{heroTags.map((tag, i) => <span key={i} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 4, padding: "2px 6px", fontSize: "0.62rem", color: "#777" }}>{tag}</span>)}</div>}
        </div>
      )}
      {(ef.aboutTitle || ef.aboutIntro) && (
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: "0.62rem", color: "#555", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>OVER</div>
          {ef.aboutTitle && <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem" }}>{aboutTitle}</div>}
          {ef.aboutIntro && (aboutIntro ? (aboutIntro.startsWith("<") ? <div style={{ color: "#aaa", fontSize: "0.72rem", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: aboutIntro }} /> : <div style={{ color: "#aaa", fontSize: "0.72rem", lineHeight: 1.6 }}>{aboutIntro}</div>) : <div style={{ color: "#333", fontSize: "0.72rem", fontStyle: "italic" }}>Introductietekst verschijnt hier...</div>)}
        </div>
      )}
      {ef.cards && (
        <div style={{ padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "0.62rem", color: "#555", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>KAARTEN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {cards.map((card, i) => (
              <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: "0.75rem" }}>
                <div style={{ fontWeight: 600, fontSize: "0.78rem", marginBottom: "0.15rem" }}>{card.title}</div>
                {card.sub && <div style={{ color: "#666", fontSize: "0.65rem", marginBottom: "0.3rem" }}>{card.sub}</div>}
                {card.desc ? (card.desc.startsWith("<") ? <div style={{ color: "#888", fontSize: "0.65rem", lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: card.desc }} /> : <div style={{ color: "#888", fontSize: "0.65rem", lineHeight: 1.5 }}>{card.desc}</div>) : <div style={{ color: "#333", fontSize: "0.65rem", fontStyle: "italic" }}>Beschrijving...</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TekstenPage() {
  const [data, setData]     = useState<Texts>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const accent = useCmsAccent();

  useEffect(() => {
    fetch("/api/cms/save").then((r) => r.json()).then((d) => setData(d ?? {}));
  }, []);

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/cms/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (FIELDS.length === 0) {
    return (
      <div style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>Teksten</h1>
        <div style={{ color: "#555", fontSize: "0.85rem" }}>Geen tekstvelden ingeschakeld voor deze site.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Teksten</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={() => setShowPreview((v) => !v)} style={{ padding: "0.45rem 1rem", background: "transparent", color: showPreview ? accent : "#555", border: `1px solid ${showPreview ? accent : "#333"}`, borderRadius: 8, fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
            {showPreview ? "Verberg preview" : "Toon preview"}
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "0.55rem 1.4rem", background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: showPreview ? "1fr 320px" : "1fr", gap: "1.5rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {FIELDS.map(({ key, label, placeholder, rich }) => {
            const value = data[key] ?? "";
            return (
              <div key={key}>
                <label style={{ color: "#aaa", fontSize: "0.75rem", display: "block", marginBottom: 6, letterSpacing: "0.05em" }}>{label}</label>
                {rich ? (
                  <RichTextEditor value={value} onChange={(html) => handleChange(key, html)} rows={key === "aboutIntro" ? 8 : 3} />
                ) : (
                  <input type="text" value={value} onChange={(e) => handleChange(key, e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "0.65rem 0.85rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", boxSizing: "border-box" }} />
                )}
              </div>
            );
          })}
        </div>
        {showPreview && <LivePreview data={data} />}
      </div>
    </div>
  );
}
