import type { MetadataRoute } from "next";
import { getArticles, getEvents, getPrograms } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.apiculture.in";
  const [programs, events, articles] = await Promise.all([getPrograms(), getEvents(), getArticles()]);

  return [
    "",
    "/about",
    "/programs",
    "/articles",
    "/events",
    "/gallery",
    "/contact",
    "/policies",
    "/terms-and-conditions",
    "/privacy-policy",
    "/refund-policy",
    "/return-policy",
    "/shipping-policy",
    ...programs.map((program) => `/programs/${program.slug}`),
    ...articles.map((article) => `/articles/${article.slug}`),
    ...events.map((event) => `/events/${event.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
