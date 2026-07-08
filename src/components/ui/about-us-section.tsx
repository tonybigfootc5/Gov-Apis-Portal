"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Award, BriefcaseBusiness, Calendar, Check, CheckCircle2, ChevronDown, GraduationCap, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { getSiteCopy } from "@/lib/site-copy";
import type { SiteLanguage } from "@/lib/i18n";

const apiCultureFormation = {
  title: "API CULTURE",
  logo: "/api-culture-logo-clean.png",
  body: "API CULTURE Technology Center is the shared identity formed through the combined ecosystem of NIRDPR, AP Bee Keepers' Association, and Kavuri Bee Hive 'n' Natural Products. The center brings these three supporting cultures together under one field-focused apiculture mission.",
  points: [
    "Established in 2004 at Rural Technology Park, Rajendranagar.",
    "Built through institutional association and technical support from the three source-linked supporting cultures.",
    "Focused on training, technology transfer, pollination awareness, skill development, and bee hive product education.",
  ],
};

const supportingCultures = [
  {
    title: "Kavuri",
    logo: "/kavuri-extract-3.png",
    eyebrow: "Technical support partner",
    description:
      "The source profile names Kavuri Bee Hive 'n' Natural Products as one of the supporting cultures behind the formation of API CULTURE.",
    points: [
      "Named in the formation profile.",
      "Linked with bee hive and natural products identity.",
      "Part of the support ecosystem represented within API CULTURE.",
    ],
    details: [
      {
        icon: <GraduationCap className="h-4 w-4" />,
        title: "Scientific training",
        description: "Hands-on hive handling, colony care, and practical beekeeping instruction for trainees.",
      },
      {
        icon: <Award className="h-4 w-4" />,
        title: "Queen rearing and hive skills",
        description: "Supports queen rearing, colony multiplication, and better management practices.",
      },
    ],
    layout: "left",
  },
  {
    title: "Bee Keepers' Association",
    logo: "/scientific-beekeeping-icon.png",
    eyebrow: "Field leadership and training support",
    description:
      "AP Bee Keepers' Association is documented as the technical support body behind field practice, leadership continuity, and applied beekeeping knowledge.",
    points: [
      "Technical support since formation.",
      "Leadership connection through K. Sambashiva Rao and P. Ravindra Kumar.",
      "Strong linkage to field training, migration, colony care, and practical beekeeping.",
    ],
    details: [
      {
        icon: <Users className="h-4 w-4" />,
        title: "Community-focused outreach",
        description: "Supports farmers, rural youth, women groups, and aspiring entrepreneurs through field-ready guidance.",
      },
      {
        icon: <Sparkles className="h-4 w-4" />,
        title: "Transfer of technology",
        description: "Connects motivation, awareness, bee breeding, equipment exposure, and consumer education.",
      },
    ],
    layout: "right",
  },
  {
    title: "NIRDPR",
    logo: "/nirdpr-logo.jpeg",
    eyebrow: "Institutional association",
    description:
      "NIRDPR is the institutional anchor named in the source text, linking the center's formation to Rural Technology Park and a broader public-sector development context.",
    points: [
      "Association noted at the time of establishment.",
      "Institutional backing for continuity and mission trust.",
      "Supports the center's positioning within a rural development ecosystem.",
    ],
    details: [
      {
        icon: <ShieldCheck className="h-4 w-4" />,
        title: "Institutional continuity",
        description: "Provides the clearest documented public-sector anchor in the formation profile.",
      },
      {
        icon: <BriefcaseBusiness className="h-4 w-4" />,
        title: "Development ecosystem",
        description: "Strengthens the center's role within Rural Technology Park and rural development outreach.",
      },
    ],
    layout: "bottom",
  },
];

export default function AboutUsSection({ language }: { language: SiteLanguage }) {
  const copy = getSiteCopy(language);
  const storyParagraphs = copy.about.storyParagraphs;
  const peopleGroups = copy.about.peopleGroups;
  const moreCards = copy.about.moreCards;
  const aboutUi = {
    en: {
      eyebrow: "Discover our story",
      title: "About Us",
      formationTitle: "API CULTURE formed by three supporting cultures",
      explorePrograms: "Explore programs",
      established: "Established",
      supportingCultures: "Supporting cultures",
      coreThemes: "Core training themes",
      leadershipShown: "Leadership profiles shown",
      missionPeople: "People Behind The Mission",
      missionLead: "Leadership, committee, and technical guidance",
      missionBody:
        "The older profile information is restored below on the same About page so the center's directors, committee members, and technical or faculty members remain visible within the current design.",
      readyTitle: "Ready to learn beekeeping with real field grounding?",
      readyBody: "Explore current batches or contact the center for training guidance.",
      viewPrograms: "View programs",
      contactUs: "Contact us",
      clickToView: "Click to view this culture's information",
    },
    te: {
      eyebrow: "మా కథను తెలుసుకోండి",
      title: "మా గురించి",
      formationTitle: "మూడు మద్దతు సంస్కృతులతో ఏర్పడిన API CULTURE",
      explorePrograms: "కార్యక్రమాలు చూడండి",
      established: "స్థాపన",
      supportingCultures: "మద్దతు సంస్కృతులు",
      coreThemes: "ప్రధాన శిక్షణ అంశాలు",
      leadershipShown: "చూపించిన నాయకత్వ ప్రొఫైళ్లు",
      missionPeople: "ఈ లక్ష్యానికి వెనుక ఉన్నవారు",
      missionLead: "నాయకత్వం, కమిటీ మరియు సాంకేతిక మార్గదర్శకం",
      missionBody:
        "కేంద్రానికి చెందిన డైరెక్టర్లు, కమిటీ సభ్యులు, సాంకేతిక మరియు ఫ్యాకల్టీ సభ్యులు ప్రస్తుత రూపకల్పనలో కూడా స్పష్టంగా కనిపించేలా ఈ పాత ప్రొఫైల్ సమాచారాన్ని ఇదే About పేజీలో కొనసాగించాము.",
      readyTitle: "ప్రాక్టికల్ ఫీల్డ్ అనుభవంతో తేనెటీగల పెంపకం నేర్చుకోవడానికి సిద్ధమేనా?",
      readyBody: "ప్రస్తుత బ్యాచ్‌లను చూడండి లేదా శిక్షణ మార్గదర్శకత్వం కోసం కేంద్రాన్ని సంప్రదించండి.",
      viewPrograms: "కార్యక్రమాలు చూడండి",
      contactUs: "సంప్రదించండి",
      clickToView: "ఈ విభాగం సమాచారాన్ని చూడటానికి క్లిక్ చేయండి",
    },
    hi: {
      eyebrow: "हमारी कहानी जानें",
      title: "हमारे बारे में",
      formationTitle: "तीन सहयोगी संस्कृतियों से बना API CULTURE",
      explorePrograms: "कार्यक्रम देखें",
      established: "स्थापना",
      supportingCultures: "सहयोगी संस्कृतियां",
      coreThemes: "मुख्य प्रशिक्षण विषय",
      leadershipShown: "दिखाई गई नेतृत्व प्रोफाइल",
      missionPeople: "मिशन के पीछे के लोग",
      missionLead: "नेतृत्व, समिति और तकनीकी मार्गदर्शन",
      missionBody:
        "केंद्र के निदेशकों, समिति सदस्यों और तकनीकी या फैकल्टी प्रोफाइल्स को वर्तमान डिजाइन में भी स्पष्ट रखने के लिए पुरानी प्रोफाइल जानकारी इसी About पेज में रखी गई है।",
      readyTitle: "क्या आप वास्तविक फील्ड अनुभव के साथ मधुमक्खी पालन सीखने के लिए तैयार हैं?",
      readyBody: "वर्तमान बैच देखें या प्रशिक्षण मार्गदर्शन के लिए केंद्र से संपर्क करें।",
      viewPrograms: "कार्यक्रम देखें",
      contactUs: "संपर्क करें",
      clickToView: "इस जानकारी को देखने के लिए क्लिक करें",
    },
  }[language];

  const [activeCulture, setActiveCulture] = useState("Kavuri");
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const peopleRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: false, amount: 0.08 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });
  const isPeopleInView = useInView(peopleRef, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 34]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,251,243,0.96),rgba(248,240,225,0.92)_36%,rgba(241,232,216,0.94)_70%,rgba(236,225,205,0.98)_100%)] px-4 py-24 text-[#173f33]"
    >
      <motion.div className="absolute left-10 top-20 h-60 w-60 rounded-full bg-[#f0c76d]/10 blur-3xl" style={{ y: y1 }} />
      <motion.div className="absolute bottom-16 right-12 h-72 w-72 rounded-full bg-[#90a882]/10 blur-3xl" style={{ y: y2 }} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_22%,transparent_78%,rgba(255,240,206,0.22))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#9c7a36_1px,transparent_0)] [background-size:18px_18px]" />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#b97816]">
            <Zap className="h-4 w-4" />
            {aboutUi.eyebrow}
          </span>
          <h2 className="font-display text-center text-4xl md:text-5xl">{aboutUi.title}</h2>
          <div className="mt-4 h-1 w-24 bg-[#b97816]" />
        </motion.div>

        <motion.div className="mx-auto max-w-4xl text-center" variants={itemVariants}>
          {storyParagraphs.map((paragraph) => (
            <p key={paragraph} className="mx-auto mb-4 text-base leading-8 text-[#5f6e67] last:mb-0">
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.div className="mx-auto mt-16 max-w-6xl" variants={itemVariants}>
          <div className="relative overflow-hidden rounded-[2.8rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.42),rgba(255,249,239,0.2))] p-5 shadow-[0_30px_90px_rgba(82,57,13,0.12)] ring-1 ring-[#d7be90]/28 backdrop-blur-2xl md:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.38),transparent_26%,transparent_74%,rgba(242,181,68,0.08))]" />
            <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.44),transparent)]" />
            <HoneycombCluster className="absolute right-8 top-6 hidden lg:flex" />
            <HoneycombCluster className="absolute bottom-10 left-8 hidden scale-75 lg:flex" />

            <div className="relative z-10 space-y-6">
              <div className="rounded-[2.2rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,250,242,0.46))] px-6 py-7 shadow-[0_28px_80px_rgba(121,89,28,0.1)] ring-1 ring-[#ead8b6]/35 backdrop-blur-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-20 w-24">
                    <Image src={apiCultureFormation.logo} alt="API CULTURE logo" fill className="object-contain" sizes="96px" />
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#b97816]">{apiCultureFormation.title}</p>
                  <h3 className="mt-2 text-3xl font-semibold">{aboutUi.formationTitle}</h3>
                  <p className="mt-4 text-sm leading-8 text-[#5f6e67]">{apiCultureFormation.body}</p>
                  <div className="mt-6 grid w-full gap-3 md:grid-cols-3">
                    {apiCultureFormation.points.map((point) => (
                      <div
                        key={point}
                        className="rounded-[1.25rem] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,248,236,0.36))] px-4 py-4 text-sm leading-7 text-[#66736d] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-lg"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden lg:block px-8">
                <TreeBranchGraphic />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {supportingCultures.map((culture, index) => (
                  <TreeLeafButton
                    key={culture.title}
                    culture={culture}
                    accent={index === 0 ? "blue" : index === 1 ? "green" : "gold"}
                    active={activeCulture === culture.title}
                    onClick={() => setActiveCulture(culture.title)}
                    helperLabel={aboutUi.clickToView}
                  />
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr] xl:items-start">
                <div>
                  {supportingCultures.map((culture, index) => (
                    <TreeNodeCard
                      key={culture.title}
                      culture={culture}
                      accent={index === 0 ? "blue" : index === 1 ? "green" : "gold"}
                      open={activeCulture === culture.title}
                    />
                  ))}
                </div>

                <div className="space-y-5">
                  <div className="relative mx-auto w-full max-w-sm">
                    <div className="relative overflow-hidden rounded-[2rem] shadow-[0_28px_60px_rgba(85,64,25,0.18)]">
                      <div className="relative aspect-[4/5]">
                        <Image
                          src="/field-beekeeping.jpg"
                          alt="API CULTURE field training"
                          fill
                          sizes="(min-width: 1280px) 22rem, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#173f33]/60 via-[#173f33]/10 to-transparent p-5">
                          <Link
                            href="/programs"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#173f33]"
                          >
                            {aboutUi.explorePrograms} <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 -z-10 -m-3 rounded-[2rem] border-2 border-[#d9ddc8]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={statsRef}
          className="mt-16 grid gap-4 md:grid-cols-4"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <FactStat icon={<Calendar className="h-5 w-5" />} value={2004} suffix="" label={aboutUi.established} delay={0} />
          <FactStat icon={<Users className="h-5 w-5" />} value={3} suffix="" label={aboutUi.supportingCultures} delay={0.08} />
          <FactStat icon={<Award className="h-5 w-5" />} value={4} suffix="+" label={aboutUi.coreThemes} delay={0.16} />
          <FactStat icon={<ShieldCheck className="h-5 w-5" />} value={2} suffix="" label={aboutUi.leadershipShown} delay={0.24} />
        </motion.div>

        <motion.div
          ref={peopleRef}
          className="mt-20 rounded-[2.2rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,249,239,0.3))] p-8 shadow-[0_28px_70px_rgba(99,77,26,0.1)] ring-1 ring-[#e4cc9d]/32 backdrop-blur-2xl"
          initial="hidden"
          animate={isPeopleInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div className="max-w-3xl" variants={itemVariants}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b97816]">{aboutUi.missionPeople}</p>
            <h3 className="mt-3 text-3xl font-semibold">{aboutUi.missionLead}</h3>
            <p className="mt-4 text-sm leading-8 text-[#5f6e67]">
              {aboutUi.missionBody}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-8 xl:grid-cols-2">
            {peopleGroups.map((group) => (
              <motion.div
                key={group.title}
                className="rounded-[1.8rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(255,250,243,0.42))] p-6 shadow-[0_18px_44px_rgba(99,77,26,0.08)] backdrop-blur-xl"
                variants={itemVariants}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b97816]">{group.eyebrow}</p>
                <h4 className="mt-3 text-2xl font-semibold">{group.title}</h4>
                <div className="mt-6 space-y-5">
                  {group.members.map((member) => (
                    <div
                      key={member.name}
                      className="rounded-[1.35rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,251,245,0.48))] p-5 shadow-[0_12px_34px_rgba(99,77,26,0.06)] backdrop-blur-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h5 className="text-lg font-semibold text-[#173f33]">{member.name}</h5>
                          <p className="mt-1 text-sm leading-6 text-[#6a7771]">{member.designation}</p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f8f1e1] px-3 py-1 text-xs font-semibold text-[#b97816]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Profile
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[#5f6e67]">{member.role}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {member.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full border border-[#efe3cd] bg-[#fff8ec] px-3 py-1 text-xs font-medium text-[#7a6641]"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4" variants={containerVariants}>
          {moreCards.map((card) => (
            <motion.div
              key={card.title}
              className="rounded-[1.55rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,249,239,0.36))] p-5 shadow-[0_18px_40px_rgba(99,77,26,0.08)] backdrop-blur-xl"
              variants={itemVariants}
            >
              <p className="text-lg font-semibold text-[#173f33]">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#5f6e67]">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-white/14 bg-[linear-gradient(135deg,rgba(17,59,49,0.9),rgba(24,73,60,0.72))] p-8 text-white shadow-[0_24px_60px_rgba(23,63,51,0.24)] backdrop-blur-xl md:flex-row"
          initial={{ opacity: 0, y: 24 }}
          animate={isPeopleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <div className="flex-1">
            <h3 className="text-2xl font-medium">{aboutUi.readyTitle}</h3>
            <p className="mt-2 text-white/80">{aboutUi.readyBody}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f2b544] px-6 py-3 font-medium text-[#173f33] transition-colors hover:bg-[#f5c15f]"
            >
              {aboutUi.viewPrograms} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-medium text-white transition-colors hover:bg-white/8"
            >
              {aboutUi.contactUs} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function TreeNodeCard({
  culture,
  accent,
  open,
}: {
  culture: {
    title: string;
    logo: string;
    eyebrow: string;
    description: string;
    points: string[];
    details: { icon: React.ReactNode; title: string; description: string }[];
  };
  accent: "blue" | "green" | "gold";
  open: boolean;
}) {
  const accentStyles = {
    blue: {
      border: "border-[#cfe5f5]",
      bg: "bg-[linear-gradient(180deg,rgba(233,246,255,0.54),rgba(248,252,255,0.3))]",
      icon: "bg-[linear-gradient(180deg,rgba(217,236,251,0.92),rgba(235,245,255,0.72))] text-[#386a8e]",
      chip: "bg-[linear-gradient(180deg,rgba(240,247,255,0.72),rgba(255,255,255,0.42))] text-[#3d6b8f] border-[#d3e7f6]",
    },
    green: {
      border: "border-[#d1e6d4]",
      bg: "bg-[linear-gradient(180deg,rgba(237,249,238,0.54),rgba(248,252,248,0.3))]",
      icon: "bg-[linear-gradient(180deg,rgba(223,240,225,0.92),rgba(240,248,241,0.72))] text-[#3f7049]",
      chip: "bg-[linear-gradient(180deg,rgba(240,248,241,0.72),rgba(255,255,255,0.42))] text-[#446f4d] border-[#d7e9da]",
    },
    gold: {
      border: "border-[#ead4a0]",
      bg: "bg-[linear-gradient(180deg,rgba(255,246,224,0.54),rgba(255,251,243,0.3))]",
      icon: "bg-[linear-gradient(180deg,rgba(248,231,188,0.92),rgba(255,246,222,0.72))] text-[#8a6722]",
      chip: "bg-[linear-gradient(180deg,rgba(255,247,228,0.72),rgba(255,255,255,0.42))] text-[#8a6826] border-[#efdfb4]",
    },
  }[accent];

  if (!open) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-[2rem] border p-5 shadow-[0_18px_48px_rgba(99,77,26,0.08)] ring-1 ring-white/35 backdrop-blur-2xl ${accentStyles.border} ${accentStyles.bg}`}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border border-white/70 bg-white/82 p-2 shadow-[0_10px_24px_rgba(99,77,26,0.08)] backdrop-blur-md">
          <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain p-2" sizes="64px" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b97816]">{culture.eyebrow}</p>
          <h3 className="mt-2 text-[1.7rem] leading-tight font-semibold text-[#173f33]">{culture.title}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#5f6e67]">{culture.description}</p>
      <div className="mt-4 grid gap-3">
        {culture.points.map((point) => (
          <div
            key={point}
            className={`rounded-[1rem] border px-4 py-3 text-sm leading-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-lg ${accentStyles.chip}`}
          >
            {point}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3">
        {culture.details.map((detail) => (
          <div
            key={detail.title}
            className="rounded-[1.1rem] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,252,246,0.42))] p-4 shadow-[0_10px_24px_rgba(99,77,26,0.05)] backdrop-blur-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ${accentStyles.icon}`}>{detail.icon}</div>
              <h4 className="text-base font-semibold text-[#173f33]">{detail.title}</h4>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#62706a]">{detail.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TreeLeafButton({
  culture,
  accent,
  active,
  onClick,
  helperLabel,
}: {
  culture: {
    title: string;
    logo: string;
    eyebrow: string;
  };
  accent: "blue" | "green" | "gold";
  active: boolean;
  onClick: () => void;
  helperLabel: string;
}) {
  const accentStyles = {
    blue: {
      border: active ? "border-[#7fb2db]" : "border-[#cfe2f1]",
      bg: active
        ? "bg-[linear-gradient(180deg,rgba(238,247,255,0.82),rgba(255,255,255,0.5))]"
        : "bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,249,239,0.3))]",
      ring: active ? "shadow-[0_18px_44px_rgba(89,145,188,0.18)] ring-1 ring-[#aed0e9]/45" : "shadow-[0_12px_28px_rgba(99,77,26,0.05)] ring-1 ring-white/35",
    },
    green: {
      border: active ? "border-[#8ac496]" : "border-[#d3e7d6]",
      bg: active
        ? "bg-[linear-gradient(180deg,rgba(241,249,242,0.82),rgba(255,255,255,0.5))]"
        : "bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,249,239,0.3))]",
      ring: active ? "shadow-[0_18px_44px_rgba(98,150,103,0.18)] ring-1 ring-[#bdddbe]/45" : "shadow-[0_12px_28px_rgba(99,77,26,0.05)] ring-1 ring-white/35",
    },
    gold: {
      border: active ? "border-[#d7b056]" : "border-[#eedbb0]",
      bg: active
        ? "bg-[linear-gradient(180deg,rgba(255,248,231,0.82),rgba(255,255,255,0.5))]"
        : "bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,249,239,0.3))]",
      ring: active ? "shadow-[0_18px_44px_rgba(190,145,47,0.18)] ring-1 ring-[#e5cb88]/45" : "shadow-[0_12px_28px_rgba(99,77,26,0.05)] ring-1 ring-white/35",
    },
  }[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[1.75rem] border p-4 text-left transition-all duration-200 backdrop-blur-xl ${accentStyles.border} ${accentStyles.bg} ${accentStyles.ring}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/70 bg-white/82 p-1.5 shadow-[0_8px_22px_rgba(99,77,26,0.08)] backdrop-blur-md">
            <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain p-1.5" sizes="48px" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b97816]">{culture.eyebrow}</p>
            <h4 className="mt-1 text-lg font-semibold text-[#173f33]">{culture.title}</h4>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-[#8b6c2e] transition-transform ${active ? "rotate-180" : ""}`} />
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#6c786f]">
        <Check className="h-3.5 w-3.5 text-[#b97816]" />
        {helperLabel}
      </div>
    </button>
  );
}

function TreeBranchGraphic() {
  return (
    <svg viewBox="0 0 1200 200" className="h-40 w-full" aria-hidden="true">
      <defs>
        <linearGradient id="treeBranchStable" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#dab170" />
          <stop offset="50%" stopColor="#b88433" />
          <stop offset="100%" stopColor="#e0c79a" />
        </linearGradient>
      </defs>
      <path d="M600 10 L600 78" fill="none" stroke="url(#treeBranchStable)" strokeWidth="16" strokeLinecap="round" />
      <path d="M600 68 C520 84, 420 110, 200 144" fill="none" stroke="url(#treeBranchStable)" strokeWidth="12" strokeLinecap="round" />
      <path d="M600 68 C600 92, 600 112, 600 136" fill="none" stroke="url(#treeBranchStable)" strokeWidth="12" strokeLinecap="round" />
      <path d="M600 68 C680 84, 780 110, 1000 144" fill="none" stroke="url(#treeBranchStable)" strokeWidth="12" strokeLinecap="round" />
      <circle cx="200" cy="144" r="10" fill="#d2a653" />
      <circle cx="600" cy="136" r="10" fill="#d2a653" />
      <circle cx="1000" cy="144" r="10" fill="#d2a653" />
    </svg>
  );
}

function HoneycombCluster({ className }: { className?: string }) {
  const cells = [
    "translate-x-0 translate-y-0",
    "translate-x-9 translate-y-0",
    "translate-x-[72px] translate-y-0",
    "translate-x-[18px] translate-y-8",
    "translate-x-[54px] translate-y-8",
    "translate-x-[90px] translate-y-8",
  ];

  return (
    <div className={className}>
      <div className="relative h-20 w-36 opacity-75">
        {cells.map((cell) => (
          <div
            key={cell}
            className={`absolute h-8 w-9 rotate-0 rounded-[0.55rem] border border-[#f3d98c] bg-[linear-gradient(180deg,rgba(255,223,112,0.9),rgba(226,170,47,0.82))] shadow-[0_6px_16px_rgba(193,137,26,0.18)] [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)] ${cell}`}
          />
        ))}
      </div>
    </div>
  );
}

function FactStat({
  icon,
  value,
  suffix,
  label,
  delay,
}: {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: false, amount: 0.5 });
  const springValue = useSpring(0, { stiffness: 55, damping: 14 });

  useEffect(() => {
    springValue.set(isInView ? value : 0);
  }, [isInView, springValue, value]);

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  return (
    <motion.div
      className="rounded-[1.65rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,249,239,0.34))] p-6 text-center shadow-[0_18px_44px_rgba(99,77,26,0.08)] ring-1 ring-[#e4cc9d]/28 backdrop-blur-xl"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay },
        },
      }}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f1e1] text-[#b97816]">{icon}</div>
      <div ref={countRef} className="mt-4 flex items-center justify-center text-3xl font-bold text-[#173f33]">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-[#6a7771]">{label}</p>
    </motion.div>
  );
}
