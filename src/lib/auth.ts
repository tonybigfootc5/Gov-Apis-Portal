import "server-only";

import { headers } from "next/headers";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { serviceUnavailable, unauthorized } from "@/lib/api-response";

const CF_ACCESS_JWT_HEADER = "cf-access-jwt-assertion";
const CF_ACCESS_LOGOUT_PATH = "/cdn-cgi/access/logout";

export type AdminIdentity = {
  subject: string;
  email: string | null;
  name: string | null;
  issuer: string;
  audience: string[];
  userUuid: string | null;
  rawClaims: JWTPayload;
};

type CloudflareAccessConfig = {
  audience: string;
  teamDomain: string;
};

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function normalizeTeamDomain(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

function getCloudflareAccessConfig(): CloudflareAccessConfig {
  return {
    audience: process.env.CLOUDFLARE_ACCESS_AUD?.trim() ?? "",
    teamDomain: normalizeTeamDomain(process.env.CLOUDFLARE_ACCESS_TEAM_DOMAIN ?? ""),
  };
}

function getCloudflareAccessJwks(teamDomain: string) {
  const existing = jwksCache.get(teamDomain);
  if (existing) return existing;

  const next = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
  jwksCache.set(teamDomain, next);
  return next;
}

function mapAdminIdentity(payload: JWTPayload): AdminIdentity {
  const audClaim = payload.aud;
  const audience = Array.isArray(audClaim)
    ? audClaim.filter((value): value is string => typeof value === "string")
    : typeof audClaim === "string"
      ? [audClaim]
      : [];

  return {
    subject: typeof payload.sub === "string" ? payload.sub : "unknown",
    email: typeof payload.email === "string" ? payload.email : null,
    name: typeof payload.name === "string" ? payload.name : null,
    issuer: typeof payload.iss === "string" ? payload.iss : "",
    audience,
    userUuid: typeof payload.common_name === "string" ? payload.common_name : null,
    rawClaims: payload,
  };
}

export function getCloudflareAccessSetupMessage() {
  const { audience, teamDomain } = getCloudflareAccessConfig();
  const problems: string[] = [];

  if (!audience) {
    problems.push("CLOUDFLARE_ACCESS_AUD must be configured with the Access application AUD.");
  }

  if (!teamDomain) {
    problems.push("CLOUDFLARE_ACCESS_TEAM_DOMAIN must be configured with the Cloudflare Access team domain.");
  }

  return problems.length ? problems.join(" ") : null;
}

export function getCloudflareAccessLogoutPath() {
  return CF_ACCESS_LOGOUT_PATH;
}

export function getCloudflareAccessTeamDomain() {
  return getCloudflareAccessConfig().teamDomain || null;
}

export async function verifyCloudflareAccessToken(token: string) {
  const setupMessage = getCloudflareAccessSetupMessage();
  if (setupMessage) {
    throw new Error(setupMessage);
  }

  const { audience, teamDomain } = getCloudflareAccessConfig();
  const { payload } = await jwtVerify(token, getCloudflareAccessJwks(teamDomain), {
    issuer: teamDomain,
    audience,
  });

  return mapAdminIdentity(payload);
}

export async function getAdminIdentity() {
  const token = (await headers()).get(CF_ACCESS_JWT_HEADER);
  if (!token) return null;

  try {
    return await verifyCloudflareAccessToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  return getAdminIdentity();
}

export async function adminUnauthorized(message = "Cloudflare Access token missing or invalid.") {
  const setupMessage = getCloudflareAccessSetupMessage();
  if (setupMessage) {
    return serviceUnavailable(setupMessage);
  }

  return unauthorized(message);
}
