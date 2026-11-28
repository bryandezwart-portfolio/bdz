// ─────────────────────────────────────────────
//  CMS METADATA HELPER
//  Gebruik in app/layout.tsx van de klantsite:
//
//  import { getCmsMetadata } from "@/lib/cms-metadata";
//  export async function generateMetadata() {
//    return getCmsMetadata();
//  }
// ─────────────────────────────────────────────

import { Redis } from "@upstash/redis";
import { Metadata } from "next";
import { cmsConfig } from "./cms-config";

const redis = Redis.fromEnv();

export async function getCmsMetadata(): Promise<Metadata> {
  let data: Record<string, unknown> = {};

  try {
    data = (await redis.get<Record<string, unknown>>("cms:content")) ?? {};
  } catch {
    // Redis niet beschikbaar — gebruik defaults
  }

  const siteName   = String(data.siteName   ?? cmsConfig.siteName);
  const siteUrl    = String(data.canonicalUrl ?? cmsConfig.siteUrl ?? "").replace(/\/$/, "");
  const title      = String(data.metaTitle      ?? siteName);
  const description = String(data.metaDescription ?? "");
  const keywords   = String(data.metaKeywords   ?? "");
  const ogTitle    = String(data.ogTitle        ?? title);
  const ogDesc     = String(data.ogDescription  ?? description);
  const ogImage    = data.ogImage ? String(data.ogImage) : undefined;
  const twitterCard = (data.twitterCard as "summary" | "summary_large_image") ?? "summary_large_image";
  const googleVerif = data.googleVerification ? String(data.googleVerification) : undefined;
  const robotsIndex = data.robotsIndex !== false;

  return {
    title,
    description,
    keywords: keywords || undefined,
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    alternates: siteUrl ? { canonical: siteUrl } : undefined,
    robots: robotsIndex
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: siteUrl || undefined,
      siteName,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }] : undefined,
      type: "website",
      locale: "nl_NL",
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDesc,
      images: ogImage ? [ogImage] : undefined,
    },
    verification: googleVerif ? { google: googleVerif } : undefined,
  };
}

// ─────────────────────────────────────────────
//  STRUCTURED DATA (JSON-LD)
//  Gebruik als component in app/layout.tsx:
//
//  import { CmsStructuredData } from "@/lib/cms-metadata";
//  <CmsStructuredData />
// ─────────────────────────────────────────────

export async function getCmsStructuredData(): Promise<Record<string, unknown> | null> {
  let data: Record<string, unknown> = {};

  try {
    data = (await redis.get<Record<string, unknown>>("cms:content")) ?? {};
  } catch {
    return null;
  }

  const name = data.structuredDataName ?? data.siteName ?? cmsConfig.siteName;
  if (!name) return null;

  const type    = String(data.structuredDataType ?? "LocalBusiness");
  const phone   = data.structuredDataPhone  ? String(data.structuredDataPhone)  : undefined;
  const email   = data.structuredDataEmail  ? String(data.structuredDataEmail)  : undefined;
  const address = data.structuredDataAddress ? String(data.structuredDataAddress) : undefined;
  const url     = data.canonicalUrl ? String(data.canonicalUrl) : undefined;
  const image   = data.ogImage ? String(data.ogImage) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    ...(url     && { url }),
    ...(phone   && { telephone: phone }),
    ...(email   && { email }),
    ...(image   && { image }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
      },
    }),
  };
}
