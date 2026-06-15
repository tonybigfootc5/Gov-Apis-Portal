import "server-only";

import { createHash, createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { unauthorized } from "@/lib/api-response";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

const COOKIE_NAME = "api_culture_admin";
const PREAUTH_COOKIE_NAME = "api_culture_admin_preauth";
const ONE_DAY = 60 * 60 * 24;
const PREAUTH_MAX_AGE = 10 * 60;
const TOTP_TIME_STEP_SECONDS = 30;
const TOTP_ALLOWED_WINDOW = 1;
const TOTP_DIGITS = 6;
const BACKUP_CODE_ENV_NAME = "ADMIN_BACKUP_CODES_HASHES";

export type AdminLoginStage = "password" | "verify";

type AdminAuthConfig = {
  password: string;
  sessionSecret: string;
  totpSecret: string;
  backupCodeHashes: Set<string>;
};

type AdminAuthReadiness = {
  ready: boolean;
  message: string | null;
  stage: AdminLoginStage;
};

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "development-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function createSignedToken(prefix: string, expiresInSeconds: number) {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const nonce = randomBytes(12).toString("hex");
  const payload = `${prefix}.${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function verifySignedToken(token: string | undefined, prefix: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [role, expires, nonce, signature] = parts;
  if (role !== prefix) return false;

  const payload = `${role}.${expires}.${nonce}`;
  const expected = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return false;

  return Number(expires) > Math.floor(Date.now() / 1000);
}

function normalizeBase32(value: string) {
  return value.replace(/[\s-]+/g, "").toUpperCase();
}

function decodeBase32(value: string) {
  const normalized = normalizeBase32(value);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let current = 0;
  const bytes: number[] = [];

  for (const character of normalized) {
    const index = alphabet.indexOf(character);
    if (index === -1) {
      throw new Error("Invalid base32 secret.");
    }

    current = (current << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((current >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function generateTotp(secretValue: string, stepOffset = 0) {
  const counter = Math.floor(Date.now() / 1000 / TOTP_TIME_STEP_SECONDS) + stepOffset;
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const digest = createHmac("sha1", decodeBase32(secretValue)).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    (digest[offset + 1] << 16) |
    (digest[offset + 2] << 8) |
    digest[offset + 3];

  return String(binary % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, "0");
}

function normalizeBackupCode(value: string) {
  return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function parseBackupCodeHashes(value: string | undefined) {
  return (value ?? "")
    .split(/[\s,]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function getAdminAuthConfig(): AdminAuthConfig {
  return {
    password: process.env.ADMIN_PASSWORD ?? "",
    sessionSecret: process.env.ADMIN_SESSION_SECRET ?? "",
    totpSecret: normalizeBase32(process.env.ADMIN_TOTP_SECRET ?? ""),
    backupCodeHashes: new Set(parseBackupCodeHashes(process.env[BACKUP_CODE_ENV_NAME])),
  };
}

export function getAdminAuthSetupMessage() {
  const config = getAdminAuthConfig();
  const problems: string[] = [];

  if (!hasDatabaseUrl) {
    problems.push("DATABASE_URL is required so backup-code usage can be tracked safely.");
  }

  if (config.password.length !== 24) {
    problems.push("ADMIN_PASSWORD must be set to a 24-character admin secret.");
  }

  if (!config.sessionSecret) {
    problems.push("ADMIN_SESSION_SECRET must be configured.");
  }

  if (!config.totpSecret) {
    problems.push("ADMIN_TOTP_SECRET must be configured with the Google Authenticator secret.");
  }

  if (config.backupCodeHashes.size === 0) {
    problems.push(`${BACKUP_CODE_ENV_NAME} must contain the backup-code hashes.`);
  }

  return problems.length ? problems.join(" ") : null;
}

export async function getAdminLoginReadiness(): Promise<AdminAuthReadiness> {
  const store = await cookies();
  const stage = verifySignedToken(store.get(PREAUTH_COOKIE_NAME)?.value, "mfa")
    ? "verify"
    : "password";

  return {
    ready: !getAdminAuthSetupMessage(),
    message: getAdminAuthSetupMessage(),
    stage,
  };
}

export function createSessionToken() {
  return createSignedToken("admin", ONE_DAY);
}

export async function setAdminCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_DAY,
    path: "/",
  });
}

export async function clearAdminCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function setAdminPreAuthCookie(response: NextResponse) {
  response.cookies.set(PREAUTH_COOKIE_NAME, createSignedToken("mfa", PREAUTH_MAX_AGE), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: PREAUTH_MAX_AGE,
    path: "/admin",
  });
}

export async function clearAdminPreAuthCookie(response: NextResponse) {
  response.cookies.set(PREAUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/admin",
  });
}

export function verifyAdminToken(token?: string) {
  return verifySignedToken(token, "admin");
}

export async function requireAdmin() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE_NAME)?.value);
}

export async function requireAdminPreAuth() {
  const store = await cookies();
  return verifySignedToken(store.get(PREAUTH_COOKIE_NAME)?.value, "mfa");
}

export async function adminUnauthorized() {
  return unauthorized();
}

export function isValidPassword(password: string) {
  const expected = getAdminAuthConfig().password;
  if (expected.length !== 24) {
    return false;
  }

  const providedBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export function isValidTotpCode(code: string) {
  const normalizedCode = code.replace(/\D/g, "");
  if (normalizedCode.length !== TOTP_DIGITS) {
    return false;
  }

  const { totpSecret } = getAdminAuthConfig();
  if (!totpSecret) {
    return false;
  }

  const providedBuffer = Buffer.from(normalizedCode);

  try {
    for (let offset = -TOTP_ALLOWED_WINDOW; offset <= TOTP_ALLOWED_WINDOW; offset += 1) {
      const expectedCode = generateTotp(totpSecret, offset);
      const expectedBuffer = Buffer.from(expectedCode);
      if (
        providedBuffer.length === expectedBuffer.length &&
        timingSafeEqual(providedBuffer, expectedBuffer)
      ) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

export async function consumeBackupCode(code: string) {
  const normalizedCode = normalizeBackupCode(code);
  if (!normalizedCode) {
    return false;
  }

  const codeHash = hashValue(normalizedCode);
  const { backupCodeHashes } = getAdminAuthConfig();
  if (!backupCodeHashes.has(codeHash)) {
    return false;
  }

  try {
    await prisma.adminBackupCodeUse.create({
      data: { codeHash },
    });
    return true;
  } catch {
    return false;
  }
}
