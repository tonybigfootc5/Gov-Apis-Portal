import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60svh] max-w-2xl place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">404</p>
        <h1 className="mt-3 text-3xl font-black text-emerald-950">Page not found</h1>
        <p className="mt-3 text-stone-700">The requested page is not available.</p>
        <Link href="/" className="mt-6 inline-flex rounded-md bg-emerald-950 px-5 py-3 text-sm font-black text-white">Return home</Link>
      </div>
    </section>
  );
}
