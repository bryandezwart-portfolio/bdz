import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = Redis.fromEnv();
const SALT = "bdz-cms-salt";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(SALT + password).digest("hex");
}

type StoredUser = {
  username: string;
  passwordHash: string;
  role: "master" | "client";
  email?: string;
};

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Token en wachtwoord verplicht" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Wachtwoord moet minimaal 8 tekens zijn" }, { status: 400 });
    }

    const key = `cms:reset:${token}`;
    const username = await redis.get<string>(key);
    if (!username) {
      return NextResponse.json({ error: "Link is verlopen of ongeldig" }, { status: 400 });
    }

    if (username === "master") {
      // Master wachtwoord staat in env — kan niet via Redis gereset worden
      return NextResponse.json(
        { error: "Master wachtwoord kan alleen via Vercel environment variables gewijzigd worden." },
        { status: 400 }
      );
    }

    // Update gebruiker in Redis
    const users = await redis.get<StoredUser[]>("cms:users");
    const list = Array.isArray(users) ? users : [];
    const idx = list.findIndex((u) => u.username === username);
    if (idx === -1) {
      return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
    }

    list[idx].passwordHash = hashPassword(password);
    await redis.set("cms:users", list);

    // Verwijder token
    await redis.del(key);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset error:", err);
    return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
  }
}
