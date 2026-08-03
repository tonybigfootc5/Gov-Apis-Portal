"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Bug,
  ChevronRight,
  CircleCheck,
  Factory,
  GraduationCap,
  HandHeart,
  IndianRupee,
  Languages,
  Landmark,
  Lightbulb,
  Sprout,
  Target,
  Timer,
  Tractor,
  UserRound,
  UsersRound,
  Wheat,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { institute } from "@/lib/fallback-data";
import type { SiteLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const TrainingApplicationForm = dynamic(
  () => import("@/components/training-application-form").then((module) => module.TrainingApplicationForm),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-[#e6dfd2] bg-white p-6 text-sm font-semibold text-[#66776f]">
        Loading application form...
      </div>
    ),
  },
);

export type TrainingPreviewCourse = {
  id: string;
  slug: string;
  tabLabel: string;
  title: string;
  summary: string;
  description: string;
  duration: string;
  level: string;
  fee: string;
  capacity: string;
  batchDate: string;
  focusLabel: string;
  focusText: string;
  targetAudience: string;
  imageSrc: string;
  imageAlt: string;
  outcomes: string[];
  skills: string[];
  rating: string;
  ratingLabel: string;
  experienceLabel: string;
  tools: string[];
  certificate: string;
  taughtIn: string;
  testimonial: {
    quote: string;
    name: string;
  };
};

type TrainingPreviewSwitchProps = {
  courses: TrainingPreviewCourse[];
  language: SiteLanguage;
};

type ProgramLogoProps = React.SVGProps<SVGSVGElement>;
type ProgramLogo = (props: ProgramLogoProps) => React.JSX.Element;

const courseIcons: ProgramLogo[] = [ApiaryCartLogo, HoneyJarLogo, QueenBeeLogo, RoyalJellyJarLogo];

const trainingCopy = {
  en: {
    loadingForm: "Loading application form...",
    headingLight: "Our Training",
    headingStrong: "Programs",
    headingAria: "Our Training Programs",
    intro: "Learn. Practice. Grow. Empowering beekeepers for a better tomorrow.",
    railAria: "Training course switcher",
    program: "program",
    courseFee: "Course fee",
    gstIncluded: "GST included",
    enrollNow: "Enroll Now",
    startsAt: "starts at",
    level: "Level",
    duration: "Duration",
    batchSize: "Batch size",
    learn: "What you'll learn",
    taughtIn: "Taught in:",
    aboutCourse: "About this course",
    aboutShort: "About",
    outcomes: "Outcomes",
    attend: "Who can attend?",
    more: "And more...",
    applicationForm: "Application form",
    modalHelp: "Fill the API Culture application without leaving this page.",
    closeApplication: "Close application form",
    benefits: [
      ["Expert Instructors", "Learn from experienced apiculture faculty."],
      ["Practical Approach", "Field-led practice with classroom grounding."],
      ["Modern Facilities", "Apiary, labs, tools, and demonstrations."],
      ["Community Impact", "Building stronger rural livelihoods."],
    ],
    beekeepingAudience: [
      "Farmers",
      "Rural youth",
      "Women",
      "Tribal communities",
      "Landless individuals",
      "Existing beekeepers",
      "Aspiring beekeepers & entrepreneurs",
      "Agriculture & horticulture workers",
      "Anyone interested in starting an apiary",
    ],
  },
  te: {
    loadingForm: "దరఖాస్తు ఫారమ్ లోడ్ అవుతోంది...",
    headingLight: "మా శిక్షణ",
    headingStrong: "కార్యక్రమాలు",
    headingAria: "మా శిక్షణ కార్యక్రమాలు",
    intro: "నేర్చుకోండి. సాధన చేయండి. ఎదగండి. మెరుగైన రేపటి కోసం తేనెటీగల పెంపకదారులను శక్తివంతం చేస్తున్నాం.",
    railAria: "శిక్షణ కార్యక్రమాల ఎంపిక",
    program: "కార్యక్రమం",
    courseFee: "కోర్సు ఫీజు",
    gstIncluded: "GST కలుపుకొని",
    enrollNow: "ఇప్పుడే నమోదు",
    startsAt: "ప్రారంభం",
    level: "స్థాయి",
    duration: "వ్యవధి",
    batchSize: "బ్యాచ్ పరిమాణం",
    learn: "మీరు నేర్చుకునేవి",
    taughtIn: "బోధించే భాషలు:",
    aboutCourse: "ఈ కోర్సు గురించి",
    aboutShort: "గురించి",
    outcomes: "ఫలితాలు",
    attend: "ఎవరు హాజరు కావచ్చు?",
    more: "ఇంకా మరిన్ని...",
    applicationForm: "దరఖాస్తు ఫారమ్",
    modalHelp: "ఈ పేజీ విడిచిపెట్టకుండా API Culture దరఖాస్తును పూరించండి.",
    closeApplication: "దరఖాస్తు ఫారమ్ మూసివేయండి",
    benefits: [
      ["నిపుణులైన శిక్షకులు", "అనుభవజ్ఞులైన అపికల్చర్ అధ్యాపకుల నుంచి నేర్చుకోండి."],
      ["ప్రాయోగిక విధానం", "తరగతి బోధనతో పాటు ఫీల్డ్ ప్రాక్టీస్."],
      ["ఆధునిక సదుపాయాలు", "అపియరీ, ల్యాబ్స్, పరికరాలు మరియు ప్రదర్శనలు."],
      ["సమాజ ప్రభావం", "బలమైన గ్రామీణ జీవనోపాధి నిర్మాణం."],
    ],
    beekeepingAudience: [
      "రైతులు",
      "గ్రామీణ యువత",
      "మహిళలు",
      "గిరిజన సమాజాలు",
      "భూమిలేని వ్యక్తులు",
      "ప్రస్తుత తేనెటీగల పెంపకదారులు",
      "ఆసక్తి ఉన్న పెంపకదారులు మరియు వ్యాపారులు",
      "వ్యవసాయ మరియు ఉద్యానవన కార్మికులు",
      "అపియరీ ప్రారంభించాలనుకునే వారు",
    ],
  },
  hi: {
    loadingForm: "आवेदन फॉर्म लोड हो रहा है...",
    headingLight: "हमारे प्रशिक्षण",
    headingStrong: "कार्यक्रम",
    headingAria: "हमारे प्रशिक्षण कार्यक्रम",
    intro: "सीखें. अभ्यास करें. आगे बढ़ें. बेहतर कल के लिए मधुमक्खी पालकों को सशक्त बनाएं.",
    railAria: "प्रशिक्षण कार्यक्रम चयन",
    program: "कार्यक्रम",
    courseFee: "कोर्स शुल्क",
    gstIncluded: "GST शामिल",
    enrollNow: "अभी नामांकन करें",
    startsAt: "शुरू",
    level: "स्तर",
    duration: "अवधि",
    batchSize: "बैच आकार",
    learn: "आप क्या सीखेंगे",
    taughtIn: "भाषाएं:",
    aboutCourse: "इस कोर्स के बारे में",
    aboutShort: "परिचय",
    outcomes: "परिणाम",
    attend: "कौन शामिल हो सकता है?",
    more: "और भी...",
    applicationForm: "आवेदन फॉर्म",
    modalHelp: "इस पेज को छोड़े बिना API Culture आवेदन भरें.",
    closeApplication: "आवेदन फॉर्म बंद करें",
    benefits: [
      ["विशेषज्ञ प्रशिक्षक", "अनुभवी अपिकल्चर फैकल्टी से सीखें."],
      ["व्यावहारिक तरीका", "कक्षा की समझ के साथ फील्ड अभ्यास."],
      ["आधुनिक सुविधाएं", "एपियरी, लैब, उपकरण और डेमो."],
      ["समुदाय प्रभाव", "मजबूत ग्रामीण आजीविका का निर्माण."],
    ],
    beekeepingAudience: [
      "किसान",
      "ग्रामीण युवा",
      "महिलाएं",
      "जनजातीय समुदाय",
      "भूमिहीन व्यक्ति",
      "मौजूदा मधुमक्खी पालक",
      "इच्छुक पालक और उद्यमी",
      "कृषि और बागवानी कार्यकर्ता",
      "एपियरी शुरू करने में रुचि रखने वाले",
    ],
  },
} as const satisfies Record<SiteLanguage, {
  loadingForm: string;
  headingLight: string;
  headingStrong: string;
  headingAria: string;
  intro: string;
  railAria: string;
  program: string;
  courseFee: string;
  gstIncluded: string;
  enrollNow: string;
  startsAt: string;
  level: string;
  duration: string;
  batchSize: string;
  learn: string;
  taughtIn: string;
  aboutCourse: string;
  aboutShort: string;
  outcomes: string;
  attend: string;
  more: string;
  applicationForm: string;
  modalHelp: string;
  closeApplication: string;
  benefits: readonly (readonly [string, string])[];
  beekeepingAudience: readonly string[];
}>;

type TrainingCopy = (typeof trainingCopy)[SiteLanguage];

const audienceIconRules: Array<{ patterns: string[]; icon: LucideIcon }> = [
  { patterns: ["farmer"], icon: Tractor },
  { patterns: ["rural youth", "youth"], icon: UsersRound },
  { patterns: ["women", "woman"], icon: UserRound },
  { patterns: ["tribal", "communities", "community"], icon: UsersRound },
  { patterns: ["landless"], icon: UserRound },
  { patterns: ["existing beekeeper", "advanced beekeeper", "progressive beekeeper", "beekeeper"], icon: Bug },
  { patterns: ["aspiring", "entrepreneur"], icon: Lightbulb },
  { patterns: ["agriculture", "horticulture", "extension staff"], icon: Wheat },
  { patterns: ["producer", "honey unit", "value-addition", "product-focused unit"], icon: Factory },
  { patterns: ["experienced trainee", "specialized trainee", "trainee", "trainer"], icon: GraduationCap },
];

function getAudienceIcon(label: string) {
  const normalized = label.toLowerCase();
  return audienceIconRules.find((rule) => rule.patterns.some((pattern) => normalized.includes(pattern)))?.icon ?? Sprout;
}

const programBenefits = [
  {
    icon: UsersRound,
    title: "Expert Instructors",
    body: "Learn from experienced apiculture faculty.",
  },
  {
    icon: BookOpenCheck,
    title: "Practical Approach",
    body: "Field-led practice with classroom grounding.",
  },
  {
    icon: Landmark,
    title: "Modern Facilities",
    body: "Apiary, labs, tools, and demonstrations.",
  },
  {
    icon: HandHeart,
    title: "Community Impact",
    body: "Building stronger rural livelihoods.",
  },
] as const;

function ApiaryCartLogo(props: ProgramLogoProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 17 24 8l15 9" strokeWidth="2.6" />
      <path d="M14 18h20v18H14z" strokeWidth="2.4" />
      <path d="M18 22h12M18 27h12" strokeWidth="2.2" />
      <path d="M19 36v3M31 36v3M12 39h25" strokeWidth="2.4" />
      <circle cx="19" cy="40" r="2.3" strokeWidth="2.2" />
      <circle cx="33" cy="40" r="2.3" strokeWidth="2.2" />
      <path d="M24 29c3.5-2.6 5.2.1 5.2 2.1 0 2.6-2.4 4.1-5.2 5.7-2.8-1.6-5.2-3.1-5.2-5.7 0-2 1.7-4.7 5.2-2.1Z" strokeWidth="2.2" />
    </svg>
  );
}

function HoneyJarLogo(props: ProgramLogoProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 7h18M14 12h20M17 17h14" strokeWidth="2.5" />
      <path d="M16 17c-1.4 3.4-2.2 7.3-2.2 11.1V38c0 2.2 1.8 4 4 4h12.4c2.2 0 4-1.8 4-4v-9.9c0-3.8-.8-7.7-2.2-11.1" strokeWidth="2.5" />
      <path d="m24 25 6 5-6 5-6-5 6-5Z" strokeWidth="2.3" />
    </svg>
  );
}

function QueenBeeLogo(props: ProgramLogoProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m18 14-2.6-6 5.7 2.2L24 5l2.9 5.2L32.6 8 30 14H18Z" strokeWidth="2.3" />
      <path d="M17 17h14" strokeWidth="2.3" />
      <path d="M24 22c4 0 7.2 3.4 7.2 7.6S28 39 24 39s-7.2-5.2-7.2-9.4S20 22 24 22Z" strokeWidth="2.4" />
      <path d="M16.8 29.8c-5.7-1.1-7.2-5.8-4.3-8.2 2.8-2.3 6.6-.1 8.2 2.4M31.2 29.8c5.7-1.1 7.2-5.8 4.3-8.2-2.8-2.3-6.6-.1-8.2 2.4" strokeWidth="2.3" />
      <path d="M24 22v17M18.6 31h10.8" strokeWidth="2.1" />
    </svg>
  );
}

function RoyalJellyJarLogo(props: ProgramLogoProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m17 13-2.2-5 5 1.9L24 5l4.2 4.9 5-1.9-2.2 5H17Z" strokeWidth="2.2" />
      <path d="M18 16h12M16 21h16" strokeWidth="2.4" />
      <path d="M17.5 21c-1.2 2.9-1.9 6.2-1.9 9.4V38c0 2.2 1.8 4 4 4h8.8c2.2 0 4-1.8 4-4v-7.6c0-3.2-.7-6.5-1.9-9.4" strokeWidth="2.5" />
      <path d="M20.5 30h7M20.5 35h7" strokeWidth="2.1" />
    </svg>
  );
}

export function TrainingPreviewSwitch({ courses, language }: TrainingPreviewSwitchProps) {
  const copy = trainingCopy[language] ?? trainingCopy.en;
  const [active, setActive] = React.useState(0);
  const [applicationCourse, setApplicationCourse] = React.useState<TrainingPreviewCourse | null>(null);
  const courseOverviewRef = React.useRef<HTMLElement | null>(null);
  const course = courses[active] ?? courses[0];
  const serviceOptions = courses.map((item) => ({
    title: item.title,
    duration: item.duration,
    level: item.level,
  }));

  if (!course) return null;

  function openApplicationForCourse(selectedCourse: TrainingPreviewCourse) {
    setApplicationCourse(selectedCourse);
  }

  function selectCourse(index: number) {
    setActive(index);

    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      window.requestAnimationFrame(() => {
        courseOverviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#fffdfa] px-3 py-7 text-[#16241f] sm:px-5 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_5%,rgba(246,179,0,0.14),transparent_22rem),radial-gradient(circle_at_92%_2%,rgba(15,75,51,0.14),transparent_24rem),linear-gradient(180deg,#ffffff_0%,#fffaf0_56%,#ffffff_100%)]" />

      <div className="relative mx-auto max-w-[94rem]">
        <TrainingHeader copy={copy} />

        <div
          className="training-program-shell mt-6"
          style={getCourseSurfaceStyle()}
        >
          <div className="training-program-layout">
            <TrainingRail courses={courses} active={active} copy={copy} onSelect={selectCourse} />
            <CourseOverview key={course.id} course={course} copy={copy} overviewRef={courseOverviewRef} onEnroll={() => openApplicationForCourse(course)} />
          </div>
        </div>
      </div>

      {applicationCourse ? (
        <ApplicationOverlay
          course={applicationCourse}
          language={language}
          serviceOptions={serviceOptions}
          onClose={() => setApplicationCourse(null)}
        />
      ) : null}
    </section>
  );
}

function TrainingHeader({ copy }: { copy: TrainingCopy }) {
  return (
    <header className="mx-auto max-w-7xl text-left">
      <h1
        aria-label={copy.headingAria}
        className="max-w-full whitespace-nowrap font-light leading-[1.02]"
        style={{ color: "#d8dad7", fontSize: "clamp(1.55rem, 5.8vw, 5.7rem)" }}
      >
        <span>{copy.headingLight} </span>
        <span className="font-semibold" style={{ color: "#111513" }}>
          {copy.headingStrong}
        </span>
      </h1>
      <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-[#26332f] sm:text-lg">
        {copy.intro}
      </p>
      <span className="mt-5 block h-1 w-16 rounded-full bg-[#063f2e] shadow-[2px_2px_0_#f5b300]" />
    </header>
  );
}

function TrainingRail({
  courses,
  active,
  copy,
  onSelect,
}: {
  courses: TrainingPreviewCourse[];
  active: number;
  copy: TrainingCopy;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className="training-program-rail grid gap-4">
      <div
        role="tablist"
        aria-label={copy.railAria}
        className="training-program-rail-list"
      >
        {courses.map((course, index) => {
          const isActive = index === active;
          const Icon = courseIcons[index % courseIcons.length] ?? GraduationCap;

          return (
            <button
              key={course.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(index)}
              className={cn(
                "training-program-tab group relative flex min-h-[6.6rem] w-full min-w-0 items-center gap-4 rounded-lg border px-4 py-4 text-left shadow-[0_14px_30px_rgba(36,41,34,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efa500] focus-visible:ring-offset-2",
                isActive
                  ? "training-program-tab-active border-[#0b382b] bg-[#0f4a38] text-white shadow-[0_20px_42px_rgba(15,74,56,0.24)]"
                  : "border-[#f0e8dc] bg-white/78 text-[#111f1a] hover:-translate-y-0.5 hover:border-[#f1c866] hover:bg-white",
              )}
            >
              <span
                className={cn(
                  "grid h-14 w-14 shrink-0 place-items-center bg-[#f5b300] text-[#062f24] transition hex-clip sm:h-16 sm:w-16",
                  isActive
                    ? "shadow-[0_0_0_5px_rgba(245,179,0,0.18),0_16px_30px_rgba(245,179,0,0.22)]"
                    : "shadow-[0_10px_22px_rgba(245,179,0,0.16)] group-hover:shadow-[0_0_0_4px_rgba(245,179,0,0.14),0_14px_26px_rgba(245,179,0,0.2)]",
                )}
              >
                <Icon className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={2.35} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-1 items-center self-stretch">
                <span className="block text-[1.12rem] font-black leading-[1.08] sm:text-[1.26rem] lg:text-[1.18rem] xl:text-[1.4rem]">{course.tabLabel}</span>
              </span>
              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full transition", isActive ? "bg-[#f5b300] text-[#0f2f25] shadow-[0_10px_18px_rgba(245,179,0,0.24)]" : "bg-[#f5f1eb] text-[#10251d] group-hover:bg-[#f5b300]")}>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <TrainingTimingPanel />
      <BenefitPanel copy={copy} />
    </aside>
  );
}

function TrainingTimingPanel() {
  return (
    <section className="rounded-lg border border-[#ead8ad] bg-[linear-gradient(180deg,#fff8df,#fffdf8)] p-3 shadow-[0_14px_32px_rgba(36,41,34,0.06)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#eadfca] pb-3">
        <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-[#06432f]">Training schedule</h3>
        <span className="h-2 w-2 rounded-full bg-[#f5b300] shadow-[0_0_0_4px_rgba(245,179,0,0.18)]" />
      </div>
      <div className="mt-3 grid gap-2">
        <div className="flex items-start gap-3 rounded-lg border border-[#efe4d2] bg-white px-3 py-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#06432f] text-[#f5b300] shadow-[inset_0_0_0_3px_rgba(255,255,255,0.08)]">
            <Timer className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-[#14241f]">Training Hrs</h4>
            <p className="mt-1 text-xs font-semibold leading-5 text-[#293834]">{institute.trainingHours}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[#efe4d2] bg-white px-3 py-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#06432f] text-[#f5b300] shadow-[inset_0_0_0_3px_rgba(255,255,255,0.08)]">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-[#14241f]">Training Location</h4>
            <p className="mt-1 text-xs font-semibold leading-5 text-[#293834]">{institute.trainingLocation}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseOverview({
  course,
  copy,
  overviewRef,
  onEnroll,
}: {
  course: TrainingPreviewCourse;
  copy: TrainingCopy;
  overviewRef: React.RefObject<HTMLElement | null>;
  onEnroll: () => void;
}) {
  const skills = normalizeSkills(course, copy);
  const audience = getAudienceItems(course, copy);
  const feeLabel = formatFeeForDisplay(course.fee);
  const hasLongTitle = course.title.length > 28;
  function handleEnrollClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onEnroll();
  }

  return (
    <article ref={overviewRef} className="training-course-panel scroll-mt-24 overflow-hidden rounded-lg border border-[#0b382b] bg-[#0f4a38] p-2.5 shadow-[0_18px_46px_rgba(15,74,56,0.18)] sm:p-3">
      <div className="relative min-h-[20rem] overflow-hidden rounded-lg p-5 sm:p-6 lg:min-h-[19.5rem] lg:pb-6">
        <Image src={course.imageSrc} alt={course.imageAlt} fill sizes="(max-width: 1280px) 100vw, 46rem" className="object-cover object-right" priority />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fffdf8_0%,rgba(255,253,248,0.98)_33%,rgba(255,253,248,0.72)_55%,rgba(255,253,248,0.18)_100%)]" />
        <div className="relative lg:pr-[29rem]">
          <p className="inline-flex rounded-full bg-[#f5a900] px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-white">
            {course.duration} {copy.program}
          </p>
          <h2
            className={cn(
              "mt-4 max-w-full font-black leading-none text-[#06432f] lg:whitespace-nowrap",
              "lg:w-[calc(100%+29rem)]",
              hasLongTitle ? "text-[clamp(1.65rem,2.25vw,2.55rem)]" : "text-[clamp(2rem,4.6vw,3.25rem)]",
            )}
          >
            {course.title}
          </h2>
          <p className="mt-2 text-base font-black leading-6 text-[#153f32] sm:text-lg">{course.focusLabel}</p>
          <p className="mt-3 max-w-none text-[0.94rem] font-semibold leading-6 text-[#24322d] sm:text-base sm:leading-7">{course.description}</p>
        </div>
        <button
          type="button"
          onClick={handleEnrollClick}
          className="group relative z-20 mt-5 flex min-h-[5.35rem] w-full max-w-[27.5rem] items-center gap-2 overflow-visible rounded-[1.35rem] border border-[#f4c75f]/75 bg-[#053727] p-2 text-left shadow-[0_24px_52px_rgba(6,67,47,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_32px_68px_rgba(6,67,47,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efa500] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:min-h-[6rem] sm:gap-3 sm:p-2.5 sm:pr-3 lg:absolute lg:bottom-6 lg:right-6 lg:mt-0"
        >
          <span
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.28rem] bg-[radial-gradient(circle_at_14%_18%,rgba(255,211,103,0.26),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(255,255,255,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.1),transparent_45%)]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute inset-y-3 right-16 hidden w-px bg-[linear-gradient(180deg,transparent,rgba(245,179,0,0.86),transparent)] sm:block"
            aria-hidden="true"
          />
          <span className="relative grid h-[4.25rem] w-[4.75rem] shrink-0 place-items-center rounded-[1.05rem] bg-[linear-gradient(145deg,#ffeaa0,#f5b300_58%,#d98900)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_18px_30px_rgba(0,0,0,0.18)] sm:h-[4.9rem] sm:w-[6.75rem]">
            <span
              className="absolute inset-1 rounded-[0.88rem] opacity-45 [background-image:linear-gradient(30deg,rgba(6,67,47,0.16)_12%,transparent_12.5%,transparent_87%,rgba(6,67,47,0.16)_87.5%,rgba(6,67,47,0.16)),linear-gradient(150deg,rgba(6,67,47,0.16)_12%,transparent_12.5%,transparent_87%,rgba(6,67,47,0.16)_87.5%,rgba(6,67,47,0.16)),linear-gradient(30deg,rgba(6,67,47,0.16)_12%,transparent_12.5%,transparent_87%,rgba(6,67,47,0.16)_87.5%,rgba(6,67,47,0.16)),linear-gradient(150deg,rgba(6,67,47,0.16)_12%,transparent_12.5%,transparent_87%,rgba(6,67,47,0.16)_87.5%,rgba(6,67,47,0.16))] [background-position:0_0,0_0,12px_21px,12px_21px] [background-size:24px_42px]"
              aria-hidden="true"
            />
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[#053727] text-[#f5b300] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_20px_rgba(6,67,47,0.24)] sm:h-11 sm:w-11">
              <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.6} aria-hidden="true" />
            </span>
          </span>
          <span className="relative min-w-0 flex-1 py-1 text-white">
            <span className="flex items-center gap-2">
              <span className="rounded-full border border-[#f5b300]/36 bg-white/8 px-1.5 py-1 text-[7px] font-black uppercase tracking-[0.12em] text-[#ffe39b] sm:px-2 sm:text-[8px] sm:tracking-[0.16em]">
                {copy.courseFee}
              </span>
              <span className="h-px min-w-3 flex-1 bg-[#f5b300]/22" aria-hidden="true" />
            </span>
            <span className="mt-1.5 flex items-end gap-2">
              <span className="whitespace-nowrap text-[1.25rem] font-black leading-none text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.12)] sm:text-[1.7rem]">{feeLabel}</span>
              <span className="hidden pb-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#8dd2a8] sm:inline">{copy.gstIncluded}</span>
            </span>
            <span className="mt-2 flex items-center gap-1.5 text-[9px] font-bold leading-none text-white/78 sm:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5b300] shadow-[0_0_0_3px_rgba(245,179,0,0.14)]" aria-hidden="true" />
              {copy.startsAt} {course.batchDate}
            </span>
          </span>
          <span className="relative grid shrink-0 gap-1 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f5b300] text-[#053727] shadow-[0_14px_28px_rgba(245,179,0,0.28)] transition group-hover:scale-105 group-hover:shadow-[0_18px_34px_rgba(245,179,0,0.34)] sm:h-12 sm:w-12">
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.06em] text-white/88 sm:text-[8px] sm:tracking-[0.08em]">{copy.enrollNow}</span>
          </span>
        </button>
      </div>

      <div className="mt-2.5 grid gap-2.5 rounded-lg border border-[color:var(--course-surface-deep)] bg-white/72 p-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={GraduationCap} label={copy.level} value={course.experienceLabel || course.level} />
        <Metric icon={Timer} label={copy.duration} value={course.duration} />
        <Metric icon={UsersRound} label={copy.batchSize} value={course.capacity} />
        <Metric icon={Languages} label={copy.taughtIn} value={course.taughtIn} />
      </div>

      <div className="pt-2.5">
        <section className="rounded-lg border border-[color:var(--course-surface-deep)] bg-white/78 p-3.5">
          <h3 className="text-lg font-black uppercase tracking-[0.02em] text-[#06432f]">{copy.learn}</h3>
          <div className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
              <p key={skill} className="flex items-center gap-3 text-sm font-medium text-[#24322d]">
                <CircleCheck className="h-4 w-4 shrink-0 fill-[#06432f] text-white" aria-hidden="true" />
                {skill}
              </p>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-2.5 rounded-lg border border-[color:var(--course-surface-deep)] bg-white/78 p-3.5 shadow-[0_8px_22px_rgba(36,41,34,0.04)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#f0e5d2] pb-2.5">
          <h3 className="text-sm font-black uppercase leading-none tracking-[0.07em] text-[#06432f]">
            {copy.attend}
          </h3>
          <div className="flex shrink-0 items-center justify-center gap-1.5 text-[#efa500]">
            <span className="hidden h-px w-7 rounded-full bg-[#2f703c] sm:block" />
            <Bug className="h-3.5 w-3.5" strokeWidth={2.1} aria-hidden="true" />
          </div>
        </div>

        <div className="mt-2.5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {audience.map((item) => {
            const AudienceIcon = getAudienceIcon(item);

            return (
              <p
                key={item}
                className="flex min-h-[2.65rem] min-w-0 items-center gap-2 rounded-lg border border-[#efdfbe] bg-white px-2 py-1.5 text-[10px] font-black capitalize leading-tight text-[#14241f] shadow-[0_5px_14px_rgba(36,41,34,0.03)]"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#f2ddb5] bg-[#fffaf0] text-[#efa500] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <AudienceIcon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span className="line-clamp-2 min-w-0 flex-1 [overflow-wrap:normal] [word-break:normal]">{item}</span>
              </p>
            );
          })}
        </div>
      </section>

      <section className="mt-2.5 rounded-lg border border-[color:var(--course-surface-deep)] bg-white/78 p-3.5 shadow-[0_16px_38px_rgba(36,41,34,0.06)]">
        <div className="flex items-center gap-2 border-b border-[#f0e5d2] pb-3">
          <Target className="h-4 w-4 text-[#06432f]" aria-hidden="true" />
          <h3 className="text-sm font-black uppercase tracking-[0.07em] text-[#06432f]">{copy.outcomes}</h3>
        </div>
        <div className="mt-2.5 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {course.outcomes.map((outcome, index) => (
            <p key={outcome} className="flex gap-3 rounded-lg border border-[#f0eadf] bg-[#fffdf8] p-3 text-sm font-medium leading-6 text-[#24322d]">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#fff0bd] text-xs font-black text-[#06432f]">{index + 1}</span>
              {outcome}
            </p>
          ))}
        </div>
      </section>
    </article>
  );
}

function BenefitPanel({ copy }: { copy: TrainingCopy }) {
  return (
    <section className="rounded-lg border border-[#e8decf] bg-[linear-gradient(180deg,#fffdf8,#f7f5ec)] p-3 shadow-[0_14px_32px_rgba(36,41,34,0.06)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#ebe1d2] pb-3">
        <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-[#06432f]">Why this works</h3>
        <span className="h-2 w-2 rounded-full bg-[#f5b300] shadow-[0_0_0_4px_rgba(245,179,0,0.18)]" />
      </div>
      <div className="mt-3 grid gap-2">
        {programBenefits.map((benefit, index) => {
          const Icon = benefit.icon;
          const localized = copy.benefits[index] ?? [benefit.title, benefit.body];

          return (
            <article key={benefit.title} className="flex items-start gap-3 rounded-lg border border-[#efe4d2] bg-white px-3 py-2.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#06432f] text-[#f5b300] shadow-[inset_0_0_0_3px_rgba(255,255,255,0.08)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-[#14241f]">{localized[0]}</h4>
                <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-[#293834]">{localized[1]}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 h-8 w-8 shrink-0 text-[#06432f]" strokeWidth={1.8} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#14241f]">{label}</p>
        <p className="mt-1 break-words text-sm font-black leading-5 text-[#121f1b]">{value}</p>
      </div>
    </div>
  );
}

function ApplicationOverlay({
  course,
  language,
  serviceOptions,
  onClose,
}: {
  course: TrainingPreviewCourse;
  language: SiteLanguage;
  serviceOptions: Array<{ title: string; duration: string; level: string }>;
  onClose: () => void;
}) {
  const portalElement = typeof document === "undefined" ? null : document.body;

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!portalElement) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[300] bg-[#071421]/58 p-0 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="training-application-title">
      <div className="mx-auto flex h-[100dvh] max-w-6xl flex-col overflow-hidden border border-[#e3ded2] bg-[#fbfaf6] shadow-[0_30px_90px_rgba(7,20,33,0.38)] sm:h-full sm:rounded-lg">
        <div className="flex items-start justify-between gap-4 border-b border-[#e3ded2] bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00]">{trainingCopy[language].applicationForm}</p>
            <h2 id="training-application-title" className="mt-1 text-xl font-black leading-tight text-[#173f33] sm:text-2xl">
              {course.title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#66776f]">{trainingCopy[language].modalHelp}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e3ded2] bg-[#fffdf8] text-[#173f33] transition hover:border-[#b36b00] hover:text-[#b36b00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b36b00]"
            aria-label={trainingCopy[language].closeApplication}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div data-application-scroll className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
          <TrainingApplicationForm language={language} serviceOptions={serviceOptions} selectedServiceTitle={course.title} />
        </div>
      </div>
    </div>,
    portalElement,
  );
}

function normalizeSkills(course: TrainingPreviewCourse, copy: TrainingCopy) {
  const merged = [...course.skills, ...course.outcomes.map((outcome) => summarizeOutcome(outcome))];
  const unique = Array.from(new Set(merged.map((item) => item.trim()).filter(Boolean)));
  return [...unique.slice(0, 9), copy.more];
}

function summarizeOutcome(outcome: string) {
  return outcome
    .replace(/^Understand\s+/i, "")
    .replace(/^Handle\s+/i, "")
    .replace(/^Improve\s+/i, "")
    .replace(/^Apply\s+/i, "")
    .replace(/^Learn\s+/i, "")
    .replace(/^Follow\s+/i, "")
    .replace(/\.$/, "")
    .split(/,| while | through | around | with /)[0]
    .trim();
}

function getAudienceItems(course: TrainingPreviewCourse, copy: TrainingCopy) {
  if (course.id === "program-beekeeping") {
    return [...copy.beekeepingAudience];
  }

  return course.targetAudience
    .replace(/\.$/, "")
    .replace(", and ", ", ")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatFeeForDisplay(fee: string) {
  return fee.replace(/^INR\s*/i, "Rs. ");
}

function getCourseSurfaceStyle(): React.CSSProperties {
  return {
    "--course-surface": "#0f4a38",
    "--course-surface-deep": "#0b382b",
  } as React.CSSProperties;
}
