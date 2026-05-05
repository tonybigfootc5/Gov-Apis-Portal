export const supportedLanguages = ["en", "te", "hi"] as const;

export type SiteLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SiteLanguage = "en";
export const languageCookieName = "site-language";

const translations: Record<SiteLanguage, Record<string, string>> = {
  en: {
    "lang.label": "Language",
    "lang.en": "English",
    "lang.te": "Telugu",
    "lang.hi": "Hindi",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.training": "Training",
    "nav.events": "Events",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "header.techCenter": "Technology Center",
    "home.hero.titlePrefix": "Advanced",
    "home.hero.titleHighlight": "API CULTURE",
    "home.hero.description":
      "API CULTURE is a field-focused apiculture technology center for scientific beekeeping training, rural enterprise, workshops, and institutional collaboration.",
    "home.hero.cta.training": "Training catalog",
    "home.hero.cta.mission": "Learn mission",
    "home.hero.liveCampus": "Live campus motion",
    "home.hero.location": "Location",
    "home.hero.focus": "Focus",
    "home.hero.focusText": "Applied training, hive practice, rural enterprise",
    "home.hero.stats": "Training and field capability pathways",
    "home.cards.training.title": "Applied training",
    "home.cards.training.text": "Structured beekeeping programs",
    "home.cards.workshops.title": "Workshops",
    "home.cards.workshops.text": "Events and orientation sessions",
    "home.cards.tech.title": "Technology center",
    "home.cards.tech.text": "Field-ready apiculture practices",
    "home.fieldSpotlight.title": "Beekeeping practice, captured in the field",
    "home.fieldSpotlight.body":
      "API CULTURE connects classroom instruction with real-world observation, hive handling, and field-ready apiculture methods that learners can carry into rural enterprise and institutional training programs.",
    "home.fieldSpotlight.tag1": "Hands-on learning",
    "home.fieldSpotlight.tag2": "Applied beekeeping",
    "home.fieldSpotlight.tag3": "Field observation",
    "home.training.eyebrow": "Training",
    "home.training.title": "Professional programs for practical apiculture capability",
    "home.training.body":
      "The training catalog is dynamic and managed through the secure admin dashboard backed by PostgreSQL and Prisma. All API CULTURE programs are designed for hands-on learning.",
    "home.events.eyebrow": "Events",
    "home.events.title": "Workshops and public programs",
    "home.events.body":
      "Publish orientations, workshops, and field sessions with dynamic event detail pages hosted by API CULTURE.",
    "about.eyebrow": "About",
    "about.title": "An institutional center for apiculture capability",
    "about.body":
      "API Culture Technology Center (Bee Keeping) operates as API CULTURE in Rajendranagar, Hyderabad, supporting scientific beekeeping training, field demonstration, rural livelihood enablement, and technology awareness.",
    "about.copy1":
      "National Institute of Rural Development & Panchayati Raj, Ministry of Rural Development, Government of India",
    "about.copy2":
      "The website is designed for long-term institutional use: structured pages, dynamic training and event publishing, secure environment variables, validated backend handling, and deployment-ready documentation for GitHub, Vercel, PostgreSQL, and GoDaddy DNS.",
    "about.copy3":
      "API CULTURE focuses on empowering beekeepers through training, technology transfer, and sustainable apiculture practices.",
    "programs.eyebrow": "Training programs",
    "programs.title": "Professional beekeeping training catalog",
    "programs.body":
      "API CULTURE offers comprehensive training programs managed from the admin dashboard and rendered with dynamic routes for search-friendly public access.",
    "programs.seats": "seats",
    "programs.back": "Training programs",
    "programs.detail.capacity": "Capacity",
    "programs.detail.duration": "Duration",
    "programs.detail.fee": "Fee",
    "programs.detail.fallbackFee": "As notified",
    "programs.detail.foundationBadge": "Live apiary foundation",
    "programs.detail.queenBadge": "Queen line development",
    "events.page.title": "Workshops, orientations, and field sessions",
    "events.page.body":
      "API CULTURE publishes timely events with structured status, dates, locations, and detailed public pages for all participants.",
    "events.back": "Events",
    "gallery.eyebrow": "Gallery",
    "gallery.title": "Visual record of the center",
    "gallery.body":
      "API CULTURE gallery showcases field photos, event documentation, training batches, and infrastructure images from our beekeeping technology center.",
    "gallery.image1": "Center signboard",
    "gallery.image2": "Apiary learning space",
    "gallery.image3": "Training campus",
    "contact.eyebrow": "Contact",
    "contact.title": "Reach API CULTURE",
    "contact.body":
      "Use the secure contact form or the official contact details from the center. Our team at API CULTURE is ready to assist with inquiries about programs, training, and partnerships.",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.website": "Website",
    "contact.form.name": "Full name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone",
    "contact.form.subject": "Subject",
    "contact.form.message": "Message",
    "contact.form.submit": "Send message",
    "contact.form.submitting": "Submitting",
    "contact.form.success":
      "Your message has been recorded. The center team will respond through the provided contact details.",
    "contact.form.error": "Unable to submit the form right now. Please try again.",
    "footer.programs": "Training programs",
    "footer.events": "Events and workshops",
    "footer.contact": "Contact the center",
    "footer.designedBy": "Designed by Solution Architect:",
    "footer.youtube": "YouTube",
    "footer.instagram": "Insta",
    "footer.facebook": "Facebook",
    "program.level.FOUNDATION": "Foundation",
    "program.level.ADVANCED": "Advanced",
    "program.level.PROFESSIONAL": "Professional",
    "event.status.UPCOMING": "Upcoming",
    "event.status.COMPLETED": "Completed",
    "event.status.CANCELLED": "Cancelled",
    "program.slug.scientific-beekeeping-foundation.title": "Beekeeping",
    "program.slug.scientific-beekeeping-foundation.summary":
      "Practical training covering colony biology, hive handling, safety, seasonal care, and honey hygiene.",
    "program.slug.scientific-beekeeping-foundation.description":
      "A field-led foundation program for farmers, self-help groups, youth entrepreneurs, and institutional trainees. Participants learn bee biology, apiary layout, hive inspection, protective practices, harvesting hygiene, and responsible colony care.",
    "program.slug.queen-rearing-and-colony-multiplication.title": "Queen Rearing & Colony Multiplication",
    "program.slug.queen-rearing-and-colony-multiplication.summary":
      "Advanced instruction on selection, grafting, nucleus colonies, and sustainable apiary expansion.",
    "program.slug.queen-rearing-and-colony-multiplication.description":
      "Designed for trained beekeepers and extension teams, this module focuses on genetic selection, grafting discipline, mating yard preparation, nucleus management, and record-led colony multiplication.",
    "event.slug.apiculture-technology-orientation.title": "Apiculture Technology Orientation",
    "event.slug.apiculture-technology-orientation.summary":
      "Open orientation on modern beekeeping, honey value chains, and rural enterprise opportunities.",
    "event.slug.apiculture-technology-orientation.description":
      "A public orientation for prospective trainees, farmer groups, and partner institutions. Sessions include center briefing, equipment demonstrations, and guidance on training enrollment.",
  },
  te: {
    "lang.label": "భాష",
    "lang.en": "English",
    "lang.te": "తెలుగు",
    "lang.hi": "हिन्दी",
    "nav.home": "హోమ్",
    "nav.about": "గురించి",
    "nav.training": "శిక్షణ",
    "nav.events": "ఈవెంట్లు",
    "nav.gallery": "గ్యాలరీ",
    "nav.contact": "సంప్రదించండి",
    "nav.admin": "అడ్మిన్",
    "header.techCenter": "టెక్నాలజీ సెంటర్",
    "home.hero.titlePrefix": "అధునాతన",
    "home.hero.titleHighlight": "API CULTURE",
    "home.hero.description":
      "API CULTURE శాస్త్రీయ తేనేటీగల పెంపకం శిక్షణ, గ్రామీణ ఉపాధి, వర్క్‌షాపులు మరియు సంస్థాగత భాగస్వామ్యంపై దృష్టి పెట్టిన అపికల్చర్ టెక్నాలజీ సెంటర్.",
    "home.hero.cta.training": "శిక్షణ పట్టిక",
    "home.hero.cta.mission": "మా లక్ష్యం తెలుసుకోండి",
    "home.hero.liveCampus": "ప్రాంగణ దృశ్యం",
    "home.hero.location": "స్థానం",
    "home.hero.focus": "ప్రాధాన్యం",
    "home.hero.focusText": "ప్రాయోగిక శిక్షణ, హైవ్ ప్రాక్టీస్, గ్రామీణ ఉపాధి",
    "home.hero.stats": "శిక్షణ మరియు ఫీల్డ్ సామర్థ్య మార్గాలు",
    "home.cards.training.title": "ప్రాయోగిక శిక్షణ",
    "home.cards.training.text": "సంఘటిత తేనేటీగల పెంపక కార్యక్రమాలు",
    "home.cards.workshops.title": "వర్క్‌షాపులు",
    "home.cards.workshops.text": "ఈవెంట్లు మరియు పరిచయ సమావేశాలు",
    "home.cards.tech.title": "టెక్నాలజీ సెంటర్",
    "home.cards.tech.text": "ఫీల్డ్‌కు సిద్ధమైన అపికల్చర్ పద్ధతులు",
    "home.fieldSpotlight.title": "ఫీల్డ్‌లో కనిపించిన తేనేటీగల పెంపకం",
    "home.fieldSpotlight.body":
      "API CULTURE తరగతి బోధనను ప్రత్యక్ష పరిశీలన, హైవ్ హ్యాండ్లింగ్ మరియు గ్రామీణ ఉపాధికి ఉపయోగపడే ఫీల్డ్ పద్ధతులతో కలుపుతుంది.",
    "home.fieldSpotlight.tag1": "చేతికందిన అభ్యాసం",
    "home.fieldSpotlight.tag2": "ప్రయోజనకరమైన తేనేటీగల పెంపకం",
    "home.fieldSpotlight.tag3": "ఫీల్డ్ పరిశీలన",
    "home.training.eyebrow": "శిక్షణ",
    "home.training.title": "ప్రాయోగిక అపికల్చర్ నైపుణ్యాల కోసం ప్రొఫెషనల్ కార్యక్రమాలు",
    "home.training.body":
      "శిక్షణ పట్టిక అడ్మిన్ డ్యాష్‌బోర్డ్ ద్వారా నిర్వహించబడుతుంది మరియు API CULTURE కార్యక్రమాలు అన్నీ ప్రాయోగిక అభ్యాసంపై దృష్టి పెట్టి రూపొందించబడ్డాయి.",
    "home.events.eyebrow": "ఈవెంట్లు",
    "home.events.title": "వర్క్‌షాపులు మరియు ప్రజా కార్యక్రమాలు",
    "home.events.body":
      "API CULTURE కోసం డైనమిక్ ఈవెంట్ పేజీలతో ఓరియెంటేషన్‌లు, వర్క్‌షాపులు మరియు ఫీల్డ్ సెషన్‌లను ప్రచురించండి.",
    "about.eyebrow": "గురించి",
    "about.title": "అపికల్చర్ సామర్థ్యానికి సంస్థాగత కేంద్రం",
    "about.body":
      "API Culture Technology Center (Bee Keeping) రాజేంద్రనగర్, హైదరాబాద్‌లో API CULTURE గా పనిచేస్తూ శాస్త్రీయ తేనేటీగల పెంపకం శిక్షణ, ఫీల్డ్ ప్రదర్శనలు, గ్రామీణ జీవనోపాధి మరియు టెక్నాలజీ అవగాహనకు మద్దతు ఇస్తుంది.",
    "about.copy1":
      "జాతీయ గ్రామీణాభివృద్ధి మరియు పంచాయతీరాజ్ సంస్థ, గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ, భారత ప్రభుత్వం",
    "about.copy2":
      "ఈ వెబ్‌సైట్ దీర్ఘకాలిక సంస్థాగత వినియోగం కోసం రూపొందించబడింది: క్రమబద్ధమైన పేజీలు, డైనమిక్ శిక్షణ మరియు ఈవెంట్ ప్రచురణ, సురక్షిత ఎన్విరాన్‌మెంట్ వేరియబుల్స్ మరియు డిప్లాయ్‌మెంట్‌కు సిద్ధమైన డాక్యుమెంటేషన్.",
    "about.copy3":
      "API CULTURE శిక్షణ, టెక్నాలజీ బదిలీ మరియు సుస్థిర అపికల్చర్ పద్ధతుల ద్వారా తేనేటీగల పెంపకదారులను సాధికారులుగా చేయడంపై దృష్టి పెడుతుంది.",
    "programs.eyebrow": "శిక్షణ కార్యక్రమాలు",
    "programs.title": "ప్రొఫెషనల్ తేనేటీగల పెంపక శిక్షణ పట్టిక",
    "programs.body":
      "API CULTURE లోని సమగ్ర శిక్షణ కార్యక్రమాలు అడ్మిన్ డ్యాష్‌బోర్డ్ ద్వారా నిర్వహించబడుతూ ప్రజలకు అనుకూలంగా డైనమిక్ రూట్లలో చూపబడతాయి.",
    "programs.seats": "సీట్లు",
    "programs.back": "శిక్షణ కార్యక్రమాలు",
    "programs.detail.capacity": "సామర్థ్యం",
    "programs.detail.duration": "వ్యవధి",
    "programs.detail.fee": "ఫీజు",
    "programs.detail.fallbackFee": "కేంద్రం తెలియజేసిన ప్రకారం",
    "programs.detail.foundationBadge": "ప్రత్యక్ష అపియరీ పునాది",
    "programs.detail.queenBadge": "క్వీన్ లైన్ అభివృద్ధి",
    "events.page.title": "వర్క్‌షాపులు, ఓరియెంటేషన్‌లు మరియు ఫీల్డ్ సెషన్‌లు",
    "events.page.body":
      "API CULTURE సమయానుకూల ఈవెంట్లను స్థితి, తేదీలు, ప్రదేశాలు మరియు ప్రజా వివరాలతో ప్రచురిస్తుంది.",
    "events.back": "ఈవెంట్లు",
    "gallery.eyebrow": "గ్యాలరీ",
    "gallery.title": "కేంద్రం యొక్క దృశ్య రికార్డు",
    "gallery.body":
      "API CULTURE గ్యాలరీలో ఫీల్డ్ ఫోటోలు, ఈవెంట్ డాక్యుమెంటేషన్, శిక్షణ బ్యాచ్‌లు మరియు మౌలిక సదుపాయాల చిత్రాలు ఉంటాయి.",
    "gallery.image1": "కేంద్రం సైన్‌బోర్డ్",
    "gallery.image2": "అపియరీ అభ్యాస ప్రదేశం",
    "gallery.image3": "శిక్షణ ప్రాంగణం",
    "contact.eyebrow": "సంప్రదించండి",
    "contact.title": "API CULTURE ను సంప్రదించండి",
    "contact.body":
      "సురక్షిత కాంటాక్ట్ ఫారమ్ లేదా కేంద్రం యొక్క అధికారిక వివరాలను ఉపయోగించండి. మా బృందం కార్యక్రమాలు, శిక్షణ మరియు భాగస్వామ్యాలపై సహాయం అందించడానికి సిద్ధంగా ఉంది.",
    "contact.phone": "ఫోన్",
    "contact.email": "ఈమెయిల్",
    "contact.website": "వెబ్‌సైట్",
    "contact.form.name": "పూర్తి పేరు",
    "contact.form.email": "ఈమెయిల్",
    "contact.form.phone": "ఫోన్",
    "contact.form.subject": "విషయం",
    "contact.form.message": "సందేశం",
    "contact.form.submit": "సందేశం పంపండి",
    "contact.form.submitting": "పంపుతోంది",
    "contact.form.success":
      "మీ సందేశం నమోదు చేయబడింది. కేంద్ర బృందం మీరు ఇచ్చిన సంప్రదింపు వివరాల ద్వారా స్పందిస్తుంది.",
    "contact.form.error": "ప్రస్తుతం ఫారమ్ పంపడం సాధ్యపడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
    "footer.programs": "శిక్షణ కార్యక్రమాలు",
    "footer.events": "ఈవెంట్లు మరియు వర్క్‌షాపులు",
    "footer.contact": "కేంద్రాన్ని సంప్రదించండి",
    "footer.designedBy": "డిజైన్ చేసిన వారు Solution Architect:",
    "footer.youtube": "యూట్యూబ్",
    "footer.instagram": "ఇన్‌స్టా",
    "footer.facebook": "ఫేస్‌బుక్",
    "program.level.FOUNDATION": "పునాది",
    "program.level.ADVANCED": "అధునాతన",
    "program.level.PROFESSIONAL": "ప్రొఫెషనల్",
    "event.status.UPCOMING": "రాబోయే",
    "event.status.COMPLETED": "పూర్తయింది",
    "event.status.CANCELLED": "రద్దు",
    "program.slug.scientific-beekeeping-foundation.title": "తేనేటీగల పెంపకం",
    "program.slug.scientific-beekeeping-foundation.summary":
      "కాలనీ బయాలజీ, హైవ్ హ్యాండ్లింగ్, భద్రత, ఋతుపరమైన సంరక్షణ మరియు తేనె పరిశుభ్రతపై ప్రాయోగిక శిక్షణ.",
    "program.slug.scientific-beekeeping-foundation.description":
      "రైతులు, స్వయం సహాయక బృందాలు, యువ పారిశ్రామికవేత్తలు మరియు సంస్థాగత శిక్షార్థుల కోసం ఫీల్డ్ ఆధారిత పునాది కార్యక్రమం. ఇందులో తేనేటీగల బయాలజీ, అపియరీ అమరిక, హైవ్ తనిఖీ, రక్షణ పద్ధతులు మరియు బాధ్యతాయుత కాలనీ సంరక్షణ బోధించబడుతుంది.",
    "program.slug.queen-rearing-and-colony-multiplication.title": "క్వీన్ పెంపకం & కాలనీ విస్తరణ",
    "program.slug.queen-rearing-and-colony-multiplication.summary":
      "ఎంపిక, గ్రాఫ్టింగ్, న్యూక్లియస్ కాలనీలు మరియు సుస్థిర అపియరీ విస్తరణపై అధునాతన శిక్షణ.",
    "program.slug.queen-rearing-and-colony-multiplication.description":
      "శిక్షణ పొందిన తేనేటీగల పెంపకదారులు మరియు ఎక్స్‌టెన్షన్ బృందాల కోసం రూపొందించిన ఈ మాడ్యూల్‌లో జన్యు ఎంపిక, గ్రాఫ్టింగ్ క్రమశిక్షణ, మ్యాటింగ్ యార్డ్ సిద్ధత, న్యూక్లియస్ నిర్వహణ మరియు కాలనీ విస్తరణపై దృష్టి ఉంటుంది.",
    "event.slug.apiculture-technology-orientation.title": "అపికల్చర్ టెక్నాలజీ ఓరియెంటేషన్",
    "event.slug.apiculture-technology-orientation.summary":
      "ఆధునిక తేనేటీగల పెంపకం, తేనె విలువ గొలుసులు మరియు గ్రామీణ ఉపాధి అవకాశాలపై ఓపెన్ ఓరియెంటేషన్.",
    "event.slug.apiculture-technology-orientation.description":
      "భవిష్యత్ శిక్షార్థులు, రైతు బృందాలు మరియు భాగస్వామ్య సంస్థల కోసం ప్రజా ఓరియెంటేషన్. ఇందులో కేంద్ర పరిచయం, పరికరాల ప్రదర్శనలు మరియు శిక్షణ నమోదు మార్గదర్శకం ఉంటాయి.",
  },
  hi: {
    "lang.label": "भाषा",
    "lang.en": "English",
    "lang.te": "తెలుగు",
    "lang.hi": "हिन्दी",
    "nav.home": "होम",
    "nav.about": "परिचय",
    "nav.training": "प्रशिक्षण",
    "nav.events": "कार्यक्रम",
    "nav.gallery": "गैलरी",
    "nav.contact": "संपर्क",
    "nav.admin": "एडमिन",
    "header.techCenter": "टेक्नोलॉजी सेंटर",
    "home.hero.titlePrefix": "उन्नत",
    "home.hero.titleHighlight": "API CULTURE",
    "home.hero.description":
      "API CULTURE वैज्ञानिक मधुमक्खी पालन प्रशिक्षण, ग्रामीण उद्यम, कार्यशालाओं और संस्थागत सहयोग पर केंद्रित एक एपिकल्चर टेक्नोलॉजी सेंटर है।",
    "home.hero.cta.training": "प्रशिक्षण सूची",
    "home.hero.cta.mission": "मिशन जानें",
    "home.hero.liveCampus": "कैंपस दृश्य",
    "home.hero.location": "स्थान",
    "home.hero.focus": "केंद्रबिंदु",
    "home.hero.focusText": "व्यावहारिक प्रशिक्षण, हाइव अभ्यास, ग्रामीण उद्यम",
    "home.hero.stats": "प्रशिक्षण और फील्ड क्षमता मार्ग",
    "home.cards.training.title": "व्यावहारिक प्रशिक्षण",
    "home.cards.training.text": "संरचित मधुमक्खी पालन कार्यक्रम",
    "home.cards.workshops.title": "कार्यशालाएँ",
    "home.cards.workshops.text": "कार्यक्रम और परिचय सत्र",
    "home.cards.tech.title": "टेक्नोलॉजी सेंटर",
    "home.cards.tech.text": "फील्ड के लिए तैयार एपिकल्चर पद्धतियाँ",
    "home.fieldSpotlight.title": "मैदान में कैद मधुमक्खी पालन अभ्यास",
    "home.fieldSpotlight.body":
      "API CULTURE कक्षा शिक्षण को प्रत्यक्ष अवलोकन, हाइव हैंडलिंग और ऐसे फील्ड तरीकों से जोड़ता है जिन्हें शिक्षार्थी ग्रामीण उद्यम और संस्थागत प्रशिक्षण में उपयोग कर सकें।",
    "home.fieldSpotlight.tag1": "हैंड्स-ऑन लर्निंग",
    "home.fieldSpotlight.tag2": "व्यावहारिक मधुमक्खी पालन",
    "home.fieldSpotlight.tag3": "मैदान अवलोकन",
    "home.training.eyebrow": "प्रशिक्षण",
    "home.training.title": "व्यावहारिक एपिकल्चर क्षमता के लिए पेशेवर कार्यक्रम",
    "home.training.body":
      "प्रशिक्षण सूची सुरक्षित एडमिन डैशबोर्ड द्वारा संचालित होती है और API CULTURE के सभी कार्यक्रम व्यावहारिक सीखने के लिए तैयार किए गए हैं।",
    "home.events.eyebrow": "कार्यक्रम",
    "home.events.title": "कार्यशालाएँ और सार्वजनिक कार्यक्रम",
    "home.events.body":
      "API CULTURE के लिए डायनेमिक इवेंट पेजों के साथ ओरिएंटेशन, कार्यशालाएँ और फील्ड सत्र प्रकाशित करें।",
    "about.eyebrow": "परिचय",
    "about.title": "एपिकल्चर क्षमता के लिए एक संस्थागत केंद्र",
    "about.body":
      "API Culture Technology Center (Bee Keeping) राजेंद्रनगर, हैदराबाद में API CULTURE के रूप में कार्य करता है और वैज्ञानिक मधुमक्खी पालन प्रशिक्षण, फील्ड प्रदर्शन, ग्रामीण आजीविका और टेक्नोलॉजी जागरूकता को समर्थन देता है।",
    "about.copy1":
      "राष्ट्रीय ग्रामीण विकास एवं पंचायती राज संस्थान, ग्रामीण विकास मंत्रालय, भारत सरकार",
    "about.copy2":
      "यह वेबसाइट दीर्घकालिक संस्थागत उपयोग के लिए बनाई गई है: संरचित पेज, डायनेमिक प्रशिक्षण और कार्यक्रम प्रकाशन, सुरक्षित एनवायरनमेंट वेरिएबल्स और डिप्लॉयमेंट-तैयार दस्तावेज़ीकरण।",
    "about.copy3":
      "API CULTURE प्रशिक्षण, तकनीकी हस्तांतरण और सतत एपिकल्चर पद्धतियों के माध्यम से मधुमक्खी पालकों को सशक्त बनाने पर केंद्रित है।",
    "programs.eyebrow": "प्रशिक्षण कार्यक्रम",
    "programs.title": "पेशेवर मधुमक्खी पालन प्रशिक्षण सूची",
    "programs.body":
      "API CULTURE में व्यापक प्रशिक्षण कार्यक्रम एडमिन डैशबोर्ड से संचालित होते हैं और सार्वजनिक उपयोग के लिए डायनेमिक रूट्स में प्रस्तुत किए जाते हैं।",
    "programs.seats": "सीटें",
    "programs.back": "प्रशिक्षण कार्यक्रम",
    "programs.detail.capacity": "क्षमता",
    "programs.detail.duration": "अवधि",
    "programs.detail.fee": "शुल्क",
    "programs.detail.fallbackFee": "केंद्र की सूचना अनुसार",
    "programs.detail.foundationBadge": "लाइव एपियरी फाउंडेशन",
    "programs.detail.queenBadge": "क्वीन लाइन विकास",
    "events.page.title": "कार्यशालाएँ, ओरिएंटेशन और फील्ड सत्र",
    "events.page.body":
      "API CULTURE समयानुकूल कार्यक्रमों को स्थिति, तिथि, स्थान और विस्तृत सार्वजनिक पेजों के साथ प्रकाशित करता है।",
    "events.back": "कार्यक्रम",
    "gallery.eyebrow": "गैलरी",
    "gallery.title": "केंद्र का दृश्य अभिलेख",
    "gallery.body":
      "API CULTURE गैलरी में फील्ड फ़ोटो, कार्यक्रम दस्तावेज़, प्रशिक्षण बैच और आधारभूत संरचना के दृश्य शामिल हैं।",
    "gallery.image1": "केंद्र साइनबोर्ड",
    "gallery.image2": "एपियरी सीखने का स्थान",
    "gallery.image3": "प्रशिक्षण परिसर",
    "contact.eyebrow": "संपर्क",
    "contact.title": "API CULTURE से संपर्क करें",
    "contact.body":
      "सुरक्षित संपर्क फ़ॉर्म या केंद्र की आधिकारिक जानकारी का उपयोग करें। हमारी टीम कार्यक्रमों, प्रशिक्षण और साझेदारियों के बारे में सहायता के लिए तैयार है।",
    "contact.phone": "फोन",
    "contact.email": "ईमेल",
    "contact.website": "वेबसाइट",
    "contact.form.name": "पूरा नाम",
    "contact.form.email": "ईमेल",
    "contact.form.phone": "फोन",
    "contact.form.subject": "विषय",
    "contact.form.message": "संदेश",
    "contact.form.submit": "संदेश भेजें",
    "contact.form.submitting": "भेजा जा रहा है",
    "contact.form.success":
      "आपका संदेश दर्ज कर लिया गया है। केंद्र की टीम दिए गए संपर्क विवरणों पर उत्तर देगी।",
    "contact.form.error": "अभी फ़ॉर्म जमा नहीं हो सका। कृपया फिर से प्रयास करें।",
    "footer.programs": "प्रशिक्षण कार्यक्रम",
    "footer.events": "कार्यक्रम और कार्यशालाएँ",
    "footer.contact": "केंद्र से संपर्क करें",
    "footer.designedBy": "डिज़ाइन: Solution Architect:",
    "footer.youtube": "यूट्यूब",
    "footer.instagram": "इंस्टा",
    "footer.facebook": "फेसबुक",
    "program.level.FOUNDATION": "बुनियादी",
    "program.level.ADVANCED": "उन्नत",
    "program.level.PROFESSIONAL": "पेशेवर",
    "event.status.UPCOMING": "आगामी",
    "event.status.COMPLETED": "पूर्ण",
    "event.status.CANCELLED": "रद्द",
    "program.slug.scientific-beekeeping-foundation.title": "मधुमक्खी पालन",
    "program.slug.scientific-beekeeping-foundation.summary":
      "कालोनी जीवविज्ञान, हाइव हैंडलिंग, सुरक्षा, मौसमी देखभाल और शहद स्वच्छता पर व्यावहारिक प्रशिक्षण।",
    "program.slug.scientific-beekeeping-foundation.description":
      "किसानों, स्वयं सहायता समूहों, युवा उद्यमियों और संस्थागत प्रशिक्षुओं के लिए फील्ड-आधारित बुनियादी कार्यक्रम। इसमें मधुमक्खी जीवविज्ञान, एपियरी लेआउट, हाइव निरीक्षण, सुरक्षा अभ्यास और जिम्मेदार कालोनी देखभाल सिखाई जाती है।",
    "program.slug.queen-rearing-and-colony-multiplication.title": "क्वीन पालन और कालोनी विस्तार",
    "program.slug.queen-rearing-and-colony-multiplication.summary":
      "चयन, ग्राफ्टिंग, न्यूक्लियस कालोनियों और सतत एपियरी विस्तार पर उन्नत प्रशिक्षण।",
    "program.slug.queen-rearing-and-colony-multiplication.description":
      "प्रशिक्षित मधुमक्खी पालकों और एक्सटेंशन टीमों के लिए तैयार यह मॉड्यूल आनुवंशिक चयन, ग्राफ्टिंग अनुशासन, मेटिंग यार्ड तैयारी, न्यूक्लियस प्रबंधन और कालोनी विस्तार पर केंद्रित है।",
    "event.slug.apiculture-technology-orientation.title": "एपिकल्चर टेक्नोलॉजी ओरिएंटेशन",
    "event.slug.apiculture-technology-orientation.summary":
      "आधुनिक मधुमक्खी पालन, शहद मूल्य श्रृंखला और ग्रामीण उद्यम अवसरों पर खुला परिचय कार्यक्रम।",
    "event.slug.apiculture-technology-orientation.description":
      "भावी प्रशिक्षुओं, किसान समूहों और साझेदार संस्थानों के लिए सार्वजनिक ओरिएंटेशन। इसमें केंद्र परिचय, उपकरण प्रदर्शन और प्रशिक्षण नामांकन मार्गदर्शन शामिल है।",
  },
};

export function t(language: SiteLanguage, key: string): string {
  return translations[language][key] ?? translations.en[key] ?? key;
}

export function getTranslatedProgramContent<
  T extends { slug: string; title: string; summary: string; description: string; level: string }
>(program: T, language: SiteLanguage) {
  const baseKey = `program.slug.${program.slug}`;
  return {
    ...program,
    title: translations[language][`${baseKey}.title`] ?? translations.en[`${baseKey}.title`] ?? program.title,
    summary:
      translations[language][`${baseKey}.summary`] ??
      translations.en[`${baseKey}.summary`] ??
      program.summary,
    description:
      translations[language][`${baseKey}.description`] ??
      translations.en[`${baseKey}.description`] ??
      program.description,
    level: t(language, `program.level.${program.level}`),
  };
}

export function getTranslatedEventContent<
  T extends { slug: string; title: string; summary: string; description: string; status: string }
>(event: T, language: SiteLanguage) {
  const baseKey = `event.slug.${event.slug}`;
  return {
    ...event,
    title: translations[language][`${baseKey}.title`] ?? translations.en[`${baseKey}.title`] ?? event.title,
    summary:
      translations[language][`${baseKey}.summary`] ??
      translations.en[`${baseKey}.summary`] ??
      event.summary,
    description:
      translations[language][`${baseKey}.description`] ??
      translations.en[`${baseKey}.description`] ??
      event.description,
    status: t(language, `event.status.${event.status}`),
  };
}
