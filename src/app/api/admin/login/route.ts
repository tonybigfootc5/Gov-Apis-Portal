import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { tooManyRequests } from "@/lib/api-response";
import { isValidPassword, setAdminCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || "unknown";
  const limit = rateLimit("admin-login", key, 8, 15 * 60 * 1000);
  if (!limit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return tooManyRequests("Too many login attempts. Please wait a few minutes and try again.", retryAfterSeconds);
  }

  if (!isValidPassword(password)) {
    redirect("/admin/login?error=invalid");
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  await setAdminCookie(response);
  return response;
}
