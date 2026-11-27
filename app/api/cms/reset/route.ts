import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getRedisUsers, createPasswordHash } from "@/lib/cms-auth";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token en wachtwoord verplicht" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Wachtwoord moet minimaal 8 tekens zijn" }, { status: 400 });
    }

    const redis = Redis.fromEnv();

    // Token ophalen uit Redis
    const data = await redis.get<{ email: string; username: string }>(`cms:reset:${token}`);
    if (!data) {
      return NextResponse.json({ error: "Link is ongeldig of verlopen" }, { status: 400 });
    }

    // Gebruikers ophalen en updaten
    const users = await getRedisUsers();
    const userIndex = users.findIndex(
      (u) => u.username === data.username || u.email === data.email
    );

    if (userIndex === -1) {
      return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
    }

    // Wachtwoord hashen en opslaan
    users[userIndex].passwordHash = createPasswordHash(password);
    await redis.set("cms:users", users);

    // Token verwijderen (eenmalig gebruik)
    await redis.del(`cms:reset:${token}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cms/reset]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
