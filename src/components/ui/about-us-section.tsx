"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Award, BriefcaseBusiness, Calendar, GraduationCap, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";
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

const localizedOrbitCopy = {
  en: {
    eyebrow: "Formation ecosystem",
    title: "API CULTURE formed by three supporting cultures",
    body: "The orbit view restores the earlier About page visual: API CULTURE at the center, with its documented support ecosystem moving around it.",
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

  return (
    <section id="about-section" className="scroll-mt-28 bg-white px-3 py-10 text-[#173f33] sm:px-5 sm:py-14 lg:px-8">
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

      <div className="mx-auto max-w-[1480px]">
        <div className="mb-6 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#b97816]">{orbitCopy.eyebrow}</p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-black leading-[0.98] text-[#123f31]">
            {orbitCopy.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#61716a] sm:text-base sm:leading-8">
            {orbitCopy.body}
          </p>
        </div>
        <AboutEcosystemOrbit copy={orbitCopy} />
      </div>

      <div className="mx-auto mt-10 max-w-[1792px] overflow-hidden rounded-[1.65rem] bg-white shadow-[0_28px_90px_rgba(31,54,44,0.08)] sm:mt-14">
        <Image
          src="/about-section-reference.png"
          alt="About Api Culture Technology Center, training benefits, crop yield potential, faculty experience, and pan-India reach"
          width={1792}
          height={1024}
          sizes="(min-width: 1800px) 1792px, 100vw"
          className="block h-auto w-full"
          priority
        />
      </div>
    </section>
  );
}

function AboutEcosystemOrbit({ copy }: { copy: Record<string, string> }) {
  const [activeCulture, setActiveCulture] = useState<string>(supportingCultures[0].title);
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
    const lineLength = Math.hypot(x, y);
    const lineAngle = Math.atan2(y, x) * (180 / Math.PI);
    const zIndex = Math.round(90 + 35 * Math.sin(radian));
    const opacity = Math.max(0.54, Math.min(1, 0.62 + 0.38 * ((1 + Math.sin(radian)) / 2)));
    const scale = 0.92 + 0.12 * ((1 + Math.sin(radian)) / 2);

    return { lineAngle, lineLength, opacity, scale, x, y, zIndex };
  };

  const centerNode = (cultureTitle: string) => {
    const nodeIndex = supportingCultures.findIndex((culture) => culture.title === cultureTitle);
    if (nodeIndex < 0) {
      return;
    }

    const targetAngle = (nodeIndex / supportingCultures.length) * 360;
    setRotationAngle(270 - targetAngle);
    setActiveCulture(cultureTitle);
  };

  const orbitPositions = supportingCultures.map((culture, index) => ({
    culture,
    position: calculateNodePosition(index, supportingCultures.length),
  }));

  return (
    <div className="relative overflow-hidden rounded-[1.65rem] border border-[#eadbb7] bg-[linear-gradient(145deg,rgba(255,252,244,0.96),rgba(247,240,225,0.82))] p-4 shadow-[0_30px_90px_rgba(82,57,13,0.12)] ring-1 ring-[#d7be90]/28 md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.62),transparent_26%,transparent_74%,rgba(242,181,68,0.12))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,#9c7a36_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="relative z-10 grid gap-5">
        <div className="grid gap-3 lg:hidden">
          {supportingCultures.map((culture) => {
            const isActive = activeCulture === culture.title;
            return (
              <button
                type="button"
                key={culture.title}
                onClick={() => centerNode(culture.title)}
                className={`rounded-[1.15rem] border p-4 text-left transition ${
                  isActive ? "border-[#d6a84b] bg-white/90 shadow-[0_16px_34px_rgba(184,120,22,0.14)]" : "border-white/70 bg-white/56"
                }`}
              >
                <CultureLogo culture={culture} />
              </button>
            );
          })}
        </div>

        <div
          className="relative hidden min-h-[35rem] overflow-hidden rounded-[1.35rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.48),rgba(255,250,242,0.28))] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] lg:block"
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
          {orbitPositions.map(({ culture, position }) => (
            <span
              key={`${culture.title}-connector`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-px origin-left bg-[repeating-linear-gradient(90deg,#c7ad70_0_7px,transparent_7px_16px)]"
              style={{
                opacity: activeCulture === culture.title || hoveredCulture === culture.title ? 0.68 : 0.34,
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
                onClick={() => centerNode(culture.title)}
                onMouseEnter={() => setHoveredCulture(culture.title)}
                onMouseLeave={() => setHoveredCulture(null)}
                className={`absolute left-1/2 top-1/2 ${culture.title === "API Bee Keeper's Association" ? "w-64" : "w-52"} rounded-[1.25rem] border p-4 text-left backdrop-blur-xl transition-[border-color,background-color,box-shadow,opacity] duration-200 ${
                  isActive
                    ? "border-[#d6a84b] bg-[linear-gradient(180deg,rgba(255,249,235,0.94),rgba(255,255,255,0.68))] shadow-[0_28px_60px_rgba(184,120,22,0.2)]"
                    : isHovered
                      ? "border-[#d6a84b]/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,250,242,0.58))] shadow-[0_22px_46px_rgba(99,77,26,0.12)]"
                      : "border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,250,242,0.46))] shadow-[0_14px_34px_rgba(99,77,26,0.08)]"
                }`}
                style={{
                  opacity: isActive || isHovered ? 1 : position.opacity,
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${isActive || isHovered ? 1.08 : position.scale})`,
                  zIndex: isActive || isHovered ? 140 : position.zIndex,
                }}
              >
                <CultureLogo culture={culture} note={isHovered ? copy.clickToView : undefined} />
              </button>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-[1.35rem] border border-[#d7be90]/38 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,249,239,0.5))] p-5 shadow-[0_22px_54px_rgba(99,77,26,0.1)] md:p-6">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-[#f5c15f]/18" />
          <div className="relative grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-stretch">
            <div>
              <div className="flex items-center gap-4">
                <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[1.15rem] border border-white/70 bg-white/85 shadow-[0_10px_24px_rgba(99,77,26,0.08)]">
                  <Image src={activeDetails.logo} alt={`${activeDetails.title} logo`} fill className="object-contain p-2" sizes="72px" />
                </div>
                <div>
                  <h3 className="text-[clamp(1.8rem,3vw,3.1rem)] font-black leading-[1.03] text-[#173f33]">{activeDetails.title}</h3>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#7d8b84]">{activeDetails.eyebrow}</p>
                </div>
              </div>
              <p className="mt-6 text-[15px] font-semibold leading-8 text-[#5f6e67]">{activeDetails.description}</p>
              <Link href="/programs" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#f2b544] px-5 py-2.5 text-sm font-black text-[#173f33]">
                {copy.explorePrograms} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {activeDetails.details.map((detail) => (
                <DetailCard key={detail.title} icon={detail.icon} title={detail.title} description={detail.description} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CultureLogo({
  culture,
  note,
}: {
  culture: (typeof supportingCultures)[number];
  note?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/75 bg-white/85 shadow-[0_8px_22px_rgba(99,77,26,0.08)]">
        <Image src={culture.logo} alt={`${culture.title} logo`} fill className="object-contain p-2" sizes="48px" />
      </div>
      <div className="min-w-0">
        <h4 className={`${culture.title === "API Bee Keeper's Association" ? "text-[1.05rem]" : "text-lg"} font-black leading-snug text-[#173f33]`}>
          {culture.title}
        </h4>
        {note ? <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#b97816]">{note}</p> : null}
      </div>
    </div>
  );
}

function DetailCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-[1rem] border border-white/65 bg-white/64 p-4 shadow-[0_10px_24px_rgba(99,77,26,0.05)]">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#f8f1e1] p-2 text-[#b97816]">{icon}</div>
        <h4 className="text-base font-black text-[#173f33]">{title}</h4>
      </div>
      <p className="mt-3 text-sm font-semibold leading-7 text-[#62706a]">{description}</p>
    </div>
  );
}
