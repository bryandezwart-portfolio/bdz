import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { createPasswordHash, getRedisUsers } from "@/lib/cms-auth";

// Eenmalige route om master-gebruikers in Redis te zetten
// Beveiligd met CMS_MASTER_PASSWORD
// Aanroepen via: /api/cms/init-masters?secret=JOUWWACHTWOORD

const MASTER_ACCOUNTS = [
  { username: "info@brandingtotaal.com", email: "info@brandingtotaal.com" },
  { username: "bdz-ventures@protonmail.com", email: "bdz-ventures@protonmail.com" },
  { username: "b21workgroup@gmail.com", email: "b21workgroup@gmail.com" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const masterPassword = process.env.CMS_MASTER_PASSWORD;

  if (!secret || !masterPassword || secret !== masterPassword) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 401 });
  }

  const redis = Redis.fromEnv();
  const users = await getRedisUsers();

  for (const account of MASTER_ACCOUNTS) {
    const exists = users.find((u) => u.email === account.email);
    if (!exists) {
      users.push({
        username: account.username,
        email: account.email,
        passwordHash: createPasswordHash(masterPassword),
        role: "master",
      });
    }
  }

  await redis.set("cms:users", users);

  return NextResponse.json({
    ok: true,
    message: "Master-gebruikers aangemaakt in Redis",
    accounts: MASTER_ACCOUNTS.map((a) => a.email),
  });
}
