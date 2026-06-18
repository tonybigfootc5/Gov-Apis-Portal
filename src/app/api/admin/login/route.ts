import { NextResponse } from "next/server";
import { isSandboxEnvironment } from "@/lib/app-env";
import {
  clearSandboxAdminCookie,
  getAdminAccessSetupMessage,
  isValidSandboxAdminSecret,
  setSandboxAdminCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  if (isSandboxEnvironment()) {
    const setupMessage = getAdminAccessSetupMessage();
    if (setupMessage) {
      return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
    }

    const formData = await request.formData();
    const secret = String(formData.get("secret") ?? "");
    if (!isValidSandboxAdminSecret(secret)) {
      const response = NextResponse.redirect(new URL("/admin/login?error=invalid-secret", request.url), { status: 303 });
      await clearSandboxAdminCookie(response);
      return response;
    }

    const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
    await setSandboxAdminCookie(response);
    return response;
  }

  return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
}
