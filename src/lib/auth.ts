import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serviceUnavailable, unauthorized } from "@/lib/api-response";

const ADMIN_SESSION_COOKIE = "api_culture_admin_session";
const ADMIN_PENDING_COOKIE = "api_culture_admin_pending";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;
const ADMIN_PENDING_MAX_AGE = 60 * 10;
const TOTP_WINDOW = 1;
const TOTP_DIGITS = 6;
const TOTP_PERIOD_SECONDS = 30;

type SessionScope = "admin-session" | "admin-pending";

type SessionPayload = {
  scope: SessionScope;
  subject: string;
  expiresAt: number;
  nonce: string;
};

export type AdminIdentity = {
  subject: string;
  email: string | null;
  name: string | null;
  issuer: string;
  audience: string[];
  userUuid: string | null;
  rawClaims: null;
};

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

function getAdminTotpSecret() {
  return process.env.ADMIN_TOTP_SECRET?.trim() ?? "";
}

function getAdminBackupCodeHashes() {
  return (process.env.ADMIN_BACKUP_CODES_HASHES ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function createSessionSignature(payloadBase64: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(payloadBase64).digest("base64url");
}

function encodeSession(scope: SessionScope, maxAgeSeconds: number) {
  const payload: SessionPayload = {
    scope,
    subject: "admin",
    expiresAt: Math.floor(Date.now() / 1000) + maxAgeSeconds,
    nonce: randomBytes(12).toString("hex"),
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createSessionSignature(payloadBase64);
  return `${payloadBase64}.${signature}`;
}

function decodeSession(value: string | undefined, expectedScope: SessionScope) {
  if (!value || !getAdminSessionSecret()) return null;

  const [payloadBase64, providedSignature] = value.split(".");
  if (!payloadBase64 || !providedSignature) return null;

  const expectedSignature = createSessionSignature(payloadBase64);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8")) as SessionPayload;
    if (payload.scope !== expectedScope) return null;
    if (payload.subject !== "admin") return null;
    if (payload.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function normalizeBackupCode(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function hashBackupCode(value: string) {
  return createHash("sha256").update(normalizeBackupCode(value)).digest("hex");
}

function decodeBase32(value: string) {
  const sanitized = value.replace(/=+$/g, "").replace(/[^A-Z2-7]/gi, "").toUpperCase();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let buffer = 0;
  const bytes: number[] = [];

  for (const character of sanitized) {
    const index = alphabet.indexOf(character);
    if (index === -1) continue;

    buffer = (buffer << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((buffer >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function generateTotp(counter: number) {
  const secret = decodeBase32(getAdminTotpSecret());
  if (secret.length === 0) return null;

  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  counterBuffer.writeUInt32BE(counter >>> 0, 4);

  const hmac = createHmac("sha1", secret).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binaryCode =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(binaryCode % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, "0");
}

export function isValidAdminPassword(value: string) {
  const expected = getAdminPassword();
  const provided = value.trim();
  if (!expected || !provided) return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export function isValidAdminTotp(value: string) {
  const normalized = value.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;

  const nowCounter = Math.floor(Date.now() / 1000 / TOTP_PERIOD_SECONDS);
  for (let offset = -TOTP_WINDOW; offset <= TOTP_WINDOW; offset += 1) {
    if (generateTotp(nowCounter + offset) === normalized) return true;
  }

  return false;
}

export function isValidAdminBackupCode(value: string) {
  const normalized = normalizeBackupCode(value);
  if (normalized.length < 8) return false;

  const codeHash = hashBackupCode(value);
  return getAdminBackupCodeHashes().includes(codeHash);
}

export function getAdminAccessSetupMessage() {
  const problems: string[] = [];

  if (!getAdminPassword()) {
    problems.push("ADMIN_PASSWORD must be configured.");
  }

  if (!getAdminSessionSecret()) {
    problems.push("ADMIN_SESSION_SECRET must be configured.");
  }

  if (!getAdminTotpSecret()) {
    problems.push("ADMIN_TOTP_SECRET must be configured.");
  }

  return problems.length ? problems.join(" ") : null;
}

export async function setPendingAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_PENDING_COOKIE, encodeSession("admin-pending", ADMIN_PENDING_MAX_AGE), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_PENDING_MAX_AGE,
    path: "/",
  });
}

export async function clearPendingAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_PENDING_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function setAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, encodeSession("admin-session", ADMIN_SESSION_MAX_AGE), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function hasPendingAdminChallenge() {
  const cookieStore = await cookies();
  return Boolean(decodeSession(cookieStore.get(ADMIN_PENDING_COOKIE)?.value, "admin-pending"));
}

export async function getAdminIdentity() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value, "admin-session");
  if (!session) return null;

  return {
    subject: session.subject,
    email: null,
    name: "Admin",
    issuer: "app-mfa",
    audience: ["admin"],
    userUuid: null,
    rawClaims: null,
  } satisfies AdminIdentity;
}

export async function requireAdmin() {
  return getAdminIdentity();
}

export async function adminUnauthorized(message?: string) {
  const setupMessage = getAdminAccessSetupMessage();
  if (setupMessage) {
    return serviceUnavailable(setupMessage);
  }

  return unauthorized(message ?? "Admin session missing or invalid.");
}
