import type { MetadataRoute } from "next";
import { getArticles, getEvents } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.apiculture.in";
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
