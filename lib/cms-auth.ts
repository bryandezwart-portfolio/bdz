import { cookies } from "next/headers";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import crypto from "crypto";

const SESSION_COOKIE = "cms_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000;
const USERS_FILE = join(process.cwd(), "private", "cms-users.json");

export type Role = "master" | "client";

export interface CmsUser {
  username: string;
  passwordHash: string;
  role: Role;
}

export interface Session {
  username: string;
  role: Role;
  expires: number;
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "bdz-cms-salt").digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createPasswordHash(password: string): string {
  return hashPassword(password);
}

export function getUsers(): CmsUser[] {
  if (!existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export async function validateLogin(username: string, password: string): Promise<CmsUser | null> {
  const masterPassword = process.env.CMS_MASTER_PASSWORD;
  if (username === "master" && masterPassword && password === masterPassword) {
    return { username: "master", passwordHash: "", role: "master" };
  }
  const users = getUsers();
  const user = users.find((u) => u.username === username);
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
