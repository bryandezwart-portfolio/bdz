import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export async function GET() {
  const redis = Redis.fromEnv();
  const data = await redis.get("cms:releases");
  return NextResponse.json(Array.isArray(data) ? data : []);
}

export async function POST(req: Request) {
  const redis = Redis.fromEnv();
  const body = await req.json();
  await redis.set("cms:releases", body);
  return NextResponse.json({ ok: true });
}
