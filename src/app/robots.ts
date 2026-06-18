import type { MetadataRoute } from "next";
import { isSandboxEnvironment } from "@/lib/app-env";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.apiculture.in";
  const sandboxMode = isSandboxEnvironment();

  return {
    rules: sandboxMode
      ? {
          userAgent: "*",
          disallow: "/",
        }
      : {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin", "/api/admin"],
        },
    sitemap: `${base}/sitemap.xml`,
  };
}
