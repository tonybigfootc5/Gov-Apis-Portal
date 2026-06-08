import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-md items-center px-4 py-16">
      <AdminLoginForm />
    </section>
  );
}
