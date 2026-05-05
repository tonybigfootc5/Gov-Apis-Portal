import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { isValidPassword, setAdminCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");

  if (!isValidPassword(password)) {
    redirect("/admin/login?error=invalid");
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  await setAdminCookie(response);
  return response;
}
