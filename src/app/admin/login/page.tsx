import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminLoginReadiness } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const [{ error }, readiness] = await Promise.all([searchParams, getAdminLoginReadiness()]);
  const errorCode = Array.isArray(error) ? error[0] : error;

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-md items-center px-4 py-16">
      <AdminLoginForm
        authReady={readiness.ready}
        configMessage={readiness.message}
        errorCode={errorCode}
        initialStage={readiness.stage}
      />
    </section>
  );
}
