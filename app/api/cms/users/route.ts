import { NextResponse } from "next/server";
import { getSession, createPasswordHash } from "@/lib/cms-auth";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const USERS_KEY = "cms:users";

type StoredUser = { username: string; passwordHash: string; role: "master" | "client" };

async function getStoredUsers(): Promise<StoredUser[]> {
  const users = await redis.get<StoredUser[]>(USERS_KEY);
  return Array.isArray(users) ? users : [];
}

async function saveStoredUsers(users: StoredUser[]) {
  await redis.set(USERS_KEY, users);
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const users = await getStoredUsers();
  return NextResponse.json({ users: users.map((u) => ({ username: u.username, role: u.role })) });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const { username, password, role } = await req.json();
  if (!username || !password) return NextResponse.json({ error: "Gebruikersnaam en wachtwoord zijn verplicht" }, { status: 400 });
  if (username === "master") return NextResponse.json({ error: "Deze gebruikersnaam is gereserveerd" }, { status: 400 });
  const users = await getStoredUsers();
  if (users.find((u) => u.username === username)) return NextResponse.json({ error: "Gebruikersnaam bestaat al" }, { status: 400 });
  users.push({ username, passwordHash: createPasswordHash(password), role: role || "client" });
  await saveStoredUsers(users);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const { username } = await req.json();
  if (username === "master") return NextResponse.json({ error: "Master kan niet verwijderd worden" }, { status: 400 });
  const users = await getStoredUsers();
  await saveStoredUsers(users.filter((u) => u.username !== username));
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const { username, password } = await req.json();
  if (username === "master") return NextResponse.json({ error: "Master wachtwoord wijzig je via .env.local" }, { status: 400 });
  const users = await getStoredUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
  user.passwordHash = createPasswordHash(password);
  await saveStoredUsers(users);
  return NextResponse.json({ ok: true });
}
