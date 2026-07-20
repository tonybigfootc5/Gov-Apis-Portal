"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Crown,
  Factory,
  FileBadge2,
  GraduationCap,
  HandHeart,
  Info,
  Languages,
  Landmark,
  MessageSquareQuote,
  PackageCheck,
  Target,
  Timer,
  UsersRound,
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
  instructorName: string;
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

type DetailTab = "about" | "outcomes" | "testimonials";

const courseIcons: LucideIcon[] = [GraduationCap, PackageCheck, Crown, Factory];

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

export function TrainingPreviewSwitch({ courses, language }: TrainingPreviewSwitchProps) {
  const [active, setActive] = React.useState(0);
  const [activeDetail, setActiveDetail] = React.useState<DetailTab>("about");
  const [applicationCourse, setApplicationCourse] = React.useState<TrainingPreviewCourse | null>(null);
  const courseOverviewRef = React.useRef<HTMLElement | null>(null);
  const course = courses[active] ?? courses[0];
  const serviceOptions = courses.map((item) => ({
    title: item.title,
    duration: item.duration,
    level: item.level,
  }));

  if (!course) return null;

  function selectCourse(index: number) {
    setActive(index);
    setActiveDetail("about");

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
        <TrainingHeader />

        <div className="mt-6 rounded-lg border border-[#efe7da] bg-white/82 p-3 shadow-[0_28px_80px_rgba(36,41,34,0.1)] backdrop-blur sm:p-4 lg:p-5">
          <div className="training-program-layout">
            <TrainingRail courses={courses} active={active} onSelect={selectCourse} />
            <CourseOverview course={course} overviewRef={courseOverviewRef} onEnroll={() => setApplicationCourse(course)} />
            <CourseDetailTabs course={course} active={activeDetail} onSelect={setActiveDetail} onEnroll={() => setApplicationCourse(course)} />
          </div>
          <BenefitRow />
        </div>
      </div>

      {applicationCourse && typeof document !== "undefined"
        ? createPortal(
            <ApplicationOverlay
              course={applicationCourse}
              language={language}
              serviceOptions={serviceOptions}
              onClose={() => setApplicationCourse(null)}
            />,
            document.body,
          )
        : null}
    </section>
  );
}

function TrainingHeader() {
  return (
    <header className="mx-auto max-w-7xl text-left">
      <h1
        className="max-w-[22rem] text-5xl font-black leading-[0.96] text-[#063f2e] sm:max-w-4xl sm:text-6xl lg:text-7xl 2xl:text-8xl"
        style={{
          textShadow:
            "1px 1px 0 #f5b300, 2px 2px 0 rgba(245,179,0,0.64), 5px 8px 18px rgba(6,63,46,0.18)",
        }}
      >
        <span className="block sm:inline">Our Training</span>{" "}
        <span className="block sm:inline">Programs</span>
      </h1>
      <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-[#26332f] sm:text-lg">
        Learn. Practice. Grow. Empowering beekeepers for a better tomorrow.
      </p>
      <span className="mt-5 block h-1 w-16 rounded-full bg-[#063f2e] shadow-[2px_2px_0_#f5b300]" />
    </header>
  );
}

function TrainingRail({
  courses,
  active,
  onSelect,
}: {
  courses: TrainingPreviewCourse[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <aside className="grid gap-4 lg:content-between">
      <div
        role="tablist"
        aria-label="Training course switcher"
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
                "group flex min-h-[6.6rem] w-full min-w-0 items-center gap-3 rounded-lg border px-4 py-4 text-left shadow-[0_14px_30px_rgba(36,41,34,0.06)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efa500] focus-visible:ring-offset-2",
                isActive
                  ? "border-[#06432f] bg-[#06432f] text-white shadow-[0_20px_42px_rgba(6,67,47,0.22)]"
                  : "border-[#f0e8dc] bg-white text-[#111f1a] hover:-translate-y-0.5 hover:border-[#f1c866]",
              )}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center bg-[#f5b300] text-base font-black text-[#062f24] hex-clip">
                {index + 1}
              </span>
              <Icon className={cn("h-9 w-9 shrink-0", isActive ? "text-[#f5b300]" : "text-[#111f1a]")} strokeWidth={1.8} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-base font-black leading-5">{course.tabLabel}</span>
                <span className={cn("mt-2 block text-sm font-medium", isActive ? "text-white/86" : "text-[#2d3935]")}>{course.duration} program</span>
              </span>
              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full transition", isActive ? "bg-[#021d16] text-white" : "bg-[#f5f1eb] text-[#10251d] group-hover:bg-[#f5b300]")}>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <blockquote className="hidden rounded-lg border border-[#ece4d8] bg-[#f7f5ec] p-6 shadow-[0_14px_34px_rgba(36,41,34,0.05)] xl:block">
        <MessageSquareQuote className="h-8 w-8 fill-[#06432f] text-[#06432f]" aria-hidden="true" />
        <p className="mt-5 text-lg font-medium leading-8 text-[#173f33]">
          Empowering rural communities through modern beekeeping education.
        </p>
        <div className="mt-5 h-16 opacity-20">
          <Image src="/beekeeping-illustration.svg" alt="" width={120} height={70} className="ml-auto h-full w-auto" />
        </div>
      </blockquote>
    </aside>
  );
}

function CourseOverview({
  course,
  overviewRef,
  onEnroll,
}: {
  course: TrainingPreviewCourse;
  overviewRef: React.RefObject<HTMLElement | null>;
  onEnroll: () => void;
}) {
  const skills = normalizeSkills(course);

  return (
    <article ref={overviewRef} className="scroll-mt-24 overflow-hidden rounded-lg border border-[#e7dfd2] bg-white shadow-[0_18px_46px_rgba(36,41,34,0.08)]">
      <div className="relative min-h-[22rem] overflow-hidden p-5 sm:p-7">
        <Image src={course.imageSrc} alt={course.imageAlt} fill sizes="(max-width: 1280px) 100vw, 46rem" className="object-cover object-right" priority />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fffdf8_0%,rgba(255,253,248,0.96)_34%,rgba(255,253,248,0.58)_58%,rgba(255,253,248,0.08)_100%)]" />
        <div className="relative max-w-md">
          <p className="inline-flex rounded-full bg-[#f5a900] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
            {course.duration} program
          </p>
          <h2 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-black leading-none text-[#06432f]">{course.title}</h2>
          <p className="mt-3 text-lg font-black leading-6 text-[#153f32]">{course.focusLabel}</p>
          <p className="mt-4 max-w-sm text-base font-medium leading-7 text-[#24322d]">{course.focusText}</p>
        </div>
      </div>

      <div className="grid gap-4 border-y border-[#ece4d8] bg-[#fffdfa] p-4 sm:grid-cols-2 min-[1500px]:grid-cols-4">
        <Metric icon={GraduationCap} label="Level" value={course.experienceLabel || course.level} />
        <Metric icon={Timer} label="Duration" value={course.duration} />
        <Metric icon={UsersRound} label="Batch size" value={course.capacity} />
        <Metric icon={FileBadge2} label="Certificate" value={formatCertificateMetric(course.certificate)} />
      </div>

      <div className="p-4 sm:p-5">
        <section className="rounded-lg border border-[#ece4d8] bg-white p-4">
          <h3 className="text-lg font-black uppercase tracking-[0.02em] text-[#06432f]">What you&apos;ll learn</h3>
          <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {skills.map((skill) => (
              <p key={skill} className="flex items-center gap-3 text-sm font-medium text-[#24322d]">
                <CircleCheck className="h-4 w-4 shrink-0 fill-[#06432f] text-white" aria-hidden="true" />
                {skill}
              </p>
            ))}
          </div>
        </section>

        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-[#ece4d8] bg-[#f8f6ee] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.04em] text-[#06432f]">
            <Languages className="h-5 w-5 text-[#06432f]" aria-hidden="true" />
            Taught in:
          </p>
          <p className="text-sm font-semibold text-[#24322d]">{course.taughtIn}</p>
          <button
            type="button"
            onClick={onEnroll}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#06432f] px-4 text-sm font-black text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efa500] focus-visible:ring-offset-2 sm:hidden"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function CourseDetailTabs({
  course,
  active,
  onSelect,
  onEnroll,
}: {
  course: TrainingPreviewCourse;
  active: DetailTab;
  onSelect: (tab: DetailTab) => void;
  onEnroll: () => void;
}) {
  const audience = getAudienceItems(course);
  const tabs = [
    { id: "about", label: "About this course", shortLabel: "About", icon: Info },
    { id: "outcomes", label: "Outcomes", shortLabel: "Outcomes", icon: Target },
    { id: "testimonials", label: "Testimonials", shortLabel: "Reviews", icon: MessageSquareQuote },
  ] as const;

  return (
    <aside className="grid content-start gap-4">
      <div role="tablist" aria-label={`${course.title} details`} className="grid gap-2 rounded-lg border border-[#ece4d8] bg-[#fbfaf5] p-2 shadow-[0_12px_28px_rgba(36,41,34,0.05)] sm:grid-cols-3 xl:grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${course.id}-${tab.id}-panel`}
              id={`${course.id}-${tab.id}-tab`}
              aria-label={tab.label}
              onClick={() => onSelect(tab.id)}
              className={cn(
                "inline-flex min-h-12 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efa500] focus-visible:ring-offset-2 sm:gap-2 sm:px-3 sm:text-sm",
                isActive ? "bg-[#06432f] text-white shadow-[0_12px_24px_rgba(6,67,47,0.18)]" : "bg-white text-[#14241f] hover:bg-[#fff4d5]",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sm:hidden lg:inline 2xl:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline lg:hidden 2xl:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-[#ece4d8] bg-white p-5 shadow-[0_16px_38px_rgba(36,41,34,0.06)]">
        {active === "about" ? (
          <section id={`${course.id}-about-panel`} role="tabpanel" aria-labelledby={`${course.id}-about-tab`}>
            <p className="text-base font-medium leading-8 text-[#24322d]">{course.description}</p>
          </section>
        ) : null}

        {active === "outcomes" ? (
          <section id={`${course.id}-outcomes-panel`} role="tabpanel" aria-labelledby={`${course.id}-outcomes-tab`} className="grid gap-3">
            {course.outcomes.map((outcome, index) => (
              <p key={outcome} className="flex gap-3 text-sm font-medium leading-6 text-[#24322d]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#fff0bd] text-xs font-black text-[#06432f]">{index + 1}</span>
                {outcome}
              </p>
            ))}
          </section>
        ) : null}

        {active === "testimonials" ? (
          <section id={`${course.id}-testimonials-panel`} role="tabpanel" aria-labelledby={`${course.id}-testimonials-tab`}>
            <MessageSquareQuote className="h-8 w-8 text-[#efa500]" aria-hidden="true" />
            <blockquote className="mt-4 text-base font-medium leading-8 text-[#24322d]">
              &ldquo;{course.testimonial.quote}&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-black text-[#06432f]">{course.testimonial.name}</p>
          </section>
        ) : null}
      </div>

      <section className="rounded-lg border border-[#ece4d8] bg-[#f3f3ec] p-4">
        <h3 className="text-sm font-black uppercase tracking-[0.04em] text-[#06432f]">Who can attend?</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {audience.map((item) => (
            <p key={item} className="flex min-h-11 items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#26332f]">
              <UsersRound className="h-4 w-4 shrink-0 fill-[#06432f] text-white" aria-hidden="true" />
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-[#06432f] p-4 text-white shadow-[0_18px_40px_rgba(6,67,47,0.2)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch 2xl:flex-row 2xl:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[#f5b300] text-[#062f24]">
              <CalendarDays className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-black leading-6">Enroll in {course.title}</h3>
              <p className="mt-1 text-sm font-semibold text-white/82">Next batch {formatEnrollDateLabel(course.batchDate)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEnroll}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#f5b300] px-5 text-sm font-black text-[#062f24] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06432f]"
          >
            Apply Now
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </section>
    </aside>
  );
}

function BenefitRow() {
  return (
    <div className="mt-5 grid gap-3 border-t border-[#ece4d8] pt-5 sm:grid-cols-2 xl:grid-cols-4">
      {programBenefits.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <article key={benefit.title} className="flex items-center gap-4 rounded-lg bg-white px-4 py-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#06432f] text-[#f5b300] shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08)]">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-black text-[#14241f]">{benefit.title}</h3>
              <p className="mt-1 text-sm font-medium leading-6 text-[#293834]">{benefit.body}</p>
            </div>
          </article>
        );
      })}
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
  serviceOptions: Array<{ title: string; duration: string; level: string }>;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[90] bg-[#071421]/58 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="training-application-title">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-lg border border-[#e3ded2] bg-[#fbfaf6] shadow-[0_30px_90px_rgba(7,20,33,0.38)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#e3ded2] bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00]">Application form</p>
            <h2 id="training-application-title" className="mt-1 text-xl font-black leading-tight text-[#173f33] sm:text-2xl">
              {course.title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#66776f]">Fill the API Culture application without leaving this page.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e3ded2] bg-[#fffdf8] text-[#173f33] transition hover:border-[#b36b00] hover:text-[#b36b00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b36b00]"
            aria-label="Close application form"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <TrainingApplicationForm language={language} serviceOptions={serviceOptions} selectedServiceTitle={course.title} />
        </div>
      </div>
    </div>
  );
}

function normalizeSkills(course: TrainingPreviewCourse) {
  const merged = [...course.skills, ...course.outcomes.map((outcome) => summarizeOutcome(outcome))];
  const unique = Array.from(new Set(merged.map((item) => item.trim()).filter(Boolean)));
  return [...unique.slice(0, 9), "And more..."];
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

function getAudienceItems(course: TrainingPreviewCourse) {
  if (course.id === "program-beekeeping") {
    return [
      "Farmers",
      "Rural youth",
      "Women",
      "Tribal communities",
      "Landless individuals",
      "Existing beekeepers",
      "Aspiring beekeepers & entrepreneurs",
      "Agriculture & horticulture workers",
      "Anyone interested in starting an apiary",
    ];
  }

  return course.targetAudience
    .replace(/\.$/, "")
    .replace(", and ", ", ")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatEnrollDateLabel(batchDate: string) {
  return batchDate.toLowerCase().includes("contact") ? batchDate : `starts ${batchDate}`;
}

function formatCertificateMetric(certificate: string) {
  return certificate.replace(" issued ", " ").replace(" after completion", " after completion");
}
