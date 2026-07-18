import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Beaker, Bug, Factory, FlaskConical, Sparkles } from "lucide-react";
import { technologyItems } from "@/lib/technologies";

export const metadata: Metadata = {
  title: "Technologies",
  description: "Beekeeping and bee-product technologies followed and taught at API CULTURE.",
};

const pillars = [
  {
    icon: Bug,
    title: "Apiary practice",
    body: "Hands-on work around colony care, queen management, hive behavior, and field-safe handling.",
  },
  {
    icon: Beaker,
    title: "Bee-product collection",
    body: "Collection methods for honey, royal jelly, pollen, propolis, wax, and specialized product streams.",
  },
  {
    icon: FlaskConical,
    title: "Processing and packing",
    body: "Value-addition workflows that focus on cleaner handling, storage awareness, and product presentation.",
  },
  {
    icon: Factory,
    title: "Equipment systems",
    body: "Hive components, tools, and equipment understanding that support real apiary operations.",
  },
] as const;

export default function TechnologiesPage() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="neo-shell rounded-[2.4rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#8ec5ff]">Technology stack</p>
              <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.92] text-bright sm:text-6xl lg:text-7xl">
                Technologies followed across beekeeping, hive products, and value addition.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-dim sm:text-lg">
                This page organizes the practical technologies followed at API CULTURE, from foundational beekeeping and queen rearing to honey processing, wax work, pollen, propolis, venom, and equipment manufacturing awareness.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Chip>11 technologies</Chip>
                <Chip>Field + processing exposure</Chip>
                <Chip>Bee-product value addition</Chip>
              </div>
            </div>

            <div className="section-frame rounded-[1.7rem] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">Snapshot</p>
              <div className="mt-5 grid gap-4">
                <QuickStat value="11" label="Technologies listed" />
                <QuickStat value="4" label="Learning pillars" />
                <QuickStat value="Field-ready" label="Approach" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div key={title} className="section-frame rounded-[1.8rem] p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2b544]/12 text-[#f2b544]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-5 text-3xl text-bright">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-dim">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#f4ecde_100%)] p-4 shadow-[0_22px_60px_rgba(171,141,92,0.14)]">
          <div className="relative min-h-[20rem] overflow-hidden rounded-[1.5rem]">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Beekeeper_with_moveable_comb_hive.jpg"
              alt="Beekeeper holding a hive frame"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,20,0.04)_20%,rgba(10,13,20,0.74)_100%)]" />
            <div className="absolute inset-x-5 bottom-5 rounded-[1.4rem] border border-[rgba(255,255,255,0.24)] bg-[rgba(17,28,24,0.56)] p-5 backdrop-blur-md">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">Practical scope</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#fff9ef]">
                The technologies below span colony work, bee-product collection, processing, packing, and equipment understanding so learners see how field practice and value addition connect end to end.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {technologyItems.map((item, index) => (
            <article
              key={item.slug}
              className="grid gap-0 overflow-hidden rounded-[1.8rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e7_100%)] shadow-[0_18px_50px_rgba(171,141,92,0.12)] lg:grid-cols-[21rem_minmax(0,1fr)]"
            >
              <div className="relative min-h-[16rem] border-b border-[rgba(41,56,49,0.08)] bg-[#f3ecdf] lg:min-h-full lg:border-r lg:border-b-0">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 21rem, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,27,22,0.02)_10%,rgba(17,27,22,0.58)_100%)]" />
                <p className="absolute left-4 top-4 rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(17,28,24,0.52)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#fff9ef] backdrop-blur-sm">
                  {item.category}
                </p>
              </div>

              <div className="p-5 sm:p-6 lg:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[#8ec5ff]/22 bg-[#8ec5ff]/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#547ba1]">
                    Technology {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-dim">API CULTURE practice area</span>
                </div>

                <h2 className="font-display mt-4 text-4xl leading-tight text-bright">{item.title}</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-dim">{item.description}</p>

                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  <InfoBlock title="Practical focus" items={item.practicalFocus} />
                  <InfoBlock title="Learning outcomes" items={item.outcomes} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
          >
            View programs
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.78)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#1f352b]"
          >
            About the center
          </Link>
        </div>

      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] px-4 py-2 text-sm font-semibold text-[#1f352b]">
      {children}
    </span>
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

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.76)] p-5">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">{title}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="inline-flex gap-3 text-sm leading-7 text-dim">
            <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#f2b544]" aria-hidden="true" />
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
