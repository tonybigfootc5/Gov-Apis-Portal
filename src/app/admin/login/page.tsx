import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-md items-center px-4 py-16">
      <form action="/api/admin/login" method="post" className="w-full rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">Restricted</p>
        <h1 className="mt-2 text-3xl font-black text-emerald-950">Admin login</h1>
        <label className="mt-6 grid gap-2 text-sm font-bold text-stone-700">
          Password
          <input type="password" name="password" required className="rounded-md border border-stone-300 px-3 py-2 outline-none ring-amber-400 focus:ring-2" />
        </label>
        <button className="mt-5 w-full rounded-md bg-emerald-950 px-4 py-3 text-sm font-black text-white" type="submit">
          Continue
        </button>
      </form>
    </section>
  );
}
