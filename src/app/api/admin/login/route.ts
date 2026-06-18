import { NextResponse } from "next/server";
import { getAdminAccessSetupMessage, isValidAdminPassword, clearAdminSessionCookie, setAdminSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

function getRequestKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const firstIp = forwardedFor.split(",")[0]?.trim();
  return firstIp || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const setupMessage = getAdminAccessSetupMessage();
  if (setupMessage) {
    return NextResponse.redirect(new URL("/admin/login?error=setup", request.url), { status: 303 });
  }

  const limit = rateLimit("admin-login-password", getRequestKey(request), 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.redirect(new URL("/admin/login?error=rate-limit", request.url), { status: 303 });
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  if (!isValidAdminPassword(password)) {
    const response = NextResponse.redirect(new URL("/admin/login?error=invalid-password", request.url), { status: 303 });
    await clearAdminSessionCookie(response);
    return response;
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  await setAdminSessionCookie(response);
  return response;
}
