import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Factory, Leaf, PackageCheck, ShieldCheck, Sparkles, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Equipment",
  description: "Beekeeping equipment support and local manufacturing encouragement from API CULTURE Technology Center.",
};

const showcaseItems = [
  {
    title: "Bee hives",
    shortTitle: "Hives",
    category: "Colony housing",
    imageSrc: "/training-field-visuals/image1.jpeg",
    imageAlt: "Rows of bee hive boxes in an apiary field",
    detail: "Standard hive boxes and frames for colony inspection, seasonal expansion, and field demonstrations.",
    specs: ["Movable frames", "Field ready", "Training use"],
  },
  {
    title: "Hive tools",
    shortTitle: "Tools",
    category: "Daily handling",
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/6/64/Beekeeping_hive_tool.jpg",
    imageAlt: "A beekeeping hive tool used during hive inspection",
    detail: "Inspection tools that help farmers open boxes, lift frames, clear burr comb, and work with precision.",
    specs: ["Inspection", "Frame lifting", "Cleaner work"],
  },
  {
    title: "Honey extractors",
    shortTitle: "Extractors",
    category: "Harvest support",
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/7/74/Extractor_Beekeeping.jpg",
    imageAlt: "Honey extractor used for beekeeping harvest work",
    detail: "Processing equipment that supports cleaner honey removal and more organized value addition after harvest.",
    specs: ["Harvesting", "Processing", "Value addition"],
  },
  {
    title: "Protective veils",
    shortTitle: "Veils",
    category: "Field safety",
    imageSrc: "/training-field-visuals/image6.jpeg",
    imageAlt: "Beekeepers and farmers standing near hive boxes with protective veils",
    detail: "Safety equipment for trainees, apiarists, and farmers during hive opening and field practice.",
    specs: ["Trainee safety", "Hive opening", "Confidence"],
  },
] as const;

const equipmentTools = [
  {
    title: "Bee colonies",
    category: "Living stock",
    body: "Starter and working colonies for practical apiary establishment, demonstrations, and farmer support.",
    icon: Leaf,
  },
  {
    title: "Queens",
    category: "Colony strength",
    body: "Queen support for colony continuity, brood quality, and stronger apiary productivity.",
    icon: Sparkles,
  },
  {
    title: "Queen excluders",
    category: "Hive management",
    body: "Hive partitions that help organize brood and honey areas during seasonal colony work.",
    icon: ShieldCheck,
  },
  {
    title: "Feeders",
    category: "Nutrition support",
    body: "Feeding accessories for colony support during training, seasonal gaps, and weak colony recovery.",
    icon: PackageCheck,
  },
  {
    title: "Comb foundation sheets",
    category: "Comb building",
    body: "Foundation support for uniform comb construction, cleaner frames, and organized hive expansion.",
    icon: Boxes,
  },
  {
    title: "Extractors",
    category: "Honey harvest",
    body: "Honey extraction equipment for cleaner removal, handling, and value-added processing.",
    icon: Wrench,
  },
  {
    title: "Bee hives",
    category: "Colony housing",
    body: "Hive boxes and frames for inspection, colony expansion, and field-level apiary setup.",
    icon: Boxes,
  },
  {
    title: "Hive tools",
    category: "Inspection work",
    body: "Daily handling tools for opening boxes, lifting frames, removing comb, and safer inspection.",
    icon: Wrench,
  },
  {
    title: "Bee veils",
    category: "Protection",
    body: "Protective veils and safety wear so trainees and farmers can work with confidence.",
    icon: ShieldCheck,
  },
  {
    title: "Necessary field equipment",
    category: "Apiary readiness",
    body: "Supporting equipment required for demonstrations, field handling, transport, and maintenance.",
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
  const featured = showcaseItems[0];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.35rem] border border-[rgba(41,56,49,0.1)] bg-[#fffefa] shadow-[0_30px_90px_rgba(121,105,70,0.16)]">
          <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#dcefe8]" />
          <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(214,239,229,0.72),rgba(255,255,255,0))]" />
          <div className="relative grid min-h-[43rem] grid-rows-[auto_1fr] gap-5 p-5 sm:p-8 lg:p-10">
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

            <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)_17rem] lg:items-center">
              <aside className="order-3 grid gap-4 sm:grid-cols-2 lg:order-1 lg:grid-cols-1">
                {showcaseItems.slice(1, 3).map((item) => (
                  <EquipmentPreview key={item.title} item={item} />
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

                <div className="mx-auto mt-6 grid max-w-[58rem] grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {equipmentTools.map((item, index) => (
                    <CompactToolPill key={item.title} item={item} index={index} />
                  ))}
                </div>

                <div className="relative mx-auto mt-5 max-w-[34rem]">
                  <div className="absolute inset-x-8 bottom-0 h-24 rounded-[100%] bg-[#123f32]/15 blur-2xl" />
                  <article className="relative overflow-hidden rounded-[1.8rem] bg-[#008f68] text-white shadow-[0_34px_74px_rgba(0,79,58,0.3)]">
                    <div className="relative h-[16rem] bg-[#e6eee8] sm:h-[19rem]">
                      <Image
                        src={featured.imageSrc}
                        alt={featured.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 34rem, 100vw"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,143,104,0)_20%,rgba(0,76,54,0.92)_100%)]" />
                      <span className="absolute left-5 top-5 rounded-full bg-white/92 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#00513d]">
                        Featured
                      </span>
                    </div>
                    <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-end sm:p-7">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f9d779]">{featured.category}</p>
                        <h2 className="mt-3 text-3xl font-black leading-none tracking-[-0.03em] sm:text-4xl">{featured.title}</h2>
                        <p className="mt-4 max-w-[24rem] text-sm leading-7 text-white/78">{featured.detail}</p>
                      </div>
                      <Link href="/programs" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-black uppercase tracking-[0.16em] text-[#083527]">
                        Train
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </div>
              </main>

              <aside className="order-2 space-y-5 lg:order-3">
                <div className="rounded-[1.4rem] border border-[rgba(41,56,49,0.08)] bg-white/80 p-5 shadow-[0_18px_46px_rgba(121,105,70,0.1)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b36b00]">Full supply scope</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {equipmentTools.map((item) => (
                      <span key={item.title} className="rounded-full bg-[#f5efe4] px-3 py-2 text-[11px] font-bold text-[#52695e]">
                        {item.title}
                      </span>
                    ))}
                  </div>
                </div>
                <EquipmentPreview item={showcaseItems[3]} />
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
            {equipmentTools.map((item, index) => (
              <EquipmentToolCard key={item.title} item={item} index={index} />
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

function EquipmentPreview({ item }: { item: (typeof showcaseItems)[number] }) {
  return (
    <article className="group overflow-hidden rounded-[1.55rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_18px_46px_rgba(121,105,70,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(0,79,58,0.14)]">
      <div className="relative h-36">
        <Image src={item.imageSrc} alt={item.imageAlt} fill sizes="(min-width: 1024px) 17rem, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,31,0.02),rgba(20,38,31,0.36))]" />
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a36600]">{item.category}</p>
        <h3 className="mt-3 text-2xl font-black leading-none tracking-[-0.03em] text-[#133226]">{item.shortTitle}</h3>
        <p className="mt-3 text-sm leading-6 text-[#65756c]">{item.detail}</p>
      </div>
    </article>
  );
}

function EquipmentToolCard({ item, index }: { item: (typeof equipmentTools)[number]; index: number }) {
  const Icon = item.icon;

  return (
    <article className="group flex min-h-[16rem] flex-col rounded-[1.35rem] border border-[rgba(41,56,49,0.1)] bg-white/82 p-4 shadow-[0_16px_38px_rgba(121,105,70,0.09)] transition duration-300 hover:-translate-y-1 hover:border-[#f2b544]/50 hover:bg-[#fffdf8]">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#dcefe8] text-[#0f5d47] transition group-hover:bg-[#f2b544] group-hover:text-[#133226]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-[11px] font-black text-[#b36b00]">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#a36600]">{item.category}</p>
      <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.02em] text-[#133226]">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#65756c]">{item.body}</p>
    </article>
  );
}

function CompactToolPill({ item, index }: { item: (typeof equipmentTools)[number]; index: number }) {
  const Icon = item.icon;

  return (
    <div className="flex min-h-[4.5rem] items-center gap-3 rounded-[1rem] border border-[rgba(41,56,49,0.08)] bg-white/86 px-3 py-3 text-left shadow-[0_10px_26px_rgba(121,105,70,0.08)]">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcefe8] text-[#0f5d47]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-black text-[#b36b00]">{String(index + 1).padStart(2, "0")}</span>
        <span className="block text-[0.78rem] font-black leading-tight text-[#133226]">{item.title}</span>
      </span>
    </div>
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
