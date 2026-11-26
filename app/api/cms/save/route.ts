import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import fs from "fs";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "public", "site-content.json");

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  try {
    const raw = fs.readFileSync(CONTENT_FILE, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const body = await req.json();
  const existing = (() => {
    try { return JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8")); } catch { return {}; }
  })();

  const merged = { ...existing, ...body };
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(merged, null, 2), "utf8");
  return NextResponse.json({ ok: true });
}
