import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60svh] max-w-2xl place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">404</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-[#ffd485]">Page not found</h1>
        <p className="mt-3 text-[#d4c4ac]">The requested page is not available.</p>
        <Link href="/" className="mt-6 inline-flex rounded bg-[#f4b315] px-5 py-3 text-sm font-black text-[#271900]">Return home</Link>
      </div>
    </section>
  );
}
