import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET() {
  const data = await redis.get("cms:seo");
  return NextResponse.json(data ?? {});
}

export async function POST(req: Request) {
  const { title, description, ogImage } = await req.json();
  await redis.set("cms:seo", { title, description, ogImage });
  return NextResponse.json({ ok: true });
}
