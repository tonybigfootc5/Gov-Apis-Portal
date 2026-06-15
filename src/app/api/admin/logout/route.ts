import { NextResponse } from "next/server";
import { clearAdminCookie, clearAdminPreAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  await clearAdminCookie(response);
  await clearAdminPreAuthCookie(response);
  return response;
}
