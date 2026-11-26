import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/cms-auth";

export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const res = NextResponse.redirect(`${origin}/cms/login`);
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
