import Image from "next/image";
import type { Metadata } from "next";
import { Boxes, Factory, Leaf, PackageCheck, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SiteLanguage } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

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
    body: "Partitions for brood and honey areas in the hive.",
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

type LocalizedEquipmentTool = {
  title: string;
  category: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  imageSlides?: readonly { src: string; alt: string }[];
  icon: LucideIcon;
};
type EquipmentTextOverride = Partial<Pick<LocalizedEquipmentTool, "title" | "category" | "body">>;

const supportCards = [
  {
    icon: Factory,
    title: "Local manufacturing",
    body: "Encouraging nearby units so practical beekeeping equipment can reach farmers faster.",
    imageSrc: "/equipment/local-manufacturing.jpeg",
    imageAlt: "Locally manufactured wooden beekeeping hive box",
    badgeSrc: "/equipment/made-in-india.png",
    badgeAlt: "Make in India",
  },
  {
    icon: PackageCheck,
    title: "Supply support",
    body: "Connecting apiarists with colony, hive, harvesting, safety, and management equipment.",
  },
  {
    icon: Wrench,
    title: "Training readiness",
    body: "Tool handling, maintenance, and field use.",
  },
] as const;

const equipmentPageCopy = {
  en: {
    titleLines: ["Beekeeping equipment", "for field-ready", "apiaries."],
    bodyLines: [
      "Supply support and local manufacturing encouragement",
      "for the tools farmers need to manage colonies,",
      "harvest honey, and work safely.",
    ],
    deskPrefix: "API CULTURE",
    deskTitle: "Equipment Desk",
    ctaTitle: "From equipment supply to farmer confidence.",
    ctaBody:
      "The Technology Center supports the development of the beekeeping industry through equipment access and local manufacturing units that serve apiarists closer to their fields.",
    items: {} as Record<string, Partial<(typeof equipmentTools)[number]>>,
    support: {} as Record<string, { title: string; body: string }>,
  },
  te: {
    titleLines: ["తేనెటీగల పెంపక", "పరికరాలు", "ఫీల్డ్ అపియరీల కోసం."],
    bodyLines: [
      "రైతులు కాలనీలను నిర్వహించడానికి,",
      "తేనె కోతకు మరియు సురక్షితంగా పనిచేయడానికి",
      "అవసరమైన పరికరాలకు సరఫరా సహాయం.",
    ],
    deskPrefix: "API CULTURE",
    deskTitle: "పరికరాల విభాగం",
    ctaTitle: "పరికరాల సరఫరా నుంచి రైతుల విశ్వాసం వరకు.",
    ctaBody:
      "టెక్నాలజీ సెంటర్ పరికరాల లభ్యత మరియు స్థానిక తయారీ యూనిట్ల ప్రోత్సాహం ద్వారా తేనెటీగల పెంపక రంగ అభివృద్ధికి మద్దతు ఇస్తుంది.",
    items: {
      "Bee colonies": {
        title: "తేనెటీగల కాలనీలు",
        category: "జీవ కాలనీ",
        body: "ప్రాయోగిక అపియరీ ఏర్పాటు మరియు డెమోలకు ప్రారంభ మరియు పని కాలనీలు.",
      },
      Queens: {
        title: "క్వీన్స్",
        category: "కాలనీ బలం",
        body: "కాలనీ కొనసాగింపు, బ్రూడ్ నాణ్యత మరియు ఉత్పాదకతకు క్వీన్ సహాయం.",
      },
      "Queen excluders": {
        title: "క్వీన్ ఎక్స్‌క్లూడర్లు",
        category: "హైవ్ నిర్వహణ",
        body: "హైవ్‌లో బ్రూడ్ మరియు తేనె ప్రాంతాలను విడదీయడానికి భాగాలు.",
      },
      Feeders: {
        title: "ఫీడర్లు",
        category: "పోషణ సహాయం",
        body: "సీజనల్ లోటు మరియు బలహీన కాలనీ రికవరీ కోసం ఫీడింగ్ పరికరాలు.",
      },
      "Comb foundation sheets": {
        title: "కాంబ్ ఫౌండేషన్ షీట్లు",
        category: "కాంబ్ నిర్మాణం",
        body: "సమానమైన కాంబ్ నిర్మాణం మరియు శుభ్రమైన ఫ్రేమ్స్‌కు సహాయం.",
      },
      Extractors: {
        title: "ఎక్స్‌ట్రాక్టర్లు",
        category: "తేనె కోత",
        body: "శుభ్రమైన తేనె తొలగింపు మరియు ప్రాసెసింగ్ కోసం ఎక్స్‌ట్రాక్షన్ పరికరాలు.",
      },
      "Bee hives": {
        title: "తేనెటీగల పెట్టెలు",
        category: "కాలనీ నివాసం",
        body: "పరిశీలన, విస్తరణ మరియు ఫీల్డ్ ఏర్పాటు కోసం హైవ్ బాక్స్‌లు మరియు ఫ్రేమ్స్.",
      },
      "Hive tools": {
        title: "హైవ్ టూల్స్",
        category: "పరిశీలన పని",
        body: "బాక్స్‌లు తెరవడం, ఫ్రేమ్స్ ఎత్తడం మరియు సురక్షిత పరిశీలనకు రోజువారీ టూల్స్.",
      },
      "Bee veils": {
        title: "బీ వేయిల్స్",
        category: "రక్షణ",
        body: "శిక్షణార్థులు మరియు రైతులు నమ్మకంగా పనిచేయడానికి రక్షణ వేయిల్స్.",
      },
    },
    support: {
      "Local manufacturing": {
        title: "స్థానిక తయారీ",
        body: "ప్రాయోగిక తేనెటీగల పెంపక పరికరాలు రైతులకు వేగంగా చేరేలా సమీప యూనిట్లను ప్రోత్సహించడం.",
      },
      "Supply support": {
        title: "సరఫరా సహాయం",
        body: "కాలనీ, హైవ్, కోత, భద్రత మరియు నిర్వహణ పరికరాలతో అపియరిస్టులను కలపడం.",
      },
      "Training readiness": {
        title: "శిక్షణ సిద్ధత",
        body: "పరికరాల వినియోగం, నిర్వహణ మరియు ఫీల్డ్ వాడకం.",
      },
    },
  },
  hi: {
    titleLines: ["मधुमक्खी पालन", "उपकरण", "फील्ड एपियरी के लिए."],
    bodyLines: [
      "कॉलोनी प्रबंधन, शहद कटाई और",
      "सुरक्षित काम के लिए किसानों को",
      "जरूरी उपकरणों की आपूर्ति सहायता.",
    ],
    deskPrefix: "API CULTURE",
    deskTitle: "उपकरण डेस्क",
    ctaTitle: "उपकरण आपूर्ति से किसान भरोसे तक.",
    ctaBody:
      "टेक्नोलॉजी सेंटर उपकरण उपलब्धता और स्थानीय निर्माण इकाइयों को प्रोत्साहित करके मधुमक्खी पालन उद्योग के विकास में मदद करता है.",
    items: {
      "Bee colonies": {
        title: "मधुमक्खी कॉलोनियां",
        category: "जीवित कॉलोनी",
        body: "प्रायोगिक एपियरी सेटअप और डेमो के लिए स्टार्टर और वर्किंग कॉलोनियां.",
      },
      Queens: {
        title: "रानियां",
        category: "कॉलोनी शक्ति",
        body: "कॉलोनी निरंतरता, ब्रूड गुणवत्ता और उत्पादकता के लिए क्वीन सपोर्ट.",
      },
      "Queen excluders": {
        title: "क्वीन एक्सक्लूडर",
        category: "हाइव प्रबंधन",
        body: "हाइव में ब्रूड और शहद क्षेत्रों को अलग रखने के लिए पार्टिशन.",
      },
      Feeders: {
        title: "फीडर",
        category: "पोषण सहायता",
        body: "मौसमी कमी और कमजोर कॉलोनी रिकवरी के लिए फीडिंग उपकरण.",
      },
      "Comb foundation sheets": {
        title: "कॉम्ब फाउंडेशन शीट",
        category: "कॉम्ब निर्माण",
        body: "समान कॉम्ब निर्माण और साफ फ्रेम के लिए फाउंडेशन सपोर्ट.",
      },
      Extractors: {
        title: "एक्सट्रैक्टर",
        category: "शहद कटाई",
        body: "साफ शहद निकासी और प्रोसेसिंग के लिए एक्सट्रैक्शन उपकरण.",
      },
      "Bee hives": {
        title: "बी हाइव्स",
        category: "कॉलोनी आवास",
        body: "निरीक्षण, विस्तार और फील्ड सेटअप के लिए हाइव बॉक्स और फ्रेम.",
      },
      "Hive tools": {
        title: "हाइव टूल्स",
        category: "निरीक्षण कार्य",
        body: "बॉक्स खोलने, फ्रेम उठाने और सुरक्षित निरीक्षण के लिए दैनिक टूल्स.",
      },
      "Bee veils": {
        title: "बी वेल्स",
        category: "सुरक्षा",
        body: "प्रशिक्षुओं और किसानों को आत्मविश्वास से काम करने के लिए सुरक्षात्मक वेल्स.",
      },
    },
    support: {
      "Local manufacturing": {
        title: "स्थानीय निर्माण",
        body: "व्यावहारिक मधुमक्खी पालन उपकरण किसानों तक जल्दी पहुंचें, इसके लिए पास की इकाइयों को प्रोत्साहन.",
      },
      "Supply support": {
        title: "आपूर्ति सहायता",
        body: "कॉलोनी, हाइव, कटाई, सुरक्षा और प्रबंधन उपकरणों से एपियारिस्ट को जोड़ना.",
      },
      "Training readiness": {
        title: "प्रशिक्षण तैयारी",
        body: "उपकरण उपयोग, रखरखाव और फील्ड उपयोग.",
      },
    },
  },
} as const satisfies Record<SiteLanguage, {
  titleLines: readonly string[];
  bodyLines: readonly string[];
  deskPrefix: string;
  deskTitle: string;
  ctaTitle: string;
  ctaBody: string;
  items: Record<string, EquipmentTextOverride>;
  support: Record<string, { title: string; body: string }>;
}>;

export default async function EquipmentPage() {
  const language = await getRequestLanguage();
  const copy = equipmentPageCopy[language] ?? equipmentPageCopy.en;
  const localizedTools: LocalizedEquipmentTool[] = equipmentTools.map((item) => ({ ...item, ...copy.items[item.title] }));
  const localizedSupportCards = supportCards.map((card) => ({ ...card, ...copy.support[card.title] }));
  const featured = localizedTools[6];
  const leftRailItems = localizedTools.slice(0, 3);
  const middleRailItems = localizedTools.slice(3, 5);
  const rightRailItems = [localizedTools[5], ...localizedTools.slice(7)];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.35rem] border border-[rgba(41,56,49,0.1)] bg-[#fffefa] shadow-[0_30px_90px_rgba(121,105,70,0.16)]">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#dcefe8]" />
          <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(214,239,229,0.72),rgba(255,255,255,0))]" />
          <div className="relative grid gap-5 p-5 sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[15.5rem_minmax(0,1fr)_15.5rem] lg:items-start xl:gap-8">
              <aside className="hidden gap-3 lg:order-1 lg:grid lg:grid-cols-1">
                {leftRailItems.map((item) => (
                  <ProductOrbitCard key={item.title} item={item} />
                ))}
              </aside>

              <main className="order-1 lg:order-2">
                <div className="mx-auto max-w-[39rem] text-center lg:mt-2">
                  <h1 className="mx-auto max-w-[34rem] text-balance font-display text-[clamp(2.35rem,4.2vw,4rem)] font-semibold leading-[0.9] text-[#008b67]">
                    {copy.titleLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </h1>
                  <p className="mx-auto mt-6 max-w-[39rem] text-[15px] leading-8 text-[#65756c]">
                    {copy.bodyLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </p>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:hidden">
                  {localizedTools.map((item) => (
                    <ProductOrbitCard key={item.title} item={item} compact />
                  ))}
                </div>

                <div className="mx-auto mt-8 hidden w-full max-w-[48rem] gap-5 lg:grid lg:grid-cols-3">
                  <ProductOrbitCard item={featured} showcase />
                  {middleRailItems.map((item) => (
                    <ProductOrbitCard key={item.title} item={item} showcase />
                  ))}
                </div>

                <div className="mx-auto mt-5 hidden w-full max-w-[48rem] justify-center lg:flex">
                  <p className="flex w-full max-w-[42rem] items-center justify-center gap-5 py-1 text-center">
                    <span className="text-[15px] font-black uppercase tracking-[0.28em] text-[#b36b00]">
                      {copy.deskPrefix}
                    </span>
                    <span className="h-px w-20 bg-[#cda24c]" aria-hidden="true" />
                    <span className="font-display text-[clamp(2.45rem,3.05vw,3.55rem)] font-semibold leading-none text-[#0f5d47]">
                      {copy.deskTitle}
                    </span>
                  </p>
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
          {localizedSupportCards.map((card) => (
            <SupportCard key={card.title} {...card} />
          ))}
        </div>

        <div className="mt-8">
          <section className="rounded-[1.8rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(135deg,#113f32,#0f5d47)] p-6 text-[#fff9ef] shadow-[0_24px_70px_rgba(22,57,46,0.18)] sm:p-8">
            <Sparkles className="h-8 w-8 text-[#f2b544]" aria-hidden="true" />
            <h2 className="mt-5 font-display text-4xl leading-tight">{copy.ctaTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-white/76">
              {copy.ctaBody}
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

function ProductOrbitCard({
  item,
  compact = false,
  showcase = false,
  className = "",
}: {
  item: LocalizedEquipmentTool;
  compact?: boolean;
  showcase?: boolean;
  className?: string;
}) {
  const sizeClass = showcase
    ? "group grid h-[31rem] grid-rows-[3.35fr_1fr] overflow-hidden rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_18px_42px_rgba(121,105,70,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(0,79,58,0.16)]"
    : compact
      ? "group grid h-[17.5rem] grid-rows-[3fr_1fr] overflow-hidden rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_14px_34px_rgba(121,105,70,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(0,79,58,0.14)]"
      : "group grid h-[19rem] grid-rows-[3fr_1fr] overflow-hidden rounded-[1.25rem] border border-[rgba(41,56,49,0.08)] bg-[#edeae3] shadow-[0_14px_34px_rgba(121,105,70,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(0,79,58,0.14)]";

  return (
    <article className={`${sizeClass} ${className}`}>
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

function EquipmentCardMedia({
  item,
  sizes,
  priority = false,
}: {
  item: LocalizedEquipmentTool;
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

function SupportCard({
  icon: Icon,
  title,
  body,
  imageSrc,
  imageAlt,
  badgeSrc,
  badgeAlt,
}: {
  icon: typeof Factory;
  title: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeSrc?: string;
  badgeAlt?: string;
}) {
  const hasBackground = Boolean(imageSrc);

  return (
    <article className={`${hasBackground ? "min-h-[17rem] bg-[#113f32] p-6 text-white" : "bg-white/74 p-5"} relative overflow-hidden rounded-[1.5rem] border border-[rgba(41,56,49,0.1)] shadow-[0_18px_48px_rgba(121,105,70,0.1)]`}>
      {imageSrc ? (
        <>
          <Image src={imageSrc} alt={imageAlt ?? ""} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,44,34,0.9)_0%,rgba(12,44,34,0.62)_48%,rgba(12,44,34,0.28)_100%)]" />
        </>
      ) : null}

      <div className="relative z-10 max-w-[18rem]">
        {!hasBackground ? (
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#dcefe8] text-[#0f5d47]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
        <h2 className={`${hasBackground ? "text-white" : "text-[#133226]"} mt-5 text-xl font-black tracking-[-0.02em]`}>{title}</h2>
        <p className={`${hasBackground ? "text-white/82" : "text-[#65756c]"} mt-3 text-sm leading-7`}>{body}</p>
        {!hasBackground ? (
          <div className="mt-5 flex items-center gap-2 text-[#f2b544]">
            <Leaf className="h-4 w-4" aria-hidden="true" />
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <Boxes className="h-4 w-4" aria-hidden="true" />
          </div>
        ) : null}
      </div>

      {badgeSrc ? (
        <Image src={badgeSrc} alt={badgeAlt ?? ""} width={128} height={78} className="absolute bottom-4 right-4 z-10 h-auto w-24 object-contain mix-blend-multiply drop-shadow-[0_10px_22px_rgba(0,0,0,0.24)]" />
      ) : null}
    </article>
  );
}
