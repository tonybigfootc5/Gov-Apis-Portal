import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRequestLanguage } from "@/lib/request-language";
import { productItems } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Representative hive products connected to API CULTURE training and value-addition work.",
};

export default async function ProductsPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      eyebrow: "Hive products",
      title: "Products that connect beekeeping with value addition and rural opportunity.",
      body:
        "These products represent the major hive-product streams commonly linked to practical apiary work, collection discipline, processing awareness, and market-facing presentation.",
      snapshot: "Snapshot",
      streamCount: "Product streams",
      learningPath: "Learning path",
      approach: "Approach",
      learningPathValue: "Collection + processing",
      approachValue: "Field-linked",
      streamLabel: "Product stream",
      explore: "Explore technologies",
      training: "View training",
      items: {} as Record<string, { title: string; description: string; highlights: string[] }>,
    },
    te: {
      eyebrow: "హైవ్ ఉత్పత్తులు",
      title: "తేనెటీగల పెంపకాన్ని విలువ వృద్ధి మరియు గ్రామీణ అవకాశాలతో కలిపే ఉత్పత్తులు.",
      body:
        "ఈ ఉత్పత్తులు ప్రాక్టికల్ ఆపియరీ పని, సేకరణ క్రమశిక్షణ, ప్రాసెసింగ్ అవగాహన మరియు మార్కెట్‌కు సిద్ధమైన ప్రదర్శనతో సంబంధం ఉన్న ప్రధాన హైవ్-ఉత్పత్తి ప్రవాహాలను సూచిస్తాయి.",
      snapshot: "స్నాప్‌షాట్",
      streamCount: "ఉత్పత్తి ప్రవాహాలు",
      learningPath: "అభ్యాస మార్గం",
      approach: "విధానం",
      learningPathValue: "సేకరణ + ప్రాసెసింగ్",
      approachValue: "ఫీల్డ్-లింక్డ్",
      streamLabel: "ఉత్పత్తి విభాగం",
      explore: "టెక్నాలజీలను చూడండి",
      training: "శిక్షణ చూడండి",
      items: {
        Honey: {
          title: "తేనె",
          description: "తేనె అనేది అత్యంత పరిచితమైన హైవ్ ఉత్పత్తి. ఇది కాలనీ ఆరోగ్యం, పుష్ప వనరులు, పరిశుభ్రమైన కోత మరియు విలువ వృద్ధి ప్యాకింగ్‌తో నేరుగా సంబంధం కలిగి ఉంటుంది.",
          highlights: ["సరైన హైవ్ నిర్వహణ తర్వాత కోత", "వడపోత, పరిశుభ్రత, బాట్లింగ్‌తో సంబంధం", "జీవనోపాధి మరియు మార్కెట్ విలువ వృద్ధికి మద్దతు"],
        },
        "Royal Jelly": {
          title: "రాయల్ జెల్లీ",
          description: "రాయల్ జెల్లీ అనేది క్వీన్ సెల్ సిద్ధం, సేకరణ సమయం మరియు సున్నితమైన నిర్వహణపై ఆధారపడే అధిక విలువ కలిగిన ప్రత్యేక తేనెటీగ ఉత్పత్తి.",
          highlights: ["సిద్ధమైన క్వీన్ సెల్లుల నుంచి సేకరణ", "ఖచ్చితమైన సమయ నియంత్రణ అవసరం", "సున్నితమైన విలువ వృద్ధి ఉత్పత్తిగా నిర్వహణ"],
        },
        "Bee Pollen": {
          title: "బీ పొలెన్",
          description: "బీ పొలెన్‌ను పుప్పొడి ట్రాపింగ్ ద్వారా సేకరించి, తరువాత శుభ్రపరచడం, ఎండబెట్టే అవగాహన, నిల్వ మరియు ఉత్పత్తి ప్రదర్శనకు సిద్ధం చేస్తారు.",
          highlights: ["పొలెన్ ట్రాప్స్‌తో సేకరణ", "సేకరణ తర్వాత పరిశుభ్రమైన నిర్వహణ అవసరం", "విలువ వృద్ధి ఉత్పత్తిగా ప్యాక్ చేయవచ్చు"],
        },
        Beeswax: {
          title: "బీస్‌వాక్స్",
          description: "వాక్స్‌ను హైవ్ కార్యకలాపాల నుంచి సేకరించి శుభ్రపరచడం, ప్రాసెస్ చేయడం, అచ్చులు వేయడం లేదా ఫౌండేషన్-సంబంధిత పనుల్లో ఉపయోగించవచ్చు.",
          highlights: ["హైవ్ పదార్థాల నుంచి సేకరణ", "కరిగించడం మరియు శుభ్రపరచడం ద్వారా ప్రాసెసింగ్", "మళ్లీ వినియోగం మరియు ఉత్పత్తి వైవిధ్యానికి మద్దతు"],
        },
        Propolis: {
          title: "ప్రోపోలిస్",
          description: "ప్రోపోలిస్ అనేది నియంత్రిత సేకరణ పద్ధతులు మరియు ప్రాథమిక శుభ్రపరచడం ద్వారా పొందే రెసిన్ ఆధారిత హైవ్ ఉత్పత్తి.",
          highlights: ["ప్రత్యేక సేకరణ పద్ధతులు", "శుభ్రపరచడం మరియు జాగ్రత్తగా నిర్వహణ అవసరం", "హైవ్ ఉత్పత్తుల వైవిధ్యాన్ని విస్తరిస్తుంది"],
        },
        "Bee Venom": {
          title: "తేనెటీగ విషం",
          description: "తేనెటీగ విషం సేకరణ అనేది నియంత్రిత పద్ధతులు, పరికరాల అవగాహన మరియు క్రమబద్ధమైన భద్రతా ఆచరణలు అవసరమైన ప్రత్యేక విభాగం.",
          highlights: ["ప్రత్యేక సేకరణ విధానం", "భద్రతపై గట్టి దృష్టి", "అధునాతన ఉత్పత్తి వైవిధ్యానికి పరిచయం"],
        },
      },
    },
    hi: {
      eyebrow: "छत्ता उत्पाद",
      title: "ऐसे उत्पाद जो मधुमक्खी पालन को मूल्य-वर्धन और ग्रामीण अवसरों से जोड़ते हैं।",
      body:
        "ये उत्पाद व्यावहारिक एपियरी कार्य, संग्रह अनुशासन, प्रसंस्करण जागरूकता और बाज़ार-उन्मुख प्रस्तुति से जुड़े प्रमुख छत्ता-उत्पाद प्रवाहों का प्रतिनिधित्व करते हैं।",
      snapshot: "स्नैपशॉट",
      streamCount: "उत्पाद प्रवाह",
      learningPath: "अध्ययन मार्ग",
      approach: "दृष्टिकोण",
      learningPathValue: "संग्रह + प्रसंस्करण",
      approachValue: "फील्ड-लिंक्ड",
      streamLabel: "उत्पाद श्रेणी",
      explore: "तकनीकें देखें",
      training: "प्रशिक्षण देखें",
      items: {} as Record<string, { title: string; description: string; highlights: string[] }>,
    },
  }[language];

  const productOverrides = copy.items as Record<string, { title: string; description: string; highlights: string[] }>;
  const localizedItems = productItems.map((item) => ({
    ...item,
    title: productOverrides[item.title]?.title ?? item.title,
    description: productOverrides[item.title]?.description ?? item.description,
    highlights: productOverrides[item.title]?.highlights ?? item.highlights,
  }));
  const featuredProduct = localizedItems[0];
  const leftRailProducts = localizedItems.slice(1, 3);
  const rightRailProducts = localizedItems.slice(3, 6);

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.35rem] border border-[rgba(41,56,49,0.1)] bg-[#fffefa] shadow-[0_30px_90px_rgba(121,105,70,0.16)]">
          <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#dcefe8]" />
          <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(214,239,229,0.72),rgba(255,255,255,0))]" />
          <div className="relative grid gap-5 p-5 sm:p-8 lg:p-10">
            <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
              <nav aria-label="Product streams" className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#52695e]">
                {localizedItems.slice(0, 5).map((item) => (
                  <span key={item.title}>{item.title}</span>
                ))}
              </nav>

              <div className="flex items-center justify-start gap-3 lg:justify-end">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f2b544] text-sm font-black text-[#133226]">{localizedItems.length}</span>
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#133226]">{copy.streamCount}</span>
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[15.5rem_minmax(0,1fr)_15.5rem] lg:items-start xl:gap-8">
              <aside className="hidden gap-4 lg:order-1 lg:grid lg:grid-cols-1">
                {leftRailProducts.map((item) => (
                  <ProductShowcaseCard key={item.title} item={item} copy={copy} />
                ))}
              </aside>

              <main className="order-1 lg:order-2">
                <div className="mx-auto max-w-[42rem] text-center lg:mt-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#b36b00]">{copy.eyebrow}</p>
                  <h1 className="mx-auto mt-4 max-w-[38rem] text-balance font-display text-[clamp(2.55rem,4.9vw,4.65rem)] font-semibold leading-[0.88] text-[#008b67]">
                    {copy.title}
                  </h1>
                  <p className="mx-auto mt-5 max-w-[34rem] text-sm leading-7 text-[#65756c] sm:text-base">
                    {copy.body}
                  </p>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:hidden">
                  {localizedItems.map((item) => (
                    <ProductShowcaseCard key={item.title} item={item} copy={copy} compact />
                  ))}
                </div>

                <div className="mx-auto mt-8 hidden w-full max-w-[42rem] gap-4 lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                  <FeaturedProductCard item={featuredProduct} copy={copy} />
                  <div className="rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-white/86 p-4 shadow-[0_14px_34px_rgba(121,105,70,0.1)]">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b36b00]">{copy.snapshot}</p>
                    <div className="mt-4 grid gap-3">
                      <QuickStat value={`${productItems.length}`} label={copy.streamCount} />
                      <QuickStat value={copy.learningPathValue} label={copy.learningPath} />
                      <QuickStat value={copy.approachValue} label={copy.approach} />
                    </div>
                  </div>
                </div>
              </main>

              <aside className="hidden gap-4 lg:order-3 lg:grid lg:grid-cols-1">
                {rightRailProducts.map((item) => (
                  <ProductShowcaseCard key={item.title} item={item} copy={copy} />
                ))}
              </aside>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/technologies"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
          >
            {copy.explore}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.78)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#1f352b]"
          >
            {copy.training}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductShowcaseCard({
  item,
  copy,
  compact = false,
}: {
  item: (typeof productItems)[number];
  copy: { streamLabel: string };
  compact?: boolean;
}) {
  return (
    <article className={compact ? "group grid h-[21rem] grid-rows-[3fr_1fr] overflow-hidden rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_14px_34px_rgba(121,105,70,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(0,79,58,0.14)]" : "group grid h-[19rem] grid-rows-[3fr_1fr] overflow-hidden rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_14px_34px_rgba(121,105,70,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(0,79,58,0.14)]"}>
      <div className="relative min-h-0">
        <ProductCardMedia item={item} sizes="(min-width: 1024px) 17rem, (min-width: 640px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,31,0.02)_0%,rgba(20,38,31,0.08)_48%,rgba(7,30,22,0.88)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#f9d779]">{copy.streamLabel}</p>
          <h2 className={compact ? "mt-1 product-card-title-overlay max-w-full text-2xl font-black leading-none tracking-[-0.03em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]" : "mt-1 product-card-title-overlay max-w-full text-xl font-black leading-none tracking-[-0.03em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"}>{item.title}</h2>
        </div>
      </div>
      <div className={compact ? "min-h-0 overflow-hidden p-4" : "min-h-0 overflow-hidden p-3.5"}>
        <p className={compact ? "product-card-copy text-sm leading-6 text-[#65756c]" : "product-card-copy text-xs leading-5 text-[#65756c]"}>{item.description}</p>
      </div>
    </article>
  );
}

function FeaturedProductCard({ item, copy }: { item: (typeof productItems)[number]; copy: { streamLabel: string; training: string } }) {
  return (
    <article className="relative grid h-[28rem] grid-rows-[3fr_1fr] overflow-hidden rounded-[1.45rem] bg-[#008f68] text-white shadow-[0_24px_54px_rgba(0,79,58,0.24)]">
      <div className="relative min-h-0 bg-[#e6eee8]">
        <ProductCardMedia item={item} sizes="(min-width: 1024px) 24rem, 100vw" priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,143,104,0)_10%,rgba(0,76,54,0.2)_48%,rgba(0,45,32,0.92)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#00513d]">
          {copy.streamLabel}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f9d779]">{copy.streamLabel}</p>
          <h2 className="mt-2 product-card-title-overlay text-4xl font-black leading-none tracking-[-0.03em] drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]">{item.title}</h2>
        </div>
      </div>
      <div className="grid min-h-0 gap-3 overflow-hidden p-4">
        <div className="min-h-0 overflow-hidden">
          <p className="product-card-copy text-sm leading-6 text-white/78">{item.description}</p>
        </div>
        <Link href="/programs" className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-white px-5 text-xs font-black uppercase tracking-[0.16em] text-[#083527]">
          {copy.training}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function ProductCardMedia({
  item,
  sizes,
  priority = false,
}: {
  item: (typeof productItems)[number];
  sizes: string;
  priority?: boolean;
}) {
  if (item.imageSlides?.length) {
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

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-4">
      <p className="text-lg font-semibold text-bright">{value}</p>
      <p className="mt-1 text-sm text-dim">{label}</p>
    </div>
  );
}
