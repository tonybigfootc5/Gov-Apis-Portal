import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Factory, Leaf, PackageCheck, ShieldCheck, Sparkles, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Equipment",
  description: "Beekeeping equipment support and local manufacturing encouragement from API CULTURE Technology Center.",
};

const equipmentTools = [
  {
    title: "Bee colonies",
    category: "Living stock",
    body: "Starter and working colonies for practical apiary setup and demonstrations.",
    imageSrc: "/training-field-visuals/image1.jpeg",
    imageAlt: "Rows of bee colonies in hive boxes across a field apiary",
    icon: Leaf,
  },
  {
    title: "Queens",
    category: "Colony strength",
    body: "Queen support for colony continuity, brood quality, and productivity.",
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Beekeeper_with_moveable_comb_hive.jpg",
    imageAlt: "Beekeeper holding a movable comb hive frame",
    icon: Sparkles,
  },
  {
    title: "Queen excluders",
    category: "Hive management",
    body: "Partitions that help organize brood and honey areas in the hive.",
    imageSrc: "/scientific-foundation-bg.jpg",
    imageAlt: "Comb and hive foundation visual used for equipment support",
    icon: ShieldCheck,
  },
  {
    title: "Feeders",
    category: "Nutrition support",
    body: "Feeding accessories for seasonal gaps and weak colony recovery.",
    imageSrc: "/training-field-visuals/image2.jpeg",
    imageAlt: "Apiary field visual representing feeding support equipment",
    icon: PackageCheck,
  },
  {
    title: "Comb foundation sheets",
    category: "Comb building",
    body: "Foundation support for uniform comb building and cleaner frames.",
    imageSrc: "/queen-rearing-bg.jpg",
    imageAlt: "Honeycomb and beekeeping visual representing comb foundation sheets",
    icon: Boxes,
  },
  {
    title: "Extractors",
    category: "Honey harvest",
    body: "Extraction equipment for cleaner honey removal and processing.",
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/7/74/Extractor_Beekeeping.jpg",
    imageAlt: "Honey extractor used for beekeeping harvest work",
    icon: Wrench,
  },
  {
    title: "Bee hives",
    category: "Colony housing",
    body: "Hive boxes and frames for inspection, expansion, and field setup.",
    imageSrc: "/training-field-visuals/image10.jpeg",
    imageAlt: "Bee hive boxes in a practical field training setting",
    icon: Boxes,
  },
  {
    title: "Hive tools",
    category: "Inspection work",
    body: "Daily tools for opening boxes, lifting frames, and safer inspection.",
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/6/64/Beekeeping_hive_tool.jpg",
    imageAlt: "A beekeeping hive tool used during hive inspection",
    icon: Wrench,
  },
  {
    title: "Bee veils",
    category: "Protection",
    body: "Protective veils so trainees and farmers can work with confidence.",
    imageSrc: "/training-field-visuals/image6.jpeg",
    imageAlt: "Farmers and beekeepers wearing protective veils near hive boxes",
    icon: ShieldCheck,
  },
  {
    title: "Necessary field equipment",
    category: "Apiary readiness",
    body: "Support gear for demonstrations, handling, transport, and maintenance.",
    imageSrc: "/field-beekeeping.jpg",
    imageAlt: "Field beekeeping visual representing necessary apiary equipment",
    icon: Factory,
  },
] as const;

const supportCards = [
  {
    icon: Factory,
    title: "Local manufacturing",
    body: "Encouraging nearby units so practical beekeeping equipment can reach farmers faster.",
  },
  {
    icon: PackageCheck,
    title: "Supply support",
    body: "Connecting apiarists with colony, hive, harvesting, safety, and management equipment.",
  },
  {
    icon: Wrench,
    title: "Training readiness",
    body: "Helping trainees understand the purpose, handling, and maintenance of each tool.",
  },
] as const;

export default function EquipmentPage() {
  const featured = equipmentTools[6];
  const leftRailItems = equipmentTools.slice(0, 4);
  const middleRailItems = equipmentTools.slice(4, 6);
  const rightRailItems = equipmentTools.slice(6, 10);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.35rem] border border-[rgba(41,56,49,0.1)] bg-[#fffefa] shadow-[0_30px_90px_rgba(121,105,70,0.16)]">
          <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#dcefe8]" />
          <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(214,239,229,0.72),rgba(255,255,255,0))]" />
          <div className="relative grid grid-rows-[auto_1fr] gap-5 p-5 sm:p-8 lg:p-10">
            <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
              <nav aria-label="Equipment categories" className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#52695e]">
                <span>Colonies</span>
                <span>Hives</span>
                <span>Tools</span>
                <span>Safety</span>
                <span>Processing</span>
              </nav>

              <div className="flex items-center justify-start gap-3 lg:justify-end">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f2b544] text-sm font-black text-[#133226]">10</span>
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#133226]">Visible support tools</span>
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[15.5rem_minmax(0,1fr)_15.5rem] lg:items-start xl:gap-8">
              <aside className="hidden gap-3 lg:order-1 lg:grid lg:grid-cols-1">
                {leftRailItems.map((item) => (
                  <ProductOrbitCard key={item.title} item={item} />
                ))}
              </aside>

              <main className="order-1 lg:order-2">
                <div className="mx-auto max-w-[39rem] text-center lg:mt-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#b36b00]">API CULTURE equipment desk</p>
                  <h1 className="mx-auto mt-4 max-w-[32rem] text-balance font-display text-[clamp(2.55rem,4.9vw,4.65rem)] font-semibold leading-[0.88] text-[#008b67]">
                    Beekeeping equipment for field-ready apiaries.
                  </h1>
                  <p className="mx-auto mt-5 max-w-[32rem] text-sm leading-7 text-[#65756c] sm:text-base">
                    Supply support and local manufacturing encouragement for the tools farmers need to manage colonies, harvest honey, and work safely.
                  </p>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:hidden">
                  {equipmentTools.map((item) => (
                    <ProductOrbitCard key={item.title} item={item} compact />
                  ))}
                </div>

                <div className="mx-auto mt-8 hidden w-full max-w-[42rem] gap-4 lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                  <FeatureEquipmentCard item={featured} />
                  <div className="grid gap-4">
                    {middleRailItems.map((item) => (
                      <ProductOrbitCard key={item.title} item={item} compact />
                    ))}
                  </div>
                </div>
              </main>

              <aside className="hidden gap-3 lg:order-3 lg:grid lg:grid-cols-1">
                {rightRailItems.map((item) => (
                  <ProductOrbitCard key={item.title} item={item} />
                ))}
              </aside>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {supportCards.map((card) => (
            <SupportCard key={card.title} {...card} />
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(180deg,#fffefa_0%,#f7f1e7_100%)] p-5 shadow-[0_24px_70px_rgba(121,105,70,0.12)] sm:p-7 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b36b00]">All supportive equipment</p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-[#133226] sm:text-5xl">Every tool visible, with its field purpose.</h2>
            </div>
            <p className="max-w-[30rem] text-sm leading-7 text-[#65756c]">
              These are the equipment categories from the earlier content, expanded so visitors can scan the full support list without hunting through small tags.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {equipmentTools.map((item) => (
              <EquipmentToolCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          <section className="rounded-[1.8rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(135deg,#113f32,#0f5d47)] p-6 text-[#fff9ef] shadow-[0_24px_70px_rgba(22,57,46,0.18)] sm:p-8">
            <Sparkles className="h-8 w-8 text-[#f2b544]" aria-hidden="true" />
            <h2 className="mt-5 font-display text-4xl leading-tight">From equipment supply to farmer confidence.</h2>
            <p className="mt-5 text-sm leading-7 text-white/76">
              The Technology Center supports the development of the beekeeping industry by helping farmers access essential equipment and by encouraging local manufacturing units that can serve apiarists closer to their fields.
            </p>
          </section>

          <section className="rounded-[1.8rem] border border-[rgba(41,56,49,0.1)] bg-white/78 p-5 shadow-[0_20px_60px_rgba(121,105,70,0.11)] sm:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b36b00]">Equipment workflow</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Identify colony need", "Select proper tool", "Practice in field"].map((step, index) => (
                <div key={step} className="rounded-[1.2rem] border border-[rgba(41,56,49,0.09)] bg-[#fffaf1] p-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#dcefe8] text-sm font-black text-[#0f5d47]">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-sm font-black uppercase tracking-[0.12em] text-[#133226]">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-[#65756c]">
              This page uses representative imagery from API CULTURE field visuals and Wikimedia Commons to describe equipment support.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

function ProductOrbitCard({ item, compact = false }: { item: (typeof equipmentTools)[number]; compact?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_14px_34px_rgba(121,105,70,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(0,79,58,0.14)]">
      <div className={compact ? "relative h-20" : "relative h-24"}>
        <Image src={item.imageSrc} alt={item.imageAlt} fill sizes="(min-width: 1024px) 17rem, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,31,0.02),rgba(20,38,31,0.36))]" />
      </div>
      <div className={compact ? "p-3" : "p-3.5"}>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#a36600]">{item.category}</p>
        <h3 className={compact ? "mt-1.5 text-base font-black leading-tight tracking-[-0.03em] text-[#133226]" : "mt-1.5 text-lg font-black leading-tight tracking-[-0.03em] text-[#133226]"}>{item.title}</h3>
        <p className={compact ? "mt-1.5 text-xs leading-[1.35rem] text-[#65756c]" : "mt-1.5 text-xs leading-5 text-[#65756c]"}>{item.body}</p>
      </div>
    </article>
  );
}

function FeatureEquipmentCard({ item }: { item: (typeof equipmentTools)[number] }) {
  return (
    <article className="relative overflow-hidden rounded-[1.45rem] bg-[#008f68] text-white shadow-[0_24px_54px_rgba(0,79,58,0.24)]">
      <div className="relative h-32 bg-[#e6eee8]">
        <Image src={item.imageSrc} alt={item.imageAlt} fill sizes="(min-width: 1024px) 24rem, 100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,143,104,0)_12%,rgba(0,76,54,0.82)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#00513d]">
          Featured
        </span>
      </div>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f9d779]">{item.category}</p>
          <h2 className="mt-2 text-3xl font-black leading-none tracking-[-0.03em]">{item.title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/78">{item.body}</p>
        </div>
        <Link href="/programs" className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-black uppercase tracking-[0.16em] text-[#083527]">
          Train
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function EquipmentToolCard({ item }: { item: (typeof equipmentTools)[number] }) {
  const Icon = item.icon;

  return (
    <article className="group flex min-h-[16rem] flex-col rounded-[1.35rem] border border-[rgba(41,56,49,0.1)] bg-white/82 p-4 shadow-[0_16px_38px_rgba(121,105,70,0.09)] transition duration-300 hover:-translate-y-1 hover:border-[#f2b544]/50 hover:bg-[#fffdf8]">
      <div className="relative -mx-4 -mt-4 mb-4 h-32 overflow-hidden rounded-t-[1.35rem]">
        <Image src={item.imageSrc} alt={item.imageAlt} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,31,0.02),rgba(20,38,31,0.38))]" />
      </div>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#dcefe8] text-[#0f5d47] transition group-hover:bg-[#f2b544] group-hover:text-[#133226]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#a36600]">{item.category}</p>
      <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.02em] text-[#133226]">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#65756c]">{item.body}</p>
    </article>
  );
}

function SupportCard({ icon: Icon, title, body }: { icon: typeof Factory; title: string; body: string }) {
  return (
    <article className="rounded-[1.5rem] border border-[rgba(41,56,49,0.1)] bg-white/74 p-5 shadow-[0_18px_48px_rgba(121,105,70,0.1)]">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#dcefe8] text-[#0f5d47]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-black tracking-[-0.02em] text-[#133226]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#65756c]">{body}</p>
      <div className="mt-5 flex items-center gap-2 text-[#f2b544]">
        <Leaf className="h-4 w-4" aria-hidden="true" />
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        <Boxes className="h-4 w-4" aria-hidden="true" />
      </div>
    </article>
  );
}
