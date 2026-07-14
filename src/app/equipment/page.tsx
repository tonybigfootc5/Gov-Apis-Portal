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
    imageSrc: "/equipment/bee-colonies.jpg",
    imageAlt: "Bee colonies arranged for practical apiary setup",
    imageSlides: [
      {
        src: "/equipment/bee-colonies.jpg",
        alt: "Bee colonies arranged for practical apiary setup",
      },
      {
        src: "/equipment/bee-colonies-1.jpg",
        alt: "Close view of bee colonies and hive boxes",
      },
    ],
    icon: Leaf,
  },
  {
    title: "Queens",
    category: "Colony strength",
    body: "Queen support for colony continuity, brood quality, and productivity.",
    imageSrc: "/equipment/queens.jpg",
    imageAlt: "Queen bee support for colony strength",
    imageSlides: [
      {
        src: "/equipment/queens.jpg",
        alt: "Queen bee support for colony strength",
      },
      {
        src: "/equipment/queens-1.jpg",
        alt: "Close view of queen bee handling work",
      },
    ],
    icon: Sparkles,
  },
  {
    title: "Queen excluders",
    category: "Hive management",
    body: "Partitions that help organize brood and honey areas in the hive.",
    imageSrc: "/equipment/queen-excluders.jpg",
    imageAlt: "Queen excluder equipment for hive management",
    imageSlides: [
      {
        src: "/equipment/queen-excluders.jpg",
        alt: "Queen excluder equipment for hive management",
      },
      {
        src: "/equipment/queen-excluders-1.jpg",
        alt: "Close view of queen excluder hive partition",
      },
    ],
    icon: ShieldCheck,
  },
  {
    title: "Feeders",
    category: "Nutrition support",
    body: "Feeding accessories for seasonal gaps and weak colony recovery.",
    imageSrc: "/equipment/feeders.jpg",
    imageAlt: "Bee feeders for colony nutrition support",
    imageSlides: [
      {
        src: "/equipment/feeders.jpg",
        alt: "Bee feeders for colony nutrition support",
      },
      {
        src: "/equipment/feeders-1.jpg",
        alt: "Close view of feeder equipment for weak colony recovery",
      },
    ],
    icon: PackageCheck,
  },
  {
    title: "Comb foundation sheets",
    category: "Comb building",
    body: "Foundation support for uniform comb building and cleaner frames.",
    imageSrc: "/equipment/comb-foundation-sheets.jpeg",
    imageAlt: "Comb foundation sheets for uniform comb building",
    imageSlides: [
      {
        src: "/equipment/comb-foundation-sheets.jpeg",
        alt: "Comb foundation sheets for uniform comb building",
      },
      {
        src: "/equipment/comb-foundation-sheets-1.jpg",
        alt: "Close view of comb foundation sheet material",
      },
    ],
    icon: Boxes,
  },
  {
    title: "Extractors",
    category: "Honey harvest",
    body: "Extraction equipment for cleaner honey removal and processing.",
    imageSrc: "/equipment/extractors.jpg",
    imageAlt: "Honey extractor equipment for harvest processing",
    imageSlides: [
      {
        src: "/equipment/extractors.jpg",
        alt: "Honey extractor equipment for harvest processing",
      },
      {
        src: "/equipment/extractors-1.jpg",
        alt: "Close view of extractor equipment used during honey harvest",
      },
    ],
    icon: Wrench,
  },
  {
    title: "Bee hives",
    category: "Colony housing",
    body: "Hive boxes and frames for inspection, expansion, and field setup.",
    imageSrc: "/equipment/bee-hives.avif",
    imageAlt: "Bee hive boxes for colony housing",
    imageSlides: [
      {
        src: "/equipment/bee-hives.avif",
        alt: "Bee hive boxes for colony housing",
      },
      {
        src: "/equipment/bee-hives-1.jpg",
        alt: "Close view of bee hive equipment for field setup",
      },
    ],
    icon: Boxes,
  },
  {
    title: "Hive tools",
    category: "Inspection work",
    body: "Daily tools for opening boxes, lifting frames, and safer inspection.",
    imageSrc: "/equipment/hive-tools.webp",
    imageAlt: "Hive tools used for daily inspection work",
    icon: Wrench,
  },
  {
    title: "Bee veils",
    category: "Protection",
    body: "Protective veils so trainees and farmers can work with confidence.",
    imageSrc: "/equipment/bee-veils.jpg",
    imageAlt: "Bee veils used for protection during hive work",
    icon: ShieldCheck,
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
  const leftRailItems = equipmentTools.slice(0, 3);
  const middleRailItems = equipmentTools.slice(3, 5);
  const rightRailItems = [equipmentTools[5], ...equipmentTools.slice(7)];

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
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f2b544] text-sm font-black text-[#133226]">9</span>
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
    <article className={compact ? "group grid h-[18rem] grid-rows-[3fr_1fr] overflow-hidden rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_14px_34px_rgba(121,105,70,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(0,79,58,0.14)]" : "group grid h-[19rem] grid-rows-[3fr_1fr] overflow-hidden rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_14px_34px_rgba(121,105,70,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(0,79,58,0.14)]"}>
      <div className="relative min-h-0">
        <EquipmentCardMedia item={item} sizes="(min-width: 1024px) 17rem, (min-width: 640px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,31,0.02)_0%,rgba(20,38,31,0.08)_48%,rgba(7,30,22,0.88)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#f9d779]">{item.category}</p>
          <h3 className={compact ? "mt-1 product-card-title-overlay max-w-full text-xl font-black leading-none tracking-[-0.03em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]" : "mt-1 product-card-title-overlay max-w-full text-xl font-black leading-none tracking-[-0.03em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"}>{item.title}</h3>
        </div>
      </div>
      <div className={compact ? "min-h-0 overflow-hidden p-3" : "min-h-0 overflow-hidden p-3.5"}>
        <p className={compact ? "product-card-copy text-xs leading-[1.35rem] text-[#65756c]" : "product-card-copy text-xs leading-5 text-[#65756c]"}>{item.body}</p>
      </div>
    </article>
  );
}

function FeatureEquipmentCard({ item }: { item: (typeof equipmentTools)[number] }) {
  return (
    <article className="relative grid h-[25rem] grid-rows-[3fr_1fr] overflow-hidden rounded-[1.45rem] bg-[#008f68] text-white shadow-[0_24px_54px_rgba(0,79,58,0.24)]">
      <div className="relative min-h-0 bg-[#e6eee8]">
        <EquipmentCardMedia item={item} sizes="(min-width: 1024px) 24rem, 100vw" priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,143,104,0)_10%,rgba(0,76,54,0.2)_48%,rgba(0,45,32,0.92)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#00513d]">
          Featured
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f9d779]">{item.category}</p>
          <h2 className="mt-2 product-card-title-overlay text-4xl font-black leading-none tracking-[-0.03em] drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]">{item.title}</h2>
        </div>
      </div>
      <div className="grid min-h-0 gap-3 overflow-hidden p-4">
        <div className="min-h-0 overflow-hidden">
          <p className="product-card-copy text-sm leading-6 text-white/78">{item.body}</p>
        </div>
        <Link href="/programs" className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-black uppercase tracking-[0.16em] text-[#083527]">
          Train
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function EquipmentCardMedia({
  item,
  sizes,
  priority = false,
}: {
  item: (typeof equipmentTools)[number];
  sizes: string;
  priority?: boolean;
}) {
  if ("imageSlides" in item && item.imageSlides?.length) {
    return (
      <>
        {item.imageSlides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={index === 0 ? slide.alt : ""}
            fill
            sizes={sizes}
            priority={priority && index === 0}
            aria-hidden={index > 0}
            className="product-image-slide object-cover transition duration-500 group-hover:scale-105"
            style={{ animationDelay: `${index * -4.5}s` }}
          />
        ))}
      </>
    );
  }

  return <Image src={item.imageSrc} alt={item.imageAlt} fill sizes={sizes} priority={priority} className="object-cover transition duration-500 group-hover:scale-105" />;
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
