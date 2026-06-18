import { NextResponse } from "next/server";
import { getAdminAccessSetupMessage } from "@/lib/auth";

export async function POST(request: Request) {
  const setupMessage = getAdminAccessSetupMessage();
  if (setupMessage) {
    return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
  }

  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
