import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

const SESSION_COOKIE = "cms_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000;
const USERS_KEY = "cms:users";

// ─── Master e-mailadressen ───────────────────────────────────────────────────
// Voeg hier jouw eigen e-mailadressen toe als master-toegang
const MASTER_EMAILS = [
  "info@brandingtotaal.com",
  "bdz-ventures@protonmail.com",
  "b21workgroup@gmail.com",
];

export type Role = "master" | "client";

export interface CmsUser {
  username: string;
  passwordHash: string;
  role: Role;
  email?: string;
}

export interface Session {
  username: string;
  role: Role;
  expires: number;
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update("bdz-cms-salt" + password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createPasswordHash(password: string): string {
  return hashPassword(password);
}

export async function getRedisUsers(): Promise<CmsUser[]> {
  const redis = Redis.fromEnv();
  const users = await redis.get<CmsUser[]>(USERS_KEY);
  return Array.isArray(users) ? users : [];
}

export async function validateLogin(usernameOrEmail: string, password: string): Promise<CmsUser | null> {
  const masterPassword = process.env.CMS_MASTER_PASSWORD;

  // Master via gebruikersnaam "master" + env wachtwoord
  if (usernameOrEmail === "master" && masterPassword && password === masterPassword) {
    return { username: "master", passwordHash: "", role: "master" };
  }

  // Master via e-mailadres uit MASTER_EMAILS + env wachtwoord
  if (masterPassword && MASTER_EMAILS.includes(usernameOrEmail) && password === masterPassword) {
    return { username: usernameOrEmail, passwordHash: "", role: "master" };
  }

  // Overige gebruikers via Redis — zoek op username OF email
  const users = await getRedisUsers();
  const user = users.find(
    (u) => u.username === usernameOrEmail || u.email === usernameOrEmail
  );
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export function createSessionToken(username: string, role: Role): string {
  const session: Session = { username, role, expires: Date.now() + SESSION_DURATION };
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const session: Session = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (Date.now() > session.expires) return null;
    return session;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
