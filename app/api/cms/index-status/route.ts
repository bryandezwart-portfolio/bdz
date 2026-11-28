import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL ontbreekt" }, { status: 400 });

    // Methode 1: Controleer via Google's cache-URL
    // Als Google de pagina kent, geeft cache.google.com een resultaat
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace("www.", "");

    // Zoek via site: operator simulatie — we doen een fetch naar Google en kijken of resultaten terugkomen
    const googleSearchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(parsedUrl.href)}&num=1`;

    let indexed = false;
    let coverage = "Onbekend";
    let lastCrawled: string | undefined;

    try {
      const googleRes = await fetch(googleSearchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "nl-NL,nl;q=0.9",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (googleRes.ok) {
        const html = await googleRes.text();

        // Check of Google resultaten toont voor deze site
        if (html.includes("did not match any documents") || html.includes("geen documenten gevonden") || html.includes("0 resultaten")) {
          indexed = false;
          coverage = "Niet gevonden in Google index";
        } else if (html.includes(domain) && (html.includes("cite") || html.includes("BreadcrumbList") || html.includes("/search?q="))) {
          indexed = true;
          coverage = "Gevonden in Google index";
        } else {
          // Controleer ook via Google cache check
          indexed = html.includes(domain) && !html.includes("did not match");
          coverage = indexed ? "Waarschijnlijk geïndexeerd" : "Status onbekend";
        }
      }
    } catch {
      // Google blokkeerde de request — gebruik alternatieve methode
    }

    // Methode 2: Controleer of de robots.txt crawlen toestaat
    try {
      const robotsRes = await fetch(`${parsedUrl.origin}/robots.txt`, { signal: AbortSignal.timeout(5000) });
      if (robotsRes.ok) {
        const robotsTxt = await robotsRes.text();
        // Check voor Disallow: / regels
        if (robotsTxt.includes("Disallow: /") && !robotsTxt.includes("Allow: /")) {
          coverage = coverage + " (let op: robots.txt blokkeert mogelijk crawlen)";
        }
      }
    } catch {
      // robots.txt niet beschikbaar
    }

    // Methode 3: Check sitemap voor de URL
    try {
      const sitemapRes = await fetch(`${parsedUrl.origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      if (sitemapRes.ok) {
        const sitemapXml = await sitemapRes.text();
        if (sitemapXml.includes(url) || sitemapXml.includes(parsedUrl.pathname)) {
          coverage = coverage + " · In sitemap";
          if (!indexed) {
            indexed = true;
            coverage = "Aanwezig in sitemap (indexering verwacht)";
          }
        }
      }
    } catch {
      // sitemap niet beschikbaar
    }

    // Probeer lastmod uit sitemap te halen
    try {
      const sitemapRes = await fetch(`${parsedUrl.origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      if (sitemapRes.ok) {
        const xml = await sitemapRes.text();
        const lastmodMatch = xml.match(/<lastmod>([^<]+)<\/lastmod>/);
        if (lastmodMatch) {
          lastCrawled = new Date(lastmodMatch[1]).toLocaleDateString("nl-NL");
        }
      }
    } catch {
      // skip
    }

    return NextResponse.json({ indexed, url, lastCrawled, coverage });
  } catch (err) {
    console.error("Index status error:", err);
    return NextResponse.json({ error: "Kon indexeringsstatus niet controleren" }, { status: 500 });
  }
}
