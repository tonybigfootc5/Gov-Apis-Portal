import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { isSandboxEnvironment } from "@/lib/app-env";
import { serviceUnavailable, unauthorized } from "@/lib/api-response";

const CF_ACCESS_JWT_HEADER = "cf-access-jwt-assertion";
const CF_ACCESS_LOGOUT_PATH = "/cdn-cgi/access/logout";
const SANDBOX_COOKIE_NAME = "api_culture_sandbox_admin";
const SANDBOX_SECRET_MAX_AGE = 60 * 60 * 12;

export type AdminIdentity = {
  subject: string;
  email: string | null;
  name: string | null;
  issuer: string;
  audience: string[];
  userUuid: string | null;
  rawClaims: JWTPayload | null;
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

function getSandboxAdminSecret() {
  return process.env.SANDBOX_ADMIN_BYPASS_SECRET?.trim() ?? "";
}

function getCloudflareAccessJwks(teamDomain: string) {
  const existing = jwksCache.get(teamDomain);
  if (existing) return existing;

  const next = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
  jwksCache.set(teamDomain, next);
  return next;
}

function sandboxCookieSignature(payload: string) {
  return createHmac("sha256", getSandboxAdminSecret()).update(payload).digest("hex");
}

function createSandboxCookieValue() {
  const expires = Math.floor(Date.now() / 1000) + SANDBOX_SECRET_MAX_AGE;
  const nonce = randomBytes(12).toString("hex");
  const payload = `sandbox.${expires}.${nonce}`;
  return `${payload}.${sandboxCookieSignature(payload)}`;
}

function verifySandboxCookieValue(value: string | undefined) {
  if (!value) return false;
  if (!getSandboxAdminSecret()) return false;

  const parts = value.split(".");
  if (parts.length !== 4) return false;

  const [scope, expires, nonce, signature] = parts;
  if (scope !== "sandbox") return false;

  const payload = `${scope}.${expires}.${nonce}`;
  const expected = sandboxCookieSignature(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return false;

  return Number(expires) > Math.floor(Date.now() / 1000);
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

function getSandboxAdminSetupMessage() {
  return getSandboxAdminSecret()
    ? null
    : "SANDBOX_ADMIN_BYPASS_SECRET must be configured to enable sandbox admin testing.";
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

export function getAdminAccessSetupMessage() {
  return isSandboxEnvironment() ? getSandboxAdminSetupMessage() : getCloudflareAccessSetupMessage();
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

export async function setSandboxAdminCookie(response: NextResponse) {
  response.cookies.set(SANDBOX_COOKIE_NAME, createSandboxCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SANDBOX_SECRET_MAX_AGE,
    path: "/",
  });
}

export async function clearSandboxAdminCookie(response: NextResponse) {
  response.cookies.set(SANDBOX_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export function isValidSandboxAdminSecret(value: string) {
  const expected = getSandboxAdminSecret();
  const provided = value.trim();
  if (!expected || !provided) return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

async function getSandboxAdminIdentity() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SANDBOX_COOKIE_NAME)?.value;
  if (!verifySandboxCookieValue(cookieValue)) return null;

  return {
    subject: "sandbox-admin",
    email: null,
    name: "Sandbox Admin",
    issuer: "sandbox-bypass",
    audience: ["sandbox"],
    userUuid: null,
    rawClaims: null,
  } satisfies AdminIdentity;
}

export async function getAdminIdentity() {
  if (isSandboxEnvironment()) {
    return getSandboxAdminIdentity();
  }

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

export async function adminUnauthorized(message?: string) {
  const setupMessage = getAdminAccessSetupMessage();
  if (setupMessage) {
    return serviceUnavailable(setupMessage);
  }

  return unauthorized(
    message ??
      (isSandboxEnvironment()
        ? "Sandbox admin session missing or invalid."
        : "Cloudflare Access token missing or invalid."),
  );
}
