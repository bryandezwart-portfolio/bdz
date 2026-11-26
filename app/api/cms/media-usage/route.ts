import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const [content, settings, seo, releases] = await Promise.all([
    redis.get("cms:content") as Promise<Record<string, string> | null>,
    redis.get("cms:settings") as Promise<Record<string, string> | null>,
    redis.get("cms:seo") as Promise<Record<string, string> | null>,
    redis.get("cms:releases") as Promise<{cover?: string; title?: string}[] | null>,
  ]);

  const c = content || {};
  const s = settings || {};
  const e = seo || {};
  const r = Array.isArray(releases) ? releases : [];

  // Geef alleen URL-velden terug, geen gevoelige data
  return NextResponse.json({
    heroVideo:   c.heroVideo   || null,
    heroBgImage: c.heroBgImage || null,
    logoSrc:     s.logoSrc     || null,
    ogImage:     e.ogImage     || null,
    releases: r.map((rel) => ({ cover: rel.cover || null, title: rel.title || null })),
  });
}
