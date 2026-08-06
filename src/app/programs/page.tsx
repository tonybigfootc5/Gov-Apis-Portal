import type { Metadata } from "next";
import { TrainingPreviewSwitch, type TrainingPreviewCourse } from "@/components/training-preview-switch";
import { getPrograms } from "@/lib/data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { trainingProgramCatalogBySlug } from "@/lib/training-programs";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Apiculture training programs at API CULTURE.",
};

const programDisplayOverrides = {
  te: {
    "scientific-beekeeping-foundation": {
      title: "తేనెటీగల పెంపకం",
      duration: "5 రోజులు",
      focusLabel: "శాస్త్రీయ తేనెటీగల పెంపకం",
      focusText: "అపియరీ సిద్ధత కోసం తరగతి బోధన, ప్రదర్శనలు మరియు వ్యక్తిగత చేతిపని.",
      level: "ప్రారంభ స్థాయి",
      experienceLabel: "ప్రారంభ స్థాయికి అనుకూలం",
      targetAudience: "రైతులు, గ్రామీణ యువత, మహిళలు, గిరిజన సమాజాలు, భూమిలేని వ్యక్తులు, ప్రస్తుత తేనెటీగల పెంపకదారులు, ఆసక్తి ఉన్న వ్యాపారులు.",
      taughtIn: "తెలుగు, హిందీ మరియు ఇంగ్లీష్",
      skills: ["తేనెటీగ జాతులు", "సురక్షిత హైవ్ హ్యాండ్లింగ్", "కాలనీ నిర్మాణం", "అపియరీ నిర్వహణ"],
      outcomes: ["ప్రాయోగిక అపియరీ పనిలో నమ్మకం పెంపు", "కాలనీ సంరక్షణ మరియు పరిశీలన నైపుణ్యాల మెరుగుదల"],
    },
    "honey-processing": {
      title: "తేనె ప్రాసెసింగ్",
      duration: "2 రోజులు",
      focusLabel: "తేనె ప్రాసెసింగ్ మరియు ప్యాకింగ్",
      focusText: "శుభ్రమైన ఎక్స్‌ట్రాక్షన్, వడపోత, నిల్వ మరియు మార్కెట్‌కు సిద్ధమైన ప్యాకింగ్‌పై ప్రాక్టీస్.",
      level: "ప్రారంభ మరియు మధ్యస్థ",
      experienceLabel: "తేనె ఉత్పత్తిదారులకు అనుకూలం",
      targetAudience: "తేనెటీగల పెంపకదారులు, రైతులు, ఉత్పత్తి యూనిట్లు, ఆసక్తి ఉన్న వ్యాపారులు.",
      taughtIn: "తెలుగు, హిందీ మరియు ఇంగ్లీష్",
      skills: ["శుభ్రమైన ఎక్స్‌ట్రాక్షన్", "వడపోత", "బాట్లింగ్", "లేబులింగ్"],
      outcomes: ["కాంబ్ నుంచి ప్యాక్ చేసిన తేనె వరకు ప్రక్రియ అవగాహన", "శుభ్రమైన ఉత్పత్తి నిర్వహణలో మెరుగుదల"],
    },
    "queen-rearing-and-colony-multiplication": {
      title: "క్వీన్ పెంపకం మరియు కాలనీ విస్తరణ",
      duration: "10 రోజులు",
      focusLabel: "క్వీన్ రియరింగ్ మరియు కాలనీ గుణనం",
      focusText: "గ్రాఫ్టింగ్, క్వీన్ సెల్ అభివృద్ధి, మేటింగ్ సహాయం మరియు కాలనీ విస్తరణ పద్ధతులు.",
      level: "మధ్యస్థ",
      experienceLabel: "అనుభవం ఉన్న శిక్షణార్థులకు",
      targetAudience: "ప్రస్తుత తేనెటీగల పెంపకదారులు, శిక్షకులు, వ్యవసాయ కార్మికులు, ఆసక్తి ఉన్న వ్యాపారులు.",
      taughtIn: "తెలుగు, హిందీ మరియు ఇంగ్లీష్",
      skills: ["గ్రాఫ్టింగ్", "క్వీన్ సెల్ నిర్వహణ", "మేటింగ్ సహాయం", "కాలనీ ఎంపిక"],
      outcomes: ["క్వీన్ ఉత్పత్తి పద్ధతుల ప్రాయోగిక అవగాహన", "బలమైన కాలనీ ప్రణాళికలో మెరుగుదల"],
    },
    "royal-jelly-production": {
      title: "రాయల్ జెల్లీ ఉత్పత్తి",
      duration: "10 రోజులు",
      focusLabel: "రాయల్ జెల్లీ సేకరణ మరియు ప్రాసెసింగ్",
      focusText: "క్వీన్ సెల్ సిద్ధం, సరైన సేకరణ సమయం, శుభ్రమైన హ్యాండ్లింగ్ మరియు నిల్వ అవగాహన.",
      level: "ప్రత్యేక శిక్షణ",
      experienceLabel: "అధునాతన శిక్షణార్థులకు",
      targetAudience: "అనుభవం ఉన్న తేనెటీగల పెంపకదారులు, శిక్షకులు, ప్రత్యేక ఉత్పత్తులపై ఆసక్తి ఉన్న వ్యాపారులు.",
      taughtIn: "తెలుగు, హిందీ మరియు ఇంగ్లీష్",
      skills: ["క్వీన్ సెల్ సిద్ధం", "సేకరణ సమయం", "శుభ్రమైన హ్యాండ్లింగ్", "నిల్వ అవగాహన"],
      outcomes: ["రాయల్ జెల్లీ ఉత్పత్తి దశల అవగాహన", "నాణ్యతకు కీలకమైన జాగ్రత్తల గుర్తింపు"],
    },
  },
  hi: {
    "scientific-beekeeping-foundation": {
      title: "मधुमक्खी पालन",
      duration: "5 दिन",
      focusLabel: "वैज्ञानिक मधुमक्खी पालन",
      focusText: "एपियरी तैयारी के लिए कक्षा प्रशिक्षण, डेमो और व्यक्तिगत हाथों से अभ्यास.",
      level: "प्रारंभिक स्तर",
      experienceLabel: "शुरुआती लोगों के लिए उपयुक्त",
      targetAudience: "किसान, ग्रामीण युवा, महिलाएं, जनजातीय समुदाय, भूमिहीन व्यक्ति, मौजूदा मधुमक्खी पालक और इच्छुक उद्यमी.",
      taughtIn: "हिंदी, तेलुगु और अंग्रेजी",
      skills: ["मधुमक्खी प्रजातियां", "सुरक्षित हाइव हैंडलिंग", "कॉलोनी संरचना", "एपियरी प्रबंधन"],
      outcomes: ["व्यावहारिक एपियरी कार्य में आत्मविश्वास", "कॉलोनी देखभाल और निरीक्षण कौशल में सुधार"],
    },
    "honey-processing": {
      title: "शहद प्रोसेसिंग",
      duration: "2 दिन",
      focusLabel: "शहद प्रोसेसिंग और पैकिंग",
      focusText: "स्वच्छ एक्सट्रैक्शन, फिल्टरिंग, स्टोरेज और बाजार-रेडी पैकिंग पर अभ्यास.",
      level: "प्रारंभिक और मध्यम",
      experienceLabel: "शहद उत्पादकों के लिए उपयुक्त",
      targetAudience: "मधुमक्खी पालक, किसान, उत्पाद इकाइयां और इच्छुक उद्यमी.",
      taughtIn: "हिंदी, तेलुगु और अंग्रेजी",
      skills: ["स्वच्छ एक्सट्रैक्शन", "फिल्टरिंग", "बॉटलिंग", "लेबलिंग"],
      outcomes: ["कॉम्ब से पैक्ड शहद तक की प्रक्रिया समझना", "साफ उत्पाद हैंडलिंग में सुधार"],
    },
    "queen-rearing-and-colony-multiplication": {
      title: "क्वीन पालन और कॉलोनी विस्तार",
      duration: "10 दिन",
      focusLabel: "क्वीन रियरिंग और कॉलोनी गुणन",
      focusText: "ग्राफ्टिंग, क्वीन सेल विकास, मेटिंग सपोर्ट और कॉलोनी विस्तार पद्धतियां.",
      level: "मध्यम",
      experienceLabel: "अनुभवी प्रशिक्षणार्थियों के लिए",
      targetAudience: "मौजूदा मधुमक्खी पालक, प्रशिक्षक, कृषि कार्यकर्ता और इच्छुक उद्यमी.",
      taughtIn: "हिंदी, तेलुगु और अंग्रेजी",
      skills: ["ग्राफ्टिंग", "क्वीन सेल प्रबंधन", "मेटिंग सपोर्ट", "कॉलोनी चयन"],
      outcomes: ["क्वीन उत्पादन विधियों की व्यावहारिक समझ", "मजबूत कॉलोनी योजना में सुधार"],
    },
    "royal-jelly-production": {
      title: "रॉयल जेली उत्पादन",
      duration: "10 दिन",
      focusLabel: "रॉयल जेली संग्रह और प्रोसेसिंग",
      focusText: "क्वीन सेल तैयारी, सही संग्रह समय, स्वच्छ हैंडलिंग और स्टोरेज जागरूकता.",
      level: "विशेष प्रशिक्षण",
      experienceLabel: "उन्नत प्रशिक्षणार्थियों के लिए",
      targetAudience: "अनुभवी मधुमक्खी पालक, प्रशिक्षक और विशेष उत्पादों में रुचि रखने वाले उद्यमी.",
      taughtIn: "हिंदी, तेलुगु और अंग्रेजी",
      skills: ["क्वीन सेल तैयारी", "संग्रह समय", "स्वच्छ हैंडलिंग", "स्टोरेज जागरूकता"],
      outcomes: ["रॉयल जेली उत्पादन चरणों की समझ", "गुणवत्ता के लिए जरूरी सावधानियां पहचानना"],
    },
  },
} as const;

export default async function ProgramsPage() {
  const language = await getRequestLanguage();
  const programs = await getPrograms();

  const courses: TrainingPreviewCourse[] = programs.map((program) => {
    const translatedProgram = getTranslatedProgramContent(program, language);
    const presentation = trainingProgramCatalogBySlug[program.slug];
    const override =
      language === "te" || language === "hi"
        ? programDisplayOverrides[language][program.slug as keyof (typeof programDisplayOverrides)[typeof language]]
        : undefined;

    return {
      id: program.id,
      slug: program.slug,
      serviceTitle: presentation?.title ?? program.title,
      tabLabel: override?.title ?? translatedProgram.title,
      title: override?.title ?? translatedProgram.title,
      summary: translatedProgram.summary,
      description: translatedProgram.description,
      duration: override?.duration ?? translatedProgram.duration,
      level: override?.level ?? translatedProgram.level,
      fee: translatedProgram.fee ?? t(language, "programs.detail.fallbackFee"),
      capacity: `${translatedProgram.capacity} ${t(language, "programs.seats")}`,
      batchDate: translatedProgram.batchStartsAt ? formatDate(translatedProgram.batchStartsAt) : "Contact the center for start date",
      focusLabel: override?.focusLabel ?? presentation?.focusLabel ?? translatedProgram.level,
      focusText: override?.focusText ?? presentation?.focusText ?? translatedProgram.summary,
      targetAudience: override?.targetAudience ?? presentation?.targetAudience ?? "Eligible applicants interested in beekeeping training.",
      imageSrc: presentation?.imageSrc ?? "/training-field-visuals/image2.jpeg",
      imageAlt: presentation?.imageAlt ?? translatedProgram.title,
      outcomes: override?.outcomes ? [...override.outcomes] : presentation?.outcomes ?? [],
      skills: override?.skills ? [...override.skills] : presentation?.skills ?? [],
      rating: presentation?.rating ?? "4.8",
      ratingLabel: presentation?.ratingLabel ?? "Program reviews",
      experienceLabel: override?.experienceLabel ?? presentation?.experienceLabel ?? translatedProgram.level,
      tools: presentation?.tools ?? [],
      certificate: presentation?.certificate ?? "Physical certificate issued after completion",
      taughtIn: override?.taughtIn ?? presentation?.taughtIn ?? "English and Telugu",
      testimonial: presentation?.testimonial ?? {
        quote: "Field-led practice made the training practical and clear.",
        name: "Program trainee",
      },
    };
  });

  return <TrainingPreviewSwitch courses={courses} language={language} />;
}
