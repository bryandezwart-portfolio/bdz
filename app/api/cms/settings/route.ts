import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const CONTENT_FILE = join(process.cwd(), "public", "site-content.json");

function readContent() {
  if (!existsSync(CONTENT_FILE)) return {};
  return JSON.parse(readFileSync(CONTENT_FILE, "utf-8"));
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const content = readContent();
  return NextResponse.json({ settings: content.cms || {} });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const { logoSrc, logoAlt, siteName } = await req.json();
  const content = readContent();
  content.cms = { ...(content.cms || {}), logoSrc, logoAlt, siteName };
  writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  return NextResponse.json({ ok: true });
}
