"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Award, BriefcaseBusiness, Calendar, GraduationCap, ShieldCheck, Users } from "lucide-react";
import type { SiteLanguage } from "@/lib/i18n";
import { getSiteCopy } from "@/lib/site-copy";

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
  },
  {
    title: "API Bee Keeper's Association",
    logo: "/scientific-beekeeping-icon.png",
    eyebrow: "Registered beekeeping association",
    description:
      "The AP Bee Keeper's Association was formed under the leadership of Sri. Kavuri Venkateshwara Rao on 27th November 1980 and is part of the center's beekeeping support ecosystem.",
    details: [
      {
        icon: <Users className="h-4 w-4" />,
        title: "Community training",
        description: "Built around practical beekeeping training for rural people, farmers, women, and weaker sections.",
      },
      {
        icon: <Calendar className="h-4 w-4" />,
        title: "Established in 1980",
        description: "The association adds long-running field credibility to the API CULTURE story.",
      },
    ],
  },
  {
    title: "NIRDPR",
    logo: "/nirdpr-logo.jpeg",
    eyebrow: "Institutional association",
    description:
      "NIRDPR is the institutional anchor named in the source text, linking the center's formation to Rural Technology Park and a broader public-sector development context.",
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
  },
] as const;

const memberPortraits: Record<string, { src: string; alt: string; objectPosition: string }> = {
  "Sree Sambashiva Rao": {
    src: "/team/k-sambashiva-rao.jpeg",
    alt: "Sree Sambashiva Rao portrait",
    objectPosition: "50% 6%",
  },
  "P. Ravindra Kumar": {
    src: "/team/p-ravindra-kumar.png",
    alt: "P. Ravindra Kumar portrait",
    objectPosition: "50% 4%",
  },
  "Smt. Sita Rathnam": {
    src: "/team/smt-sita-rathnam.png",
    alt: "Smt. Sita Rathnam portrait",
    objectPosition: "50% 5%",
  },
  "Sree Subba Rao": {
    src: "/team/k-subba-rao.jpeg",
    alt: "Sree Subba Rao portrait",
    objectPosition: "50% 7%",
  },
};

const localizedOrbitCopy = {
  en: {
    eyebrow: "Three cultures. One mission.",
    title: "",
    body: "",
    explorePrograms: "Explore programs",
    sharedEcosystem: "Shared apiculture ecosystem",
    clickToView: "Click to view",
  },
  te: {
    eyebrow: "ఫార్మేషన్ ఎకోసిస్టమ్",
    title: "మూడు మద్దతు సంస్కృతులతో ఏర్పడిన API CULTURE",
    body: "API CULTURE మధ్యలో ఉండగా, దాని డాక్యుమెంట్ చేసిన మద్దతు వ్యవస్థ చుట్టూ తిరిగే పాత About పేజీ విజువల్ ఇక్కడ మళ్లీ కనిపిస్తుంది.",
    explorePrograms: "కార్యక్రమాలు చూడండి",
    sharedEcosystem: "షేర్డ్ అపికల్చర్ ఎకోసిస్టమ్",
    clickToView: "చూడటానికి క్లిక్ చేయండి",
  },
  hi: {
    eyebrow: "फॉर्मेशन इकोसिस्टम",
    title: "तीन सहयोगी संस्कृतियों से बना API CULTURE",
    body: "यह पुराने About पेज का ऑर्बिट दृश्य वापस लाता है: केंद्र में API CULTURE और उसके चारों ओर दस्तावेजित सहयोगी इकोसिस्टम.",
    explorePrograms: "कार्यक्रम देखें",
    sharedEcosystem: "साझा एपिकल्चर इकोसिस्टम",
    clickToView: "देखने के लिए क्लिक करें",
  },
} satisfies Record<SiteLanguage, Record<string, string>>;

export default function AboutUsSection({ language }: { language: SiteLanguage }) {
  const orbitCopy = localizedOrbitCopy[language];
  const aboutCopy = getSiteCopy(language).about;

  return (
    <section id="about-section" className="scroll-mt-28 bg-white px-3 py-10 text-[#173f33] sm:px-5 sm:py-12 lg:px-8 lg:py-14">
      <div className="sr-only">
        <h1>Api Culture Technology Center</h1>
        <p>
          Api Culture Technology Center was established in 2004 at Rural Technology Park in association with NIRDPR,
          with technical support from the Bee Keepers Association and Kavuri.
        </p>
        <p>
          The center presents itself as a practical mission for training, technology transfer, pollination, and livelihood
          support across rural communities.
        </p>
        <p>
          The mission grows through scientific beekeeping, honey processing, queen rearing, hive product awareness,
          equipment access, and public-facing apiculture education for farmers and future beekeeping entrepreneurs.
        </p>
      </div>

      <div className="mx-auto max-w-[94rem]">
        <div className="mx-auto mb-6 max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#b97816]">{orbitCopy.eyebrow}</p>
          {orbitCopy.title ? (
            <h2 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-black leading-[0.98] text-[#123f31]">
              {orbitCopy.title}
            </h2>
          ) : null}
          {orbitCopy.body ? (
            <p className="mx-auto mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#61716a] sm:text-base sm:leading-8">
              {orbitCopy.body}
            </p>
          ) : null}
        </div>
        <AboutEcosystemOrbit copy={orbitCopy} />
      </div>

      <div className="mx-auto mt-10 max-w-[94rem] sm:mt-12">
        <Image
          src="/about-section-reference.png"
          alt="About Api Culture Technology Center, training benefits, crop yield potential, faculty experience, and pan-India reach"
          width={1792}
          height={1024}
          sizes="(min-width: 1504px) 1504px, 100vw"
          className="block h-auto w-full"
          priority
        />
      </div>

      <AboutPeopleSection
        eyebrow={aboutCopy.peopleEyebrow}
        title={aboutCopy.peopleTitle}
        body={aboutCopy.peopleBody}
        profileLabel={aboutCopy.profileLabel}
        groups={aboutCopy.peopleGroups}
      />
    </section>
  );
}

type AboutPeopleSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  profileLabel: string;
  groups: ReturnType<typeof getSiteCopy>["about"]["peopleGroups"];
};

function AboutPeopleSection({ eyebrow, title, body, profileLabel, groups }: AboutPeopleSectionProps) {
  const members = groups.flatMap((group) =>
    group.members.map((member, memberIndex) => ({
      ...member,
      groupEyebrow: group.eyebrow,
      groupTitle: group.title,
      tone: memberIndex === 0 && group.title === groups[0].title ? "deep" : memberIndex === 1 ? "gold" : "light",
    })),
  );

  return (
    <div className="mx-auto mt-10 max-w-[94rem] rounded-[1.65rem] border border-[#eadbb7] bg-[#fffdf8] px-4 py-10 shadow-[0_32px_90px_rgba(31,54,44,0.10)] sm:mt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-sm italic leading-none text-[#9c8b6a]">{eyebrow}</p>
        <h3 className="mt-3 text-[clamp(2.25rem,5vw,4.8rem)] font-black leading-[0.92] text-[#111c18]">
          {title}
        </h3>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-7 text-[#68776f] sm:text-base sm:leading-8">
          {body}
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {members.map((member, index) => {
          const portrait = memberPortraits[member.name];
          const designationLines = member.designation.split("|").map((line) => line.trim()).filter(Boolean);
          const portraitEyebrow = designationLines.length > 1 ? designationLines[0] : member.groupEyebrow;
          const portraitSubtext = designationLines.length > 1 ? designationLines.slice(1).join(" | ") : member.designation;

          return (
          <article
            key={member.name}
            className={`group relative isolate min-h-[26rem] overflow-hidden rounded-[1.35rem] border border-[#e8dcc4] bg-[#f3f2ef] shadow-[0_20px_48px_rgba(31,54,44,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(31,54,44,0.16)] ${
              portrait ? "p-0" : "p-5"
            }`}
          >
            {portrait ? (
              <>
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1280px) 50vw, 24rem"
                  className="object-cover"
                  style={{ objectPosition: portrait.objectPosition }}
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,14,0.14)_0%,rgba(7,18,14,0.02)_34%,rgba(7,18,14,0.74)_100%)]" aria-hidden="true" />
              </>
            ) : null}
            <div
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-[58%] ${
                portrait
                  ? "bg-transparent"
                  : member.tone === "deep"
                    ? "bg-[linear-gradient(180deg,rgba(18,63,49,0),rgba(18,63,49,0.18))]"
                    : member.tone === "gold"
                      ? "bg-[linear-gradient(180deg,rgba(242,181,68,0),rgba(242,181,68,0.28))]"
                      : "bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(220,229,222,0.74))]"
              }`}
            />
            {!portrait ? (
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b97816]">{profileLabel}</p>
                <h4 className="mt-2 text-[clamp(1.65rem,2.2vw,2.15rem)] font-black leading-[0.96] text-[#111c18]">
                  {member.name}
                </h4>
                <p className="mt-3 max-w-[13rem] text-sm font-bold italic leading-5 text-[#7a827d]">{member.designation}</p>
              </div>
            ) : null}

            {!portrait ? (
              <div className="pointer-events-none absolute inset-x-4 bottom-12 flex justify-center">
                <div className="relative h-44 w-44 rounded-full bg-[linear-gradient(180deg,#ffffff,#e8ece8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_44px_rgba(23,63,51,0.12)]">
                  <div className="absolute left-1/2 top-7 h-20 w-20 -translate-x-1/2 rounded-full bg-[#d6ddd8]" />
                  <div className="absolute bottom-0 left-1/2 h-28 w-36 -translate-x-1/2 rounded-t-[4rem] bg-[#ffffff]" />
                  <div className="absolute bottom-6 left-1/2 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-[1.25rem] bg-[#123f31] text-2xl font-black text-[#f2b544] shadow-[0_16px_30px_rgba(18,63,49,0.22)]">
                    {initials(member.name, index)}
                  </div>
                </div>
              </div>
            ) : null}

            <div className={`absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3 ${
              portrait ? "min-h-[7.25rem] rounded-[1rem] border border-white/18 bg-[#081710]/76 p-4 shadow-[0_18px_34px_rgba(0,0,0,0.24)] backdrop-blur-md" : ""
            }`}>
              <div className="min-w-0">
                {portrait ? (
                  <div className="grid h-full min-h-[5.1rem] content-center gap-1.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#f6cf74]">
                      {portraitEyebrow}
                    </p>
                    <h4 className="text-[clamp(1.18rem,1.35vw,1.45rem)] font-black leading-[1.05] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.36)]">
                      {member.name}
                    </h4>
                    <p className="line-clamp-2 text-[10px] font-black uppercase leading-4 tracking-[0.09em] text-white/88">
                      {portraitSubtext}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${portrait ? "text-[#f6cf74]" : "text-[#6c7b73]"}`}>{member.groupEyebrow}</p>
                    {portrait ? (
                      <h4 className="mt-1 text-[clamp(1.2rem,1.55vw,1.45rem)] font-black leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.36)]">
                        {member.name}
                      </h4>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            <div className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${
              portrait ? "border border-white/22 bg-black/28 text-white backdrop-blur-md" : "border border-[#e2d5b8] bg-white/76 text-[#123f31]"
            }`}>
              {member.highlights[0]}
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}

function initials(name: string, fallback: number) {
  const letters = name
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Z]/g, "").charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return letters || String(fallback + 1).padStart(2, "0");
}

function AboutEcosystemOrbit({ copy }: { copy: Record<string, string> }) {
  const [activeCulture, setActiveCulture] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredCulture, setHoveredCulture] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!activeCulture) {
      return;
    }

    const closeOnScroll = () => {
      setActiveCulture(null);
      setAutoRotate(true);
    };

    window.addEventListener("scroll", closeOnScroll, { passive: true });

    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [activeCulture]);

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
    const radiusX = 440;
    const radiusY = 238;
    const x = Number((radiusX * Math.cos(radian)).toFixed(3));
    const y = Number((radiusY * Math.sin(radian)).toFixed(3));
    const lineLength = Math.hypot(x, y);
    const lineAngle = Number((Math.atan2(y, x) * (180 / Math.PI)).toFixed(3));
    const zIndex = Math.round(90 + 35 * Math.sin(radian));
    const opacity = Number(Math.max(0.88, Math.min(1, 0.9 + 0.1 * ((1 + Math.sin(radian)) / 2))).toFixed(3));
    const scale = Number((0.98 + 0.04 * ((1 + Math.sin(radian)) / 2)).toFixed(3));

    return { lineAngle, lineLength, opacity, scale, x, y, zIndex };
  };

  const centerNode = (cultureTitle: string) => {
    const nodeIndex = supportingCultures.findIndex((culture) => culture.title === cultureTitle);
    if (nodeIndex < 0) {
      return;
    }

    setActiveCulture(cultureTitle);
    setAutoRotate(false);
  };

  const orbitPositions = supportingCultures.map((culture, index) => ({
    culture,
    position: calculateNodePosition(index, supportingCultures.length),
  }));

  return (
    <div
      className="relative overflow-visible p-0"
      onClick={() => {
        setActiveCulture(null);
        setAutoRotate(true);
      }}
    >
      <div className="relative z-10 grid gap-5">
        <div className="grid gap-3 lg:hidden">
          {supportingCultures.map((culture) => {
            const isActive = activeCulture === culture.title;
            return (
              <button
                type="button"
                key={culture.title}
                onClick={(event) => {
                  event.stopPropagation();
                  centerNode(culture.title);
                }}
                className={`rounded-[1.15rem] border p-4 text-left transition ${
                  isActive ? "border-[#d6a84b] bg-white/90 shadow-[0_16px_34px_rgba(184,120,22,0.14)]" : "border-white/70 bg-white/56"
                }`}
              >
                <CultureOrbitContent culture={culture} active={isActive} copy={copy} compact />
              </button>
            );
          })}
        </div>

        <div
          className="relative hidden min-h-[45rem] overflow-visible lg:block"
          onMouseEnter={() => setAutoRotate(false)}
          onMouseLeave={() => {
            setHoveredCulture(null);
            if (!activeCulture) {
              setAutoRotate(true);
            }
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c15f]/24 blur-sm" />
          <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d6a84b]/38" />
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e8d4a8]/48" />
          <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e8d4a8]/22" />
          {orbitPositions.map(({ culture, position }) => (
            <span
              key={`${culture.title}-connector`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[1.5px] origin-left bg-[repeating-linear-gradient(90deg,#b97816_0_8px,transparent_8px_16px)]"
              style={{
                opacity: activeCulture === culture.title || hoveredCulture === culture.title ? 0.82 : 0.58,
                transform: `rotate(${position.lineAngle}deg)`,
                width: `${position.lineLength}px`,
              }}
              aria-hidden="true"
            />
          ))}

          <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,248,234,0.64))] text-center shadow-[0_22px_54px_rgba(99,77,26,0.14)] ring-1 ring-[#e6d2a9]/40 backdrop-blur-xl">
            <div className="absolute -inset-4 rounded-full border border-[#d6a84b]/15 opacity-70 [animation:ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute -inset-8 rounded-full border border-[#f2b544]/18 opacity-50 [animation:ping_3.6s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="relative h-16 w-20">
              <Image src={apiCultureFormation.logo} alt="API CULTURE logo" fill className="object-contain" sizes="80px" />
            </div>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#b97816]">{apiCultureFormation.title}</p>
            <p className="mt-1 px-4 text-xs leading-5 text-[#61716a]">{copy.sharedEcosystem}</p>
          </div>

          {orbitPositions.map(({ culture, position }) => {
            const isActive = activeCulture === culture.title;
            const isHovered = hoveredCulture === culture.title;
            return (
              <button
                type="button"
                key={culture.title}
                onClick={(event) => {
                  event.stopPropagation();
                  centerNode(culture.title);
                }}
                onMouseEnter={() => setHoveredCulture(culture.title)}
                onMouseLeave={() => setHoveredCulture(null)}
                className={`absolute left-1/2 top-1/2 ${isActive ? "w-[22rem] xl:w-[24rem]" : culture.title === "API Bee Keeper's Association" ? "w-64" : "w-52"} rounded-[1.25rem] border p-4 text-left backdrop-blur-xl transition-[border-color,background-color,box-shadow,opacity,width] duration-200 ${
                  isActive
                    ? "border-[#d6a84b] bg-[linear-gradient(180deg,rgba(255,249,235,0.94),rgba(255,255,255,0.68))] shadow-[0_28px_60px_rgba(184,120,22,0.2)]"
                    : isHovered
                      ? "border-[#d6a84b]/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,250,242,0.8))] shadow-[0_22px_46px_rgba(99,77,26,0.14)]"
                      : "border-[#e0c584]/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,250,242,0.74))] shadow-[0_18px_42px_rgba(99,77,26,0.12)]"
                }`}
                style={{
                  opacity: isActive || isHovered ? 1 : position.opacity,
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${isActive || isHovered ? 1.02 : position.scale})`,
                  zIndex: isActive || isHovered ? 140 : position.zIndex,
                }}
              >
                <CultureOrbitContent culture={culture} active={isActive} copy={copy} note={isHovered ? copy.clickToView : undefined} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CultureOrbitContent({
  culture,
  active,
  compact = false,
  copy,
  note,
}: {
  culture: (typeof supportingCultures)[number];
  active: boolean;
  compact?: boolean;
  copy: Record<string, string>;
  note?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/75 bg-white/85 shadow-[0_8px_22px_rgba(99,77,26,0.08)]">
          <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain p-2" sizes="48px" />
        </div>
        <div className="min-w-0">
          <h4 className={`${culture.title === "API Bee Keeper's Association" ? "text-[1.05rem]" : "text-lg"} font-black leading-snug text-[#173f33]`}>
            {culture.title}
          </h4>
          {note && !active ? <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#b97816]">{note}</p> : null}
        </div>
      </div>

      {active ? (
        <div className={compact ? "mt-4 space-y-4" : "mt-4 space-y-3"}>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7d8b84]">{culture.eyebrow}</p>
          <p className={`${compact ? "text-sm leading-7" : "text-[13px] leading-6"} font-semibold text-[#5f6e67]`}>
            {culture.description}
          </p>
          <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-2 sm:grid-cols-2"}>
            {culture.details.map((detail) => (
              <div key={detail.title} className="rounded-[0.9rem] border border-white/65 bg-white/62 p-3 shadow-[0_8px_18px_rgba(99,77,26,0.05)]">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f8f1e1] text-[#b97816]">{detail.icon}</span>
                  <span className="text-sm font-black leading-snug text-[#173f33]">{detail.title}</span>
                </div>
                <p className={`${compact ? "mt-2 leading-5" : "mt-1.5 leading-[1.35]"} text-xs font-semibold text-[#62706a]`}>{detail.description}</p>
              </div>
            ))}
          </div>
          <Link
            href="/programs"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f2b544] px-4 py-2 text-xs font-black text-[#173f33]"
            onClick={(event) => event.stopPropagation()}
          >
            {copy.explorePrograms} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
