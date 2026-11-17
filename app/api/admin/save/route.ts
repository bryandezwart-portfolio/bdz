import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const data = await req.json();

  // Schrijf naar content.json in de public map
  const filePath = path.join(process.cwd(), "public", "site-content.json");
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
