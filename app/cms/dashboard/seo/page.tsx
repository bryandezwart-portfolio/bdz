"use client";
import { useEffect, useState, useCallback } from "react";
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
  changelogEntries?: ChangelogEntry[];
};

type ChangelogEntry = {
  id: string;
  date: string;
  author: string;
  note: string;
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

type PageSpeedResult = {
  performance: number;
  accessibility: number;
  seo: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  url: string;
  error?: string;
};

type BrokenLink = {
  url: string;
  status: number | null;
  text?: string;
  error?: string;
};

type KeywordSuggestion = {
  keyword: string;
  volume?: string;
  difficulty?: string;
  relevance: "hoog" | "middel" | "laag";
};

type IndexStatus = {
  indexed: boolean;
  url: string;
  lastCrawled?: string;
  coverage?: string;
  error?: string;
};

export default function SeoPage() {
  const [data, setData] = useState<SeoData>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [currentUser, setCurrentUser] = useState("SEO Expert");

  // Competitor
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [competing, setCompeting] = useState(false);
  const [competitor, setCompetitor] = useState<CompetitorResult | null>(null);
  const [competitorError, setCompetitorError] = useState("");

  // PageSpeed
  const [psUrl, setPsUrl] = useState("");
  const [psLoading, setPsLoading] = useState(false);
  const [psResult, setPsResult] = useState<PageSpeedResult | null>(null);
  const [psError, setPsError] = useState("");

  // Broken links
  const [blLoading, setBlLoading] = useState(false);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[] | null>(null);
  const [blError, setBlError] = useState("");

  // Keyword suggestions
  const [kwSuggestions, setKwSuggestions] = useState<KeywordSuggestion[]>([]);
  const [kwLoading, setKwLoading] = useState(false);

  // Index status
  const [indexUrl, setIndexUrl] = useState("");
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexResult, setIndexResult] = useState<IndexStatus | null>(null);
  const [indexError, setIndexError] = useState("");

  // Changelog
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const accent = useCmsAccent();

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((d) => {
        setData(d ?? {});
      });
    fetch("/api/cms/session")
      .then((r) => r.json())
      .then((s) => {
        if (s?.role === "master" || s?.role === "seo") setIsMaster(true);
        if (s?.username) setCurrentUser(s.username);
      })
      .catch(() => {});
  }, []);

  function handleChange(key: keyof SeoData, value: string | boolean | ChangelogEntry[]) {
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

  // ── Competitor analyse ──────────────────────────────────────────────
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

  // ── PageSpeed ───────────────────────────────────────────────────────
  async function checkPageSpeed() {
    const url = psUrl || data.canonicalUrl || "";
    if (!url) { setPsError("Vul een URL in"); return; }
    setPsLoading(true);
    setPsResult(null);
    setPsError("");
    try {
      const res = await fetch("/api/cms/pagespeed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (!res.ok) setPsError(result.error || "Pagespeed check mislukt");
      else setPsResult(result);
    } catch {
      setPsError("Kan geen verbinding maken met PageSpeed API");
    } finally {
      setPsLoading(false);
    }
  }

  // ── Broken links ────────────────────────────────────────────────────
  async function checkBrokenLinks() {
    const url = data.canonicalUrl || "";
    if (!url) { setBlError("Stel eerst een Canonical URL in bij Zoekmachines"); return; }
    setBlLoading(true);
    setBrokenLinks(null);
    setBlError("");
    try {
      const res = await fetch("/api/cms/broken-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (!res.ok) setBlError(result.error || "Link check mislukt");
      else setBrokenLinks(result.links ?? []);
    } catch {
      setBlError("Kan geen verbinding maken");
    } finally {
      setBlLoading(false);
    }
  }

  // ── Keyword suggesties ──────────────────────────────────────────────
  const generateKeywordSuggestions = useCallback(() => {
    const keywords = (data.metaKeywords ?? "").split(",").map(k => k.trim()).filter(Boolean);
    const title = data.metaTitle ?? "";
    const siteName = cmsConfig.siteName;

    if (!keywords.length && !title) {
      setKwSuggestions([]);
      return;
    }

    setKwLoading(true);
    // Genereer suggesties op basis van bestaande keywords + titel
    setTimeout(() => {
      const base = [...keywords, ...title.split(" ").filter(w => w.length > 4)];
      const suggestions: KeywordSuggestion[] = [];
      const prefixes = ["beste", "goedkoop", "professioneel", "top", "lokaal"];
      const suffixes = ["diensten", "kosten", "ervaringen", "review", "inhuren", "tips"];

      base.slice(0, 3).forEach(kw => {
        const cleanKw = kw.toLowerCase().replace(/[^a-z0-9 ]/g, "");
        prefixes.slice(0, 2).forEach(p => {
          suggestions.push({ keyword: `${p} ${cleanKw}`, relevance: "hoog", volume: "100-1K", difficulty: "laag" });
        });
        suffixes.slice(0, 2).forEach(s => {
          suggestions.push({ keyword: `${cleanKw} ${s}`, relevance: "middel", volume: "10-100", difficulty: "middel" });
        });
      });

      if (siteName) {
        suggestions.push({ keyword: siteName.toLowerCase(), relevance: "hoog", volume: "100-1K", difficulty: "laag" });
      }

      setKwSuggestions(suggestions.slice(0, 12));
      setKwLoading(false);
    }, 600);
  }, [data.metaKeywords, data.metaTitle]);

  useEffect(() => {
    if (data.metaKeywords || data.metaTitle) {
      generateKeywordSuggestions();
    }
  }, [data.metaKeywords, data.metaTitle, generateKeywordSuggestions]);

  // ── Index status ────────────────────────────────────────────────────
  async function checkIndexStatus() {
    const url = indexUrl || data.canonicalUrl || "";
    if (!url) { setIndexError("Vul een URL in of stel Canonical URL in"); return; }
    setIndexLoading(true);
    setIndexResult(null);
    setIndexError("");
    try {
      const res = await fetch("/api/cms/index-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (!res.ok) setIndexError(result.error || "Status check mislukt");
      else setIndexResult(result);
    } catch {
      setIndexError("Kan geen verbinding maken");
    } finally {
      setIndexLoading(false);
    }
  }

  // ── Changelog ───────────────────────────────────────────────────────
  async function addChangelogEntry() {
    if (!newNote.trim()) return;
    setAddingNote(true);
    const entry: ChangelogEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      author: currentUser,
      note: newNote.trim(),
    };
    const updated = [entry, ...(data.changelogEntries ?? [])].slice(0, 50);
    handleChange("changelogEntries", updated);
    setNewNote("");

    // Direct opslaan
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, changelogEntries: updated }),
    });
    setAddingNote(false);
  }

  async function deleteChangelogEntry(id: string) {
    const updated = (data.changelogEntries ?? []).filter(e => e.id !== id);
    handleChange("changelogEntries", updated);
    await fetch("/api/cms/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, changelogEntries: updated }),
    });
  }

  // ── Styles ──────────────────────────────────────────────────────────
  const inp = { width: "100%", padding: "0.65rem 0.85rem", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.85rem", boxSizing: "border-box" as const };
  const lbl = { color: "#aaa", fontSize: "0.75rem", display: "block" as const, marginBottom: 6, letterSpacing: "0.05em" };
  const hint = { color: "#555", fontSize: "0.68rem", marginTop: 4 };
  const card = { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1.25rem" };
  const section = { fontSize: "0.72rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1rem" };

  // ── SEO Score ───────────────────────────────────────────────────────
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

  function scoreColor(n: number) {
    return n >= 70 ? "#22c55e" : n >= 40 ? "#f59e0b" : "#e63946";
  }

  function ScoreGauge({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
    const pct = Math.round((value / max) * 100);
    return (
      <div style={{ textAlign: "center" as const }}>
        <div style={{ position: "relative" as const, width: 64, height: 64, margin: "0 auto 0.4rem" }}>
          <svg viewBox="0 0 36 36" style={{ width: 64, height: 64, transform: "rotate(-90deg)" }}>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1a1a" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor(pct)} strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute" as const, inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 700, color: scoreColor(pct) }}>{value}</div>
        </div>
        <div style={{ fontSize: "0.68rem", color: "#555" }}>{label}</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>SEO</h1>
        <button onClick={handleSave} disabled={saving} style={{ padding: "0.55rem 1.4rem", background: saved ? "#1a7a1a" : accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Opslaan..." : saved ? "✓ Opgeslagen" : "Opslaan"}
        </button>
      </div>

      {/* ── SEO Score ── */}
      <div style={{ ...card, marginBottom: "1.25rem" }}>
        <div style={section}>SEO SCORE</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 99, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${myScore}%`, background: scoreColor(myScore), borderRadius: 99, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: scoreColor(myScore), minWidth: 40 }}>{myScore}/100</div>
        </div>
        <div style={{ color: "#555", fontSize: "0.72rem", marginTop: 8 }}>
          {myScore < 40 && "Vul minimaal meta titel, beschrijving en canonical URL in."}
          {myScore >= 40 && myScore < 70 && "Goed begin! Voeg OG afbeelding en structured data toe voor een hogere score."}
          {myScore >= 70 && "Uitstekend! Je SEO is goed ingesteld."}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* ── Zoekmachines ── */}
        <div style={card}>
          <div style={section}>ZOEKMACHINES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={lbl}>Meta titel</label>
              <input type="text" value={data.metaTitle ?? ""} onChange={(e) => handleChange("metaTitle", e.target.value)} placeholder={cmsConfig.siteName} style={inp} />
              <div style={{ ...hint, color: (data.metaTitle ?? "").length > 60 ? "#e63946" : "#555" }}>{(data.metaTitle ?? "").length}/60 tekens aanbevolen</div>
            </div>
            <div>
              <label style={lbl}>Meta beschrijving</label>
              <textarea value={data.metaDescription ?? ""} onChange={(e) => handleChange("metaDescription", e.target.value)} placeholder="Korte beschrijving voor zoekmachines..." rows={3} style={{ ...inp, resize: "vertical" as const }} />
              <div style={{ ...hint, color: (data.metaDescription ?? "").length > 160 ? "#e63946" : "#555" }}>{(data.metaDescription ?? "").length}/160 tekens aanbevolen</div>
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

        {/* ── Google Search Console ── */}
        <div style={card}>
          <div style={section}>GOOGLE SEARCH CONSOLE</div>
          <div>
            <label style={lbl}>Verificatiecode</label>
            <input type="text" value={data.googleVerification ?? ""} onChange={(e) => handleChange("googleVerification", e.target.value)} placeholder="google-site-verification=abc123..." style={inp} />
            <div style={hint}>Plak hier de volledige content-waarde van de Google verificatie meta tag</div>
          </div>
          {data.canonicalUrl && (
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#555", marginBottom: "0.25rem" }}>SNELLE LINKS</div>
              <a href={`https://search.google.com/search-console/welcome?utm_source=about-page`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1a1a1a", borderRadius: 8, padding: "0.65rem 0.85rem", color: accent, fontSize: "0.8rem", textDecoration: "none" }}>
                <span>🔗 Google Search Console openen</span>
                <span>→</span>
              </a>
              <a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(data.canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1a1a1a", borderRadius: 8, padding: "0.65rem 0.85rem", color: "#aaa", fontSize: "0.8rem", textDecoration: "none" }}>
                <span>✨ Rich Results Test</span>
                <span>→</span>
              </a>
              <a href={`https://developers.google.com/speed/pagespeed/insights/?url=${encodeURIComponent(data.canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1a1a1a", borderRadius: 8, padding: "0.65rem 0.85rem", color: "#aaa", fontSize: "0.8rem", textDecoration: "none" }}>
                <span>⚡ PageSpeed Insights (extern)</span>
                <span>→</span>
              </a>
            </div>
          )}
        </div>

        {/* ── PageSpeed / Core Web Vitals ── */}
        <div style={card}>
          <div style={section}>PAGINASNELHEID & CORE WEB VITALS</div>
          <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "1rem" }}>Analyseer de laadsnelheid en gebruikerservaring van je site via Google PageSpeed Insights.</div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="url"
              value={psUrl}
              onChange={(e) => setPsUrl(e.target.value)}
              placeholder={data.canonicalUrl || "https://jouwsite.nl"}
              style={{ ...inp, flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && checkPageSpeed()}
            />
            <button onClick={checkPageSpeed} disabled={psLoading} style={{ padding: "0.65rem 1.2rem", background: accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: psLoading ? "not-allowed" : "pointer", whiteSpace: "nowrap" as const }}>
              {psLoading ? "Laden..." : "Analyseer"}
            </button>
          </div>
          {psError && <div style={{ color: "#e63946", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{psError}</div>}
          {psLoading && (
            <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "1.5rem", textAlign: "center" as const }}>
              <div style={{ color: "#555", fontSize: "0.82rem" }}>⏳ PageSpeed analyse loopt... (kan 10-15 sec duren)</div>
            </div>
          )}
          {psResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Scores */}
              <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "1rem" }}>
                <div style={{ fontSize: "0.72rem", color: "#555", marginBottom: "1rem" }}>LIGHTHOUSE SCORES</div>
                <div style={{ display: "flex", justifyContent: "space-around", gap: "0.5rem" }}>
                  <ScoreGauge value={psResult.performance} label="Performance" />
                  <ScoreGauge value={psResult.accessibility} label="Toegankelijkheid" />
                  <ScoreGauge value={psResult.seo} label="SEO" />
                </div>
              </div>
              {/* Core Web Vitals */}
              {(psResult.lcp !== undefined || psResult.cls !== undefined) && (
                <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "1rem" }}>
                  <div style={{ fontSize: "0.72rem", color: "#555", marginBottom: "0.75rem" }}>CORE WEB VITALS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {psResult.lcp !== undefined && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ color: "#aaa", fontSize: "0.82rem" }}>LCP</span>
                          <span style={{ color: "#555", fontSize: "0.72rem", marginLeft: "0.5rem" }}>Largest Contentful Paint</span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: psResult.lcp <= 2.5 ? "#22c55e" : psResult.lcp <= 4 ? "#f59e0b" : "#e63946" }}>
                          {psResult.lcp.toFixed(1)}s
                        </span>
                      </div>
                    )}
                    {psResult.cls !== undefined && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ color: "#aaa", fontSize: "0.82rem" }}>CLS</span>
                          <span style={{ color: "#555", fontSize: "0.72rem", marginLeft: "0.5rem" }}>Cumulative Layout Shift</span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: psResult.cls <= 0.1 ? "#22c55e" : psResult.cls <= 0.25 ? "#f59e0b" : "#e63946" }}>
                          {psResult.cls.toFixed(3)}
                        </span>
                      </div>
                    )}
                    {psResult.fid !== undefined && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ color: "#aaa", fontSize: "0.82rem" }}>FID</span>
                          <span style={{ color: "#555", fontSize: "0.72rem", marginLeft: "0.5rem" }}>First Input Delay</span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: psResult.fid <= 100 ? "#22c55e" : psResult.fid <= 300 ? "#f59e0b" : "#e63946" }}>
                          {psResult.fid}ms
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: "0.75rem", fontSize: "0.68rem", color: "#333", display: "flex", gap: "1rem" }}>
                    <span style={{ color: "#22c55e" }}>● Goed</span>
                    <span style={{ color: "#f59e0b" }}>● Verbetering nodig</span>
                    <span style={{ color: "#e63946" }}>● Slecht</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Broken Links Checker ── */}
        <div style={card}>
          <div style={section}>BROKEN LINKS CHECKER</div>
          <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "1rem" }}>
            Controleert automatisch alle links op je site op dode of gebroken pagina&apos;s.
            {!data.canonicalUrl && <span style={{ color: "#f59e0b" }}> Stel eerst een Canonical URL in.</span>}
          </div>
          <button onClick={checkBrokenLinks} disabled={blLoading || !data.canonicalUrl} style={{ padding: "0.65rem 1.4rem", background: data.canonicalUrl ? accent : "#1a1a1a", color: data.canonicalUrl ? "#fff" : "#555", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: blLoading || !data.canonicalUrl ? "not-allowed" : "pointer", marginBottom: "1rem" }}>
            {blLoading ? "⏳ Controleren..." : "🔗 Check broken links"}
          </button>
          {blError && <div style={{ color: "#e63946", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{blError}</div>}
          {brokenLinks !== null && (
            <div>
              {brokenLinks.length === 0 ? (
                <div style={{ background: "#0a2a0a", border: "1px solid #22c55e33", borderRadius: 8, padding: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#22c55e", fontSize: "1.1rem" }}>✓</span>
                  <span style={{ color: "#22c55e", fontSize: "0.82rem" }}>Geen broken links gevonden — alles werkt!</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ fontSize: "0.72rem", color: "#e63946", marginBottom: "0.25rem" }}>{brokenLinks.length} broken link{brokenLinks.length !== 1 ? "s" : ""} gevonden</div>
                  {brokenLinks.map((link, i) => (
                    <div key={i} style={{ background: "#1a0a0a", border: "1px solid #e6394633", borderRadius: 8, padding: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#e63946", fontSize: "0.75rem", fontWeight: 600 }}>
                          {link.status ? `HTTP ${link.status}` : "Fout"}
                        </span>
                        {link.text && <span style={{ color: "#555", fontSize: "0.68rem" }}>{link.text}</span>}
                      </div>
                      <div style={{ color: "#aaa", fontSize: "0.78rem", wordBreak: "break-all" as const }}>{link.url}</div>
                      {link.error && <div style={{ color: "#555", fontSize: "0.68rem", marginTop: "0.25rem" }}>{link.error}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Zoekwoord suggesties ── */}
        <div style={card}>
          <div style={section}>ZOEKWOORD SUGGESTIES</div>
          <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "1rem" }}>
            Automatische suggesties op basis van je meta titel en keywords. Vul eerst je zoekwoorden in bij Zoekmachines.
          </div>
          {!data.metaKeywords && !data.metaTitle ? (
            <div style={{ color: "#333", fontSize: "0.82rem" }}>Vul meta titel of keywords in om suggesties te zien.</div>
          ) : kwLoading ? (
            <div style={{ color: "#555", fontSize: "0.82rem" }}>Suggesties genereren...</div>
          ) : kwSuggestions.length > 0 ? (
            <div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.5rem", marginBottom: "0.75rem" }}>
                {kwSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const current = data.metaKeywords ?? "";
                      const list = current.split(",").map(k => k.trim()).filter(Boolean);
                      if (!list.includes(s.keyword)) {
                        handleChange("metaKeywords", [...list, s.keyword].join(", "));
                      }
                    }}
                    title="Klik om toe te voegen"
                    style={{
                      padding: "0.3rem 0.7rem",
                      background: "#1a1a1a",
                      border: `1px solid ${s.relevance === "hoog" ? "#22c55e55" : s.relevance === "middel" ? "#f59e0b55" : "#2a2a2a"}`,
                      borderRadius: 99,
                      color: s.relevance === "hoog" ? "#22c55e" : s.relevance === "middel" ? "#f59e0b" : "#666",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    + {s.keyword}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.68rem", color: "#333" }}>
                <span style={{ color: "#22c55e" }}>● Hoge relevantie</span>
                <span style={{ color: "#f59e0b" }}>● Middel</span>
                <span style={{ color: "#555" }}>● Laag</span>
              </div>
              <div style={hint}>Klik op een suggestie om hem toe te voegen aan je keywords.</div>
            </div>
          ) : (
            <div style={{ color: "#333", fontSize: "0.82rem" }}>Geen suggesties gevonden.</div>
          )}
        </div>

        {/* ── Indexeringsstatus ── */}
        <div style={card}>
          <div style={section}>INDEXERINGSSTATUS</div>
          <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "1rem" }}>
            Controleer of je pagina geïndexeerd is door Google via een site: zoekopdracht.
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="url"
              value={indexUrl}
              onChange={(e) => setIndexUrl(e.target.value)}
              placeholder={data.canonicalUrl || "https://jouwsite.nl"}
              style={{ ...inp, flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && checkIndexStatus()}
            />
            <button onClick={checkIndexStatus} disabled={indexLoading} style={{ padding: "0.65rem 1.2rem", background: accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: indexLoading ? "not-allowed" : "pointer", whiteSpace: "nowrap" as const }}>
              {indexLoading ? "Controleren..." : "Controleer"}
            </button>
          </div>
          {indexError && <div style={{ color: "#e63946", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{indexError}</div>}
          {indexResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ background: indexResult.indexed ? "#0a2a0a" : "#1a0a0a", border: `1px solid ${indexResult.indexed ? "#22c55e33" : "#e6394633"}`, borderRadius: 8, padding: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>{indexResult.indexed ? "✅" : "❌"}</span>
                  <span style={{ color: indexResult.indexed ? "#22c55e" : "#e63946", fontWeight: 600, fontSize: "0.9rem" }}>
                    {indexResult.indexed ? "Geïndexeerd" : "Niet geïndexeerd"}
                  </span>
                </div>
                <div style={{ color: "#666", fontSize: "0.78rem", wordBreak: "break-all" as const }}>{indexResult.url}</div>
                {indexResult.lastCrawled && (
                  <div style={{ color: "#555", fontSize: "0.72rem", marginTop: "0.4rem" }}>Laatste crawl: {indexResult.lastCrawled}</div>
                )}
                {indexResult.coverage && (
                  <div style={{ color: "#555", fontSize: "0.72rem", marginTop: "0.2rem" }}>Status: {indexResult.coverage}</div>
                )}
              </div>
              {!indexResult.indexed && (
                <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "0.85rem" }}>
                  <div style={{ fontSize: "0.72rem", color: "#f59e0b", marginBottom: "0.5rem" }}>MOGELIJKE OORZAKEN</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {["De site is nieuw (kan 1-4 weken duren)", "robots.txt blokkeert de pagina", "noindex meta tag is actief", "Geen inkomende links naar deze pagina"].map((tip, i) => (
                      <div key={i} style={{ color: "#666", fontSize: "0.78rem" }}>• {tip}</div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a href={`https://www.google.com/search?q=site:${encodeURIComponent((indexResult.url || "").replace(/^https?:\/\//, ""))}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "block", background: "#1a1a1a", borderRadius: 8, padding: "0.6rem", color: accent, fontSize: "0.75rem", textDecoration: "none", textAlign: "center" as const }}>
                  🔍 Bekijk in Google
                </a>
                <a href="https://search.google.com/search-console/" target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "block", background: "#1a1a1a", borderRadius: 8, padding: "0.6rem", color: "#aaa", fontSize: "0.75rem", textDecoration: "none", textAlign: "center" as const }}>
                  📊 Search Console
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ── Social Media ── */}
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

        {/* ── Social Preview ── */}
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
            {data.canonicalUrl && (
              <a href={`https://www.opengraph.xyz/url/${encodeURIComponent(data.canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.75rem", color: accent, fontSize: "0.78rem", textDecoration: "none" }}>
                ↗ Test op opengraph.xyz
              </a>
            )}
          </div>
        )}

        {/* ── Structured Data ── */}
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

        {/* ── Sitemap & Robots ── */}
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

        {/* ── Changelog / Notities ── */}
        <div style={card}>
          <div style={section}>CHANGELOG & NOTITIES</div>
          <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "1rem" }}>Houd bij wat je wanneer hebt gewijzigd voor je SEO-strategie.</div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Bijv: Meta beschrijving aangepast voor betere CTR..."
              style={{ ...inp, flex: 1 }}
              onKeyDown={(e) => e.key === "Enter" && addChangelogEntry()}
            />
            <button onClick={addChangelogEntry} disabled={addingNote || !newNote.trim()} style={{ padding: "0.65rem 1rem", background: newNote.trim() ? accent : "#1a1a1a", color: newNote.trim() ? "#fff" : "#555", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: !newNote.trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap" as const }}>
              {addingNote ? "..." : "+ Toevoegen"}
            </button>
          </div>
          {(!data.changelogEntries || data.changelogEntries.length === 0) ? (
            <div style={{ color: "#333", fontSize: "0.82rem", fontStyle: "italic" as const }}>Nog geen notities. Voeg je eerste wijziging toe.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {data.changelogEntries.map((entry) => (
                <div key={entry.id} style={{ background: "#1a1a1a", borderRadius: 8, padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#ccc", fontSize: "0.82rem", marginBottom: "0.3rem" }}>{entry.note}</div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <span style={{ color: "#555", fontSize: "0.68rem" }}>{entry.date}</span>
                      <span style={{ color: "#333", fontSize: "0.68rem" }}>door {entry.author}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteChangelogEntry(entry.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "0.85rem", padding: "0.1rem 0.3rem", lineHeight: 1 }} title="Verwijder">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Concurrentie — master only ── */}
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
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 8, padding: "0.75rem", textAlign: "center" as const }}>
                    <div style={{ fontSize: "0.68rem", color: "#555", marginBottom: 4 }}>DEZE SITE</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: scoreColor(myScore) }}>{myScore}</div>
                  </div>
                  <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 8, padding: "0.75rem", textAlign: "center" as const }}>
                    <div style={{ fontSize: "0.68rem", color: "#555", marginBottom: 4 }}>CONCURRENT</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: scoreColor(competitor.score ?? 0) }}>{competitor.score ?? "?"}</div>
                  </div>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {competitor.title && <div><span style={{ color: "#555", fontSize: "0.72rem" }}>TITEL: </span><span style={{ color: "#ccc", fontSize: "0.82rem" }}>{competitor.title}</span></div>}
                  {competitor.description && <div><span style={{ color: "#555", fontSize: "0.72rem" }}>BESCHRIJVING: </span><span style={{ color: "#ccc", fontSize: "0.82rem" }}>{competitor.description}</span></div>}
                  {competitor.keywords && <div><span style={{ color: "#555", fontSize: "0.72rem" }}>KEYWORDS: </span><span style={{ color: "#ccc", fontSize: "0.82rem" }}>{competitor.keywords}</span></div>}
                  {competitor.h1 && <div><span style={{ color: "#555", fontSize: "0.72rem" }}>H1: </span><span style={{ color: "#ccc", fontSize: "0.82rem" }}>{competitor.h1}</span></div>}
                </div>
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
