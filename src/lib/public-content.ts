import type { ArticleItem, GalleryImageItem } from "@/lib/data";
import type { SiteLanguage } from "@/lib/i18n";

const localizedLegalNames = {
  en: "API Culture Technology Center (Bee Keeping)",
  te: "API Culture Technology Center (తేనెటీగల పెంపకం)",
  hi: "API Culture Technology Center (मधुमक्खी पालन)",
} as const;

const localizedPolicyLinks = {
  en: [
    {
      title: "Terms and Conditions",
      description: "Platform use, enrollment, payments, acceptable use, and governing terms.",
    },
    {
      title: "Privacy Policy",
      description: "How API CULTURE collects, uses, stores, and protects personal information.",
    },
    {
      title: "Refund Policy",
      description: "Refund and cancellation handling for training enrollments and related services.",
    },
    {
      title: "Return Policy",
      description: "Returns and exchanges for any physical materials or goods, where applicable.",
    },
    {
      title: "Shipping Policy",
      description: "Delivery expectations for confirmations, documents, and any physical shipments.",
    },
  ],
  te: [
    {
      title: "నిబంధనలు మరియు షరతులు",
      description: "వేదిక వినియోగం, నమోదు, చెల్లింపులు మరియు నియంత్రణ నిబంధనలు.",
    },
    {
      title: "గోప్యతా విధానం",
      description: "API CULTURE వ్యక్తిగత సమాచారాన్ని ఎలా సేకరిస్తుంది, ఉపయోగిస్తుంది మరియు రక్షిస్తుంది.",
    },
    {
      title: "రిఫండ్ విధానం",
      description: "శిక్షణ నమోదు మరియు సంబంధిత సేవల రద్దు, రీఫండ్ విధానం.",
    },
    {
      title: "రిటర్న్ విధానం",
      description: "అవసరమైతే భౌతిక సామగ్రి లేదా వస్తువుల రిటర్న్ మరియు మార్పిడి నిబంధనలు.",
    },
    {
      title: "షిప్పింగ్ విధానం",
      description: "నిర్ధారణలు, పత్రాలు మరియు భౌతిక పంపకాల డెలివరీ అంచనాలు.",
    },
  ],
  hi: [
    {
      title: "नियम और शर्तें",
      description: "प्लेटफ़ॉर्म उपयोग, नामांकन, भुगतान और संचालन शर्तें।",
    },
    {
      title: "गोपनीयता नीति",
      description: "API CULTURE व्यक्तिगत जानकारी को कैसे एकत्र, उपयोग, संग्रहित और सुरक्षित करता है।",
    },
    {
      title: "रिफंड नीति",
      description: "प्रशिक्षण नामांकन और संबंधित सेवाओं के लिए रद्दीकरण और रिफंड प्रक्रिया।",
    },
    {
      title: "रिटर्न नीति",
      description: "जहां लागू हो, भौतिक सामग्री या वस्तुओं की वापसी और विनिमय शर्तें।",
    },
    {
      title: "शिपिंग नीति",
      description: "पुष्टिकरण, दस्तावेज़ और भौतिक भेजाव की डिलीवरी अपेक्षाएँ।",
    },
  ],
} as const;

const localizedArticles = {
  te: {
    "managing-bee-colonies-in-high-temperature-without-losing-strength": {
      category: "ఫీల్డ్ నిర్వహణ",
      title: "అధిక ఉష్ణోగ్రతల్లో తేనెటీగ కాలనీల బలం తగ్గకుండా ఎలా నిర్వహించాలి",
      excerpt: "వేసవిలో హైవ్ సంరక్షణ, గాలి ప్రవాహం, నీడ మరియు తేమ నియంత్రణపై ప్రాక్టికల్ ఫీల్డ్ నోట్.",
      body:
        "అధిక ఉష్ణోగ్రత సమయంలో గాలి ప్రవాహం, నీడ మరియు నీటి వనరులు సరిగా నిర్వహించకపోతే కాలనీలపై తీవ్రమైన ఒత్తిడి పడుతుంది. ఈ వ్యాసం వేడి ఒత్తిడిని తగ్గించడం, బ్రుడ్ ప్రాంతాలను స్థిరంగా ఉంచడం, కార్మిక తేనెటీగల పనితీరును కాపాడడం మరియు అవసరం లేని కాలనీ బలహీనతను నివారించడం కోసం సరళమైన ఫీల్డ్ చర్యలను వివరిస్తుంది.\n\nఇది సిద్ధాంతం కంటే నేరుగా ఉపయోగపడే సూచనలు కావాల్సిన ఫీల్డ్ సిబ్బంది, శిక్షణార్థులు మరియు గ్రామీణ తేనెటీగల పెంపకదారుల కోసం రాయబడింది.",
      keyPoints: "ఆపియరీకి నీడ\nసమీపంలో నీటి వనరు\nచిట్టెలు అధిక వేడి కాకుండా చూడండి",
      authorRole: "శిక్షణ మరియు ఫీల్డ్ బృందం",
      seoTitle: "అధిక ఉష్ణోగ్రతలో తేనెటీగ కాలనీ నిర్వహణ",
      metaDescription: "వేసవి ఉష్ణోగ్రతల సమయంలో తేనెటీగ కాలనీలను స్థిరంగా ఉంచే ఫీల్డ్ పద్ధతులు.",
    },
    "how-to-select-a-bee-honey-production-during-monsoon-season-in-beekeeping": {
      category: "ఋతు మార్గదర్శకం",
      title: "వర్షాకాలంలో తేనె ఉత్పత్తి ప్రణాళికను ఎలా ఎంచుకోవాలి",
      excerpt: "వర్షాకాలంలో పుష్ప వనరులు, తేమ మరియు రోగ ఒత్తిడి మారుతాయి కాబట్టి తేనె ఉత్పత్తి నిర్ణయాలు కూడా కాలానుగుణంగా ఉండాలి.",
      body:
        "వర్షాకాలంలో పుష్ప వనరులు, హైవ్ లో తేమ మరియు కాలనీ బలం వేగంగా మారవచ్చు కాబట్టి తేనె ఉత్పత్తి ప్రణాళికను మరింత జాగ్రత్తగా చేయాలి. ఈ వ్యాసం ఎప్పుడు వేచి చూడాలి, ఎప్పుడు తనిఖీ చేయాలి మరియు తేనె-కేంద్రిత నిర్వహణకు పరిస్థితులు సరైనవేనా అనే నిర్ణయానికి శిక్షణార్థులకు సహాయపడుతుంది.\n\nఈ నోటు శిక్షణ చర్చలు, ఫీల్డ్ సందర్శనలు మరియు ఎక్స్‌టెన్షన్ మద్దతు సందర్భాల్లో ఉపయోగించడానికి రూపొందించబడింది.",
      keyPoints: "పుష్ప వనరులు పరిశీలించండి\nతేమ స్థాయిలు గమనించండి\nఫంగస్ ఒత్తిడిని నివారించండి",
      authorRole: "ఋతు ప్రాక్టీస్ యూనిట్",
      seoTitle: "వర్షాకాల తేనె ఉత్పత్తి ప్రణాళిక",
      metaDescription: "వర్షాకాల పరిస్థితుల్లో తేనె ఉత్పత్తి ప్రణాళికకు అవసరమైన ఋతు అంశాలు.",
    },
    "poor-pollination-in-crop-fields-how-better-bee-placement-can-improve-results": {
      category: "పరాగసంపర్క మద్దతు",
      title: "పంట పొలాల్లో బలహీన పరాగసంపర్కం: తేనెటీగల సరైన స్థానం మెరుగైన ఫలితాలు ఎలా ఇస్తుంది",
      excerpt: "కాలనీ సంఖ్య మాత్రమే కాదు, వాటి స్థానం కూడా కీలకం. చిన్న మార్పులు కూడా పరాగసంపర్క ఫలితాలను మెరుగుపరచగలవు.",
      body:
        "పరాగసంపర్క ఫలితాలు బలహీనంగా ఉంటే సమస్య కాలనీల సంఖ్య మాత్రమే కాకపోవచ్చు. పుష్ప సమూహానికి దూరం, నీడ, విమాన మార్గాలు, పంట సమయం మరియు ఫీల్డ్ విస్తరణ వంటి అంశాలు తేనెటీగల పరాగసంపర్క పనితీరును ప్రభావితం చేస్తాయి.\n\nఈ వ్యాసం ఫీల్డ్-ఆధారిత వివరణను అందిస్తుంది; ఇది శిక్షణ సెషన్‌లు మరియు సంస్థాగత సలహా కార్యక్రమాల్లో ఉపయోగపడుతుంది.",
      keyPoints: "పుష్ప సమూహం దగ్గర ఉంచండి\nవిమాన మార్గాలు ఖాళీగా ఉంచండి\nఫీల్డ్ వ్యాప్తిని సమీక్షించండి",
      authorRole: "పంట ఇంటర్‌ఫేస్ మద్దతు",
      seoTitle: "పరాగసంపర్కం కోసం తేనెటీగల మెరుగైన స్థానం",
      metaDescription: "తేనెటీగల స్థానం వ్యూహం పంట పొలాల్లో పరాగసంపర్కాన్ని ఎలా మెరుగుపరుస్తుందో తెలుసుకోండి.",
    },
  },
} as const;

const localizedGalleryItems = {
  te: {
    "gallery-center-signboard-2025": {
      caption: "ప్రస్తుత సంస్థాగత సీజన్‌లో రాజేంద్రనగర్ క్యాంపస్ ప్రవేశం వద్ద ప్రధాన కేంద్ర సైన్‌బోర్డ్.",
      place: "API CULTURE టెక్నాలజీ సెంటర్, రాజేంద్రనగర్, హైదరాబాద్",
    },
    "gallery-field-practice-2025": {
      caption: "ఫౌండేషన్ శిక్షణ బ్యాచ్‌లో లైవ్ హైవ్ హ్యాండ్లింగ్‌తో నిర్వహించిన ప్రాక్టికల్ ఫీల్డ్ బీకీపింగ్ సెషన్.",
      place: "ఫీల్డ్ శిక్షణ ఆపియరీ, హైదరాబాద్",
    },
    "gallery-scientific-foundation-2025": {
      caption: "పర్యవేక్షిత చిట్టె పరిశీలన మరియు ప్రాక్టికల్ మార్గదర్శకతతో శాస్త్రీయ తేనెటీగల పెంపకం ఫౌండేషన్ సెషన్.",
      place: "శిక్షణ మైదానం, హైదరాబాద్ క్యాంపస్",
    },
    "gallery-queen-rearing-2025": {
      caption: "నియంత్రిత ప్రాక్టికల్ శిక్షణలో చిత్రీకరించిన అడ్వాన్స్డ్ క్వీన్ పెంపకం మరియు కాలనీ విస్తరణ బ్యాచ్.",
      place: "అడ్వాన్స్డ్ ఆపియరీ బ్లాక్, హైదరాబాద్",
    },
    "gallery-kavuri-visit-2024": {
      caption: "గౌరవ అతిథులతో జరిగిన సమావేశం మరియు కార్యక్రమ చర్చ సమయంలో చిత్రీకరించిన సంస్థాగత సమీక్ష క్షణం.",
      place: "API CULTURE సమావేశ మందిరం, హైదరాబాద్",
    },
    "gallery-kavuri-lab-2024": {
      caption: "సంస్థాగత వాక్‌థ్రూ మరియు సాంకేతిక సమీక్షను చూపించే డాక్యుమెంటేషన్ ఫ్రేమ్.",
      place: "టెక్నికల్ డిస్ప్లే ఏరియా, హైదరాబాద్ క్యాంపస్",
    },
    "gallery-kavuri-products-2024": {
      caption: "అవగాహన మరియు ఎక్స్‌టెన్షన్ కార్యకలాపాల సమయంలో సందర్శకుల కోసం సిద్ధం చేసిన బీ-హైవ్ ఉత్పత్తుల ప్రదర్శన.",
      place: "ఎక్స్‌టెన్షన్ డిస్ప్లే డెస్క్, హైదరాబాద్",
    },
    "gallery-kavuri-outreach-2024": {
      caption: "ప్రాక్టికల్ అపికల్చర్ అభ్యాసంపై దృష్టి పెట్టిన ప్రజా అవుట్‌రీచ్ కార్యక్రమం నుండి ఒక దృశ్యం.",
      place: "కమ్యూనిటీ అవుట్‌రీచ్ జోన్, హైదరాబాద్",
    },
    "gallery-campus-archive-2023": {
      caption: "మునుపటి కార్యకలాప సంవత్సరంలో కేంద్ర మౌలిక సదుపాయాలను డాక్యుమెంట్ చేసిన క్యాంపస్ ఆర్కైవ్ ఫ్రేమ్.",
      place: "రాజేంద్రనగర్ క్యాంపస్, హైదరాబాద్",
    },
    "gallery-training-archive-2023": {
      caption: "పర్యవేక్షణలో ఆపియరీ వద్ద శిక్షణార్థులు పనిచేస్తున్న ఆర్కైవ్ ఫీల్డ్-లెర్నింగ్ దృశ్యం.",
      place: "శిక్షణ ఆపియరీ, హైదరాబాద్ జిల్లా",
    },
    "gallery-products-archive-2023": {
      caption: "తేనె నిర్వహణ మరియు ప్రదర్శన ప్రమాణాలపై ఉత్పత్తి-ఆధారిత అభ్యాసంలో ఉపయోగించిన డాక్యుమెంటేషన్ ఫ్రేమ్.",
      place: "ఇన్‌స్ట్రక్షన్ బ్లాక్, హైదరాబాద్",
    },
  },
} as const;

export function getLocalizedLegalName(language: SiteLanguage) {
  return localizedLegalNames[language] ?? localizedLegalNames.en;
}

export function getLocalizedPolicyLinks(language: SiteLanguage) {
  return localizedPolicyLinks[language] ?? localizedPolicyLinks.en;
}

export function getLocalizedArticle<T extends ArticleItem>(article: T, language: SiteLanguage): T {
  const translated = localizedArticles[language as "te"]?.[article.slug as keyof (typeof localizedArticles)["te"]];

  if (!translated) {
    return article;
  }

  return {
    ...article,
    category: translated.category,
    title: translated.title,
    excerpt: translated.excerpt,
    body: translated.body,
    keyPoints: translated.keyPoints,
    authorRole: translated.authorRole,
    seoTitle: translated.seoTitle,
    metaDescription: translated.metaDescription,
  };
}

export function getLocalizedGalleryItem<T extends GalleryImageItem>(item: T, language: SiteLanguage): T {
  const translated = localizedGalleryItems[language as "te"]?.[item.id as keyof (typeof localizedGalleryItems)["te"]];

  if (!translated) {
    return item;
  }

  return {
    ...item,
    caption: translated.caption,
    place: translated.place,
  };
}
