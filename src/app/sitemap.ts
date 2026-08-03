import type { MetadataRoute } from "next";
import { getArticles, getEvents } from "@/lib/data";
import { getSiteOrigin } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteOrigin();
  const [events, articles] = await Promise.all([getEvents(), getArticles()]);

  return [
    "",
    "/about",
    "/programs",
    "/articles",
    "/events",
    "/gallery",
    "/equipment",
    "/contact",
    "/policies",
    "/terms-and-conditions",
    "/privacy-policy",
    "/refund-policy",
    "/shipping-policy",
    ...articles.map((article) => `/articles/${article.slug}`),
    ...events.map((event) => `/events/${event.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
