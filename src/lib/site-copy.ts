import type { SiteLanguage } from "@/lib/i18n";

type HomeCard = {
  title: string;
  text: string;
};

type ValueCard = {
  title: string;
  body: string;
};

type AboutMember = {
  name: string;
  designation: string;
  role: string;
  highlights: string[];
};

type AboutMemberGroup = {
  title: string;
  eyebrow: string;
  badge: string;
  members: AboutMember[];
};

type SiteCopy = {
  layout: {
    articlesLabel: string;
  };
  home: {
    heroTitle: [string, string];
    heroDescription: string;
    primaryCta: string;
    secondaryCta: string;
    stats: [string, string, string];
    locationChip: string;
    portalChip: string;
    cards: [HomeCard, HomeCard, HomeCard, HomeCard];
    whyEyebrow: string;
    whyTitle: string;
    whyBody: string;
    values: [ValueCard, ValueCard];
    fieldEyebrow: string;
    fieldTitle: string;
    galleryCta: string;
    galleryLabels: [string, string, string, string];
  };
  about: {
    heroTitle: string;
    heroBody: string;
    badges: [string, string, string];
    collaboratorsTitle: string;
    collaboratorsBody: string;
    believeTitle: string;
    believeBody: string;
    beliefCards: [HomeCard, HomeCard, HomeCard, HomeCard];
    believeClosing: string;
    missionQuote: string;
    missionVoiceLabel: string;
    missionVoiceNote: string;
    joinTitle: string;
    joinBody: string;
    joinPrimaryCta: string;
    joinSecondaryCta: string;
    storyTitle: string;
    storyParagraphs: [string, string];
    storyFacts: [{ label: string; value: string }, { label: string; value: string }, { label: string; value: string }];
    peopleEyebrow: string;
    peopleTitle: string;
    peopleBody: string;
    peopleGroups: [AboutMemberGroup, AboutMemberGroup];
    profileLabel: string;
    moreTitle: string;
    moreCards: [ValueCard, ValueCard, ValueCard, ValueCard];
  };
  articles: {
    eyebrow: string;
    title: string;
    body: string;
    sidebarEyebrow: string;
    sidebarCards: [HomeCard, HomeCard];
    readArticle: string;
    emptyTitle: string;
    emptyBody: string;
  };
  footer: {
    quickLinksLabel: string;
    policyLinksLabel: string;
    socialLabel: string;
    policies: string;
    callCenter: string;
    emailTeam: string;
    officialWebsite: string;
    instagramHandle: string;
    youtubeHandle: string;
    designedDevelopedBy: string;
  };
  policies: {
    title: string;
    body: string;
    updatedLabel: string;
    cardEyebrow: string;
    openPage: string;
  };
};

const siteCopy: Record<SiteLanguage, SiteCopy> = {
  en: {
    layout: {
      articlesLabel: "Articles",
    },
    home: {
      heroTitle: ["The Future of Indian Apiculture.", ""],
      heroDescription:
        "To the hands that feed the nation, we bring the science of liquid gold! API CULTURE is the dawn of your prosperity.",
      primaryCta: "View programs",
      secondaryCta: "About the center",
      stats: ["Years active", "Seats per batch", "Current program tracks"],
      locationChip: "Rajendranagar, Hyderabad",
      portalChip: "Public-facing training portal",
      cards: [
        {
          title: "Applied training",
          text: "Programs designed around field readiness, not brochure talk.",
        },
        {
          title: "Current batches",
          text: "Clear batch-led enrollment with direct progression to payment.",
        },
        {
          title: "Practical methods",
          text: "Scientific beekeeping, processing, and specialized production tracks.",
        },
        {
          title: "Institutional backing",
          text: "Anchored within a national public-sector development ecosystem.",
        },
      ],
      whyEyebrow: "Why this matters",
      whyTitle: "Strong beekeeping systems create value far beyond honey.",
      whyBody:
        "Practical apiculture strengthens pollination, creates rural income, and supports more resilient production systems. A training center should make that value visible in the field and online.",
      values: [
        {
          title: "Pollination",
          body: "Healthy colonies support better flowering, fruit set, and crop confidence.",
        },
        {
          title: "Livelihoods",
          body: "Honey, wax, and allied products open local earning pathways when training is solid.",
        },
      ],
      fieldEyebrow: "From the field",
      fieldTitle: "A sharper public face for a real training ecosystem.",
      galleryCta: "Open gallery",
      galleryLabels: [
        "Center signboard",
        "Field beekeeping",
        "Scientific beekeeping foundation",
        "Queen rearing and colony multiplication",
      ],
    },
    about: {
      heroTitle: "We help honey farming grow through learning, technology, and field support.",
      heroBody:
        "API Culture Technology Center operates in Rajendranagar, Hyderabad as a practical beekeeping mission built around training, technology transfer, pollination awareness, and rural livelihood support.",
      badges: ["Established in 2004", "NIRDPR-linked mission", "Field-first apiculture"],
      collaboratorsTitle: "Learn from leading institutional and field collaborators",
      collaboratorsBody:
        "The center works through a shared ecosystem that includes NIRDPR, practical beekeeping leadership, technical support partners, and field-driven rural training activity.",
      believeTitle: "We believe",
      believeBody: "Learning is the source of practical progress in honey farming and rural apiculture.",
      beliefCards: [
        {
          title: "Rural livelihoods matter",
          text: "Beekeeping creates an income-support pathway for farmers, women, tribal communities, and future rural entrepreneurs.",
        },
        {
          title: "Pollination improves outcomes",
          text: "Managed bee activity supports crop productivity and strengthens the wider agricultural ecosystem around farming communities.",
        },
        {
          title: "Training must stay practical",
          text: "The center combines field demonstrations, technology transfer, colony care, processing awareness, and guided learning.",
        },
        {
          title: "Institutional support builds trust",
          text: "The mission is strengthened by NIRDPR, beekeeping leadership, and long-term technical support around apiculture practice.",
        },
      ],
      believeClosing:
        "So that farmers, trainees, and rural communities can build stronger futures through apiculture.",
      missionQuote:
        "API CULTURE was established to connect practical beekeeping training with pollination support, field confidence, and rural livelihood opportunity across communities that need sustainable income pathways.",
      missionVoiceLabel: "Mission voice",
      missionVoiceNote: "Drawn from the center's 2025 profile and institutional mission narrative.",
      joinTitle: "Join the community and start learning today",
      joinBody:
        "Explore the center's training pathways, technology guidance, and rural support mission through API CULTURE.",
      joinPrimaryCta: "View training",
      joinSecondaryCta: "Contact the center",
      storyTitle: "Our story",
      storyParagraphs: [
        "Api Culture Technology Center was established in 2004 at Rural Technology Park in association with NIRDPR, with technical support from the Bee Keepers Association and Kavuri. The center presents itself as a practical mission for training, technology transfer, pollination, and livelihood support across rural communities.",
        "The mission grows through scientific beekeeping, honey processing, queen rearing, hive product awareness, equipment access, and public-facing apiculture education. It is designed to help farmers and future beekeeping entrepreneurs build more confident and sustainable pathways.",
      ],
      storyFacts: [
        { label: "Established", value: "2004" },
        { label: "Partners", value: "3" },
        { label: "Focus", value: "Training, pollination, technology transfer" },
      ],
      peopleEyebrow: "People Behind the Mission",
      peopleTitle: "Leadership, faculty, and technical guidance",
      peopleBody:
        "The center's mission is backed by experienced beekeeping leaders, faculty members, and senior technical advisors who guide training, field practice, and institutional continuity.",
      peopleGroups: [
        {
          title: "Leadership and committee",
          eyebrow: "Direction and governance",
          badge: "Verified profile roles",
          members: [
            {
              name: "K. Sambashiva Rao",
              designation: "President, Bee Keepers Association | Faculty Member and Field Expert",
              role: "Brings around 40 years of beekeeping experience with emphasis on field practice, bee breeding, colony management, and migration support.",
              highlights: ["40 years experience", "National Bee Board member", "Field expert"],
            },
            {
              name: "P. Ravindra Kumar",
              designation: "Director, Api Culture Technology Center | Vice President, Bee Keepers Association",
              role: "Supports center direction through training leadership across scientific beekeeping, honey processing, queen rearing, migration, and awareness work.",
              highlights: ["26 years experience", "Director and faculty", "Training lead"],
            },
          ],
        },
        {
          title: "Faculty and technical advisors",
          eyebrow: "Training and science support",
          badge: "Verified profile roles",
          members: [
            {
              name: "P. Sita Rathnam",
              designation: "Faculty Member, Api Culture Technology Center",
              role: "Supports queen rearing, royal jelly collection, and honey processing and packing technology training through practical sessions.",
              highlights: ["15 years experience", "MBA", "Practical training support"],
            },
            {
              name: "K. Subba Rao",
              designation: "Senior Scientist and Technical Adviser | Faculty Member",
              role: "Contributes long-standing scientific and R&D knowledge across beekeeping subjects with senior technical credibility.",
              highlights: ["50 years experience", "Retd. scientist", "Technical adviser"],
            },
          ],
        },
      ],
      profileLabel: "Profile",
      moreTitle: "More about API CULTURE",
      moreCards: [
        {
          title: "Mission and focus",
          body: "Scientific beekeeping, technology awareness, practical training, pollination support, and livelihood development.",
        },
        {
          title: "What the center teaches",
          body: "Honey processing, queen rearing, hive products, equipment exposure, and field-ready apiary practice.",
        },
        {
          title: "Who the mission supports",
          body: "Farmers, rural youth, women groups, tribal communities, trainees, and future beekeeping entrepreneurs.",
        },
        {
          title: "Why it matters",
          body: "It connects apiculture training with income, crop support, pollination awareness, and confidence in rural technology.",
        },
      ],
    },
    articles: {
      eyebrow: "Articles",
      title: "Field notes, training writeups, and center updates",
      body:
        "Articles published from the admin dashboard now flow directly into this page, so the public site and admin panel share the same source.",
      sidebarEyebrow: "What this connects",
      sidebarCards: [
        {
          title: "Admin to public site",
          text: "Articles created in admin can now appear here without manual UI-only edits.",
        },
        {
          title: "Single content source",
          text: "Published entries come from the shared backend path instead of placeholder cards.",
        },
      ],
      readArticle: "Read article",
      emptyTitle: "No articles are published yet",
      emptyBody: "Create and publish articles from the admin dashboard to populate this page.",
    },
    footer: {
      quickLinksLabel: "Explore",
      policyLinksLabel: "Policy links",
      socialLabel: "Social channels",
      policies: "Policies",
      callCenter: "Call the center",
      emailTeam: "Email the team",
      officialWebsite: "Official website",
      instagramHandle: "honey2health",
      youtubeHandle: "@ApiCultureTechCenter",
      designedDevelopedBy: "Designed & Developed by",
    },
    policies: {
      title: "Public policies for applications, payments, privacy, and service use.",
      body:
        "These pages are published for payment onboarding, training enrollment transparency, and general public access.",
      updatedLabel: "Last updated",
      cardEyebrow: "Policy page",
      openPage: "Open page",
    },
  },
  te: {
    layout: {
      articlesLabel: "వ్యాసాలు",
    },
    home: {
      heroTitle: ["భారతీయ అపికల్చర్ యొక్క భవిష్యత్తు.", ""],
      heroDescription:
        "API CULTURE శాస్త్రీయ తేనెటీగల పెంపకం శిక్షణ, గ్రామీణ ఉపాధి, వర్క్‌షాప్‌లు మరియు సంస్థాగత సహకారం కోసం రూపొందించిన ప్రాయోగిక అపికల్చర్ టెక్నాలజీ కేంద్రం. నమోదు ప్రక్రియ ఇప్పుడు నిజమైన చెల్లింపు ప్రవాహంతో మరింత స్పష్టంగా, వేగంగా కలుస్తుంది.",
      primaryCta: "కార్యక్రమాలు చూడండి",
      secondaryCta: "కేంద్రం గురించి",
      stats: ["సంవత్సరాల అనుభవం", "ప్రతి బ్యాచ్ సీట్లు", "ప్రస్తుత ప్రోగ్రామ్ ట్రాక్‌లు"],
      locationChip: "రాజేంద్రనగర్, హైదరాబాద్",
      portalChip: "ప్రజలకు అందుబాటులో ఉన్న శిక్షణ పోర్టల్",
      cards: [
        {
          title: "ప్రాయోగిక శిక్షణ",
          text: "బ్రోచర్ మాటలకు కాదు, ఫీల్డ్ సిద్ధతకు అనుగుణంగా రూపొందించిన కార్యక్రమాలు.",
        },
        {
          title: "ప్రస్తుత బ్యాచ్‌లు",
          text: "బ్యాచ్ ఆధారిత నమోదు నుంచి చెల్లింపువరకు స్పష్టమైన మార్గం.",
        },
        {
          title: "ప్రాక్టికల్ పద్ధతులు",
          text: "శాస్త్రీయ తేనెటీగల పెంపకం, ప్రాసెసింగ్ మరియు ప్రత్యేక శిక్షణ మార్గాలు.",
        },
        {
          title: "సంస్థాగత మద్దతు",
          text: "జాతీయ ప్రజా రంగ అభివృద్ధి వ్యవస్థలో నిలిచిన విశ్వసనీయ ఆధారం.",
        },
      ],
      whyEyebrow: "ఇది ఎందుకు ముఖ్యము",
      whyTitle: "బలమైన తేనెటీగల పెంపకం వ్యవస్థలు తేనెకు మించిన విలువను సృష్టిస్తాయి.",
      whyBody:
        "ప్రాయోగిక అపికల్చర్ పరాగసంపర్కాన్ని బలపరుస్తుంది, గ్రామీణ ఆదాయాన్ని పెంచుతుంది, మరియు వ్యవసాయ వ్యవస్థలను మరింత నిలకడగా మారుస్తుంది. ఈ విలువ ఫీల్డ్‌లోనూ, ఆన్‌లైన్‌లోనూ కనిపించాలి.",
      values: [
        {
          title: "పరాగసంపర్కం",
          body: "ఆరోగ్యకరమైన కాలనీలు మంచి పుష్పించడం, ఫలధారణ మరియు పంట నమ్మకాన్ని పెంచుతాయి.",
        },
        {
          title: "ఉపాధి",
          body: "మంచి శిక్షణతో తేనె, వెక్స్ మరియు అనుబంధ ఉత్పత్తులు స్థానిక ఆదాయ మార్గాలను తెరుస్తాయి.",
        },
      ],
      fieldEyebrow: "ఫీల్డ్ నుంచి",
      fieldTitle: "నిజమైన శిక్షణ వ్యవస్థకు మరింత స్పష్టమైన ప్రజా ముఖచిత్రం.",
      galleryCta: "గ్యాలరీ తెరవండి",
      galleryLabels: [
        "కేంద్రం సైన్‌బోర్డ్",
        "ఫీల్డ్ తేనెటీగల పెంపకం",
        "శాస్త్రీయ తేనెటీగల శిక్షణ",
        "క్వీన్ రేరింగ్ మరియు కాలనీ విస్తరణ",
      ],
    },
    about: {
      heroTitle: "అభ్యాసం, సాంకేతికత మరియు ఫీల్డ్ మద్దతుతో తేనె ఆధారిత వ్యవసాయాన్ని ముందుకు తీసుకెళ్తాము.",
      heroBody:
        "API Culture Technology Center రాజేంద్రనగర్, హైదరాబాద్‌లో శిక్షణ, సాంకేతిక బదిలీ, పరాగసంపర్క అవగాహన మరియు గ్రామీణ ఉపాధి మద్దతుపై ఆధారపడిన ప్రాయోగిక తేనెటీగల మిషన్‌గా పనిచేస్తుంది.",
      badges: ["2004లో స్థాపితం", "NIRDPR అనుబంధ మిషన్", "ఫీల్డ్-ఫస్ట్ అపికల్చర్"],
      collaboratorsTitle: "సంస్థాగత మరియు ఫీల్డ్ భాగస్వాముల నుంచి నేర్చుకోండి",
      collaboratorsBody:
        "ఈ కేంద్రం NIRDPR, ప్రాయోగిక తేనెటీగల నాయకత్వం, సాంకేతిక భాగస్వాములు మరియు గ్రామీణ శిక్షణ కార్యకలాపాలతో కూడిన భాగస్వామ్య వ్యవస్థ ద్వారా పనిచేస్తుంది.",
      believeTitle: "మా నమ్మకం",
      believeBody: "అభ్యాసమే తేనె ఆధారిత వ్యవసాయం మరియు గ్రామీణ అపికల్చర్‌లో ప్రాయోగిక పురోగతికి మూలం.",
      beliefCards: [
        {
          title: "గ్రామీణ ఉపాధి ముఖ్యం",
          text: "తేనెటీగల పెంపకం రైతులు, మహిళలు, గిరిజన సమూహాలు మరియు యువ గ్రామీణ వ్యాపారులకు ఆదాయ మార్గాన్ని అందిస్తుంది.",
        },
        {
          title: "పరాగసంపర్కం ఫలితాలను మెరుగుపరుస్తుంది",
          text: "నిర్వహిత తేనెటీగల చలనం పంట దిగుబడిని మరియు వ్యవసాయ పరిసర వ్యవస్థను బలపరుస్తుంది.",
        },
        {
          title: "శిక్షణ ప్రాయోగికంగా ఉండాలి",
          text: "ఈ కేంద్రం ఫీల్డ్ ప్రదర్శనలు, సాంకేతిక బదిలీ, కాలనీ సంరక్షణ మరియు మార్గనిర్దేశిత అభ్యాసాన్ని కలిపి అందిస్తుంది.",
        },
        {
          title: "సంస్థాగత మద్దతు నమ్మకాన్ని పెంచుతుంది",
          text: "ఈ మిషన్‌ను NIRDPR, తేనెటీగల నిపుణులు మరియు దీర్ఘకాలిక సాంకేతిక మద్దతు బలపరుస్తున్నాయి.",
        },
      ],
      believeClosing: "రైతులు, శిక్షార్థులు మరియు గ్రామీణ సమాజాలు అపికల్చర్ ద్వారా బలమైన భవిష్యత్తును నిర్మించేందుకు.",
      missionQuote:
        "API CULTURE ప్రాయోగిక తేనెటీగల శిక్షణను పరాగసంపర్క మద్దతు, ఫీల్డ్ నమ్మకం మరియు గ్రామీణ ఉపాధి అవకాశాలతో కలిపేందుకు స్థాపించబడింది.",
      missionVoiceLabel: "మిషన్ స్వరం",
      missionVoiceNote: "కేంద్రం 2025 ప్రొఫైల్ మరియు సంస్థాగత మిషన్ వివరణ ఆధారంగా రూపొందించబడింది.",
      joinTitle: "సమాజంలో చేరి ఈరోజే నేర్చుకోవడం ప్రారంభించండి",
      joinBody: "API CULTURE ద్వారా కేంద్రం శిక్షణ మార్గాలు, సాంకేతిక మార్గనిర్దేశం మరియు గ్రామీణ మద్దతు మిషన్‌ను తెలుసుకోండి.",
      joinPrimaryCta: "శిక్షణ చూడండి",
      joinSecondaryCta: "కేంద్రాన్ని సంప్రదించండి",
      storyTitle: "మా కథ",
      storyParagraphs: [
        "Api Culture Technology Center 2004లో Rural Technology Parkలో NIRDPR సహకారంతో, Bee Keepers Association మరియు Kavuri సాంకేతిక మద్దతుతో స్థాపించబడింది. ఇది శిక్షణ, సాంకేతిక బదిలీ, పరాగసంపర్కం మరియు గ్రామీణ ఉపాధి మద్దతుకు ప్రాయోగిక మిషన్‌గా ఎదిగింది.",
        "ఈ మిషన్ శాస్త్రీయ తేనెటీగల పెంపకం, తేనె ప్రాసెసింగ్, క్వీన్ రేరింగ్, హైవ్ ఉత్పత్తుల అవగాహన, పరికరాల పరిచయం మరియు ప్రజలకు అందుబాటులో ఉన్న అపికల్చర్ విద్య ద్వారా ముందుకు సాగుతోంది.",
      ],
      storyFacts: [
        { label: "స్థాపితం", value: "2004" },
        { label: "భాగస్వాములు", value: "3" },
        { label: "ప్రాధాన్యం", value: "శిక్షణ, పరాగసంపర్కం, సాంకేతిక బదిలీ" },
      ],
      peopleEyebrow: "ఈ మిషన్ వెనుకవారు",
      peopleTitle: "నాయకత్వం, అధ్యాపకులు మరియు సాంకేతిక మార్గనిర్దేశం",
      peopleBody:
        "ఈ కేంద్ర మిషన్‌కు అనుభవజ్ఞులైన తేనెటీగల నిపుణులు, అధ్యాపకులు మరియు సీనియర్ సాంకేతిక సలహాదారులు మద్దతుగా ఉన్నారు.",
      peopleGroups: [
        {
          title: "నాయకత్వం మరియు కమిటీ",
          eyebrow: "దిశ మరియు పరిపాలన",
          badge: "ధృవీకరించిన పాత్రలు",
          members: [
            {
              name: "K. Sambashiva Rao",
              designation: "President, Bee Keepers Association | Faculty Member and Field Expert",
              role: "ఫీల్డ్ ప్రాక్టీస్, తేనెటీగల సంశ్లేషణ, కాలనీ నిర్వహణ మరియు మైగ్రేషన్ మద్దతుపై సుమారు 40 ఏళ్ల అనుభవం కలిగిన నిపుణుడు.",
              highlights: ["40 ఏళ్ల అనుభవం", "National Bee Board సభ్యుడు", "ఫీల్డ్ నిపుణుడు"],
            },
            {
              name: "P. Ravindra Kumar",
              designation: "Director, Api Culture Technology Center | Vice President, Bee Keepers Association",
              role: "శాస్త్రీయ తేనెటీగల పెంపకం, తేనె ప్రాసెసింగ్, క్వీన్ రేరింగ్ మరియు అవగాహన కార్యక్రమాల్లో శిక్షణ నాయకత్వం అందిస్తారు.",
              highlights: ["26 ఏళ్ల అనుభవం", "డైరెక్టర్ మరియు ఫ్యాకల్టీ", "శిక్షణ నాయకుడు"],
            },
          ],
        },
        {
          title: "అధ్యాపకులు మరియు సాంకేతిక సలహాదారులు",
          eyebrow: "శిక్షణ మరియు శాస్త్ర మద్దతు",
          badge: "ధృవీకరించిన పాత్రలు",
          members: [
            {
              name: "P. Sita Rathnam",
              designation: "Faculty Member, Api Culture Technology Center",
              role: "క్వీన్ రేరింగ్, రాయల్ జెల్లీ సేకరణ మరియు తేనె ప్రాసెసింగ్ శిక్షణలో ప్రాయోగిక మద్దతు అందిస్తున్నారు.",
              highlights: ["15 ఏళ్ల అనుభవం", "MBA", "ప్రాయోగిక శిక్షణ మద్దతు"],
            },
            {
              name: "K. Subba Rao",
              designation: "Senior Scientist and Technical Adviser | Faculty Member",
              role: "తేనెటీగల శిక్షణలో దీర్ఘకాలిక శాస్త్రీయ మరియు R&D పరిజ్ఞానంతో సీనియర్ సాంకేతిక మార్గనిర్దేశం అందిస్తున్నారు.",
              highlights: ["50 ఏళ్ల అనుభవం", "విరమణ పొందిన శాస్త్రవేత్త", "సాంకేతిక సలహాదారు"],
            },
          ],
        },
      ],
      profileLabel: "ప్రొఫైల్",
      moreTitle: "API CULTURE గురించి మరింత",
      moreCards: [
        {
          title: "మిషన్ మరియు దృష్టి",
          body: "శాస్త్రీయ తేనెటీగల పెంపకం, సాంకేతిక అవగాహన, ప్రాయోగిక శిక్షణ, పరాగసంపర్క మద్దతు మరియు ఉపాధి అభివృద్ధి.",
        },
        {
          title: "కేంద్రం ఏమి బోధిస్తుంది",
          body: "తేనె ప్రాసెసింగ్, క్వీన్ రేరింగ్, హైవ్ ఉత్పత్తులు, పరికరాల పరిచయం మరియు ఫీల్డ్‌కు సిద్ధమైన అపియరీ పద్ధతులు.",
        },
        {
          title: "ఈ మిషన్ ఎవరికి",
          body: "రైతులు, గ్రామీణ యువత, మహిళా సమూహాలు, గిరిజన సమాజాలు, శిక్షార్థులు మరియు భవిష్యత్తు తేనెటీగల వ్యాపారులు.",
        },
        {
          title: "ఇది ఎందుకు ముఖ్యం",
          body: "ఇది అపికల్చర్ శిక్షణను ఆదాయం, పంట మద్దతు, పరాగసంపర్క అవగాహన మరియు గ్రామీణ సాంకేతిక నమ్మకంతో కలుపుతుంది.",
        },
      ],
    },
    articles: {
      eyebrow: "వ్యాసాలు",
      title: "ఫీల్డ్ నోట్స్, శిక్షణ రచనలు మరియు కేంద్రం నవీకరణలు",
      body:
        "అడ్మిన్ డ్యాష్‌బోర్డ్‌లో ప్రచురించిన వ్యాసాలు ఇప్పుడు నేరుగా ఈ పేజీకి వస్తాయి, కాబట్టి ప్రజా సైట్ మరియు అడ్మిన్ ప్యానెల్ ఒకే మూలాన్ని పంచుకుంటాయి.",
      sidebarEyebrow: "ఇది ఏమి కలుపుతుంది",
      sidebarCards: [
        {
          title: "అడ్మిన్ నుంచి ప్రజా సైట్‌కు",
          text: "అడ్మిన్‌లో సృష్టించిన వ్యాసాలు ఇక మాన్యువల్ UI మార్పులు లేకుండా ఇక్కడ కనిపిస్తాయి.",
        },
        {
          title: "ఒకే కంటెంట్ మూలం",
          text: "ప్రచురించిన ఎంట్రీలు ప్లేస్‌హోల్డర్ కార్డుల బదులు షేర్డ్ బ్యాక్‌ఎండ్ మార్గం నుంచి వస్తాయి.",
        },
      ],
      readArticle: "వ్యాసం చదవండి",
      emptyTitle: "ఇంకా వ్యాసాలు ప్రచురించబడలేదు",
      emptyBody: "ఈ పేజీని నింపడానికి అడ్మిన్ డ్యాష్‌బోర్డ్‌లో వ్యాసాలు సృష్టించి ప్రచురించండి.",
    },
    footer: {
      quickLinksLabel: "అన్వేషించండి",
      policyLinksLabel: "పాలసీ లింకులు",
      socialLabel: "సోషల్ ఛానెల్లు",
      policies: "పాలసీలు",
      callCenter: "కేంద్రానికి కాల్ చేయండి",
      emailTeam: "బృందానికి ఈమెయిల్ చేయండి",
      officialWebsite: "అధికారిక వెబ్‌సైట్",
      instagramHandle: "honey2health",
      youtubeHandle: "@ApiCultureTechCenter",
      designedDevelopedBy: "డిజైన్ & డెవలప్‌మెంట్",
    },
    policies: {
      title: "దరఖాస్తులు, చెల్లింపులు, గోప్యత మరియు సేవల వినియోగానికి సంబంధించిన ప్రజా పాలసీలు.",
      body: "ఈ పేజీలు చెల్లింపు ఆన్‌బోర్డింగ్, శిక్షణ నమోదు పారదర్శకత మరియు ప్రజా ప్రాప్యత కోసం ప్రచురించబడ్డాయి.",
      updatedLabel: "చివరిసారి నవీకరణ",
      cardEyebrow: "పాలసీ పేజీ",
      openPage: "పేజీ తెరవండి",
    },
  },
  hi: {
    layout: {
      articlesLabel: "लेख",
    },
    home: {
      heroTitle: ["भारतीय एपिकल्चर का भविष्य।", ""],
      heroDescription:
        "API CULTURE वैज्ञानिक मधुमक्खी पालन प्रशिक्षण, ग्रामीण आजीविका, कार्यशालाओं और संस्थागत सहयोग के लिए बनाया गया एक व्यावहारिक एपिकल्चर टेक्नोलॉजी केंद्र है। नामांकन प्रक्रिया अब वास्तविक भुगतान प्रवाह से अधिक स्पष्ट और तेज़ तरीके से जुड़ती है।",
      primaryCta: "कार्यक्रम देखें",
      secondaryCta: "केंद्र के बारे में",
      stats: ["अनुभव के वर्ष", "प्रति बैच सीटें", "वर्तमान प्रोग्राम ट्रैक"],
      locationChip: "राजेंद्रनगर, हैदराबाद",
      portalChip: "सार्वजनिक प्रशिक्षण पोर्टल",
      cards: [
        {
          title: "व्यावहारिक प्रशिक्षण",
          text: "ब्रॉशर की बातों से नहीं, वास्तविक फील्ड तैयारी से बने कार्यक्रम।",
        },
        {
          title: "वर्तमान बैच",
          text: "बैच आधारित नामांकन से भुगतान तक स्पष्ट प्रगति मार्ग।",
        },
        {
          title: "प्रायोगिक विधियाँ",
          text: "वैज्ञानिक मधुमक्खी पालन, प्रोसेसिंग और विशेष प्रशिक्षण ट्रैक।",
        },
        {
          title: "संस्थागत आधार",
          text: "राष्ट्रीय सार्वजनिक विकास तंत्र के भीतर स्थापित विश्वसनीय समर्थन।",
        },
      ],
      whyEyebrow: "यह क्यों महत्वपूर्ण है",
      whyTitle: "मजबूत मधुमक्खी पालन प्रणालियाँ शहद से कहीं अधिक मूल्य बनाती हैं।",
      whyBody:
        "व्यावहारिक एपिकल्चर परागण को मजबूत करता है, ग्रामीण आय बढ़ाता है और उत्पादन प्रणालियों को अधिक स्थिर बनाता है। एक प्रशिक्षण केंद्र को यह मूल्य फील्ड और ऑनलाइन दोनों जगह दिखाना चाहिए।",
      values: [
        {
          title: "परागण",
          body: "स्वस्थ कालोनियाँ बेहतर फूल, फलन और फसल भरोसा बढ़ाती हैं।",
        },
        {
          title: "आजीविका",
          body: "मजबूत प्रशिक्षण के साथ शहद, मोम और संबंधित उत्पाद स्थानीय आय के अवसर खोलते हैं।",
        },
      ],
      fieldEyebrow: "फील्ड से",
      fieldTitle: "एक वास्तविक प्रशिक्षण तंत्र के लिए अधिक स्पष्ट सार्वजनिक पहचान।",
      galleryCta: "गैलरी खोलें",
      galleryLabels: [
        "केंद्र का साइनबोर्ड",
        "फील्ड मधुमक्खी पालन",
        "वैज्ञानिक मधुमक्खी पालन प्रशिक्षण",
        "क्वीन रियरिंग और कॉलोनी विस्तार",
      ],
    },
    about: {
      heroTitle: "हम सीख, तकनीक और फील्ड सहयोग के माध्यम से शहद आधारित खेती को आगे बढ़ाते हैं।",
      heroBody:
        "API Culture Technology Center राजेंद्रनगर, हैदराबाद में प्रशिक्षण, तकनीकी हस्तांतरण, परागण जागरूकता और ग्रामीण आजीविका समर्थन पर आधारित एक व्यावहारिक मधुमक्खी पालन मिशन के रूप में कार्य करता है।",
      badges: ["2004 में स्थापित", "NIRDPR से जुड़ा मिशन", "फील्ड-फर्स्ट एपिकल्चर"],
      collaboratorsTitle: "प्रमुख संस्थागत और फील्ड सहयोगियों से सीखें",
      collaboratorsBody:
        "यह केंद्र NIRDPR, व्यावहारिक मधुमक्खी पालन नेतृत्व, तकनीकी भागीदारों और ग्रामीण प्रशिक्षण गतिविधियों वाले साझा तंत्र के साथ कार्य करता है।",
      believeTitle: "हम मानते हैं",
      believeBody: "सीखना ही शहद आधारित खेती और ग्रामीण एपिकल्चर में व्यावहारिक प्रगति का स्रोत है।",
      beliefCards: [
        {
          title: "ग्रामीण आजीविका महत्वपूर्ण है",
          text: "मधुमक्खी पालन किसानों, महिलाओं, जनजातीय समुदायों और भविष्य के ग्रामीण उद्यमियों के लिए आय का मार्ग बनाता है।",
        },
        {
          title: "परागण परिणाम बेहतर करता है",
          text: "संगठित मधुमक्खी गतिविधि फसल उत्पादकता और व्यापक कृषि तंत्र को मजबूत करती है।",
        },
        {
          title: "प्रशिक्षण व्यावहारिक होना चाहिए",
          text: "केंद्र फील्ड प्रदर्शन, तकनीकी हस्तांतरण, कॉलोनी देखभाल और मार्गदर्शित सीख को साथ लाता है।",
        },
        {
          title: "संस्थागत समर्थन भरोसा बनाता है",
          text: "इस मिशन को NIRDPR, मधुमक्खी पालन नेतृत्व और दीर्घकालिक तकनीकी सहयोग मजबूत करता है।",
        },
      ],
      believeClosing: "ताकि किसान, प्रशिक्षु और ग्रामीण समुदाय एपिकल्चर के माध्यम से मजबूत भविष्य बना सकें।",
      missionQuote:
        "API CULTURE की स्थापना व्यावहारिक मधुमक्खी पालन प्रशिक्षण को परागण समर्थन, फील्ड आत्मविश्वास और ग्रामीण आजीविका अवसरों से जोड़ने के लिए की गई थी।",
      missionVoiceLabel: "मिशन की आवाज़",
      missionVoiceNote: "केंद्र की 2025 प्रोफ़ाइल और संस्थागत मिशन विवरण से लिया गया सार।",
      joinTitle: "समुदाय से जुड़ें और आज ही सीखना शुरू करें",
      joinBody: "API CULTURE के माध्यम से केंद्र के प्रशिक्षण मार्ग, तकनीकी मार्गदर्शन और ग्रामीण समर्थन मिशन को जानें।",
      joinPrimaryCta: "प्रशिक्षण देखें",
      joinSecondaryCta: "केंद्र से संपर्क करें",
      storyTitle: "हमारी कहानी",
      storyParagraphs: [
        "Api Culture Technology Center की स्थापना 2004 में Rural Technology Park में NIRDPR के सहयोग और Bee Keepers Association तथा Kavuri के तकनीकी समर्थन से हुई। यह केंद्र प्रशिक्षण, तकनीकी हस्तांतरण, परागण और ग्रामीण आजीविका समर्थन के लिए एक व्यावहारिक मिशन के रूप में विकसित हुआ।",
        "यह मिशन वैज्ञानिक मधुमक्खी पालन, शहद प्रोसेसिंग, क्वीन रियरिंग, हाइव उत्पाद जागरूकता, उपकरण परिचय और सार्वजनिक एपिकल्चर शिक्षा के माध्यम से आगे बढ़ता है।",
      ],
      storyFacts: [
        { label: "स्थापना", value: "2004" },
        { label: "साझेदार", value: "3" },
        { label: "केंद्र बिंदु", value: "प्रशिक्षण, परागण, तकनीकी हस्तांतरण" },
      ],
      peopleEyebrow: "मिशन के पीछे के लोग",
      peopleTitle: "नेतृत्व, संकाय और तकनीकी मार्गदर्शन",
      peopleBody:
        "केंद्र के मिशन को अनुभवी मधुमक्खी पालन विशेषज्ञों, संकाय सदस्यों और वरिष्ठ तकनीकी सलाहकारों का समर्थन प्राप्त है।",
      peopleGroups: [
        {
          title: "नेतृत्व और समिति",
          eyebrow: "दिशा और संचालन",
          badge: "सत्यापित भूमिका प्रोफ़ाइल",
          members: [
            {
              name: "K. Sambashiva Rao",
              designation: "President, Bee Keepers Association | Faculty Member and Field Expert",
              role: "फील्ड अभ्यास, बी ब्रीडिंग, कॉलोनी प्रबंधन और माइग्रेशन सहयोग पर लगभग 40 वर्षों का अनुभव रखते हैं।",
              highlights: ["40 वर्ष अनुभव", "National Bee Board सदस्य", "फील्ड विशेषज्ञ"],
            },
            {
              name: "P. Ravindra Kumar",
              designation: "Director, Api Culture Technology Center | Vice President, Bee Keepers Association",
              role: "वैज्ञानिक मधुमक्खी पालन, शहद प्रोसेसिंग, क्वीन रियरिंग, माइग्रेशन और जागरूकता कार्यों में प्रशिक्षण नेतृत्व प्रदान करते हैं।",
              highlights: ["26 वर्ष अनुभव", "निदेशक और संकाय", "प्रशिक्षण नेतृत्व"],
            },
          ],
        },
        {
          title: "संकाय और तकनीकी सलाहकार",
          eyebrow: "प्रशिक्षण और विज्ञान सहयोग",
          badge: "सत्यापित भूमिका प्रोफ़ाइल",
          members: [
            {
              name: "P. Sita Rathnam",
              designation: "Faculty Member, Api Culture Technology Center",
              role: "क्वीन रियरिंग, रॉयल जेली संग्रह और शहद प्रोसेसिंग प्रशिक्षण में व्यावहारिक सहयोग देती हैं।",
              highlights: ["15 वर्ष अनुभव", "MBA", "व्यावहारिक प्रशिक्षण सहयोग"],
            },
            {
              name: "K. Subba Rao",
              designation: "Senior Scientist and Technical Adviser | Faculty Member",
              role: "मधुमक्खी पालन विषयों में दीर्घकालिक वैज्ञानिक और R&D अनुभव के साथ वरिष्ठ तकनीकी मार्गदर्शन देते हैं।",
              highlights: ["50 वर्ष अनुभव", "सेवानिवृत्त वैज्ञानिक", "तकनीकी सलाहकार"],
            },
          ],
        },
      ],
      profileLabel: "प्रोफ़ाइल",
      moreTitle: "API CULTURE के बारे में और जानें",
      moreCards: [
        {
          title: "मिशन और फोकस",
          body: "वैज्ञानिक मधुमक्खी पालन, तकनीकी जागरूकता, व्यावहारिक प्रशिक्षण, परागण समर्थन और आजीविका विकास।",
        },
        {
          title: "केंद्र क्या सिखाता है",
          body: "शहद प्रोसेसिंग, क्वीन रियरिंग, हाइव उत्पाद, उपकरण परिचय और फील्ड-रेडी एपियरी अभ्यास।",
        },
        {
          title: "यह मिशन किनके लिए है",
          body: "किसान, ग्रामीण युवा, महिला समूह, जनजातीय समुदाय, प्रशिक्षु और भविष्य के मधुमक्खी पालन उद्यमी।",
        },
        {
          title: "यह क्यों महत्वपूर्ण है",
          body: "यह एपिकल्चर प्रशिक्षण को आय, फसल सहयोग, परागण जागरूकता और ग्रामीण तकनीक के भरोसे से जोड़ता है।",
        },
      ],
    },
    articles: {
      eyebrow: "लेख",
      title: "फील्ड नोट्स, प्रशिक्षण लेख और केंद्र अपडेट",
      body:
        "एडमिन डैशबोर्ड से प्रकाशित लेख अब सीधे इस पेज पर आते हैं, इसलिए सार्वजनिक साइट और एडमिन पैनल एक ही स्रोत साझा करते हैं।",
      sidebarEyebrow: "यह क्या जोड़ता है",
      sidebarCards: [
        {
          title: "एडमिन से सार्वजनिक साइट",
          text: "एडमिन में बनाए गए लेख अब बिना अलग UI संपादन के यहाँ दिखाई दे सकते हैं।",
        },
        {
          title: "एकल सामग्री स्रोत",
          text: "प्रकाशित एंट्रीज़ प्लेसहोल्डर कार्ड्स की बजाय साझा बैकएंड पथ से आती हैं।",
        },
      ],
      readArticle: "लेख पढ़ें",
      emptyTitle: "अभी तक कोई लेख प्रकाशित नहीं हुआ है",
      emptyBody: "इस पेज को भरने के लिए एडमिन डैशबोर्ड से लेख बनाएं और प्रकाशित करें।",
    },
    footer: {
      quickLinksLabel: "एक्सप्लोर",
      policyLinksLabel: "नीति लिंक",
      socialLabel: "सोशल चैनल",
      policies: "नीतियाँ",
      callCenter: "केंद्र को कॉल करें",
      emailTeam: "टीम को ईमेल करें",
      officialWebsite: "आधिकारिक वेबसाइट",
      instagramHandle: "honey2health",
      youtubeHandle: "@ApiCultureTechCenter",
      designedDevelopedBy: "डिज़ाइन एवं डेवलपमेंट",
    },
    policies: {
      title: "आवेदन, भुगतान, गोपनीयता और सेवा उपयोग के लिए सार्वजनिक नीतियाँ।",
      body: "ये पेज भुगतान ऑनबोर्डिंग, प्रशिक्षण नामांकन पारदर्शिता और सार्वजनिक उपयोग के लिए प्रकाशित किए गए हैं।",
      updatedLabel: "अंतिम अपडेट",
      cardEyebrow: "नीति पृष्ठ",
      openPage: "पृष्ठ खोलें",
    },
  },
};

export function getSiteCopy(language: SiteLanguage): SiteCopy {
  return siteCopy[language];
}
