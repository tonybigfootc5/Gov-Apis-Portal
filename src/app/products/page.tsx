import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package2, ShieldCheck } from "lucide-react";
import { productItems } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Representative hive products connected to API CULTURE training and value-addition work.",
};

export default function ProductsPage() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="neo-shell rounded-[2.4rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#8ec5ff]">Hive products</p>
              <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.92] text-bright sm:text-6xl lg:text-7xl">
                Products that connect beekeeping with value addition and rural opportunity.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-dim sm:text-lg">
                These products represent the major hive-product streams commonly linked to practical apiary work, collection discipline, processing awareness, and market-facing presentation.
              </p>
            </div>

            <div className="section-frame rounded-[1.7rem] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">Snapshot</p>
              <div className="mt-5 grid gap-4">
                <QuickStat value={`${productItems.length}`} label="Product streams" />
                <QuickStat value="Collection + processing" label="Learning path" />
                <QuickStat value="Field-linked" label="Approach" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {productItems.map((item) => (
            <article
              key={item.title}
              className="grid gap-0 overflow-hidden rounded-[1.8rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e7_100%)] shadow-[0_18px_50px_rgba(171,141,92,0.12)] lg:grid-cols-[20rem_minmax(0,1fr)]"
            >
              <div className="relative min-h-[16rem] border-b border-[rgba(41,56,49,0.08)] bg-[#f3ecdf] lg:min-h-full lg:border-r lg:border-b-0">
                <Image src={item.imageSrc} alt={item.imageAlt} fill sizes="(min-width: 1024px) 20rem, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,27,22,0.03)_10%,rgba(17,27,22,0.56)_100%)]" />
              </div>
              <div className="p-5 sm:p-6 lg:p-7">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-[#8ec5ff]/22 bg-[#8ec5ff]/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#547ba1]">
                    Product stream
                  </span>
                  <Package2 className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
                </div>
                <h2 className="font-display mt-4 text-4xl leading-tight text-bright">{item.title}</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-dim">{item.description}</p>
                <div className="mt-6 grid gap-3">
                  {item.highlights.map((highlight) => (
                    <p key={highlight} className="inline-flex gap-3 text-sm leading-7 text-dim">
                      <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#8ec5ff]" aria-hidden="true" />
                      {highlight}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/technologies"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
          >
            Explore technologies
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.78)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#1f352b]"
          >
            View training
          </Link>
        </div>

        <div className="mt-8 rounded-[1.6rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.72)] p-5 text-sm leading-7 text-dim">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00]">Product context</p>
          <p className="mt-3">
            These product entries are positioned as representative hive-product streams connected to the center&apos;s practical beekeeping and value-addition orientation, not as an e-commerce catalog.
          </p>
        </div>
      </div>
    </section>
  );
}

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-4">
      <p className="text-lg font-semibold text-bright">{value}</p>
      <p className="mt-1 text-sm text-dim">{label}</p>
    </div>
  );
}
