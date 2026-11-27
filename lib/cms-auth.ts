import { cookies } from "next/headers";
import { cmsConfig } from "./cms-config";

const SESSION_COOKIE = "cms_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 uur

export function getCmsUsers() {
  return cmsConfig.users.map((u) => ({
    username: u.username,
    password: process.env[u.passwordEnvKey] ?? "",
    role: u.role,
  }));
}

export function validateLogin(username: string, password: string) {
  const users = getCmsUsers();
  return users.find(
    (u) =>
      u.username === username &&
      u.password !== "" &&
      u.password === password
  ) ?? null;
}

export async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const data = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    if (data.expires < Date.now()) return null;
    return data as { username: string; role: "master" | "client" | "seo"; expires: number };
  } catch {
    return null;
  }
}

export function createSessionToken(username: string, role: string) {
  const data = {
    username,
    role,
    expires: Date.now() + SESSION_MAX_AGE * 1000,
  };
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_COOKIE_MAX_AGE = SESSION_MAX_AGE;

// Alias zodat andere routes SESSION_COOKIE direct kunnen importeren
export { SESSION_COOKIE };

// Redis gebruikers ophalen (voor forgot/reset routes)
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export async function getRedisUsers(): Promise<Array<{ username: string; email?: string; passwordHash: string; role: string }>> {
  try {
    const users = await redis.get<Array<{ username: string; email?: string; passwordHash: string; role: string }>>("cms:users");
    return users ?? [];
  } catch {
    return [];
  }
}

// Wachtwoord hash (SHA-256 met salt)
import crypto from "crypto";
export function createPasswordHash(password: string): string {
  return crypto.createHash("sha256").update("bdz-cms-salt" + password).digest("hex");
}
