import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-md items-center px-4 py-16">
      <form action="/api/admin/login" method="post" className="glass-panel w-full rounded-xl p-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Restricted</p>
        <h1 className="font-display mt-2 text-4xl font-semibold text-[#ffd485]">Admin login</h1>
        <label className="mt-6 grid gap-2 text-sm font-bold text-[#d4c4ac]">
          Password
          <input type="password" name="password" required className="rounded border border-[#504533] bg-[#120c12] px-3 py-2 text-[#ecdfe8] outline-none ring-[#ffd485] focus:ring-2" />
        </label>
        <button className="hex-soft mt-5 w-full bg-[#f4b315] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#271900]" type="submit">
          Continue
        </button>
      </form>
    </section>
  );
}
