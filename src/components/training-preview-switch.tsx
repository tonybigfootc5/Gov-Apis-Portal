"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Award,
  BedDouble,
  Bug,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Coffee,
  Factory,
  GraduationCap,
  Languages,
  Link2,
  Lightbulb,
  MapPin,
  Phone,
  ReceiptText,
  Sprout,
  Timer,
  Tractor,
  UserRound,
  UsersRound,
  Wheat,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SiteLanguage } from "@/lib/i18n";
import { contactFaqCategories } from "@/lib/contact-faq";
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
  serviceTitle: string;
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
  enrollmentOpen: boolean;
  enrollmentStatusLabel: string;
  enrollmentMessage: string;
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
    headingLight: "Choose a Program,",
    headingStrong: "Start Your Journey",
    headingAria: "Choose a Program, Start Your Journey",
    intro: "Practical training. Real skills. Better tomorrow.",
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
    selectedProgram: "Selected program",
    nextBatch: "Next batch",
    location: "Location",
    locationValue: "Rajendranagar, Hyd",
    trainingBreakdown: "Training Breakdown",
    programFee: "Program Fee",
    certificateShort: "Certificate on Completion",
    accommodation: "Paid Accommodation Provided",
    refreshments: "Refreshments Included",
    limitedSeats: "Limited Seats",
    callPrompt: "Have questions? Call us",
    whatsapp: "Chat on WhatsApp",
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
    selectedProgram: "Selected program",
    nextBatch: "Next batch",
    location: "Location",
    locationValue: "Rajendranagar, Hyd",
    trainingBreakdown: "Training Breakdown",
    programFee: "Program Fee",
    certificateShort: "Certificate on Completion",
    accommodation: "Paid Accommodation Provided",
    refreshments: "Refreshments Included",
    limitedSeats: "Limited Seats",
    callPrompt: "Have questions? Call us",
    whatsapp: "Chat on WhatsApp",
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
    selectedProgram: "Selected program",
    nextBatch: "Next batch",
    location: "Location",
    locationValue: "Rajendranagar, Hyd",
    trainingBreakdown: "Training Breakdown",
    programFee: "Program Fee",
    certificateShort: "Certificate on Completion",
    accommodation: "Paid Accommodation Provided",
    refreshments: "Refreshments Included",
    limitedSeats: "Limited Seats",
    callPrompt: "Have questions? Call us",
    whatsapp: "Chat on WhatsApp",
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
  selectedProgram: string;
  nextBatch: string;
  location: string;
  locationValue: string;
  trainingBreakdown: string;
  programFee: string;
  certificateShort: string;
  accommodation: string;
  refreshments: string;
  limitedSeats: string;
  callPrompt: string;
  whatsapp: string;
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
  const [enrollmentNotice, setEnrollmentNotice] = React.useState("");
  const [contactHelpOpen, setContactHelpOpen] = React.useState(false);
  const courseOverviewRef = React.useRef<HTMLElement | null>(null);
  const course = courses[active] ?? courses[0];
  const serviceOptions = courses
    .filter((item) => item.enrollmentOpen)
    .map((item) => ({
      title: item.serviceTitle,
      duration: item.duration,
      level: item.level,
      imageSrc: item.imageSrc,
      imageAlt: item.imageAlt,
    }));

  if (!course) return null;

  function openApplicationForCourse(selectedCourse: TrainingPreviewCourse) {
    if (!selectedCourse.enrollmentOpen) {
      setEnrollmentNotice(selectedCourse.enrollmentMessage);
      return;
    }

    setEnrollmentNotice("");
    setApplicationCourse(selectedCourse);
  }

  function selectCourse(index: number) {
    setActive(index);
    setEnrollmentNotice("");

    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      window.requestAnimationFrame(() => {
        courseOverviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#fffdf8] px-3 py-7 text-[#071c16] sm:px-5 lg:px-8 lg:py-9">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_52%_0%,rgba(248,181,29,0.16),transparent_31rem),linear-gradient(180deg,#ffffff_0%,#fffaf0_52%,#fffdf8_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-52 bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.92),rgba(255,255,255,0))]" />

      <div className="relative mx-auto max-w-[94rem]">
        <TrainingHeader copy={copy} />

        <div className="mt-6" style={getCourseSurfaceStyle()}>
          <TrainingRail courses={courses} active={active} copy={copy} onSelect={selectCourse} />
          <CourseOverview
            key={course.id}
            course={course}
            copy={copy}
            overviewRef={courseOverviewRef}
            enrollmentNotice={enrollmentNotice}
            onEnroll={() => openApplicationForCourse(course)}
            onContactHelp={() => setContactHelpOpen(true)}
          />
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
      {contactHelpOpen ? <ContactHelpOverlay language={language} onClose={() => setContactHelpOpen(false)} /> : null}
    </section>
  );
}

function TrainingHeader({ copy }: { copy: TrainingCopy }) {
  return (
    <header className="mx-auto text-center">
      <h1
        aria-label={copy.headingAria}
        className="max-w-full font-black leading-[0.96] text-[#07351f]"
        style={{ fontSize: "clamp(2.5rem, 5.1vw, 4.75rem)", textShadow: "0 3px 0 rgba(7,53,31,0.08)" }}
      >
        <span>{copy.headingLight} </span>
        <span className="text-[#efa500]">
          {copy.headingStrong}
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-3xl text-sm font-semibold leading-6 text-[#151918] sm:text-lg">
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
    <aside>
      <div
        role="tablist"
        aria-label={copy.railAria}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
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
                "group relative grid min-h-[8rem] w-full min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-3 overflow-hidden rounded-[0.9rem] border bg-white p-2.5 text-left shadow-[0_12px_26px_rgba(36,31,16,0.07)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efa500] focus-visible:ring-offset-2 max-[520px]:grid-cols-[6.25rem_minmax(0,1fr)]",
                isActive
                  ? "border-[#f2a900] bg-[#fff9eb] text-[#08251c] shadow-[0_20px_42px_rgba(239,165,0,0.2)]"
                  : "border-[#eee5d6] text-[#08251c] hover:-translate-y-0.5 hover:border-[#f4c05a] hover:bg-[#fffdf7]",
              )}
            >
              <span className="relative min-h-[6.9rem] overflow-hidden rounded-[0.7rem]">
                <Image src={course.imageSrc} alt="" fill sizes="(max-width: 640px) 28vw, (max-width: 1280px) 18vw, 11rem" className="object-cover object-center transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,37,28,0.03),rgba(239,165,0,0.12))]" />
                <span className="absolute left-2.5 top-2.5 grid h-10 w-10 place-items-center rounded-[0.7rem] bg-[#07351f] text-[#ffba17] shadow-[0_8px_18px_rgba(7,53,31,0.22)]">
                  <Icon className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                </span>
              </span>
              {isActive ? (
                <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-[#f2a900] text-white shadow-[0_10px_20px_rgba(239,165,0,0.25)]">
                  <CircleCheck className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                </span>
              ) : null}
              <span className="flex min-w-0 flex-col justify-center py-1.5 pr-8">
                <span className="line-clamp-3 block text-[0.98rem] font-black leading-tight sm:text-[1.08rem]">{course.tabLabel}</span>
                <span className="mt-2 w-fit rounded-full bg-[#dfe9d2] px-2.5 py-1 text-[10px] font-black leading-none text-[#14241f]">
                  {course.duration.replace(/\bdays\b/i, "Days")} Program
                </span>
                <span
                  className={cn(
                    "absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border transition",
                    isActive ? "border-[#f2a900] bg-[#f2a900] text-white" : "border-[#e3ded2] bg-white text-[#07351f] group-hover:border-[#f2a900]",
                  )}
                >
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
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
  enrollmentNotice,
  onEnroll,
  onContactHelp,
}: {
  course: TrainingPreviewCourse;
  copy: TrainingCopy;
  overviewRef: React.RefObject<HTMLElement | null>;
  enrollmentNotice: string;
  onEnroll: () => void;
  onContactHelp: () => void;
}) {
  const skills = normalizeSkills(course, copy);
  const audience = getAudienceItems(course, copy);
  const feeLabel = formatFeeForDisplay(course.fee);
  const dayPlan = getDayPlan(course);
  const gallery = getProgramGallery(course);
  function handleEnrollClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onEnroll();
  }

  return (
    <article ref={overviewRef} className="mt-5 scroll-mt-24 overflow-hidden rounded-[1.05rem] border border-[#f2d796] bg-[#fffaf0] shadow-[0_18px_42px_rgba(67,45,12,0.1)]">
      <div className="grid lg:grid-cols-[29rem_minmax(0,1fr)]">
        <section className="relative min-h-[28rem] overflow-hidden p-6 sm:p-8">
          <Image src={course.imageSrc} alt={course.imageAlt} fill sizes="(max-width: 1024px) 100vw, 30rem" className="object-cover" priority />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.96)_0%,rgba(255,250,240,0.78)_44%,rgba(255,250,240,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(242,169,0,0.18),transparent_15rem)]" />
          <div className="relative max-w-md">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#f2a900] px-3 py-1 text-[10px] font-black uppercase text-[#102119] shadow-[0_8px_18px_rgba(242,169,0,0.22)]">
              <Bug className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.selectedProgram}
            </span>
            <h2 className="mt-4 text-[clamp(2.55rem,5vw,4rem)] font-black leading-[0.93] text-[#07351f]">{course.title}</h2>
            <p className="mt-4 text-lg font-black leading-6 text-[#e59600]">{course.duration.replace(/\bdays\b/i, "Days")} Practical Training</p>
            <p className="mt-3 max-w-sm text-sm font-semibold leading-6 text-[#151918]">{course.description}</p>
          </div>
        </section>

        <section className="bg-white/72">
          <div className="grid gap-4 border-b border-[#ead7b0] px-5 py-5 sm:grid-cols-2 xl:grid-cols-5 xl:px-7">
            <Metric icon={CalendarDays} label={copy.nextBatch} value={course.batchDate} />
            <Metric icon={MapPin} label={copy.location} value={copy.locationValue} />
            <Metric icon={UsersRound} label={copy.batchSize} value={course.capacity} />
            <Metric icon={Languages} label="Languages" value={course.taughtIn} />
            <Metric icon={Timer} label={copy.duration} value={course.duration.replace(/\bdays\b/i, "Days")} />
          </div>

          <div className="grid gap-6 px-5 py-6 xl:grid-cols-[1fr_1.05fr_0.92fr] xl:px-7">
            <section className="xl:border-r xl:border-[#ead7b0] xl:pr-7">
              <SectionTitle title={copy.learn} />
              <div className="mt-5 grid gap-3">
                {skills.slice(0, 8).map((skill) => (
                  <p key={skill} className="flex items-start gap-3 text-sm font-semibold leading-5 text-[#17231f]">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 fill-[#f2a900] text-white" strokeWidth={3} aria-hidden="true" />
                    {skill}
                  </p>
                ))}
              </div>
            </section>

            <section className="xl:border-r xl:border-[#ead7b0] xl:pr-7">
              <SectionTitle title={copy.trainingBreakdown} />
              <div className="mt-5 grid max-h-[22rem] gap-3 overflow-y-auto pr-2">
                {dayPlan.map((day, index) => {
                  const tone = getDayPlanTone(day.track);

                  return (
                    <div key={`${day.title}-${index}`} className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-3">
                      <span className={`relative flex h-8 items-center justify-center text-[11px] font-black ${tone.dayBadge} [clip-path:polygon(12%_0,88%_0,100%_50%,88%_100%,12%_100%,0_50%)]`}>
                        DAY {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-sm font-black leading-5 ${tone.title}`}>{day.title}</p>
                        <p className="text-xs font-semibold leading-5 text-[#293530]">{day.body}</p>
                        {day.segments?.length ? (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {day.segments.map((segment) => {
                              const segmentTone = getDaySegmentTone(segment.kind);
                              const segmentLabel = getDaySegmentLabel(segment.label);

                              return (
                                <span key={segment.label} className={`inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold leading-none ${segmentTone}`}>
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80" aria-hidden="true" />
                                  <span className="shrink-0 text-[9px] uppercase tracking-[0.08em] opacity-75">{segmentLabel.half}</span>
                                  <span className="min-w-0 truncate text-[10px] font-black">{segmentLabel.topic}</span>
                                </span>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <SectionTitle title={copy.attend} />
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
                {audience.slice(0, 6).map((item) => {
                  const AudienceIcon = getAudienceIcon(item);

                  return (
                    <p key={item} className="flex min-h-[5.4rem] min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-[#ead7b0] bg-white/78 px-2 py-3 text-center text-[11px] font-black capitalize leading-tight text-[#102119]">
                      <AudienceIcon className="h-7 w-7 text-[#07351f]" strokeWidth={1.9} aria-hidden="true" />
                      <span className="line-clamp-2 min-w-0">{item}</span>
                    </p>
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      </div>

      <div className="grid items-center gap-3 border-t border-[#ead7b0] bg-[#fffdf8] px-5 py-4 lg:grid-cols-[minmax(12rem,0.95fr)_repeat(4,minmax(6.25rem,0.46fr))_minmax(10.75rem,0.75fr)_minmax(10.75rem,0.75fr)] lg:px-6">
        {enrollmentNotice ? (
          <p className="rounded-lg border border-[#f2c45f] bg-[#fff7e2] px-4 py-3 text-sm font-black leading-6 text-[#6d4300] lg:col-span-full">
            {enrollmentNotice}
          </p>
        ) : null}
        <div className="flex items-center gap-3">
          <Bug className="h-11 w-11 shrink-0 text-[#f2a900]" strokeWidth={1.7} aria-hidden="true" />
          <div>
            <p className="text-sm font-black text-[#102119]">{copy.programFee}</p>
            <p className="flex flex-wrap items-end gap-2 text-[1.72rem] font-black leading-none text-[#07351f]">
              {feeLabel}
              <span className="mb-1 rounded bg-[#07351f] px-2 py-1 text-[10px] uppercase text-white">{copy.gstIncluded}</span>
            </p>
          </div>
        </div>
        <FeaturePill icon={ReceiptText} label={copy.certificateShort} />
        <FeaturePill icon={BedDouble} label={copy.accommodation} />
        <FeaturePill icon={Coffee} label={copy.refreshments} />
        <FeaturePill icon={Award} label={copy.limitedSeats} />
        <button
          type="button"
          onClick={handleEnrollClick}
          className={cn(
            "group inline-flex min-h-14 items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-black shadow-[0_14px_28px_rgba(242,169,0,0.22)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07351f]",
            course.enrollmentOpen
              ? "bg-[#f2a900] text-[#102119] hover:bg-[#ffb81f]"
              : "border border-[#d2bd8b] bg-[#fff4d5] text-[#6d4300] hover:bg-[#ffe8a8]",
          )}
        >
          {course.enrollmentOpen ? copy.enrollNow : course.enrollmentStatusLabel}
          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
        </button>
        <a
          href="https://wa.me/919395507766"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-lg border border-[#07351f] bg-white px-4 py-3 text-sm font-black text-[#07351f] transition hover:-translate-y-0.5 hover:bg-[#f3fff7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07351f]"
        >
          <span className="h-6 w-6" aria-hidden="true">
            <WhatsAppMark />
          </span>
          {copy.whatsapp}
        </a>
      </div>

      <div className="grid gap-4 border-t border-[#ead7b0] bg-[#fffaf0] px-5 py-4 lg:grid-cols-[25rem_minmax(0,1fr)] lg:px-7">
        <button type="button" onClick={onContactHelp} className="flex min-h-20 items-center justify-center gap-4 rounded-lg bg-[#eef1e6] px-5 text-left text-[#07351f] transition hover:bg-[#e7ecd9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07351f]">
          <Phone className="h-9 w-9 shrink-0 fill-[#07351f]/10" strokeWidth={2.2} aria-hidden="true" />
          <span>
            <span className="block text-base font-semibold">{copy.callPrompt}</span>
            <span className="block text-xl font-black leading-tight sm:text-2xl">9395507766</span>
          </span>
        </button>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {gallery.map((item) => (
            <div key={item.src} className="relative min-h-20 overflow-hidden rounded-lg shadow-[0_10px_20px_rgba(67,45,12,0.12)]">
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 50vw, 16vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function SectionTitle({ title, icon: Icon }: { title: string; icon?: LucideIcon }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-[#efa500]" aria-hidden="true" /> : null}
        <h3 className="text-xl font-black leading-tight text-[#102119]">{title}</h3>
      </div>
      <span className="mt-2 block h-0.5 w-9 rounded-full bg-[#f2a900]" />
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 xl:border-r xl:border-[#ead7b0] xl:last:border-r-0 xl:last:pr-0">
      <Icon className="mt-0.5 h-8 w-8 shrink-0 text-[#102119]" strokeWidth={1.8} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[11px] font-bold leading-tight text-[#263530]">{label}</p>
        <p className="mt-1 break-words text-sm font-black leading-5 text-[#102119]">{value}</p>
      </div>
    </div>
  );
}

function ContactHelpOverlay({ language, onClose }: { language: SiteLanguage; onClose: () => void }) {
  const portalElement = typeof document === "undefined" ? null : document.body;
  const copy = trainingCopy[language] ?? trainingCopy.en;

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!portalElement) return null;

  return createPortal(
    <div className="fixed inset-0 z-[320] grid place-items-center bg-[#071421]/58 px-3 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Frequently asked questions before contacting API Culture">
      <section className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.35rem] bg-[#fffdf8] shadow-[0_30px_90px_rgba(4,18,13,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7eee8] bg-[#173f33] px-5 py-5 text-[#fff9ec]">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f5c65e]">Check FAQ first</p>
            <h3 className="mt-2 text-2xl font-black leading-tight">Most questions are answered here</h3>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#d4e1d8]">
              Please review these common answers before calling the center. The contact buttons are available below if you still need help.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c65e]"
            aria-label="Close FAQ help"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-b border-[#e4e1d8] pb-4">
            {contactFaqCategories.map((category, index) => (
              <a
                key={category.category}
                href={`#program-help-${category.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition hover:text-[#173f33]",
                  index === 0 ? "text-[#173f33]" : "text-[#a8ada5]",
                )}
              >
                {category.category} ({category.questions.length})
              </a>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            {contactFaqCategories.map((category, categoryIndex) => (
              <div
                key={category.category}
                id={`program-help-${category.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="scroll-mt-28"
              >
                {categoryIndex > 0 ? (
                  <p className="mb-3 mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">{category.category}</p>
                ) : null}
                <div className="grid gap-3">
                  {category.questions.map((item, questionIndex) => {
                    const isFirstQuestion = categoryIndex === 0 && questionIndex === 0;

                    return (
                      <details
                        key={item.question}
                        open={isFirstQuestion}
                        className="group rounded-md bg-[#f5f6f7] px-4 shadow-[0_8px_22px_rgba(20,28,22,0.035)] open:bg-[#f7f8f8]"
                      >
                        <summary className="flex min-h-[4rem] cursor-pointer list-none items-center gap-4 py-3 text-left [&::-webkit-details-marker]:hidden">
                          <Link2 className="h-4 w-4 shrink-0 text-[#aab1af]" aria-hidden="true" />
                          <span className="min-w-0 flex-1 text-sm font-black leading-5 text-[#5f6b70]">{item.question}</span>
                          <ChevronDown className="h-4 w-4 shrink-0 text-[#b5bbb9] transition group-open:rotate-180 group-open:text-[#4b91d1]" aria-hidden="true" />
                        </summary>
                        <p className="border-t border-[#e8ecec] pb-5 pl-8 pr-8 pt-1 text-sm font-semibold leading-6 text-[#6f7b80]">
                          {item.answer}
                        </p>
                      </details>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 border-t border-[#e7eee8] bg-[#fffaf0] px-5 py-4 sm:grid-cols-2">
          <a
            href="tel:9395507766"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-[#173f33] px-5 py-3 text-base font-black text-[#fff9ec] transition hover:bg-[#204d3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c65e]"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {copy.callPrompt}: 9395507766
          </a>
          <a
            href="https://wa.me/919395507766"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border border-[#173f33] bg-white px-5 py-3 text-base font-black text-[#173f33] transition hover:bg-[#eef8f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f33]"
          >
            <span className="h-5 w-5" aria-hidden="true">
              <WhatsAppMark />
            </span>
            {copy.whatsapp}
          </a>
        </div>
      </section>
    </div>,
    portalElement,
  );
}

function FeaturePill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex min-h-14 flex-col items-center justify-center gap-1 border-[#ead7b0] px-2 text-center lg:border-l">
      <Icon className="h-7 w-7 text-[#07351f]" strokeWidth={1.8} aria-hidden="true" />
      <p className="text-[11px] font-black leading-tight text-[#102119]">{label}</p>
    </div>
  );
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-full w-full">
      <circle cx="24" cy="24" r="23" fill="#25D366" />
      <path
        d="M35.5 24.2c0 6.1-5 11.1-11.2 11.1-1.9 0-3.7-.5-5.3-1.3l-5.7 1.8 1.8-5.5c-1.1-1.8-1.7-3.8-1.7-6.1 0-6.1 5-11.1 11.1-11.1s11 5 11 11.1Z"
        fill="#25D366"
        stroke="white"
        strokeLinejoin="round"
        strokeWidth="3.1"
      />
      <path
        d="M20.4 18.8c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.8.1-1.2.6-.4.4-1.6 1.5-1.6 3.7 0 2.2 1.6 4.4 1.9 4.7.2.3 3.1 5 7.8 6.8 3.9 1.5 4.8 1.2 5.6 1.1.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.1-.2-.4-.3-.9-.6l-3.2-1.6c-.5-.2-.8-.3-1.2.3-.3.5-1.3 1.6-1.6 1.9-.3.4-.6.4-1.1.1-.5-.2-2-.7-3.8-2.3-1.4-1.3-2.4-2.8-2.7-3.3-.3-.5 0-.8.2-1 .2-.2.5-.6.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8l-1.2-2.9Z"
        fill="white"
      />
    </svg>
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
          <TrainingApplicationForm language={language} serviceOptions={serviceOptions} selectedServiceTitle={course.serviceTitle} />
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
  return fee.replace(/^INR\s*/i, "₹");
}

type DayPlanTrack = "plain" | "shared" | "split" | "business";
type DaySegmentKind = "queen" | "royal";

type DayPlanItem = {
  title: string;
  body: string;
  track?: DayPlanTrack;
  segments?: Array<{ label: string; kind: DaySegmentKind }>;
};

function makeDayPlanItem(
  [title, body]: [string, string],
  track: DayPlanTrack = "plain",
  segments?: DayPlanItem["segments"],
): DayPlanItem {
  return { title, body, track, segments };
}

function getDayPlanTone(track: DayPlanTrack = "plain") {
  if (track === "shared" || track === "split") {
    return {
      dayBadge: "bg-[linear-gradient(90deg,#0f6b4a_0%,#0f6b4a_50%,#d98b17_50%,#d98b17_100%)] text-white",
      title: "text-[#173f33]",
    };
  }

  if (track === "business") {
    return {
      dayBadge: "bg-[linear-gradient(90deg,#0f6b4a_0%,#0f6b4a_48%,#f6c75a_48%,#f6c75a_52%,#d98b17_52%,#d98b17_100%)] text-white",
      title: "text-[#173f33]",
    };
  }

  return {
    dayBadge: "bg-[#f8d98d] text-[#102119]",
    title: "text-[#14241f]",
  };
}

function getDaySegmentTone(kind: DaySegmentKind) {
  return kind === "queen"
    ? "bg-[#eef8f2] text-[#0f6b4a] ring-1 ring-[#0f6b4a]/18"
    : "bg-[#fff5df] text-[#9b6000] ring-1 ring-[#d98b17]/22";
}

function getDaySegmentLabel(label: string) {
  const [half, topic] = label.split(":").map((part) => part.trim());

  return {
    half: half || label,
    topic: topic || "",
  };
}

function getDayPlan(course: TrainingPreviewCourse): DayPlanItem[] {
  const defaults = [
    ["Bee Hive Production", "Hive production basics, species, tools and equipment"],
    ["Colony Management", "Hive inspection, feeding, and maintenance"],
    ["Health & Safety", "Disease management and safe handling"],
    ["Honey Harvesting", "Extraction methods and storage"],
    ["Scientific Beekeeping as Business", "Marketing, record keeping and government support"],
  ];

  if (course.slug.includes("honey-processing")) {
    return [
      ["Filtration & Quality Standards", "Filtering, settling, moisture awareness, quality standards and quality checks"],
      ["Packing, Storage & Market Readiness", "Packing tools, labels, batch handling, food-safe storage, shelf readiness, pricing, presentation and buyer trust"],
    ].map((item) => makeDayPlanItem(item as [string, string]));
  }

  if (course.slug.includes("queen-rearing")) {
    const splitSegments = [
      { label: "First half: Queen Bee Breeding", kind: "queen" as const },
      { label: "Second half: Royal Jelly Harvesting", kind: "royal" as const },
    ];

    return [
      makeDayPlanItem(["Shared Foundation", "Queen cell biology, colony readiness, hygiene discipline and program orientation"], "shared"),
      makeDayPlanItem(["Shared Grafting Basics", "Cell handling, grafting basics, breeder traits and safe tool workflow"], "shared"),
      makeDayPlanItem(["Shared Practice", "Repeat grafting practice, cell bar setup and careful correction"], "shared"),
      makeDayPlanItem(["Shared Colony Preparation", "Starter/finisher colony preparation, feed support and acceptance checks"], "shared"),
      makeDayPlanItem(["Split Practice", "Queen Bee Breeding in the first half; Royal Jelly Harvesting in the second half"], "split", splitSegments),
      makeDayPlanItem(["Mating Yard Prep & Royal Jelly Collection", "Baby queen finding, mating yard prep, royal jelly collection"], "split", splitSegments),
      makeDayPlanItem(["Queen Intro", "Queen acceptance observation first; hygienic royal jelly transfer second"], "split", splitSegments),
      makeDayPlanItem(["Colony Multiplication", "Mating-yard and field records first; colony multiplication and royal jelly collection second"], "split", splitSegments),
      makeDayPlanItem(["Processing & Packing", "Queen breeding review first; royal jelly processing, pre-harvesting packing and post-harvesting packing second"], "split", splitSegments),
      makeDayPlanItem(["Business Management", "Costing, batch records, market planning, productivity and enterprise management"], "business", [
        { label: "Queen Bee Breeding", kind: "queen" },
        { label: "Royal Jelly Harvesting", kind: "royal" },
      ]),
    ];
  }

  if (course.slug.includes("royal-jelly")) {
    return [
      ["Production Cycle", "Queen-cell preparation and timing"],
      ["Collection Method", "Sensitive harvest workflow and clean tools"],
      ["Hygienic Transfer", "Handling, containers and contamination control"],
      ["Cold Handling", "Storage discipline and quality awareness"],
      ["Starter Colony Setup", "Colony preparation, feeding support and queen-cell readiness"],
      ["Grafting for Royal Jelly", "Larval transfer, cell cups and timing accuracy"],
      ["Harvest Timing", "Collection window, batch separation and clean workspace setup"],
      ["Quality Protection", "Temperature control, containers and contamination prevention"],
      ["Packing Records", "Lot details, storage notes and handling documentation"],
      ["Commercial Planning", "Niche product positioning and records"],
    ].map((item) => makeDayPlanItem(item as [string, string]));
  }

  return defaults.map((item) => makeDayPlanItem(item as [string, string]));
}

function getProgramGallery(course: TrainingPreviewCourse) {
  return [
    { src: "/training-field-visuals/image1.jpeg", alt: "Training participants during apiary practice." },
    { src: course.imageSrc, alt: course.imageAlt },
    { src: "/honey-processing-program-updated.png", alt: "Honey processing jars and equipment." },
    { src: "/training-field-visuals/image4.jpeg", alt: "Beekeepers inspecting a frame during training." },
    { src: "/training-field-visuals/image7.jpeg", alt: "Outdoor apiary demonstration with trainees." },
  ];
}

function getCourseSurfaceStyle(): React.CSSProperties {
  return {
    "--course-surface": "#0f4a38",
    "--course-surface-deep": "#0b382b",
  } as React.CSSProperties;
}
