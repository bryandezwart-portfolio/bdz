import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL ontbreekt" }, { status: 400 });

    // Gebruik de gratis PageSpeed Insights API (geen key nodig voor basis gebruik)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=accessibility&category=seo`;

    const res = await fetch(apiUrl, { next: { revalidate: 0 } });

    if (!res.ok) {
      // Fallback: geef gesimuleerde data terug als API niet bereikbaar is
      return NextResponse.json({
        performance: 0,
        accessibility: 0,
        seo: 0,
        url,
        error: `PageSpeed API niet beschikbaar (${res.status}). Gebruik de externe link om handmatig te checken.`,
      }, { status: 200 });
    }

    const data = await res.json();
    const cats = data.lighthouseResult?.categories;
    const audits = data.lighthouseResult?.audits;

    const performance = Math.round((cats?.performance?.score ?? 0) * 100);
    const accessibility = Math.round((cats?.accessibility?.score ?? 0) * 100);
    const seo = Math.round((cats?.seo?.score ?? 0) * 100);

    // Core Web Vitals
    const lcp = audits?.["largest-contentful-paint"]?.numericValue
      ? Math.round(audits["largest-contentful-paint"].numericValue) / 1000
      : undefined;
    const cls = audits?.["cumulative-layout-shift"]?.numericValue
      ? Math.round(audits["cumulative-layout-shift"].numericValue * 1000) / 1000
      : undefined;
    const fid = audits?.["max-potential-fid"]?.numericValue
      ? Math.round(audits["max-potential-fid"].numericValue)
      : undefined;

    return NextResponse.json({ performance, accessibility, seo, lcp, cls, fid, url });
  } catch (err) {
    console.error("PageSpeed error:", err);
    return NextResponse.json({ error: "Kon PageSpeed analyse niet uitvoeren" }, { status: 500 });
  }
}
