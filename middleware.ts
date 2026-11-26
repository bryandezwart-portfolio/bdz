import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "cms_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Alleen /cms/dashboard routes beveiligen
  if (pathname.startsWith("/cms/dashboard")) {
    const cookie = req.cookies.get(SESSION_COOKIE);
    if (!cookie) {
      return NextResponse.redirect(new URL("/cms/login", req.url));
    }
    try {
      const data = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf8"));
      if (data.expires < Date.now()) {
        return NextResponse.redirect(new URL("/cms/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/cms/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/dashboard/:path*"],
};
