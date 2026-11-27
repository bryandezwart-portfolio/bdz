import { NextRequest, NextResponse } from "next/server";
import { getRedisUsers } from "@/lib/cms-auth";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username) return NextResponse.json({ error: "E-mailadres verplicht" }, { status: 400 });
    const users = await getRedisUsers();
    const user = users.find((u) => u.username === username || u.email === username);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cms/forgot]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
