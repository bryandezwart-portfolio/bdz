"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";
import { useCmsAccent } from "@/lib/useCmsAccent";

type SeoData = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  googleVerification?: string;
  structuredDataName?: string;
  structuredDataType?: string;
  structuredDataPhone?: string;
  structuredDataEmail?: string;
  structuredDataAddress?: string;
};

type CompetitorResult = {
  url: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  h1?: string;
  score?: number;
  tips?: string[];
};

export default function SeoPage() {
  const [data, setData] = useState<SeoData>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [competing, setCompeting] = useState(false);
  const [competitor, setCompetitor] = useState<CompetitorResult | null>(null);
  const [competitorError, setCompetitorError] = useState("");
  const accent = useCmsAccent();

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((d) => {
        setData(d ?? {});
        setIsMaster(d?.role === "master" || false);
      });
    // Check of master via session
    fetch("/api/cms/session")
      .then((r) => r.json())
      .then((s) => { if (s?.role === "master" || s?.role === "seo") setIsMaster(true); })
      .catch(() => {});
  }, []);

  function handleChange(key: keyof SeoData, value: string | boolean) {
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

  async function analyzeCompetitor() {
    if (!competitorUrl) return;
    setCompeting(true);
    setCompetitor(null);
    setCompetitorError("");
    try {
      const res = await fetch("/api/cms/competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: competitorUrl }),
      });
      const result = await res.json();
      if (!res.ok) setCompetitorError(result.error || "Analyse mislukt");
      else setCompetitor(result);
    } catch {
      setCompetitorError("Kan geen verbinding maken");
    } finally {
      setCompeting(false);
    }
  }

  const inp = { width: "100%", padding: "0.65rem 0.85rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", boxSizing: "border-box" as const };
  const lbl = { color: "#aaa", fontSize: "0.75rem", display: "block" as const, marginBottom: 6, letterSpacing: "0.05em" };
  const hint = { color: "#555", fontSize: "0.68rem", marginTop: 4 };
  const card = { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1.25rem" };
  const section = { fontSize: "0.72rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1rem" };

  const myScore = (() => {
    let s = 0;
    if (data.metaTitle && data.metaTitle.length >= 10) s += 20;
    if (data.metaDescription && data.metaDescription.length >= 50) s += 20;
    if (data.metaKeywords) s += 10;
    if (data.ogTitle) s += 10;
    if (data.ogImage) s += 15;
    if (data.canonicalUrl) s += 10;
    if (data.structuredDataName) s += 15;
    return s;
  })();

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>SEO</h1>
        <button onClick={handleSave} disabled={saving} style={{ padding: "0.55rem 1.4rem", background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
        </button>
      </div>

      {/* SEO Score */}
      <div style={{ ...card, marginBottom: "1.25rem" }}>
        <div style={section}>SEO SCORE</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 99, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${myScore}%`, background: myScore >= 70 ? "#22c55e" : myScore >= 40 ? "#f59e0b" : "#e63946", borderRadius: 99, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: myScore >= 70 ? "#22c55e" : myScore >= 40 ? "#f59e0b" : "#e63946", minWidth: 40 }}>{myScore}/100</div>
        </div>
        <div style={{ color: "#555", fontSize: "0.72rem", marginTop: 8 }}>
          {myScore < 40 && "Vul minimaal meta titel, beschrijving en canonical URL in."}
          {myScore >= 40 && myScore < 70 && "Goed begin! Voeg OG afbeelding en structured data toe voor een hogere score."}
          {myScore >= 70 && "Uitstekend! Je SEO is goed ingesteld."}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Zoekmachines */}
        <div style={card}>
          <div style={section}>ZOEKMACHINES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={lbl}>Meta titel</label>
              <input type="text" value={data.metaTitle ?? ""} onChange={(e) => handleChange("metaTitle", e.target.value)} placeholder={cmsConfig.siteName} style={inp} />
              <div style={hint}>{(data.metaTitle ?? "").length}/60 tekens aanbevolen</div>
            </div>
            <div>
              <label style={lbl}>Meta beschrijving</label>
              <textarea value={data.metaDescription ?? ""} onChange={(e) => handleChange("metaDescription", e.target.value)} placeholder="Korte beschrijving voor zoekmachines..." rows={3} style={{ ...inp, resize: "vertical" as const }} />
              <div style={hint}>{(data.metaDescription ?? "").length}/160 tekens aanbevolen</div>
            </div>
            <div>
              <label style={lbl}>Zoekwoorden (keywords)</label>
              <input type="text" value={data.metaKeywords ?? ""} onChange={(e) => handleChange("metaKeywords", e.target.value)} placeholder="website, logo, branding, ..." style={inp} />
              <div style={hint}>Komma gescheiden, max. 10 woorden</div>
            </div>
            <div>
              <label style={lbl}>Canonical URL</label>
              <input type="url" value={data.canonicalUrl ?? ""} onChange={(e) => handleChange("canonicalUrl", e.target.value)} placeholder="https://jouwsite.nl" style={inp} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input type="checkbox" id="robotsIndex" checked={data.robotsIndex !== false} onChange={(e) => handleChange("robotsIndex", e.target.checked)} style={{ width: 16, height: 16, accentColor: accent }} />
              <label htmlFor="robotsIndex" style={{ ...lbl, marginBottom: 0, cursor: "pointer" }}>Indexeren door zoekmachines toestaan</label>
            </div>
          </div>
        </div>

        {/* Google Search Console */}
        <div style={card}>
          <div style={section}>GOOGLE SEARCH CONSOLE</div>
          <div>
            <label style={lbl}>Verificatiecode</label>
            <input type="text" value={data.googleVerification ?? ""} onChange={(e) => handleChange("googleVerification", e.target.value)} placeholder="google-site-verification=abc123..." style={inp} />
            <div style={hint}>Plak hier de volledige content-waarde van de Google verificatie meta tag</div>
          </div>
        </div>

        {/* Social Media */}
        <div style={card}>
          <div style={section}>SOCIAL MEDIA (OG TAGS)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={lbl}>OG Titel</label>
              <input type="text" value={data.ogTitle ?? ""} onChange={(e) => handleChange("ogTitle", e.target.value)} placeholder={data.metaTitle || cmsConfig.siteName} style={inp} />
            </div>
            <div>
              <label style={lbl}>OG Beschrijving</label>
              <textarea value={data.ogDescription ?? ""} onChange={(e) => handleChange("ogDescription", e.target.value)} placeholder={data.metaDescription || "Beschrijving voor social media..."} rows={3} style={{ ...inp, resize: "vertical" as const }} />
            </div>
            <div>
              <label style={lbl}>OG Afbeelding URL</label>
              <input type="url" value={data.ogImage ?? ""} onChange={(e) => handleChange("ogImage", e.target.value)} placeholder="https://..." style={inp} />
              <div style={hint}>Aanbevolen: 1200×630px</div>
            </div>
            <div>
              <label style={lbl}>Twitter Card type</label>
              <select value={data.twitterCard ?? "summary_large_image"} onChange={(e) => handleChange("twitterCard", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                <option value="summary_large_image">Grote afbeelding (aanbevolen)</option>
                <option value="summary">Klein (alleen logo)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Social Preview */}
        {data.ogImage && (
          <div style={card}>
            <div style={section}>VOORBEELD SOCIAL PREVIEW</div>
            <div style={{ background: "#1a1a1a", borderRadius: 8, overflow: "hidden", maxWidth: 400 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.ogImage} alt="OG preview" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "0.75rem" }}>
                <div style={{ fontSize: "0.78rem", color: "#888", marginBottom: "0.2rem" }}>{(data.canonicalUrl || "jouwsite.nl").replace(/^https?:\/\//, "")}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>{data.ogTitle || data.metaTitle || cmsConfig.siteName}</div>
                <div style={{ fontSize: "0.75rem", color: "#666" }}>{data.ogDescription || data.metaDescription || ""}</div>
              </div>
            </div>
          </div>
        )}

        {/* Structured Data */}
        <div style={card}>
          <div style={section}>STRUCTURED DATA (JSON-LD)</div>
          <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "1rem" }}>Helpt Google je bedrijf beter te begrijpen</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={lbl}>Bedrijfsnaam</label>
              <input type="text" value={data.structuredDataName ?? ""} onChange={(e) => handleChange("structuredDataName", e.target.value)} placeholder={cmsConfig.siteName} style={inp} />
            </div>
            <div>
              <label style={lbl}>Type bedrijf</label>
              <select value={data.structuredDataType ?? "LocalBusiness"} onChange={(e) => handleChange("structuredDataType", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                <option value="LocalBusiness">Lokaal bedrijf</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Store">Winkel</option>
                <option value="Organization">Organisatie</option>
                <option value="Person">Persoon</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Telefoonnummer</label>
              <input type="text" value={data.structuredDataPhone ?? ""} onChange={(e) => handleChange("structuredDataPhone", e.target.value)} placeholder="+31 6 12345678" style={inp} />
            </div>
            <div>
              <label style={lbl}>E-mailadres</label>
              <input type="email" value={data.structuredDataEmail ?? ""} onChange={(e) => handleChange("structuredDataEmail", e.target.value)} placeholder="info@jouwsite.nl" style={inp} />
            </div>
            <div>
              <label style={lbl}>Adres</label>
              <input type="text" value={data.structuredDataAddress ?? ""} onChange={(e) => handleChange("structuredDataAddress", e.target.value)} placeholder="Straatnaam 1, 1234 AB Stad" style={inp} />
            </div>
          </div>
        </div>

        {/* Sitemap & Robots info */}
        <div style={card}>
          <div style={section}>SITEMAP & ROBOTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1a1a1a", borderRadius: 8, padding: "0.65rem 0.85rem" }}>
              <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Sitemap</span>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: accent, fontSize: "0.8rem", textDecoration: "none" }}>/sitemap.xml →</a>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1a1a1a", borderRadius: 8, padding: "0.65rem 0.85rem" }}>
              <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Robots.txt</span>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer" style={{ color: accent, fontSize: "0.8rem", textDecoration: "none" }}>/robots.txt →</a>
            </div>
            <div style={hint}>Sitemap en robots.txt worden automatisch gegenereerd op basis van je instellingen.</div>
          </div>
        </div>

        {/* Concurrentietool — alleen master */}
        {isMaster && (
          <div style={{ ...card, border: `1px solid ${accent}33` }}>
            <div style={{ ...section, color: accent }}>CONCURRENTIE ANALYSE · MASTER</div>
            <div style={{ color: "#666", fontSize: "0.78rem", marginBottom: "1rem" }}>Analyseer de SEO van een concurrerende website en vergelijk met deze site.</div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="https://concurrent.nl"
                style={{ ...inp, flex: 1 }}
                onKeyDown={(e) => e.key === "Enter" && analyzeCompetitor()}
              />
              <button onClick={analyzeCompetitor} disabled={competing || !competitorUrl} style={{ padding: "0.65rem 1.2rem", background: accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: competing ? "not-allowed" : "pointer", whiteSpace: "nowrap" as const }}>
                {competing ? "Analyseren..." : "Analyseer"}
              </button>
            </div>

            {competitorError && <div style={{ color: "#e63946", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{competitorError}</div>}

            {competitor && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Score vergelijking */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 8, padding: "0.75rem", textAlign: "center" as const }}>
                    <div style={{ fontSize: "0.68rem", color: "#555", marginBottom: 4 }}>DEZE SITE</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: myScore >= 70 ? "#22c55e" : myScore >= 40 ? "#f59e0b" : "#e63946" }}>{myScore}</div>
                  </div>
                  <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 8, padding: "0.75rem", textAlign: "center" as const }}>
                    <div style={{ fontSize: "0.68rem", color: "#555", marginBottom: 4 }}>CONCURRENT</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: (competitor.score ?? 0) >= 70 ? "#22c55e" : (competitor.score ?? 0) >= 40 ? "#f59e0b" : "#e63946" }}>{competitor.score ?? "?"}</div>
                  </div>
                </div>

                {/* Competitor gegevens */}
                <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {competitor.title && <div><span style={{ color: "#555", fontSize: "0.72rem" }}>TITEL: </span><span style={{ color: "#ccc", fontSize: "0.82rem" }}>{competitor.title}</span></div>}
                  {competitor.description && <div><span style={{ color: "#555", fontSize: "0.72rem" }}>BESCHRIJVING: </span><span style={{ color: "#ccc", fontSize: "0.82rem" }}>{competitor.description}</span></div>}
                  {competitor.keywords && <div><span style={{ color: "#555", fontSize: "0.72rem" }}>KEYWORDS: </span><span style={{ color: "#ccc", fontSize: "0.82rem" }}>{competitor.keywords}</span></div>}
                  {competitor.h1 && <div><span style={{ color: "#555", fontSize: "0.72rem" }}>H1: </span><span style={{ color: "#ccc", fontSize: "0.82rem" }}>{competitor.h1}</span></div>}
                </div>

                {/* Tips */}
                {competitor.tips && competitor.tips.length > 0 && (
                  <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "0.85rem" }}>
                    <div style={{ fontSize: "0.72rem", color: "#555", marginBottom: "0.5rem" }}>TIPS OM TE VERBETEREN</div>
                    {competitor.tips.map((tip, i) => (
                      <div key={i} style={{ color: "#f59e0b", fontSize: "0.8rem", marginBottom: "0.3rem" }}>• {tip}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
