import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminAccessSetupMessage, getCloudflareAccessTeamDomain } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Access",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  await searchParams;

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-md items-center px-4 py-16">
      <AdminLoginForm configMessage={getAdminAccessSetupMessage()} teamDomain={getCloudflareAccessTeamDomain()} />
    </section>
  );
}
