import type { MetadataRoute } from "next";
import { isSandboxEnvironment } from "@/lib/app-env";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
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
