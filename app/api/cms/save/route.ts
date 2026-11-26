import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const content = (await redis.get("cms:content")) || {};
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const body = await req.json();
  const existing = ((await redis.get("cms:content")) || {}) as Record<string, unknown>;
  const merged = { ...existing, ...body };
  await redis.set("cms:content", merged);
  return NextResponse.json({ ok: true });
}
