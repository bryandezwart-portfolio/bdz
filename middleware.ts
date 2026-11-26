import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "cms_session";
const MASTER_ONLY = ["/cms/dashboard/instellingen", "/cms/dashboard/gebruikers"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/cms/dashboard")) return NextResponse.next();

  const cookie = req.cookies.get(SESSION_COOKIE);
  if (!cookie) return NextResponse.redirect(new URL("/cms/login", req.url));

  let session: { role: string; expires: number } | null = null;
  try {
    session = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf8"));
  } catch {
    return NextResponse.redirect(new URL("/cms/login", req.url));
  }

  if (!session || session.expires < Date.now()) {
    return NextResponse.redirect(new URL("/cms/login", req.url));
  }

  if (session.role === "client" && MASTER_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/cms/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/dashboard/:path*"],
};
