import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = Redis.fromEnv();
const USERS_KEY = "cms:users";
const SALT = "bdz-cms-salt";

type StoredUser = {
  username: string;
  passwordHash: string;
  role: "master" | "client";
  email?: string;
};

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(SALT + password).digest("hex");
}

async function getStoredUsers(): Promise<StoredUser[]> {
  const users = await redis.get<StoredUser[]>(USERS_KEY);
  return Array.isArray(users) ? users : [];
}

async function saveStoredUsers(users: StoredUser[]) {
  await redis.set(USERS_KEY, users);
}

// GET — lijst alle gebruikers
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }
  const users = await getStoredUsers();
  return NextResponse.json(
    users.map(({ username, role, email }) => ({ username, role, email }))
  );
}

// POST — maak gebruiker aan
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const { username, password, email, role } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Gebruikersnaam en wachtwoord verplicht" }, { status: 400 });
  }
  if (username === "master") {
    return NextResponse.json({ error: "Naam 'master' is gereserveerd" }, { status: 400 });
  }

  const users = await getStoredUsers();
  if (users.find((u) => u.username === username)) {
    return NextResponse.json({ error: "Gebruikersnaam bestaat al" }, { status: 400 });
  }

  users.push({
    username,
    passwordHash: hashPassword(password),
    role: role === "master" ? "master" : "client",
    email: email || undefined,
  });
  await saveStoredUsers(users);

  return NextResponse.json({ ok: true });
}

// DELETE — verwijder gebruiker
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username) return NextResponse.json({ error: "Geen gebruiker opgegeven" }, { status: 400 });

  const users = await getStoredUsers();
  const filtered = users.filter((u) => u.username !== username);
  await saveStoredUsers(filtered);

  return NextResponse.json({ ok: true });
}

// PATCH — wijzig wachtwoord
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Gebruikersnaam en wachtwoord verplicht" }, { status: 400 });
  }

  const users = await getStoredUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });

  users[idx].passwordHash = hashPassword(password);
  await saveStoredUsers(users);

  return NextResponse.json({ ok: true });
}
