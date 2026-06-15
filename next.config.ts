import type { NextConfig } from "next";

const publicMediaBaseUrl = process.env.R2_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      ...(publicMediaBaseUrl
        ? [
            {
              protocol: new URL(publicMediaBaseUrl).protocol.replace(":", "") as "http" | "https",
              hostname: new URL(publicMediaBaseUrl).hostname,
              pathname: "/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/wiki/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
