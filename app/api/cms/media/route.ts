import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { put, list } from "@vercel/blob";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { blobs } = await list({ prefix: "cms-media/" });
  const files = blobs.map((b) => ({
    name: b.pathname.replace("cms-media/", ""),
    url: b.url,
    uploadedAt: b.uploadedAt,
  }));

  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "Geen bestand" }, { status: 400 });

  const { url } = await put(`cms-media/${file.name}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ ok: true, url });
}
