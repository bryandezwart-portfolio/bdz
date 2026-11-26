import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { put, list, del } from "@vercel/blob";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { blobs } = await list({ prefix: "cms-media/" });
  const files = blobs.map((b) => {
    const name = b.pathname.replace("cms-media/", "");
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const type = ["mp4", "mov", "webm", "ogg"].includes(ext) ? "video" : "image";
    return { name, url: b.url, type, uploadedAt: b.uploadedAt };
  });

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

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Geen naam" }, { status: 400 });

  const { blobs } = await list({ prefix: `cms-media/${name}` });
  if (blobs.length === 0) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  await del(blobs[0].url);
  return NextResponse.json({ ok: true });
}
