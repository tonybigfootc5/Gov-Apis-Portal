"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Bug,
  CircleCheck,
  Factory,
  GraduationCap,
  Languages,
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
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt,
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
    <section className="relative isolate overflow-hidden bg-[#f6f6f3] px-3 py-6 text-[#101816] sm:px-5 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(239,165,0,0.12),transparent_28rem),linear-gradient(180deg,#ffffff_0%,#f7f6f2_62%,#ffffff_100%)]" />

      <div className="training-program-shell relative mx-auto max-w-[94rem]">
        <TrainingHeader copy={copy} />

        <div className="mt-7" style={getCourseSurfaceStyle()}>
          <TrainingRail courses={courses} active={active} copy={copy} onSelect={selectCourse} />
          <CourseOverview key={course.id} course={course} copy={copy} overviewRef={courseOverviewRef} onEnroll={() => openApplicationForCourse(course)} />
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
    <header className="mx-auto text-center">
      <h1
        aria-label={copy.headingAria}
        className="max-w-full font-black leading-[0.98] text-[#070b0a]"
        style={{ fontSize: "clamp(2.35rem, 5.4vw, 4.9rem)" }}
      >
        <span>{copy.headingLight} </span>
        <span className="text-[#efa500]">
          {copy.headingStrong}
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#3c4a48] sm:text-base">
        {copy.intro}
      </p>
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
    <aside className="training-program-rail">
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
                "training-program-tab group relative flex min-h-[4.85rem] w-full min-w-0 items-center justify-center gap-4 rounded-lg border px-4 py-4 text-left shadow-[0_12px_28px_rgba(36,41,34,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efa500] focus-visible:ring-offset-2",
                isActive
                  ? "training-program-tab-active border-[#f4c05a] bg-[#fffaf0] text-[#111f1a] shadow-[0_18px_36px_rgba(239,165,0,0.12)]"
                  : "border-[#ece8df] bg-white text-[#111f1a] hover:-translate-y-0.5 hover:border-[#f1c866] hover:bg-[#fffdf8]",
              )}
            >
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#fff3cc] text-[#efa500] transition sm:h-12 sm:w-12",
                  isActive
                    ? "bg-[#fff2c6] text-[#1f1200] shadow-[0_10px_22px_rgba(239,165,0,0.13)]"
                    : "group-hover:bg-[#fff2c6]",
                )}
              >
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 items-center self-stretch">
                <span className="block text-sm font-black leading-tight sm:text-[0.95rem]">{course.tabLabel}</span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
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
    <article ref={overviewRef} className="training-course-panel mt-6 scroll-mt-24">
      <div className="overflow-hidden rounded-[1.2rem] border border-[#ece4d8] bg-white shadow-[0_22px_48px_rgba(36,41,34,0.08)]">
        <div className="relative min-h-[24rem] overflow-hidden p-5 sm:p-7 lg:min-h-[23rem] lg:p-9">
          <Image src={course.imageSrc} alt={course.imageAlt} fill sizes="(max-width: 1280px) 100vw, 82rem" className="object-cover object-right" priority />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fffdf8_0%,rgba(255,253,248,0.97)_33%,rgba(255,253,248,0.74)_55%,rgba(255,253,248,0.1)_100%)]" />
          <div className="relative grid min-h-[19rem] items-center gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="max-w-[38rem]">
              <p className="inline-flex rounded-full bg-[#f2a900] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.04em] text-[#140f00]">
                {course.duration} {copy.program}
              </p>
              <h2
                className={cn(
                  "mt-4 font-black leading-[0.96] text-[#071019]",
                  hasLongTitle ? "text-[clamp(2rem,4vw,3.4rem)]" : "text-[clamp(2.7rem,5.2vw,4.05rem)]",
                )}
              >
                {course.title}
              </h2>
              <p className="mt-3 text-lg font-black leading-6 text-[#f2a000] sm:text-xl">{course.focusLabel}</p>
              <p className="mt-4 max-w-[34rem] text-sm font-semibold leading-7 text-[#263532] sm:text-base">{course.description}</p>
            </div>

            <button
              type="button"
              onClick={handleEnrollClick}
              className="group relative z-20 w-full rounded-lg border border-[#eee8df] bg-white p-5 text-left shadow-[0_22px_46px_rgba(28,31,28,0.17)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_58px_rgba(28,31,28,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efa500] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <span className="block text-sm font-bold text-[#111816]">{copy.courseFee}</span>
              <span className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
                <span className="text-[2.35rem] font-black leading-none text-[#071019]">{feeLabel}</span>
                <span className="pb-1 text-[10px] font-black uppercase text-[#222b29]">{copy.gstIncluded}</span>
              </span>
              <span className="mt-3 block text-sm font-bold text-[#111816]">
                {copy.startsAt} {course.batchDate}
              </span>
              <span className="mt-5 flex min-h-12 overflow-hidden rounded-lg bg-[#042f28] text-white">
                <span className="flex flex-1 items-center justify-center px-4 text-sm font-black">{copy.enrollNow}</span>
                <span className="grid w-14 place-items-center bg-[#f2a900] text-[#071019] transition group-hover:w-16">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 border-t border-[#efe7dc] bg-white px-5 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <Metric icon={GraduationCap} label={copy.level} value={course.experienceLabel || course.level} />
          <Metric icon={Timer} label={copy.duration} value={course.duration} />
          <Metric icon={UsersRound} label={copy.batchSize} value={course.capacity} />
          <Metric icon={Languages} label={copy.taughtIn} value={course.taughtIn} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.98fr)]">
        <section className="rounded-[1rem] border border-[#ece6dc] bg-white p-5 shadow-[0_18px_40px_rgba(36,41,34,0.05)] sm:p-6">
          <SectionTitle title={copy.learn} />
          <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
              <p key={skill} className="flex items-start gap-3 text-sm font-semibold leading-5 text-[#273431]">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#efa500]" strokeWidth={2.4} aria-hidden="true" />
                {skill}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[1rem] border border-[#ece6dc] bg-white p-5 shadow-[0_18px_40px_rgba(36,41,34,0.05)] sm:p-6">
          <SectionTitle title={copy.attend} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {audience.slice(0, 6).map((item, index) => {
              const AudienceIcon = getAudienceIcon(item);
              const isWide = index === 5;

              return (
                <p
                  key={item}
                  className={cn(
                    "flex min-h-[4.25rem] min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-3 py-3 text-center text-[11px] font-black capitalize leading-tight shadow-[0_8px_18px_rgba(36,41,34,0.03)]",
                    isWide ? "sm:col-span-2 xl:col-span-2" : "",
                    "border-[#eee8df] bg-white text-[#111816]",
                  )}
                >
                  <span className="grid h-8 w-8 place-items-center text-[#efa500]">
                    <AudienceIcon className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" />
                  </span>
                  <span className="line-clamp-2 min-w-0">{item}</span>
                </p>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-[1rem] border border-[#ece6dc] bg-white p-5 shadow-[0_18px_40px_rgba(36,41,34,0.05)] sm:p-6">
        <SectionTitle title="Outcomes You'll Achieve" icon={Target} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {course.outcomes.slice(0, 6).map((outcome, index) => (
            <p key={outcome} className="flex gap-3 border-[#f0dfbb] text-xs font-semibold leading-5 text-[#17231f] xl:border-l xl:pl-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f8d98d] text-[11px] font-black text-[#111816]">{String(index + 1).padStart(2, "0")}</span>
              <span>{outcome}</span>
            </p>
          ))}
        </div>
      </section>
    </article>
  );
}

function SectionTitle({ title, icon: Icon }: { title: string; icon?: LucideIcon }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-[#efa500]" aria-hidden="true" /> : null}
        <h3 className="text-xl font-black leading-tight text-[#111816]">{title}</h3>
      </div>
      <span className="mt-2 block h-0.5 w-8 rounded-full bg-[#efa500]" />
    </div>
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
  serviceOptions: Array<{ title: string; duration: string; level: string; imageSrc: string; imageAlt: string }>;
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
    <div className="fixed inset-0 z-[300] bg-[#071421]/58 p-0 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-label={trainingCopy[language].applicationForm}>
      <div className="mx-auto flex h-[100dvh] max-w-6xl flex-col overflow-hidden border border-[#e3ded2] bg-[#fbfaf6] shadow-[0_30px_90px_rgba(7,20,33,0.38)] sm:h-full sm:rounded-lg">
        <div className="flex justify-end border-b border-[#e3ded2] bg-white px-4 py-3 sm:px-6">
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
