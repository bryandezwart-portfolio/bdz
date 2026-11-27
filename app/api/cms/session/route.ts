import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";

function extractMeta(html: string, name: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m) return m[1];
  }
  return "";
}

function extractOgMeta(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m) return m[1];
  }
  return "";
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
}

function extractH1(html: string): string {
  const m = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
}

function calcScore(data: {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogImage: string;
  h1: string;
}): number {
  let s = 0;
  if (data.title && data.title.length >= 10) s += 20;
  if (data.description && data.description.length >= 50) s += 20;
  if (data.keywords) s += 10;
  if (data.ogTitle) s += 10;
  if (data.ogImage) s += 15;
  if (data.h1) s += 10;
  // canonical not easily detectable
  s += 15; // base score for being online
  return Math.min(s, 100);
}

function generateTips(mine: number, theirs: number, theirData: {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  h1: string;
}): string[] {
  const tips: string[] = [];
  if (theirs > mine) {
    tips.push(`Concurrent scoort ${theirs - mine} punten hoger dan jij.`);
  }
  if (theirData.title) {
    tips.push(`Hun titel is ${theirData.title.length} tekens — controleer of jouw titel vergelijkbaar is.`);
  }
  if (theirData.ogImage && mine < 100) {
    tips.push("Concurrent heeft een OG-afbeelding — voeg er ook een toe voor betere social previews.");
  }
  if (theirData.h1) {
    tips.push(`Hun H1 is: "${theirData.h1}" — gebruik ook een duidelijke H1 op je homepage.`);
  }
  if (theirData.keywords) {
    tips.push(`Concurrent gebruikt keywords: ${theirData.keywords} — vergelijk met jouw eigen keywords.`);
  }
  if (tips.length === 0) {
    tips.push("Je scoort al goed ten opzichte van deze concurrent!");
  }
  return tips;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  let url: string;
  try {
    const body = await req.json();
    url = body.url;
  } catch {
    return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });
  }

  if (!url || !url.startsWith("http")) {
    return NextResponse.json({ error: "Vul een geldige URL in (begin met http)" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOAnalyzer/1.0)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Site niet bereikbaar (${response.status})` }, { status: 400 });
    }

    const html = await response.text();

    const title = extractTitle(html);
    const description = extractMeta(html, "description");
    const keywords = extractMeta(html, "keywords");
    const ogTitle = extractOgMeta(html, "og:title");
    const ogDescription = extractOgMeta(html, "og:description");
    const ogImage = extractOgMeta(html, "og:image");
    const h1 = extractH1(html);

    // My score from Redis (passed via query or we do a simple 0 for now)
    const theirScore = calcScore({ title, description, keywords, ogTitle, ogImage, h1 });
    const tips = generateTips(0, theirScore, { title, description, keywords, ogImage, h1 });

    return NextResponse.json({
      url,
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      h1,
      score: theirScore,
      tips,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json({ error: "Site reageert te traag (timeout)" }, { status: 400 });
    }
    return NextResponse.json({ error: "Kon site niet laden" }, { status: 400 });
  }
}
