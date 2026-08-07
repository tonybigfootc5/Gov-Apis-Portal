import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Beaker, Bug, Factory, FlaskConical, Sparkles } from "lucide-react";
import type { SiteLanguage } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import type { TechnologyItem } from "@/lib/technologies";
import { technologyItems } from "@/lib/technologies";

export const metadata: Metadata = {
  title: "Technologies",
  description: "Scientific beekeeping and bee-product technologies followed and taught at API CULTURE.",
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

const technologyCopy = {
  en: {
    eyebrow: "Technology stack",
    title: "Technologies followed across beekeeping, hive products, and value addition.",
    body:
      "This page organizes the practical technologies followed at API CULTURE, from foundational beekeeping and queen rearing to honey processing, wax work, pollen, propolis, venom, and equipment manufacturing awareness.",
    chips: ["11 technologies", "Field + processing exposure", "Bee-product value addition"],
    snapshot: "Snapshot",
    listed: "Technologies listed",
    pillars: "Learning pillars",
    approach: "Approach",
    approachValue: "Field-ready",
    scope: "Practical scope",
    scopeBody:
      "The technologies below span colony work, bee-product collection, processing, packing, and equipment understanding so learners see how field practice and value addition connect end to end.",
    technology: "Technology",
    practiceArea: "API CULTURE practice area",
    practicalFocus: "Practical focus",
    learningOutcomes: "Learning outcomes",
    viewPrograms: "View programs",
    aboutCenter: "About the center",
    pillarsCopy: {} as Record<string, { title: string; body: string }>,
    items: {} as Record<string, Partial<TechnologyItem>>,
  },
  te: {
    eyebrow: "టెక్నాలజీ విభాగం",
    title: "తేనెటీగల పెంపకం, హైవ్ ఉత్పత్తులు మరియు విలువ వృద్ధిలో అనుసరించే టెక్నాలజీలు.",
    body:
      "API CULTUREలో అనుసరించే ప్రాయోగిక టెక్నాలజీలను ఈ పేజీ సమగ్రంగా చూపిస్తుంది: బీకీపింగ్, క్వీన్ రియరింగ్, తేనె ప్రాసెసింగ్, వ్యాక్స్, పుప్పొడి, ప్రోపోలిస్, వెనం మరియు పరికరాల తయారీ అవగాహన.",
    chips: ["11 టెక్నాలజీలు", "ఫీల్డ్ + ప్రాసెసింగ్ అనుభవం", "తేనెటీగ ఉత్పత్తుల విలువ వృద్ధి"],
    snapshot: "స్నాప్‌షాట్",
    listed: "జాబితాలోని టెక్నాలజీలు",
    pillars: "అభ్యాస స్తంభాలు",
    approach: "విధానం",
    approachValue: "ఫీల్డ్‌కు సిద్ధం",
    scope: "ప్రాయోగిక పరిధి",
    scopeBody:
      "కింద ఉన్న టెక్నాలజీలు కాలనీ పని, తేనెటీగ ఉత్పత్తుల సేకరణ, ప్రాసెసింగ్, ప్యాకింగ్ మరియు పరికరాల అవగాహనను కలుపుతూ ఫీల్డ్ ప్రాక్టీస్ నుంచి విలువ వృద్ధి వరకు పూర్తి సంబంధాన్ని చూపిస్తాయి.",
    technology: "టెక్నాలజీ",
    practiceArea: "API CULTURE ప్రాక్టీస్ ప్రాంతం",
    practicalFocus: "ప్రాయోగిక దృష్టి",
    learningOutcomes: "అభ్యాస ఫలితాలు",
    viewPrograms: "కార్యక్రమాలు చూడండి",
    aboutCenter: "సెంటర్ గురించి",
    pillarsCopy: {
      "Apiary practice": {
        title: "అపియరీ ప్రాక్టీస్",
        body: "కాలనీ సంరక్షణ, క్వీన్ నిర్వహణ, హైవ్ ప్రవర్తన మరియు సురక్షిత ఫీల్డ్ హ్యాండ్లింగ్‌పై చేతిపని.",
      },
      "Bee-product collection": {
        title: "తేనెటీగ ఉత్పత్తుల సేకరణ",
        body: "తేనె, రాయల్ జెల్లీ, పుప్పొడి, ప్రోపోలిస్, వ్యాక్స్ మరియు ప్రత్యేక ఉత్పత్తుల సేకరణ పద్ధతులు.",
      },
      "Processing and packing": {
        title: "ప్రాసెసింగ్ మరియు ప్యాకింగ్",
        body: "శుభ్రమైన హ్యాండ్లింగ్, నిల్వ అవగాహన మరియు ఉత్పత్తి ప్రదర్శనపై విలువ వృద్ధి ప్రక్రియలు.",
      },
      "Equipment systems": {
        title: "పరికరాల వ్యవస్థలు",
        body: "నిజమైన అపియరీ పనులకు తోడ్పడే హైవ్ భాగాలు, టూల్స్ మరియు పరికరాల అవగాహన.",
      },
    },
    items: {
      beekeeping: {
        title: "తేనెటీగల పెంపకం",
        category: "అపియరీ పునాది",
        description: "కాలనీ ఏర్పాటు, సీజనల్ హైవ్ నిర్వహణ, పరిశీలన, తేనెటీగల ప్రవర్తన, ఫీడింగ్ సహాయం మరియు సురక్షిత ఫీల్డ్ పద్ధతులు.",
        practicalFocus: ["హైవ్ స్థానం, కాలనీ బలం మరియు పరిశీలన ప్రణాళిక", "రక్షణాత్మక హ్యాండ్లింగ్, స్మోకర్ వాడకం మరియు కాలనీ తనిఖీలు", "బ్రూడ్, ఆహార నిల్వలు మరియు క్వీన్ పనితీరుకు సీజనల్ నిర్వహణ"],
        outcomes: ["ప్రాయోగిక అపియరీ పనిలో నమ్మకం పెంపు", "కాలనీ సంరక్షణ మరియు ఫీల్డ్ పరిశీలన నైపుణ్యాల మెరుగుదల"],
      },
      "honey-processing-and-packing": {
        title: "తేనె ప్రాసెసింగ్ మరియు ప్యాకింగ్",
        category: "విలువ వృద్ధి",
        description: "శుభ్రమైన ఎక్స్‌ట్రాక్షన్, వడపోత, తేమ అవగాహన, సెటిలింగ్, నిల్వ మరియు మార్కెట్‌కు సిద్ధమైన తేనె ప్యాకింగ్ పద్ధతులు.",
        practicalFocus: ["అన్‌క్యాపింగ్, ఎక్స్‌ట్రాక్షన్, ఫిల్ట్రేషన్ మరియు శుభ్ర హ్యాండ్లింగ్", "తేమ, నిల్వ మరియు కాలుష్య నియంత్రణ ప్రాథమికాలు", "బాటిల్ ఫిల్లింగ్, సీలింగ్, లేబులింగ్ మరియు ప్రదర్శన"],
        outcomes: ["కాంబ్ నుంచి ప్యాక్ చేసిన తేనె వరకు ప్రక్రియ అవగాహన", "శుభ్రమైన ఉత్పత్తి నిర్వహణ మరియు మెరుగైన షెల్ఫ్ ప్రదర్శన"],
      },
      "royal-jelly-collection": {
        title: "రాయల్ జెల్లీ సేకరణ",
        category: "ప్రత్యేక తేనెటీగ ఉత్పత్తులు",
        description: "క్వీన్ సెల్స్ సిద్ధం, గ్రాఫ్టింగ్, పరిశీలన మరియు సరైన దశలో సేకరణకు సంబంధించిన ప్రాయోగిక విధానం.",
        practicalFocus: ["సెల్ కప్స్ సిద్ధం మరియు లార్వా బదిలీ ప్రాథమికాలు", "క్వీన్ సెల్స్ నుంచి సేకరణ సమయం", "శుభ్రమైన సేకరణ మరియు వెంటనే హ్యాండ్లింగ్"],
        outcomes: ["రాయల్ జెల్లీ ఎలా పొందుతారో ప్రాయోగిక అవగాహన", "నాణ్యమైన సేకరణకు సమయం మరియు జాగ్రత్తల గుర్తింపు"],
      },
      "royal-jelly-processing-and-packing": {
        title: "రాయల్ జెల్లీ ప్రాసెసింగ్ మరియు ప్యాకింగ్",
        category: "ప్రత్యేక తేనెటీగ ఉత్పత్తులు",
        description: "సేకరణ తర్వాత శుభ్రమైన బదిలీ, నిల్వ సున్నితత్వం మరియు ప్యాకింగ్ క్రమశిక్షణపై దృష్టి.",
        practicalFocus: ["సేకరణ తర్వాత వెంటనే బదిలీ", "సున్నితమైన ఉత్పత్తుల హ్యాండ్లింగ్ క్రమశిక్షణ", "నాణ్యత నిలుపుకునే ప్యాకింగ్ మరియు నిల్వ అవగాహన"],
        outcomes: ["నాణ్యతకు కీలకమైన ప్రాసెసింగ్ దశల అవగాహన", "శుభ్రమైన నిల్వ మరియు ప్యాకేజింగ్‌కు సిద్ధత"],
      },
      "bee-pollen-collection": {
        title: "బీ పుప్పొడి సేకరణ",
        category: "ప్రత్యేక తేనెటీగ ఉత్పత్తులు",
        description: "పోలెన్ ట్రాపింగ్, హ్యాండ్లింగ్, డ్రైయింగ్ అవగాహన మరియు కాలనీ సమతుల్యతను కాపాడే సేకరణ పద్ధతులు.",
        practicalFocus: ["పోలెన్ ట్రాప్స్ వాడకం మరియు సేకరణ సమయం", "సేకరణ తర్వాత శుభ్రమైన వేర్పాటు", "ఉత్పత్తి సేకరణను కాలనీ అవసరాలతో సమతుల్యం చేయడం"],
        outcomes: ["పుప్పొడిని జాగ్రత్తగా ఎలా సేకరించాలో అవగాహన", "సేకరణ పద్ధతిని ఉత్పత్తి నాణ్యతతో కలపడం"],
      },
      "bee-pollen-processing-and-packing": {
        title: "బీ పుప్పొడి ప్రాసెసింగ్ మరియు ప్యాకింగ్",
        category: "విలువ వృద్ధి",
        description: "శుభ్రపరచడం, తేమ తగ్గింపు అవగాహన, నిల్వ మరియు మార్కెట్‌కు సిద్ధమైన ప్యాకింగ్.",
        practicalFocus: ["సేకరణ తర్వాత శుభ్రపరచడం మరియు డ్రైయింగ్ అవగాహన", "శుభ్రత మరియు నిల్వకు సరిపోయే హ్యాండ్లింగ్", "విలువ వృద్ధి ప్రదర్శనకు ప్యాకింగ్ ఎంపికలు"],
        outcomes: ["పుప్పొడి విలువ వృద్ధిపై అవగాహన పెంపు", "మెరుగైన షెల్ఫ్ సిద్ధత మరియు హ్యాండ్లింగ్ ప్రాక్టీస్"],
      },
      "queen-rearing": {
        title: "క్వీన్ రియరింగ్",
        category: "కాలనీ మెరుగుదల",
        description: "గ్రాఫ్టింగ్, క్వీన్ సెల్ అభివృద్ధి, మేటింగ్ సహాయం, కాలనీ ఎంపిక మరియు బలమైన కాలనీలకు రీప్లేస్‌మెంట్ ప్రణాళిక.",
        practicalFocus: ["లార్వా ఎంపిక మరియు గ్రాఫ్టింగ్ వర్క్‌ఫ్లో", "క్వీన్ సెల్ అభివృద్ధి మరియు నర్సరీ నిర్వహణ", "కాలనీలకు మేటింగ్ మరియు రీప్లేస్‌మెంట్ ప్రణాళిక"],
        outcomes: ["క్వీన్ ఉత్పత్తి పద్ధతుల ప్రాయోగిక అవగాహన", "మెరుగైన క్వీన్ ప్రణాళికతో కాలనీ నిర్వహణ నిర్ణయాల బలోపేతం"],
      },
      "wax-processing": {
        title: "వ్యాక్స్ ప్రాసెసింగ్",
        category: "విలువ వృద్ధి",
        description: "వ్యాక్స్ రికవరీ, శుభ్రపరచడం, కరిగించడం, వడపోత, మోల్డింగ్ లేదా షీట్ తయారీ మరియు బీస్‌వాక్స్ వినియోగం.",
        practicalFocus: ["బీస్‌వాక్స్ పదార్థాల రికవరీ మరియు కరిగింపు", "ప్రాథమిక శుభ్రపరచడం మరియు వడపోత", "మళ్లీ వినియోగం, మోల్డింగ్ లేదా ఫౌండేషన్ పని కోసం సిద్ధం"],
        outcomes: ["బీస్‌వాక్స్ రికవరీ మరియు మళ్లీ వినియోగ సామర్థ్యంపై అవగాహన", "హైవ్ ఉత్పత్తులను అదనపు విలువ అవకాశాలతో కలపడం"],
      },
      "venom-collection": {
        title: "వెనం సేకరణ",
        category: "ప్రత్యేక తేనెటీగ ఉత్పత్తులు",
        description: "నియంత్రిత సేకరణ వ్యవస్థలు, భద్రతా క్రమశిక్షణ, పరికరాల అవగాహన మరియు జాగ్రత్తగా హ్యాండ్లింగ్ పద్ధతులు.",
        practicalFocus: ["నియంత్రిత వెనం సేకరణ పద్ధతుల అవలోకనం", "భద్రత మరియు హ్యాండ్లింగ్ జాగ్రత్తలు", "పరికరాల అవగాహన మరియు ఉత్పత్తి సున్నిత హ్యాండ్లింగ్"],
        outcomes: ["ప్రత్యేక తేనెటీగ ఉత్పత్తి ప్రవాహానికి ప్రాయోగిక పరిచయం", "భద్రత మరియు నియంత్రిత సేకరణ ప్రాముఖ్యత గుర్తింపు"],
      },
      "propolis-collection": {
        title: "ప్రోపోలిస్ సేకరణ",
        category: "ప్రత్యేక తేనెటీగ ఉత్పత్తులు",
        description: "సేకరణ ఉపరితలాలు లేదా ట్రాప్స్ వాడకం, తొలగింపు పద్ధతులు, శుభ్రపరచడం మరియు రెసిన్ ఉత్పత్తి హ్యాండ్లింగ్.",
        practicalFocus: ["హైవ్ రెసిన్ పదార్థాల సేకరణ పద్ధతులు", "శుభ్రపరచడం మరియు వేర్పాటు ప్రాథమికాలు", "నిల్వ మరియు విలువ వృద్ధి అవగాహన"],
        outcomes: ["ప్రోపోలిస్ ఎలా సేకరించి నిర్వహించాలో అవగాహన", "వైవిధ్యమైన హైవ్ ఉత్పత్తి శిక్షణలో దాని పాత్ర తెలుసుకోవడం"],
      },
      "bee-hives-and-equipment-manufacturing": {
        title: "హైవ్స్ మరియు పరికరాల తయారీ",
        category: "మౌలిక వసతులు మరియు తయారీ",
        description: "హైవ్ భాగాలు, పరికరాల కొలతలు, అసెంబ్లీ అవగాహన మరియు కాలనీ నిర్వహణకు తోడ్పడే తయారీ అంశాలు.",
        practicalFocus: ["హైవ్ బాక్స్‌లు, ఫ్రేమ్స్ మరియు భాగాల పరిచయం", "రక్షణ పరికరాలు మరియు హ్యాండ్లింగ్ టూల్స్", "అపియరీ మరియు ఉత్పత్తి పనులకు పరికరాల సిద్ధత"],
        outcomes: ["అపియరీ పనుల వెనుక పరికరాల వ్యవస్థ అవగాహన", "తయారీ నాణ్యతను రోజువారీ బీకీపింగ్ సామర్థ్యంతో కలపడం"],
      },
    },
  },
  hi: {
    eyebrow: "टेक्नोलॉजी स्टैक",
    title: "मधुमक्खी पालन, हाइव उत्पाद और मूल्य-वर्धन में अपनाई जाने वाली तकनीकें.",
    body:
      "यह पेज API CULTURE में अपनाई जाने वाली व्यावहारिक तकनीकों को व्यवस्थित करता है: बुनियादी मधुमक्खी पालन, क्वीन रियरिंग, शहद प्रोसेसिंग, वैक्स, पोलन, प्रोपोलिस, वेनम और उपकरण निर्माण जागरूकता.",
    chips: ["11 तकनीकें", "फील्ड + प्रोसेसिंग अनुभव", "बी-प्रोडक्ट मूल्य-वर्धन"],
    snapshot: "स्नैपशॉट",
    listed: "सूचीबद्ध तकनीकें",
    pillars: "लर्निंग पिलर्स",
    approach: "दृष्टिकोण",
    approachValue: "फील्ड-रेडी",
    scope: "व्यावहारिक दायरा",
    scopeBody:
      "नीचे की तकनीकें कॉलोनी कार्य, बी-प्रोडक्ट संग्रह, प्रोसेसिंग, पैकिंग और उपकरण समझ को जोड़ती हैं ताकि शिक्षार्थी फील्ड अभ्यास और मूल्य-वर्धन का पूरा संबंध देख सकें.",
    technology: "तकनीक",
    practiceArea: "API CULTURE अभ्यास क्षेत्र",
    practicalFocus: "व्यावहारिक फोकस",
    learningOutcomes: "सीखने के परिणाम",
    viewPrograms: "कार्यक्रम देखें",
    aboutCenter: "सेंटर के बारे में",
    pillarsCopy: {
      "Apiary practice": {
        title: "एपियरी अभ्यास",
        body: "कॉलोनी देखभाल, क्वीन प्रबंधन, हाइव व्यवहार और सुरक्षित फील्ड हैंडलिंग पर हाथों से काम.",
      },
      "Bee-product collection": {
        title: "बी-प्रोडक्ट संग्रह",
        body: "शहद, रॉयल जेली, पोलन, प्रोपोलिस, वैक्स और विशेष उत्पाद धाराओं के संग्रह तरीके.",
      },
      "Processing and packing": {
        title: "प्रोसेसिंग और पैकिंग",
        body: "साफ हैंडलिंग, स्टोरेज जागरूकता और उत्पाद प्रस्तुति पर केंद्रित मूल्य-वर्धन वर्कफ्लो.",
      },
      "Equipment systems": {
        title: "उपकरण प्रणाली",
        body: "हाइव पार्ट्स, टूल्स और उपकरण समझ जो वास्तविक एपियरी संचालन में मदद करती है.",
      },
    },
    items: {
      beekeeping: {
        title: "मधुमक्खी पालन",
        category: "एपियरी आधार",
        description: "कॉलोनी सेटअप, मौसमी हाइव प्रबंधन, निरीक्षण, मधुमक्खी व्यवहार, फीडिंग सपोर्ट और सुरक्षित फील्ड हैंडलिंग.",
        practicalFocus: ["हाइव स्थान, कॉलोनी शक्ति और निरीक्षण योजना", "सुरक्षात्मक हैंडलिंग, स्मोकर उपयोग और नियमित कॉलोनी जांच", "ब्रूड, भोजन भंडार और क्वीन प्रदर्शन के लिए मौसमी प्रबंधन"],
        outcomes: ["व्यावहारिक एपियरी कार्य में आत्मविश्वास", "कॉलोनी देखभाल और फील्ड निरीक्षण कौशल में सुधार"],
      },
      "honey-processing-and-packing": {
        title: "शहद प्रोसेसिंग और पैकिंग",
        category: "मूल्य-वर्धन",
        description: "स्वच्छ एक्सट्रैक्शन, फिल्टरिंग, नमी-जागरूक हैंडलिंग, सेटलिंग, स्टोरेज और बाजार-रेडी शहद पैकिंग.",
        practicalFocus: ["अनकैपिंग, एक्सट्रैक्शन, फिल्ट्रेशन और साफ हैंडलिंग", "नमी, स्टोरेज और कंटैमिनेशन नियंत्रण की बुनियाद", "बॉटल फिलिंग, सीलिंग, लेबलिंग और प्रस्तुति"],
        outcomes: ["कॉम्ब से पैक्ड शहद तक की प्रक्रिया समझना", "साफ उत्पाद हैंडलिंग और बेहतर शेल्फ प्रस्तुति"],
      },
      "royal-jelly-collection": {
        title: "रॉयल जेली संग्रह",
        category: "विशेष बी-प्रोडक्ट",
        description: "क्वीन सेल तैयारी, ग्राफ्टिंग, निगरानी और सही अवस्था में संग्रह से जुड़ी व्यावहारिक प्रक्रिया.",
        practicalFocus: ["सेल कप तैयारी और लार्वा ट्रांसफर की बुनियाद", "क्वीन सेल से संग्रह का समय", "साफ संग्रह और तुरंत हैंडलिंग"],
        outcomes: ["रॉयल जेली कैसे प्राप्त होती है इसकी व्यावहारिक समझ", "गुणवत्ता संग्रह के लिए समय और सावधानी पहचानना"],
      },
      "royal-jelly-processing-and-packing": {
        title: "रॉयल जेली प्रोसेसिंग और पैकिंग",
        category: "विशेष बी-प्रोडक्ट",
        description: "संग्रह के बाद स्वच्छ ट्रांसफर, स्टोरेज संवेदनशीलता और पैकिंग अनुशासन पर फोकस.",
        practicalFocus: ["संग्रह के तुरंत बाद ट्रांसफर", "संवेदनशील उत्पादों की हैंडलिंग अनुशासन", "गुणवत्ता बनाए रखने के लिए पैकिंग और स्टोरेज जागरूकता"],
        outcomes: ["गुणवत्ता-संवेदनशील प्रोसेसिंग स्टेप्स की समझ", "साफ स्टोरेज और पैकेजिंग वर्कफ्लो की तैयारी"],
      },
      "bee-pollen-collection": {
        title: "बी पोलन संग्रह",
        category: "विशेष बी-प्रोडक्ट",
        description: "पोलन ट्रैपिंग, हैंडलिंग, ड्राइंग जागरूकता और कॉलोनी संतुलन बनाए रखते हुए संग्रह.",
        practicalFocus: ["पोलन ट्रैप उपयोग और संग्रह समय", "संग्रह के बाद साफ अलगाव और हैंडलिंग", "उत्पाद संग्रह को कॉलोनी जरूरतों से संतुलित करना"],
        outcomes: ["पोलन को सावधानी से कैसे संग्रह करें", "संग्रह अभ्यास को उत्पाद गुणवत्ता से जोड़ना"],
      },
      "bee-pollen-processing-and-packing": {
        title: "बी पोलन प्रोसेसिंग और पैकिंग",
        category: "मूल्य-वर्धन",
        description: "सफाई, नमी घटाने की जागरूकता, स्टोरेज और बाजार-रेडी पैकेजिंग.",
        practicalFocus: ["संग्रह के बाद सफाई और ड्राइंग जागरूकता", "स्वच्छता और स्टोरेज उपयुक्तता के लिए हैंडलिंग", "मूल्य-वर्धित प्रस्तुति के लिए पैकिंग विकल्प"],
        outcomes: ["पोलन मूल्य-वर्धन की समझ", "बेहतर शेल्फ-रेडीनेस और हैंडलिंग अभ्यास"],
      },
      "queen-rearing": {
        title: "क्वीन रियरिंग",
        category: "कॉलोनी सुधार",
        description: "ग्राफ्टिंग, क्वीन सेल विकास, मेटिंग सपोर्ट, कॉलोनी चयन और मजबूत कॉलोनियों के लिए रिप्लेसमेंट योजना.",
        practicalFocus: ["लार्वा चयन और ग्राफ्टिंग वर्कफ्लो", "क्वीन सेल विकास और नर्सरी प्रबंधन", "कॉलोनियों के लिए मेटिंग और रिप्लेसमेंट योजना"],
        outcomes: ["क्वीन उत्पादन तरीकों की व्यावहारिक समझ", "बेहतर क्वीन योजना से कॉलोनी प्रबंधन निर्णय मजबूत करना"],
      },
      "wax-processing": {
        title: "वैक्स प्रोसेसिंग",
        category: "मूल्य-वर्धन",
        description: "वैक्स रिकवरी, सफाई, मेल्टिंग, फिल्टरिंग, मोल्डिंग या शीट तैयारी और बीज़वैक्स उपयोग.",
        practicalFocus: ["बीज़वैक्स सामग्री की रिकवरी और मेल्टिंग", "बुनियादी सफाई और फिल्टरिंग तरीके", "रीयूज, मोल्डिंग या फाउंडेशन कार्य के लिए तैयारी"],
        outcomes: ["बीज़वैक्स रिकवरी और पुनः उपयोग की क्षमता समझना", "हाइव उत्पादों को अतिरिक्त मूल्य-वर्धन अवसरों से जोड़ना"],
      },
      "venom-collection": {
        title: "वेनम संग्रह",
        category: "विशेष बी-प्रोडक्ट",
        description: "नियंत्रित संग्रह प्रणाली, सुरक्षा अनुशासन, उपकरण जागरूकता और सावधानीपूर्ण हैंडलिंग.",
        practicalFocus: ["नियंत्रित वेनम संग्रह विधियों का अवलोकन", "सुरक्षा और हैंडलिंग सावधानियां", "उपकरण जागरूकता और उत्पाद-संवेदनशील हैंडलिंग"],
        outcomes: ["विशेष बी-प्रोडक्ट स्ट्रीम का व्यावहारिक परिचय", "सुरक्षा और नियंत्रित संग्रह का महत्व पहचानना"],
      },
      "propolis-collection": {
        title: "प्रोपोलिस संग्रह",
        category: "विशेष बी-प्रोडक्ट",
        description: "संग्रह सतहों या ट्रैप्स का उपयोग, हटाने के तरीके, सफाई और इस रेजिनस हाइव उत्पाद की हैंडलिंग.",
        practicalFocus: ["हाइव रेजिन सामग्री के संग्रह तरीके", "सफाई और अलगाव की बुनियाद", "स्टोरेज और मूल्य-वर्धन जागरूकता"],
        outcomes: ["प्रोपोलिस को कैसे संग्रह और संभालें", "विविध हाइव-प्रोडक्ट प्रशिक्षण में इसकी भूमिका"],
      },
      "bee-hives-and-equipment-manufacturing": {
        title: "हाइव्स और उपकरण निर्माण",
        category: "इन्फ्रास्ट्रक्चर और फैब्रिकेशन",
        description: "हाइव पार्ट्स, उपकरण माप, असेंबली जागरूकता और कॉलोनी प्रबंधन में मदद करने वाले निर्माण पहलू.",
        practicalFocus: ["हाइव बॉक्स, फ्रेम और पार्ट्स की परिचितता", "सुरक्षा गियर और हैंडलिंग टूल्स", "एपियरी और उत्पाद कार्य के लिए उपकरण तैयारी"],
        outcomes: ["एपियरी संचालन के पीछे उपकरण इकोसिस्टम समझना", "निर्माण गुणवत्ता को दैनिक मधुमक्खी पालन दक्षता से जोड़ना"],
      },
    },
  },
} as const satisfies Record<SiteLanguage, {
  eyebrow: string;
  title: string;
  body: string;
  chips: readonly string[];
  snapshot: string;
  listed: string;
  pillars: string;
  approach: string;
  approachValue: string;
  scope: string;
  scopeBody: string;
  technology: string;
  practiceArea: string;
  practicalFocus: string;
  learningOutcomes: string;
  viewPrograms: string;
  aboutCenter: string;
  pillarsCopy: Record<string, { title: string; body: string }>;
  items: Record<string, Partial<TechnologyItem>>;
}>;

type TechnologyPageCopy = {
  eyebrow: string;
  title: string;
  body: string;
  chips: readonly string[];
  snapshot: string;
  listed: string;
  pillars: string;
  approach: string;
  approachValue: string;
  scope: string;
  scopeBody: string;
  technology: string;
  practiceArea: string;
  practicalFocus: string;
  learningOutcomes: string;
  viewPrograms: string;
  aboutCenter: string;
  pillarsCopy: Record<string, { title: string; body: string }>;
  items: Record<string, Partial<TechnologyItem>>;
};

export default async function TechnologiesPage() {
  const language = await getRequestLanguage();
  const copy: TechnologyPageCopy = technologyCopy[language] ?? technologyCopy.en;
  const localizedPillars = pillars.map((pillar) => ({ ...pillar, ...copy.pillarsCopy[pillar.title] }));
  const localizedItems = technologyItems.map((item) => ({ ...item, ...copy.items[item.slug] }));

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="neo-shell rounded-[2.4rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#8ec5ff]">{copy.eyebrow}</p>
              <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.92] text-bright sm:text-6xl lg:text-7xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-dim sm:text-lg">
                {copy.body}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {copy.chips.map((chip) => (
                  <Chip key={chip}>{chip}</Chip>
                ))}
              </div>
            </div>

            <div className="section-frame rounded-[1.7rem] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{copy.snapshot}</p>
              <div className="mt-5 grid gap-4">
                <QuickStat value="11" label={copy.listed} />
                <QuickStat value="4" label={copy.pillars} />
                <QuickStat value={copy.approachValue} label={copy.approach} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {localizedPillars.map(({ icon: Icon, title, body }) => (
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
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{copy.scope}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#fff9ef]">
                {copy.scopeBody}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {localizedItems.map((item, index) => (
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
                    {copy.technology} {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-dim">{copy.practiceArea}</span>
                </div>

                <h2 className="font-display mt-4 text-4xl leading-tight text-bright">{item.title}</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-dim">{item.description}</p>

                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  <InfoBlock title={copy.practicalFocus} items={item.practicalFocus} />
                  <InfoBlock title={copy.learningOutcomes} items={item.outcomes} />
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
            {copy.viewPrograms}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.78)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#1f352b]"
          >
            {copy.aboutCenter}
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
