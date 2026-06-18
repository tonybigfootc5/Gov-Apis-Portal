import { NextResponse } from "next/server";
import { clearAdminSessionCookie, clearPendingAdminCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
  await clearPendingAdminCookie(response);
  await clearAdminSessionCookie(response);
  return response;
}
