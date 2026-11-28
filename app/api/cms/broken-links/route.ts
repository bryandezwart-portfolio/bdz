import { NextRequest, NextResponse } from "next/server";

type BrokenLink = {
  url: string;
  status: number | null;
  text?: string;
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL ontbreekt" }, { status: 400 });

    // Haal de HTML van de pagina op
    const pageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SEO-Bot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });

    if (!pageRes.ok) {
      return NextResponse.json({ error: `Kon pagina niet ophalen: HTTP ${pageRes.status}` }, { status: 400 });
    }

    const html = await pageRes.text();

    // Haal alle href-links op
    const linkRegex = /href=["']([^"'#?]+)["']/gi;
    const matches = [...html.matchAll(linkRegex)];

    const baseUrl = new URL(url);
    const seen = new Set<string>();
    const linksToCheck: { url: string; text: string }[] = [];

    for (const match of matches) {
      let href = match[1];
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;

      // Maak absolute URL
      try {
        const absolute = new URL(href, url).toString();
        // Alleen links naar dezelfde domein + externe links (geen assets)
        if (!absolute.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf|zip)(\?|$)/i)) {
          if (!seen.has(absolute) && linksToCheck.length < 30) {
            seen.add(absolute);
            // Tekst context ophalen (simplistisch)
            const textMatch = html.match(new RegExp(`href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>([^<]{0,50})`));
            linksToCheck.push({ url: absolute, text: textMatch?.[1]?.trim() || "" });
          }
        }
      } catch {
        // Ongeldige URL, skip
      }
    }

    // Check alle links parallel (max 10 tegelijk)
    const brokenLinks: BrokenLink[] = [];
    const batchSize = 10;

    for (let i = 0; i < linksToCheck.length; i += batchSize) {
      const batch = linksToCheck.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(async (link) => {
          try {
            const r = await fetch(link.url, {
              method: "HEAD",
              headers: { "User-Agent": "Mozilla/5.0 (compatible; SEO-Bot/1.0)" },
              signal: AbortSignal.timeout(8000),
              redirect: "follow",
            });
            return { ...link, status: r.status };
          } catch (e) {
            return { ...link, status: null, error: e instanceof Error ? e.message : "Timeout" };
          }
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          const r = result.value;
          // 404, 410, 500+ zijn broken; timeout ook
          if (!r.status || r.status === 404 || r.status === 410 || r.status >= 500) {
            brokenLinks.push({ url: r.url, status: r.status, text: r.text, error: "error" in r ? r.error : undefined });
          }
        }
      }
    }

    return NextResponse.json({ links: brokenLinks, checked: linksToCheck.length });
  } catch (err) {
    console.error("Broken links error:", err);
    return NextResponse.json({ error: "Kon links niet controleren" }, { status: 500 });
  }
}
