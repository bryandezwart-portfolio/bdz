import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "cms_session";

// Pagina's die alleen master mag zien
const MASTER_ONLY = [
  "/cms/dashboard/gebruikers",
  "/cms/dashboard/instellingen",
];

// Pagina's die client NIET mag zien (master en seo wel)
const NO_CLIENT = [
  "/cms/dashboard/seo",
  "/cms/dashboard/releases",
];

// Pagina's die seo NIET mag zien
const NO_SEO = [
  "/cms/dashboard/socials",
  "/cms/dashboard/media",
  "/cms/dashboard/instellingen",
  "/cms/dashboard/gebruikers",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/cms/dashboard")) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(SESSION_COOKIE);
  if (!cookie) {
    return NextResponse.redirect(new URL("/cms/login", req.url));
  }

  let role = "client";
  try {
    const data = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf8"));
    if (data.expires < Date.now()) {
      return NextResponse.redirect(new URL("/cms/login", req.url));
    }
    role = data.role ?? "client";
  } catch {
    return NextResponse.redirect(new URL("/cms/login", req.url));
  }

  // Master mag overal in
  if (role === "master") return NextResponse.next();

  // SEO-rol: blokkeer niet-toegestane pagina's
  if (role === "seo") {
    if (NO_SEO.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/cms/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Client: blokkeer master-only en seo-pagina's
  if (MASTER_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/cms/dashboard", req.url));
  }
  if (NO_CLIENT.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/cms/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/dashboard/:path*"],
};
