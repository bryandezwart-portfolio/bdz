import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { Redis } from "@upstash/redis";

// Velden die ook zonder inlog zichtbaar zijn (voor de loginpagina)
const PUBLIC_FIELDS = ["loginBackground", "loginBackgroundType", "accentColor", "logo"];

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    const session = await getSession();
    const content = ((await redis.get("cms:content")) || {}) as Record<string, unknown>;

    if (!session) {
      // Alleen publieke velden teruggeven voor de loginpagina
      const pub: Record<string, unknown> = {};
      for (const key of PUBLIC_FIELDS) {
        if (content[key] !== undefined) pub[key] = content[key];
      }
      return NextResponse.json(pub);
    }

    return NextResponse.json(content);
  } catch (err) {
    console.error("[cms/save GET]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const redis = Redis.fromEnv();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

    const body = await req.json();
    const existing = ((await redis.get("cms:content")) || {}) as Record<string, unknown>;
    const merged = { ...existing, ...body };
    await redis.set("cms:content", merged);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cms/save POST]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
