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

const localizedArticles = {} as Record<string, Record<string, Partial<Pick<ArticleItem, "category" | "title" | "excerpt" | "body" | "keyPoints" | "authorRole" | "seoTitle" | "metaDescription">>>>;

const localizedGalleryItems = {} as Record<string, Record<string, Partial<Pick<GalleryImageItem, "caption" | "place">>>>;

export function getLocalizedLegalName(language: SiteLanguage) {
  return localizedLegalNames[language] ?? localizedLegalNames.en;
}

export function getLocalizedPolicyLinks(language: SiteLanguage) {
  return localizedPolicyLinks[language] ?? localizedPolicyLinks.en;
}

export function getLocalizedArticle<T extends ArticleItem>(article: T, language: SiteLanguage): T {
  const translated = localizedArticles[language]?.[article.slug];

  if (!translated) {
    return article;
  }

  return { ...article, ...translated };
}

export function getLocalizedGalleryItem<T extends GalleryImageItem>(item: T, language: SiteLanguage): T {
  const translated = localizedGalleryItems[language]?.[item.id];

  if (!translated) {
    return item;
  }

  return { ...item, ...translated };
}
