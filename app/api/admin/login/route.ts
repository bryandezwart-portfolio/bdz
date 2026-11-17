import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Verkeerd wachtwoord" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("bdz-admin-token", process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dagen
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
