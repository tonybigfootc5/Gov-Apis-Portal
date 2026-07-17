"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Award, BriefcaseBusiness, Calendar, CheckCircle2, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { getSiteCopy } from "@/lib/site-copy";
import type { SiteLanguage } from "@/lib/i18n";

const apiCultureFormation = {
  title: "API CULTURE",
  logo: "/api-culture-logo-clean.png",
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
    title: "API Bee Keeper's Association",
    logo: "/scientific-beekeeping-icon.png",
    eyebrow: "Registered beekeeping association",
    description:
      "The AP Bee Keeper's Association was formed under the leadership of Sri. Kavuri Venkateshwara Rao on 27th November 1980. He was one of the leading people in the Bee Keeping development program in Andhra Pradesh since 1945.",
    points: [
      "Gave beekeeping training to rural people, farmers, women, and weaker sections.",
      "Formed and registered under Act XXI of 1860.",
      "Located at Ithahanagar, Tenali, Guntur Dist.",
    ],
    details: [
      {
        icon: <Users className="h-4 w-4" />,
        title: "Community training",
        description: "Built around practical beekeeping training for rural people, farmers, women, and weaker sections.",
      },
      {
        icon: <Calendar className="h-4 w-4" />,
        title: "Established in 1980",
        description: "The association was formed on 27th November 1980 after decades of beekeeping development work in Andhra Pradesh.",
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
      readyBody: "Current batches and center contact support are available for learners planning practical beekeeping training.",
      viewPrograms: "View programs",
      contactUs: "Contact us",
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

        <motion.div className="mx-auto mt-14 max-w-6xl" variants={itemVariants}>
          <AboutEcosystemOrbit
            activeCulture={activeCulture}
            onSelectCulture={setActiveCulture}
            explorePrograms={aboutUi.explorePrograms}
          />
        </motion.div>

        <motion.div
          ref={statsRef}
          className="mt-12 grid gap-4 md:grid-cols-4"
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
          className="mt-14 rounded-[2.2rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,249,239,0.3))] p-8 shadow-[0_28px_70px_rgba(99,77,26,0.1)] ring-1 ring-[#e4cc9d]/32 backdrop-blur-2xl"
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

        <motion.div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4" variants={containerVariants}>
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

function AboutEcosystemOrbit({
  activeCulture,
  onSelectCulture,
  explorePrograms,
}: {
  activeCulture: string;
  onSelectCulture: (culture: string) => void;
  explorePrograms: string;
}) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredCulture, setHoveredCulture] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const activeDetails = supportingCultures.find((culture) => culture.title === activeCulture) ?? supportingCultures[0];

  useEffect(() => {
    if (!autoRotate) {
      return;
    }

    const rotationTimer = window.setInterval(() => {
      setRotationAngle((previous) => Number(((previous + 0.28) % 360).toFixed(3)));
    }, 50);

    return () => window.clearInterval(rotationTimer);
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const radiusX = 360;
    const radiusY = 196;
    const x = radiusX * Math.cos(radian);
    const y = radiusY * Math.sin(radian);
    const zIndex = Math.round(90 + 35 * Math.sin(radian));
    const opacity = Math.max(0.54, Math.min(1, 0.62 + 0.38 * ((1 + Math.sin(radian)) / 2)));
    const scale = 0.92 + 0.12 * ((1 + Math.sin(radian)) / 2);

    return { angle, opacity, scale, x, y, zIndex };
  };

  const centerNode = (cultureTitle: string) => {
    const nodeIndex = supportingCultures.findIndex((culture) => culture.title === cultureTitle);
    if (nodeIndex < 0) {
      return;
    }

    const targetAngle = (nodeIndex / supportingCultures.length) * 360;
    setRotationAngle(270 - targetAngle);
    onSelectCulture(cultureTitle);
  };

  return (
    <div className="relative overflow-hidden rounded-[2.8rem] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.58),rgba(255,249,239,0.28))] p-4 shadow-[0_30px_90px_rgba(82,57,13,0.12)] ring-1 ring-[#d7be90]/28 backdrop-blur-2xl md:p-7">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.42),transparent_26%,transparent_74%,rgba(242,181,68,0.1))]" />
      <div className="absolute left-1/2 top-8 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-[#d7be90]/26" />
      <div className="absolute left-1/2 top-20 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full border border-[#d6a84b]/24" />

      <div className="relative z-10 grid gap-5">
        <div className="grid gap-3 lg:hidden">
          {supportingCultures.map((culture) => {
            const isActive = activeCulture === culture.title;
            return (
              <button
                type="button"
                key={culture.title}
                onClick={() => centerNode(culture.title)}
                className={`rounded-[1.35rem] border p-4 text-left transition ${
                  isActive ? "border-[#d6a84b] bg-white/78 shadow-[0_16px_34px_rgba(184,120,22,0.14)]" : "border-white/60 bg-white/48"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/75 bg-white/85">
                    <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain p-2" sizes="48px" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold leading-tight text-[#173f33]">{culture.title}</h4>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="relative hidden min-h-[35rem] overflow-hidden rounded-[2.2rem] border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,250,242,0.22))] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] lg:block"
          onMouseEnter={() => setAutoRotate(false)}
          onMouseLeave={() => {
            setHoveredCulture(null);
            setAutoRotate(true);
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c15f]/24 blur-sm" />
          <div className="absolute left-1/2 top-1/2 h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d6a84b]/38" />
          <div className="absolute left-1/2 top-1/2 h-[29rem] w-[29rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e8d4a8]/48" />
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e8d4a8]/22" />
          <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,248,234,0.58))] text-center shadow-[0_22px_54px_rgba(99,77,26,0.14)] ring-1 ring-[#e6d2a9]/40 backdrop-blur-xl">
            <div className="absolute -inset-4 rounded-full border border-[#d6a84b]/15 opacity-70 [animation:ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute -inset-8 rounded-full border border-[#f2b544]/18 opacity-50 [animation:ping_3.6s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="relative h-16 w-20">
              <Image src={apiCultureFormation.logo} alt="API CULTURE logo" fill className="object-contain" sizes="80px" />
            </div>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#b97816]">{apiCultureFormation.title}</p>
            <p className="mt-1 px-4 text-xs leading-5 text-[#61716a]">Shared apiculture ecosystem</p>
          </div>

          {supportingCultures.map((culture, index) => {
            const isActive = activeCulture === culture.title;
            const isHovered = hoveredCulture === culture.title;
            const position = calculateNodePosition(index, supportingCultures.length);
            return (
              <button
                type="button"
                key={culture.title}
                onClick={() => centerNode(culture.title)}
                onMouseEnter={() => setHoveredCulture(culture.title)}
                onMouseLeave={() => setHoveredCulture(null)}
                className={`absolute left-1/2 top-1/2 ${culture.title === "API Bee Keeper's Association" ? "w-64" : "w-52"} rounded-[1.55rem] border p-4 text-left backdrop-blur-xl transition-all duration-700 ${
                  isActive
                    ? "border-[#d6a84b] bg-[linear-gradient(180deg,rgba(255,249,235,0.9),rgba(255,255,255,0.58))] shadow-[0_28px_60px_rgba(184,120,22,0.2)]"
                    : isHovered
                      ? "border-[#d6a84b]/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,250,242,0.5))] shadow-[0_22px_46px_rgba(99,77,26,0.12)]"
                      : "border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.64),rgba(255,250,242,0.38))] shadow-[0_14px_34px_rgba(99,77,26,0.08)]"
                }`}
                style={{
                  opacity: isActive || isHovered ? 1 : position.opacity,
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${isActive || isHovered ? 1.08 : position.scale})`,
                  zIndex: isActive || isHovered ? 140 : position.zIndex,
                }}
              >
                <span
                  className={`pointer-events-none absolute rounded-full transition-opacity duration-300 ${
                    isActive || isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background: "radial-gradient(circle, rgba(214,168,75,0.2) 0%, rgba(214,168,75,0) 72%)",
                    height: "104px",
                    left: "-18px",
                    top: "-18px",
                    width: "104px",
                  }}
                />
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/75 bg-white/85 shadow-[0_8px_22px_rgba(99,77,26,0.08)]">
                    <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain p-2" sizes="48px" />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`${culture.title === "API Bee Keeper's Association" ? "text-[1.05rem]" : "text-lg"} font-semibold leading-snug text-[#173f33]`}>
                      {culture.title}
                    </h4>
                    {isHovered ? <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#b97816]">Click to view</p> : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-5">
          <motion.div
            key={activeDetails.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2.25rem] border border-[#d7be90]/38 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,249,239,0.42))] p-5 shadow-[0_22px_54px_rgba(99,77,26,0.1)] backdrop-blur-2xl md:p-6"
          >
            <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-[#f5c15f]/18" />
            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-stretch">
              <div>
                <div className="flex items-center gap-4">
                  <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[1.15rem] border border-white/70 bg-white/85 shadow-[0_10px_24px_rgba(99,77,26,0.08)]">
                    <Image src={activeDetails.logo} alt={`${activeDetails.title} logo`} fill className="object-contain p-2" sizes="64px" />
                  </div>
                  <div>
                    <h3 className="text-[clamp(2rem,3vw,3.1rem)] font-semibold leading-[1.03] text-[#173f33]">{activeDetails.title}</h3>
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#7d8b84]">{activeDetails.eyebrow}</p>
                  </div>
                </div>
                <p className="mt-6 text-[15px] leading-8 text-[#5f6e67]">{activeDetails.description}</p>
                <Link href="/programs" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#f2b544] px-5 py-2.5 text-sm font-semibold text-[#173f33]">
                  {explorePrograms} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeDetails.details.map((detail) => (
                  <div key={detail.title} className="rounded-[1.25rem] border border-white/65 bg-white/58 p-4 shadow-[0_10px_24px_rgba(99,77,26,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#f8f1e1] p-2 text-[#b97816]">{detail.icon}</div>
                      <h4 className="text-base font-semibold text-[#173f33]">{detail.title}</h4>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#62706a]">{detail.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
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
