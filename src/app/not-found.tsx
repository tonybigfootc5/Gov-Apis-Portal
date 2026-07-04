import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60svh] max-w-2xl place-items-center px-4 text-center">
      <div className="rounded-[2rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#f7efe2_100%)] px-8 py-10 shadow-[0_24px_60px_rgba(171,141,92,0.14)]">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b36b00]">404</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-[#1b3b2b]">Page not found</h1>
        <p className="mt-3 text-[#516253]">The requested page is not available.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-[#f4b315] px-5 py-3 text-sm font-black text-[#271900]">Return home</Link>
      </div>
    </section>
  );
}
