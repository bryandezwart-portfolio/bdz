import { NextResponse } from "next/server";
import { getSession } from "@/lib/cms-auth";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

const USERS_KEY = "cms:users";
const SALT = "bdz-cms-salt";

type StoredUser = {
  username: string;
  passwordHash: string;
  role: "master" | "client";
  email?: string;
  name?: string;
};

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(SALT + password).digest("hex");
}

async function getStoredUsers(redis: Redis): Promise<StoredUser[]> {
  const users = await redis.get<StoredUser[]>(USERS_KEY);
  return Array.isArray(users) ? users : [];
}

async function saveStoredUsers(redis: Redis, users: StoredUser[]) {
  await redis.set(USERS_KEY, users);
}

export async function GET() {
  const redis = Redis.fromEnv();
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }
  const users = await getStoredUsers(redis);
  const currentUser = session.username;
  return NextResponse.json({
    users: users.map(({ username, role, email, name }) => ({ email: email || username, role, name })),
    currentUser: currentUser,
  });
}

export async function POST(req: Request) {
  const redis = Redis.fromEnv();
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const { email, password, role, name } = await req.json();
  // gebruik email als username
  const username = email;
  if (!username || !password) {
    return NextResponse.json({ error: "E-mail en wachtwoord zijn verplicht" }, { status: 400 });
  }
  if (username === "master") {
    return NextResponse.json({ error: "Dit e-mailadres is gereserveerd" }, { status: 400 });
  }

  const users = await getStoredUsers(redis);
  if (users.find((u) => u.username === username || u.email === email)) {
    return NextResponse.json({ error: "E-mailadres bestaat al" }, { status: 400 });
  }

  users.push({
    username,
    passwordHash: hashPassword(password),
    role: role === "master" ? "master" : "client",
    email: email || undefined,
    name: name || undefined,
  });
  await saveStoredUsers(redis, users);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const redis = Redis.fromEnv();
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  // ondersteun zowel body { email } als query ?username=
  let identifier: string | null = null;
  try {
    const body = await req.json();
    identifier = body.email || body.username || null;
  } catch {
    const { searchParams } = new URL(req.url);
    identifier = searchParams.get("username") || searchParams.get("email");
  }

  if (!identifier) return NextResponse.json({ error: "Geen gebruiker opgegeven" }, { status: 400 });

  const users = await getStoredUsers(redis);
  const filtered = users.filter((u) => u.username !== identifier && u.email !== identifier);
  await saveStoredUsers(redis, filtered);

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const redis = Redis.fromEnv();
  const session = await getSession();
  if (!session || session.role !== "master") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Gebruikersnaam en wachtwoord verplicht" }, { status: 400 });
  }

  const users = await getStoredUsers(redis);
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });

  users[idx].passwordHash = hashPassword(password);
  await saveStoredUsers(redis, users);

  return NextResponse.json({ ok: true });
}
