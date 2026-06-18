import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getCloudflareAccessSetupMessage, getCloudflareAccessTeamDomain } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Access",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-md items-center px-4 py-16">
      <AdminLoginForm
        configMessage={getCloudflareAccessSetupMessage()}
        teamDomain={getCloudflareAccessTeamDomain()}
      />
    </section>
  );
}
