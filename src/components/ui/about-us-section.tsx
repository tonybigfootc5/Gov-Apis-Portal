"use client";

import type React from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Award, BriefcaseBusiness, Calendar, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { getSiteCopy } from "@/lib/site-copy";
import type { SiteLanguage } from "@/lib/i18n";

const apiCultureFormation = {
  title: "API CULTURE",
  logo: "/api-culture-logo-clean.png",
};

const supportingCultures = [
  {
    title: "Kavuri",
    logo: "/kavuri-logo.png",
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
    logo: "/nirdpr-orbit-logo.jpeg",
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

const aboutStats = [
  {
    icon: <Award className="h-5 w-5" />,
    value: "20-80%",
    label: "Crop Yield Potential",
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    value: "5-Day",
    label: "Scientific Beekeeping Training",
  },
  {
    icon: <Users className="h-5 w-5" />,
    value: "130+ Years",
    label: "Combined Faculty Experience",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    value: "Pan-India",
    label: "Training & Technical Reach",
  },
];

export default function AboutUsSection({ language }: { language: SiteLanguage }) {
  const copy = getSiteCopy(language);
  const storyParagraphs = copy.about.storyParagraphs;
  const peopleGroups = copy.about.peopleGroups;
  const moreCards = copy.about.moreCards;
  const missionMembers = peopleGroups.flatMap((group) =>
    group.members.map((member) => ({
      ...member,
      groupEyebrow: group.eyebrow,
    })),
  );
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
      missionLead: "Leadership, committee, and technical faculty",
      missionBody:
        "The older profile information is restored below on the same About page so the center's directors, committee members, and technical or faculty members remain visible within the current design.",
      readyTitle: "",
      readyBody: "",
      viewPrograms: "",
      contactUs: "",
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
      readyTitle: "",
      readyBody: "",
      viewPrograms: "",
      contactUs: "",
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
      readyTitle: "",
      readyBody: "",
      viewPrograms: "",
      contactUs: "",
    },
  }[language];

  const [activeCulture, setActiveCulture] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const peopleRef = useRef<HTMLDivElement>(null);

  const isPeopleInView = useInView(peopleRef, { once: true, amount: 0.15 });

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
      className="relative min-h-screen scroll-mt-28 overflow-hidden bg-white px-4 py-24 text-[#173f33]"
    >
      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        initial="visible"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="mx-auto max-w-6xl" variants={itemVariants}>
          <AboutEcosystemOrbit
            activeCulture={activeCulture}
            onSelectCulture={setActiveCulture}
          />
        </motion.div>

        <motion.div className="mx-auto mt-12 grid max-w-6xl items-stretch gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]" variants={itemVariants}>
          <div className="relative overflow-hidden rounded-[2rem] border border-[#e8eee9] bg-white p-7 shadow-[0_16px_38px_rgba(34,45,38,0.06)] md:p-9">
            <div className="pointer-events-none absolute -right-8 bottom-2 h-[min(20rem,58vw)] w-[min(20rem,58vw)] opacity-[0.13] sm:-right-5 sm:bottom-4 sm:h-80 sm:w-80 md:opacity-[0.16] lg:-right-10 lg:h-[24rem] lg:w-[24rem]" aria-hidden="true">
              <Image
                src="/hero-section-center-art.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 58vw"
                className="object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.94)_58%,rgba(255,255,255,0.76)_100%)]" aria-hidden="true" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl">{aboutUi.title}</h2>
              <div className="mt-4 h-1 w-24 bg-[#b97816]" />
            </div>

            <div className="relative z-10 mt-7">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph} className="mb-4 text-base font-medium leading-8 text-[#40564d] last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {aboutStats.map((stat) => (
              <FactStat key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
            ))}
          </div>
        </motion.div>

        <motion.div
          ref={peopleRef}
          className="mx-auto mt-20 max-w-7xl"
          initial="hidden"
          animate={isPeopleInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div className="mx-auto max-w-3xl text-center" variants={itemVariants}>
            <p className="font-display text-sm italic text-[#8a978f]">{aboutUi.missionPeople}</p>
            <h3 className="mt-3 text-[clamp(2.25rem,4.2vw,4.4rem)] font-black leading-[0.92] tracking-[-0.03em] text-[#101713]">
              {aboutUi.missionLead}
            </h3>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6a7771]">
              {aboutUi.missionBody}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {missionMembers.map((member, index) => (
              <TeamMemberTile key={member.name} member={member} index={index} />
            ))}
          </div>
        </motion.div>

        <motion.div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4" variants={containerVariants}>
          {moreCards.map((card) => (
            <motion.div
              key={card.title}
              className="rounded-[1.55rem] border border-[#e8eee9] bg-white p-5 shadow-[0_12px_30px_rgba(34,45,38,0.05)]"
              variants={itemVariants}
            >
              <p className="text-lg font-semibold text-[#173f33]">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#5f6e67]">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}

function AboutEcosystemOrbit({
  activeCulture,
  onSelectCulture,
}: {
  activeCulture: string | null;
  onSelectCulture: (culture: string | null) => void;
}) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredCulture, setHoveredCulture] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const orbitRef = useRef<HTMLDivElement>(null);
  const selectedCulture = supportingCultures.find((culture) => culture.title === activeCulture) ?? null;
  const selectedCultureIndex = supportingCultures.findIndex((culture) => culture.title === activeCulture);

  useEffect(() => {
    if (!autoRotate || activeCulture) {
      return;
    }

    const rotationTimer = window.setInterval(() => {
      setRotationAngle((previous) => Number(((previous + 0.28) % 360).toFixed(3)));
    }, 50);

    return () => window.clearInterval(rotationTimer);
  }, [activeCulture, autoRotate]);

  useEffect(() => {
    if (!activeCulture) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-orbit-card]")) {
        return;
      }

      onSelectCulture(null);
      setAutoRotate(true);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [activeCulture, onSelectCulture]);

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

    setAutoRotate(false);
    onSelectCulture(cultureTitle);
  };

  const selectedPosition = selectedCultureIndex >= 0 ? calculateNodePosition(selectedCultureIndex, supportingCultures.length) : null;
  const summaryOnRight = selectedPosition ? selectedPosition.x < 90 : true;
  const summaryX = selectedPosition ? selectedPosition.x + (summaryOnRight ? 156 : -444) : 0;
  const summaryY = selectedPosition ? selectedPosition.y - 70 : 0;
  const lineStartX = selectedPosition ? selectedPosition.x + (summaryOnRight ? 128 : -128) : 0;
  const lineEndX = selectedPosition ? selectedPosition.x + (summaryOnRight ? 156 : -156) : 0;
  const lineLeft = Math.min(lineStartX, lineEndX);
  const lineWidth = Math.abs(lineEndX - lineStartX);

  return (
    <div ref={orbitRef} className="relative overflow-visible px-1 py-2 md:px-4">
      <div className="absolute left-1/2 top-8 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full border border-[#d7be90]/26" />
      <div className="absolute left-1/2 top-20 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full border border-[#d6a84b]/24" />

      <div className="relative z-10 grid gap-5">
        <div className="grid gap-3 lg:hidden">
          {supportingCultures.map((culture) => {
            const isActive = activeCulture === culture.title;
            const isLogoOnly = culture.title === "Kavuri" || culture.title === "NIRDPR";
            return (
              <div key={culture.title} className="grid gap-3">
                <button
                  type="button"
                  onClick={() => centerNode(culture.title)}
                  data-orbit-card
                  className={`flex h-28 w-full items-center justify-center rounded-[1.35rem] border bg-white p-4 transition ${
                    isActive ? "border-[#d6a84b] bg-white shadow-[0_12px_28px_rgba(34,45,38,0.08)]" : "border-[#e8eee9] bg-white"
                  }`}
                  aria-label={culture.title}
                >
                  {isLogoOnly ? (
                    <div className="relative h-20 w-44">
                      <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain" sizes="176px" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-left">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/75 bg-white/85">
                        <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain p-2" sizes="48px" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold leading-tight text-[#173f33]">{culture.title}</h4>
                      </div>
                    </div>
                  )}
                </button>
                {isActive ? <CultureInfoCard culture={culture} /> : null}
              </div>
            );
          })}
        </div>

        <div
          className="relative hidden min-h-[35rem] overflow-visible bg-white lg:block"
          onMouseEnter={() => setAutoRotate(false)}
          onMouseLeave={() => {
            setHoveredCulture(null);
            if (!activeCulture) {
              setAutoRotate(true);
            }
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d6a84b]/38" />
          <div className="absolute left-1/2 top-1/2 h-[29rem] w-[29rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e8d4a8]/48" />
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e8d4a8]/22" />
          <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#e8eee9] bg-white text-center shadow-[0_14px_32px_rgba(34,45,38,0.06)]">
            <div className="absolute -inset-4 rounded-full border border-[#d6a84b]/15 opacity-70 [animation:ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute -inset-8 rounded-full border border-[#f2b544]/18 opacity-50 [animation:ping_3.6s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="relative h-20 w-24">
              <Image src={apiCultureFormation.logo} alt="API CULTURE logo" fill className="object-contain" sizes="80px" />
            </div>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#b97816]">{apiCultureFormation.title}</p>
          </div>

          {supportingCultures.map((culture, index) => {
            const isActive = activeCulture === culture.title;
            const isHovered = hoveredCulture === culture.title;
            const isLogoOnly = culture.title === "Kavuri" || culture.title === "NIRDPR";
            const position = calculateNodePosition(index, supportingCultures.length);
            return (
              <div
                key={culture.title}
                className="absolute left-1/2 top-1/2 transition-all duration-700"
                style={{
                  opacity: isActive || isHovered ? 1 : position.opacity,
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${isActive ? 1.1 : isHovered ? 1.16 : position.scale})`,
                  zIndex: isActive || isHovered ? 140 : position.zIndex,
                }}
              >
                <button
                  type="button"
                  onClick={() => centerNode(culture.title)}
                  onMouseEnter={() => setHoveredCulture(culture.title)}
                  onMouseLeave={() => setHoveredCulture(null)}
                  data-orbit-card
                  className={`flex h-28 w-64 items-center justify-center rounded-[1.55rem] border bg-white p-4 transition-all duration-300 ${
                    isActive
                      ? "border-[#d6a84b] shadow-[0_18px_42px_rgba(34,45,38,0.08)]"
                      : isHovered
                        ? "border-[#d6a84b]/75 shadow-[0_14px_34px_rgba(34,45,38,0.07)]"
                        : "border-[#e8eee9] shadow-[0_10px_26px_rgba(34,45,38,0.04)]"
                  }`}
                  aria-label={culture.title}
                >
                  {isLogoOnly ? (
                    <div className="relative h-20 w-48">
                      <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain" sizes="192px" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-left">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/75 bg-white/85 shadow-[0_8px_22px_rgba(99,77,26,0.08)]">
                        <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain p-2" sizes="48px" />
                      </div>
                      <div className="min-w-0">
                        <h4 className={`${culture.title === "API Bee Keeper's Association" ? "text-[1.05rem]" : "text-lg"} font-semibold leading-snug text-[#173f33]`}>
                          {culture.title}
                        </h4>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
          {selectedCulture && selectedPosition ? (
            <>
              <motion.div
                className="pointer-events-none absolute z-[300] h-px bg-[#d6a84b]/60"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{
                  left: `calc(50% + ${lineLeft}px)`,
                  top: `calc(50% + ${selectedPosition.y}px)`,
                  transformOrigin: summaryOnRight ? "left center" : "right center",
                  width: `${lineWidth}px`,
                }}
              />
              <CultureInfoCard
                culture={selectedCulture}
                className="absolute w-72"
                style={{
                  left: `calc(50% + ${summaryX}px)`,
                  top: `calc(50% + ${summaryY}px)`,
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CultureInfoCard({
  culture,
  className = "",
  style,
}: {
  culture: (typeof supportingCultures)[number];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      key={culture.title}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`z-[320] rounded-[1.25rem] border border-[#d6a84b]/45 bg-white p-4 text-left shadow-[0_18px_38px_rgba(34,45,38,0.12)] ${className}`}
      style={style}
    >
      <div className="mb-3 h-px w-full bg-[#d6a84b]/45" />
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#b97816]">{culture.eyebrow}</p>
      <p className="mt-2 text-sm leading-6 text-[#40564d]">{culture.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {culture.points.slice(0, 2).map((point) => (
          <span key={point} className="rounded-full border border-[#e8eee9] bg-white px-3 py-1 text-[11px] font-semibold text-[#61716a]">
            {point}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function TeamMemberTile({
  member,
  index,
}: {
  member: {
    name: string;
    designation: string;
    role: string;
    highlights: string[];
    groupEyebrow: string;
  };
  index: number;
}) {
  const splitName = member.name.replace(/\. /g, ".\n");
  const toneClasses = [
    "from-[#f6f8f3] to-[#eef3ee]",
    "from-[#f8f5ef] to-[#eff4f0]",
    "from-[#f4f7f8] to-[#eef3ef]",
    "from-[#f7f4ef] to-[#f0f4ef]",
  ];
  const portraitTones = [
    {
      skin: "#d7b08a",
      hair: "#59655f",
      shirt: "#ffffff",
      accent: "#f2b544",
    },
    {
      skin: "#c99773",
      hair: "#3d4742",
      shirt: "#f8faf7",
      accent: "#8aa392",
    },
    {
      skin: "#b98567",
      hair: "#2d3833",
      shirt: "#ffffff",
      accent: "#d6a84b",
    },
    {
      skin: "#e0b991",
      hair: "#4b554f",
      shirt: "#f5f7f4",
      accent: "#9fb6a7",
    },
  ];
  const portrait = portraitTones[index % portraitTones.length];

  return (
    <motion.article
      className={`group relative flex min-h-[25rem] overflow-hidden rounded-[1.35rem] bg-gradient-to-b ${toneClasses[index % toneClasses.length]} p-5`}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.06 },
        },
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]" aria-hidden="true">
        <div
          className="absolute bottom-[-1.2rem] right-[-0.8rem] h-56 w-44 rounded-t-[5rem] transition duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03]"
          style={{ backgroundColor: portrait.shirt }}
        />
        <div
          className="absolute bottom-[9.2rem] right-[3.2rem] h-20 w-20 rounded-full shadow-[inset_-10px_-8px_0_rgba(70,55,42,0.08)] transition duration-500 group-hover:-translate-y-1"
          style={{ backgroundColor: portrait.skin }}
        />
        <div
          className="absolute bottom-[13.8rem] right-[2.75rem] h-12 w-24 rounded-t-full transition duration-500 group-hover:-translate-y-1"
          style={{ backgroundColor: portrait.hair }}
        />
        <div
          className="absolute bottom-[13.1rem] right-[4.75rem] h-7 w-12 rounded-b-full"
          style={{ backgroundColor: portrait.hair }}
        />
        <div className="absolute bottom-[11.2rem] right-[4.55rem] h-2 w-2 rounded-full bg-[#173f33]/55" />
        <div className="absolute bottom-[11.2rem] right-[6.2rem] h-2 w-2 rounded-full bg-[#173f33]/55" />
        <div className="absolute bottom-[10.2rem] right-[5.08rem] h-1.5 w-5 rounded-full bg-[#173f33]/30" />
        <div
          className="absolute bottom-[4.3rem] right-[1.6rem] h-10 w-40 rounded-full opacity-80"
          style={{ backgroundColor: portrait.accent }}
        />
        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white/42 blur-2xl" />
      </div>
      <div className="relative z-10 flex min-h-full w-full flex-col">
        <div>
          <h4 className="whitespace-pre-line text-[clamp(1.65rem,2.2vw,2.35rem)] font-black leading-[0.88] tracking-[-0.04em] text-[#111813]">
            {splitName}
          </h4>
          <p className="mt-3 font-display text-sm italic text-[#7f8d85]">{member.groupEyebrow}</p>
          <p className="mt-2 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-[#b97816]">{member.designation}</p>
        </div>

        <div className="relative mt-auto pt-8">
          <p className="relative z-10 max-w-[13.5rem] text-sm font-medium leading-6 text-[#4f6058]">{member.role}</p>
          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            {member.highlights.slice(0, 2).map((highlight) => (
              <span key={highlight} className="rounded-full bg-white/76 px-3 py-1 text-[11px] font-bold text-[#61716a]">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function FactStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className="flex min-h-40 flex-col justify-between rounded-[1.65rem] border border-[#e8eee9] bg-white p-6 shadow-[0_12px_30px_rgba(34,45,38,0.05)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f1e1] text-[#b97816]">{icon}</div>
      <div>
        <p className="mt-5 text-[clamp(1.75rem,3vw,2.6rem)] font-bold leading-none text-[#173f33]">{value}</p>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#6a7771]">{label}</p>
      </div>
    </div>
  );
}
