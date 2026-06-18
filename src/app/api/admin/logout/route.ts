import { NextResponse } from "next/server";
import { getCloudflareAccessLogoutPath } from "@/lib/auth";

export async function POST(request: Request) {
  return NextResponse.redirect(new URL(getCloudflareAccessLogoutPath(), request.url), { status: 303 });
}
