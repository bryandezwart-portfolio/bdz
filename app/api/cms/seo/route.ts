import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export async function GET() {
  const redis = Redis.fromEnv();
  const data = await redis.get("cms:seo");
  return NextResponse.json(data ?? {});
}

export async function POST(req: Request) {
  const redis = Redis.fromEnv();
  const { title, description, ogImage } = await req.json();
  await redis.set("cms:seo", { title, description, ogImage });
  return NextResponse.json({ ok: true });
}
