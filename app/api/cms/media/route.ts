import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
const VIDEO_EXT = [".mp4", ".webm", ".mov", ".avi"];

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  ensureDir();
  const names = fs.readdirSync(UPLOAD_DIR).filter((n) => !n.startsWith("."));
  const files = names.map((name) => {
    const ext = path.extname(name).toLowerCase();
    return {
      name,
      url: `/uploads/${name}`,
      type: VIDEO_EXT.includes(ext) ? "video" : "image",
    };
  });
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  ensureDir();
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Geen bestand" }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase();
  const allowed = [...IMAGE_EXT, ...VIDEO_EXT];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Bestandstype niet toegestaan" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const dest = path.join(UPLOAD_DIR, file.name);
  fs.writeFileSync(dest, Buffer.from(bytes));

  return NextResponse.json({ ok: true, url: `/uploads/${file.name}` });
}
