import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import crypto from "crypto";
import { cmsConfig } from "@/lib/cms-config";

const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);
const TOKEN_TTL = 60 * 60; // 1 uur in seconden

type StoredUser = {
  username: string;
  passwordHash: string;
  role: "master" | "client";
  email?: string;
};

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Gebruikersnaam verplicht" }, { status: 400 });
    }

    const origin = new URL(req.url).origin;

    // Bepaal e-mailadressen op basis van gebruiker
    let emails: string[] = [];

    if (username === "master") {
      emails = cmsConfig.masterEmails;
    } else {
      const users = await redis.get<StoredUser[]>("cms:users");
      const user = Array.isArray(users) ? users.find((u) => u.username === username) : null;
      if (!user) {
        // Geen fout tonen — security: altijd zelfde response
        return NextResponse.json({ ok: true });
      }
      if (!user.email) {
        return NextResponse.json(
          { error: "Geen e-mailadres bekend voor deze gebruiker. Neem contact op met de beheerder." },
          { status: 400 }
        );
      }
      emails = [user.email];
    }

    // Genereer token
    const token = crypto.randomBytes(32).toString("hex");
    const key = `cms:reset:${token}`;
    await redis.set(key, username, { ex: TOKEN_TTL });

    const resetUrl = `${origin}/cms/login/reset?token=${token}`;

    // Stuur email naar alle adressen
    for (const email of emails) {
      await resend.emails.send({
        from: `${cmsConfig.fromName} <${cmsConfig.fromEmail}>`,
        to: email,
        subject: "Wachtwoord herstellen – CMS",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #333;">Wachtwoord herstellen</h2>
            <p>Er is een wachtwoordherstel aangevraagd voor gebruiker <strong>${username}</strong>.</p>
            <p>Klik op de knop hieronder om een nieuw wachtwoord in te stellen. Deze link is <strong>1 uur</strong> geldig.</p>
            <a href="${resetUrl}" style="
              display: inline-block;
              margin: 24px 0;
              padding: 12px 24px;
              background: #e63946;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            ">Nieuw wachtwoord instellen</a>
            <p style="color: #666; font-size: 0.85rem;">
              Of kopieer deze link in je browser:<br>
              <a href="${resetUrl}" style="color: #e63946;">${resetUrl}</a>
            </p>
            <p style="color: #999; font-size: 0.8rem;">
              Heb je dit niet aangevraagd? Dan kun je deze e-mail negeren.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("forgot error:", err);
    return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
  }
}
