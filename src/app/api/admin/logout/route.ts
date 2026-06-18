import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
  await clearAdminSessionCookie(response);
  return response;
}
