import { NextResponse } from "next/server";
import { isSandboxEnvironment } from "@/lib/app-env";
import { clearSandboxAdminCookie, getCloudflareAccessLogoutPath } from "@/lib/auth";

export async function POST(request: Request) {
  if (isSandboxEnvironment()) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
    await clearSandboxAdminCookie(response);
    return response;
  }

  return NextResponse.redirect(new URL(getCloudflareAccessLogoutPath(), request.url), { status: 303 });
}
