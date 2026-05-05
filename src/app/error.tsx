"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto grid min-h-[60svh] max-w-2xl place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">Error</p>
        <h1 className="mt-3 text-3xl font-black text-emerald-950">Something needs attention</h1>
        <p className="mt-3 text-stone-700">The page could not be loaded. Please retry, or contact the site administrator if the issue continues.</p>
        <button onClick={reset} className="mt-6 rounded-md bg-emerald-950 px-5 py-3 text-sm font-black text-white">Retry</button>
      </div>
    </section>
  );
}
