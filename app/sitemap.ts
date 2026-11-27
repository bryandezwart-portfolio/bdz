import { Redis } from "@upstash/redis";
import { MetadataRoute } from "next";

const redis = Redis.fromEnv();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  // Remove trailing slash
  baseUrl = baseUrl.replace(/\/$/, "");

  let robotsIndex = true;
  try {
    const content = await redis.get<Record<string, unknown>>("cms:content");
    if (content?.robotsIndex === false) {
      robotsIndex = false;
    }
    if (content?.canonicalUrl) {
      baseUrl = String(content.canonicalUrl).replace(/\/$/, "");
    }
  } catch {
    // Redis not available — use env URL
  }

  // If indexing is disabled, return empty sitemap
  if (!robotsIndex) {
    return [];
  }

  // Base routes — extend with your own dynamic pages if needed
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  return routes;
}
