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

const redis = Redis.fromEnv();

async function getCmsContent(): Promise<Record<string, unknown>> {
  try {
    return (await redis.get<Record<string, unknown>>("cms:content")) ?? {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCmsContent();

  const metaTitle = (content.metaTitle as string) || site.metaTitle;
  const metaDescription = (content.metaDescription as string) || site.metaDescription;
  const metaKeywords = (content.metaKeywords as string) || "";
  const canonicalUrl = (content.canonicalUrl as string) || "";
  const robotsIndex = content.robotsIndex !== false;
  const ogTitle = (content.ogTitle as string) || metaTitle;
  const ogDescription = (content.ogDescription as string) || metaDescription;
  const ogImage = (content.ogImage as string) || site.photo.src;
  const twitterCard = (content.twitterCard as "summary" | "summary_large_image") || "summary_large_image";
  const googleVerification = (content.googleVerification as string) || "2UczOcuNILCNPFxgNHYvrk_IEgp7Qjtfaikocmqaq64";

  return {
    metadataBase: new URL(canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords ? metaKeywords.split(",").map((k) => k.trim()) : undefined,
    robots: robotsIndex ? "index, follow" : "noindex, nofollow",
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    verification: {
      google: googleVerification.replace("google-site-verification=", ""),
    },
  };
}

async function StructuredData() {
  const content = await getCmsContent();

  const name = (content.structuredDataName as string) || "";
  if (!name) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": (content.structuredDataType as string) || "LocalBusiness",
    name,
    ...(content.canonicalUrl ? { url: content.canonicalUrl } : {}),
    ...(content.structuredDataPhone ? { telephone: content.structuredDataPhone } : {}),
    ...(content.structuredDataEmail ? { email: content.structuredDataEmail } : {}),
    ...(content.structuredDataAddress
      ? { address: { "@type": "PostalAddress", streetAddress: content.structuredDataAddress } }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${display.variable} ${body.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="font-body bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
