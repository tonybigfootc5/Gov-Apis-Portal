export function getSiteOrigin(fallback = "https://www.apiculture.in") {
  return new URL((process.env.NEXT_PUBLIC_SITE_URL ?? fallback).trim()).origin;
}
