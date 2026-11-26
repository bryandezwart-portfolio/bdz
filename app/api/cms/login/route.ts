import { NextRequest, NextResponse } from "next/server";
import { validateLogin, createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from "@/lib/cms-auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = validateLogin(username, password);
  if (!user) {
    return NextResponse.json({ error: "Gebruikersnaam of wachtwoord onjuist" }, { status: 401 });
  }

  const token = createSessionToken(user.username, user.role);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
  });

  return res;
}
