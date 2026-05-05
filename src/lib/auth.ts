import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "api_culture_admin";
const ONE_DAY = 60 * 60 * 24;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "development-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionToken() {
  const expires = Math.floor(Date.now() / 1000) + ONE_DAY;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
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

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [role, expires, signature] = parts;
  const payload = `${role}.${expires}`;
  const expected = sign(payload);

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return false;

  return role === "admin" && Number(expires) > Math.floor(Date.now() / 1000);
}

export async function requireAdmin() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE_NAME)?.value);
}

export async function adminUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function isValidPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) {
    return process.env.NODE_ENV !== "production" && password === "admin-development-pass";
  }

  const providedBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}
