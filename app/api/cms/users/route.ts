import { NextResponse } from "next/server";
import { getSession, getUsers, createPasswordHash, CmsUser } from "@/lib/cms-auth";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const USERS_FILE = join(process.cwd(), "private", "cms-users.json");

function saveUsers(users: CmsUser[]) {
  const dir = join(process.cwd(), "private");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const users = getUsers().map((u) => ({ username: u.username, role: u.role }));
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const { username, password, role } = await req.json();
  if (!username || !password) return NextResponse.json({ error: "Gebruikersnaam en wachtwoord zijn verplicht" }, { status: 400 });
  if (username === "master") return NextResponse.json({ error: "Deze gebruikersnaam is gereserveerd" }, { status: 400 });
  const users = getUsers();
  if (users.find((u) => u.username === username)) return NextResponse.json({ error: "Gebruikersnaam bestaat al" }, { status: 400 });
  users.push({ username, passwordHash: createPasswordHash(password), role: role || "client" });
  saveUsers(users);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const { username } = await req.json();
  if (username === "master") return NextResponse.json({ error: "Master kan niet verwijderd worden" }, { status: 400 });
  saveUsers(getUsers().filter((u) => u.username !== username));
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "master") return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  const { username, password } = await req.json();
  if (username === "master") return NextResponse.json({ error: "Master wachtwoord wijzig je via .env.local" }, { status: 400 });
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });
  user.passwordHash = createPasswordHash(password);
  saveUsers(users);
  return NextResponse.json({ ok: true });
}
