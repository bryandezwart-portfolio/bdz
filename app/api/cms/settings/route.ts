import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "master")
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const settings = (await redis.get("cms:settings")) || {};
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master")
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const {
    logoSrc, logoAlt, siteName,
    footerPartner, footerCredit, footerCopyright,
    footerSubtitle,
    footerLink1Label, footerLink1Url,
    footerLink2Label, footerLink2Url,
    footerLink3Label, footerLink3Url,
    spotifyPlaylistId,
  } = await req.json();

  await redis.set("cms:settings", {
    logoSrc, logoAlt, siteName,
    footerPartner, footerCredit, footerCopyright,
    footerSubtitle,
    footerLink1Label, footerLink1Url,
    footerLink2Label, footerLink2Url,
    footerLink3Label, footerLink3Url,
    spotifyPlaylistId,
  });

  return NextResponse.json({ ok: true });
}
