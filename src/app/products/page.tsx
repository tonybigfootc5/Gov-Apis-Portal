import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package2, ShieldCheck } from "lucide-react";
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
      contextTitle: "Product context",
      contextBody:
        "These product entries are positioned as representative hive-product streams connected to the center's practical beekeeping and value-addition orientation, not as an e-commerce catalog.",
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
      contextTitle: "ఉత్పత్తి సందర్భం",
      contextBody:
        "ఈ ఉత్పత్తి ఎంట్రీలు కేంద్రం యొక్క ప్రాక్టికల్ తేనెటీగల పెంపకం మరియు విలువ వృద్ధి దిశకు సంబంధించిన ప్రతినిధి హైవ్-ఉత్పత్తులుగా మాత్రమే చూపించబడ్డాయి; ఇవి ఈ-కామర్స్ క్యాటలాగ్ కావు.",
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
      contextTitle: "उत्पाद संदर्भ",
      contextBody:
        "ये उत्पाद प्रविष्टियाँ केंद्र के व्यावहारिक मधुमक्खी पालन और मूल्य-वर्धन उन्मुखीकरण से जुड़े प्रतिनिधि छत्ता-उत्पाद प्रवाह हैं, ई-कॉमर्स कैटलॉग नहीं।",
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

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="neo-shell rounded-[2.4rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#8ec5ff]">{copy.eyebrow}</p>
              <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.92] text-bright sm:text-6xl lg:text-7xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-dim sm:text-lg">
                {copy.body}
              </p>
            </div>

            <div className="section-frame rounded-[1.7rem] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{copy.snapshot}</p>
              <div className="mt-5 grid gap-4">
                <QuickStat value={`${productItems.length}`} label={copy.streamCount} />
                <QuickStat value={copy.learningPathValue} label={copy.learningPath} />
                <QuickStat value={copy.approachValue} label={copy.approach} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {localizedItems.map((item) => (
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
                    {copy.streamLabel}
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

        <div className="mt-8 rounded-[1.6rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.72)] p-5 text-sm leading-7 text-dim">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00]">{copy.contextTitle}</p>
          <p className="mt-3">{copy.contextBody}</p>
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
