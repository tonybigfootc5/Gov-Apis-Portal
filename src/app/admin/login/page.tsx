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
  const step = stepParam === "password" ? "password" : "verify";

  return (
    <section className="mx-auto flex min-h-[76svh] max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <AdminLoginForm configMessage={getAdminAccessSetupMessage()} step={step} errorCode={errorParam} />
    </section>
  );
}
