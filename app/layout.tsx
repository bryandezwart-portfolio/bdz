import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { Redis } from "@upstash/redis";

const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

async function getSeoMeta(): Promise<{ title?: string; description?: string; ogImage?: string }> {
  try {
    const redis = Redis.fromEnv();
    const data = await redis.get<{ title?: string; description?: string; ogImage?: string }>("cms:seo");
    return data ?? {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta();
  const title = seo.title || site.metaTitle;
  const description = seo.description || site.metaDescription;
  const ogImage = seo.ogImage || site.photo.src;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    verification: {
      google: "2UczOcuNILCNPFxgNHYvrk_IEgp7Qjtfaikocmqaq64",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
