import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminAccessSetupMessage } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Access",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[]; step?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const errorParam = Array.isArray(resolved.error) ? resolved.error[0] : resolved.error;
  const stepParam = Array.isArray(resolved.step) ? resolved.step[0] : resolved.step;
  const step = stepParam === "verify" ? "verify" : "password";

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-md items-center px-4 py-16">
      <AdminLoginForm configMessage={getAdminAccessSetupMessage()} step={step} errorCode={errorParam} />
    </section>
  );
}
