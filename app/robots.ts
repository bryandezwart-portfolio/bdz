import { Redis } from "@upstash/redis";
import { MetadataRoute } from "next";

const redis = Redis.fromEnv();

export default async function robots(): Promise<MetadataRoute.Robots> {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  let robotsIndex = true;

  try {
    const content = await redis.get<Record<string, unknown>>("cms:content");
    if (content?.robotsIndex === false) {
      robotsIndex = false;
    }
    if (content?.canonicalUrl) {
      siteUrl = String(content.canonicalUrl).replace(/\/$/, "");
    }
  } catch {
    // Redis not available — use defaults
  }

  if (!robotsIndex) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cms/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
