"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto grid min-h-[60svh] max-w-2xl place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">Error</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-[#ffd485]">Something needs attention</h1>
        <p className="mt-3 text-[#d4c4ac]">The page could not be loaded. Please retry, or contact the site administrator if the issue continues.</p>
        <button onClick={reset} className="mt-6 rounded bg-[#f4b315] px-5 py-3 text-sm font-black text-[#271900]">Retry</button>
      </div>
    </section>
  );
}
