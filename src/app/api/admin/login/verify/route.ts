import { NextResponse } from "next/server";
import {
  clearAdminPreAuthCookie,
  consumeBackupCode,
  getAdminAuthSetupMessage,
  isValidTotpCode,
  requireAdminPreAuth,
  setAdminCookie,
} from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const setupMessage = getAdminAuthSetupMessage();
  if (setupMessage) {
    const response = NextResponse.redirect(new URL("/admin/login?error=setup", request.url), { status: 303 });
    await clearAdminPreAuthCookie(response);
    return response;
  }

  if (!(await requireAdminPreAuth())) {
    const response = NextResponse.redirect(new URL("/admin/login?error=expired", request.url), { status: 303 });
    await clearAdminPreAuthCookie(response);
    return response;
  }

  const formData = await request.formData();
  const mode = String(formData.get("mode") ?? "totp");
  const code = String(formData.get("code") ?? "");
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || "unknown";
  const limit = rateLimit("admin-login-mfa", key, 10, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.redirect(new URL("/admin/login?error=rate-limit-mfa", request.url), { status: 303 });
  }

  const verified =
    mode === "backup"
      ? await consumeBackupCode(code)
      : isValidTotpCode(code);

  if (!verified) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid-code", request.url), { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  await clearAdminPreAuthCookie(response);
  await setAdminCookie(response);
  return response;
}
