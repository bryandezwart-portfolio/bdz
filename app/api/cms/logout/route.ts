import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/cms-auth";

export async function POST() {
  const res = NextResponse.redirect(new URL("/cms/login", process.env.NEXT_PUBLIC_SITE_URL || "https://bryandezwart.nl"));
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
