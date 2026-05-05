import type { MetadataRoute } from "next";
import { getEvents, getPrograms } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.apiculture.in";
  const [programs, events] = await Promise.all([getPrograms(), getEvents()]);

  return [
    "", "/about", "/programs", "/events", "/gallery", "/contact",
    ...programs.map((program) => `/programs/${program.slug}`),
    ...events.map((event) => `/events/${event.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
