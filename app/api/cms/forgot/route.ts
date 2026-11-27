import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getRedisUsers } from "@/lib/cms-auth";
import { cmsConfig } from "@/lib/cms-config";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username) return NextResponse.json({ error: "E-mailadres verplicht" }, { status: 400 });

    const redis = Redis.fromEnv();
    const users = await getRedisUsers();
    const user = users.find((u) => u.username === username || u.email === username);

    // Altijd success tonen (security: niet verklappen of account bestaat)
    if (!user || !user.email) return NextResponse.json({ ok: true });

    // Reset token aanmaken — geldig 1 uur
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 60 * 60 * 1000;
    await redis.set(`cms:reset:${token}`, { email: user.email, username: user.username }, { ex: 3600 });

    // Reset URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bryandezwart.nl";
    const resetUrl = `${baseUrl}/cms/login/reset?token=${token}`;

    // fromName en fromEmail uit Redis lezen (ingesteld via CMS), fallback op cmsConfig
    const content = ((await redis.get("cms:content")) || {}) as Record<string, string>;
    const fromName = content.fromName || cmsConfig.fromName;
    const fromEmail = content.fromEmail || cmsConfig.fromEmail;

    // E-mail sturen via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [user.email],
          subject: "Wachtwoord resetten",
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:2rem">
              <h2 style="margin-bottom:1rem">Wachtwoord resetten</h2>
              <p>Beste klant, je hebt een reset aangevraagd voor je website. Klik op de knop hieronder om een nieuw wachtwoord in te stellen. De link is <strong>1 uur</strong> geldig.</p>
              <a href="${resetUrl}" style="display:inline-block;margin:1.5rem 0;padding:0.75rem 1.5rem;background:${cmsConfig.accentColor};color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
                Wachtwoord instellen
              </a>
              <p style="color:#888;font-size:0.85rem">Als je dit niet hebt aangevraagd, kun je deze e-mail negeren.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0"/>
              <p style="color:#aaa;font-size:0.75rem">${cmsConfig.fromName}</p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cms/forgot]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
