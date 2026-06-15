import { NextResponse } from "next/server";
import {
  clearAdminCookie,
  clearAdminPreAuthCookie,
  getAdminAuthSetupMessage,
  isValidPassword,
  setAdminPreAuthCookie,
} from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const setupMessage = getAdminAuthSetupMessage();
  if (setupMessage) {
    const response = NextResponse.redirect(new URL("/admin/login?error=setup", request.url), { status: 303 });
    await clearAdminCookie(response);
    await clearAdminPreAuthCookie(response);
    return response;
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || "unknown";
  const limit = rateLimit("admin-login-password", key, 8, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.redirect(new URL("/admin/login?error=rate-limit-password", request.url), { status: 303 });
  }

  if (!isValidPassword(password)) {
    const response = NextResponse.redirect(new URL("/admin/login?error=invalid-password", request.url), { status: 303 });
    await clearAdminCookie(response);
    await clearAdminPreAuthCookie(response);
    return response;
  }

  const response = NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
  await clearAdminCookie(response);
  await setAdminPreAuthCookie(response);
  return response;
}
