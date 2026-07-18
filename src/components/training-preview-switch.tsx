"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Check,
  Clock3,
  Languages,
  MessageSquareQuote,
  UsersRound,
  Wrench,
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
      <div className="rounded-[1.5rem] border border-[#e3ded2] bg-white p-6 text-sm font-semibold text-[#66776f]">
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

export function TrainingPreviewSwitch({ courses, language }: TrainingPreviewSwitchProps) {
  const [active, setActive] = React.useState(0);
  const [activeDetail, setActiveDetail] = React.useState<"about" | "outcomes" | "testimonials">("about");
  const [applicationCourse, setApplicationCourse] = React.useState<TrainingPreviewCourse | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const course = courses[active] ?? courses[0];
  const serviceOptions = courses.map((item) => ({
    title: item.title,
    duration: item.duration,
    level: item.level,
  }));

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!course) return null;

  return (
    <section className="relative overflow-hidden px-4 py-8 text-[#14241f] sm:px-6 lg:px-8 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(179,107,0,0.08),transparent_28%),linear-gradient(180deg,rgba(248,250,247,0.72)_0%,rgba(255,248,234,0.42)_52%,rgba(248,250,247,0.58)_100%)]" />
      <div className="pointer-events-none absolute left-0 top-20 h-px w-full bg-[#173f33]/10" />
      <div className="relative mx-auto max-w-[92rem]">
        <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <TabRail courses={courses} active={active} onSelect={setActive} />
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(22rem,0.78fr)_minmax(34rem,1.22fr)] xl:items-start">
            <CoursePanel course={course} onEnroll={() => setApplicationCourse(course)} />
            <CourseDetailTabs course={course} active={activeDetail} onSelect={setActiveDetail} />
          </div>
        </div>
      </div>
      {applicationCourse && mounted ? createPortal(
        <ApplicationOverlay
          course={applicationCourse}
          language={language}
          serviceOptions={serviceOptions}
          onClose={() => setApplicationCourse(null)}
        />,
        document.body,
      ) : null}
    </section>
  );
}

function TabRail({
  courses,
  active,
  onSelect,
}: {
  courses: TrainingPreviewCourse[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Training course switcher"
      className="flex gap-2 overflow-x-auto rounded-[1.4rem] border border-[#d9dfd2] bg-white/70 p-2 shadow-[0_18px_48px_rgba(34,45,38,0.08)] backdrop-blur [scrollbar-width:none] lg:sticky lg:top-6 lg:h-fit lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {courses.map((course, index) => {
        const isActive = index === active;
        return (
          <button
            key={course.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(index)}
            className={cn(
              "group flex min-w-56 items-start gap-3 rounded-2xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b36b00] focus-visible:ring-offset-2 lg:min-w-0",
              isActive
                ? "bg-[#173f33] text-white shadow-[0_14px_34px_rgba(23,63,51,0.18)]"
                : "text-[#6f8177] hover:bg-[#fffdf8] hover:text-[#173f33]",
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-black",
                isActive ? "bg-white text-[#173f33]" : "bg-[#f3eee5] text-[#b36b00]",
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black leading-5">{course.tabLabel}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CourseDetailTabs({
  course,
  active,
  onSelect,
}: {
  course: TrainingPreviewCourse;
  active: "about" | "outcomes" | "testimonials";
  onSelect: (tab: "about" | "outcomes" | "testimonials") => void;
}) {
  const audience = getAudienceItems(course);
  const tabs = [
    { id: "about", label: "About this course", icon: BookOpenCheck },
    { id: "outcomes", label: "Outcomes", icon: Check },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  ] as const;

  return (
    <div className="w-full rounded-[1.6rem] border border-[#d9dfd2] bg-[#fffdf8] p-4 text-left shadow-[0_24px_60px_rgba(34,45,38,0.1)] sm:p-5">
      <div className="border-b border-[#e3ded2] pb-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00]">Course details</p>
          <h2 className="mt-1 text-[clamp(1.75rem,2.8vw,2.75rem)] font-black leading-tight text-[#173f33]">{course.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#66776f]">{course.summary}</p>
        </div>
      </div>

      <div role="tablist" aria-label={`${course.title} details`} className="mt-4 rounded-[1.15rem] border border-[#e3ded2] bg-[#f3eee5] p-1.5 sm:grid sm:grid-cols-3">
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
              onClick={() => onSelect(tab.id)}
              className={cn(
                "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b36b00] focus-visible:ring-offset-2",
                isActive
                  ? "bg-white text-[#173f33] shadow-[0_12px_28px_rgba(34,45,38,0.12)]"
                  : "text-[#66776f] hover:bg-white/60 hover:text-[#173f33]",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {active === "about" ? (
          <section id={`${course.id}-about-panel`} role="tabpanel" aria-labelledby={`${course.id}-about-tab`}>
            <div className="rounded-[1.25rem] border border-[#e3ded2] bg-white p-5">
              <p className="max-w-4xl text-base leading-8 text-[#5c6d63]">{course.description}</p>
            </div>
            <div className="mt-4 rounded-[1.25rem] border border-[#e3ded2] bg-[#173f33] p-5 text-white">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#ffd485]">Who can attend</p>
                  <p className="mt-2 text-sm font-semibold text-white/72">The programme is suitable for:</p>
                </div>
                <UsersRound className="h-7 w-7 text-[#ffd485]" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
                {audience.map((item) => (
                  <p key={item} className="flex gap-2 rounded-xl bg-white/8 px-3 py-2 text-sm leading-6 text-white/88">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#ffd485]" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {active === "outcomes" ? (
          <section id={`${course.id}-outcomes-panel`} role="tabpanel" aria-labelledby={`${course.id}-outcomes-tab`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((outcome, index) => (
                <p key={outcome} className="flex gap-3 rounded-[1.15rem] border border-[#e3ded2] bg-white p-4 text-sm leading-6 text-[#315849]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f3eee5] text-xs font-black text-[#b36b00]">
                    {index + 1}
                  </span>
                  {outcome}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {active === "testimonials" ? (
          <section id={`${course.id}-testimonials-panel`} role="tabpanel" aria-labelledby={`${course.id}-testimonials-tab`}>
            <blockquote className="rounded-[1.25rem] border border-[#e3ded2] bg-white p-6 text-base leading-8 text-[#5c6d63]">
              <MessageSquareQuote className="mb-4 h-8 w-8 text-[#b36b00]" aria-hidden="true" />
              <p>
                <span className="font-display text-3xl leading-none text-[#b36b00]" aria-hidden="true">&ldquo;</span>
                {course.testimonial.quote}
                <span className="font-display text-3xl leading-none text-[#b36b00]" aria-hidden="true">&rdquo;</span>
              </p>
              <footer className="mt-4 font-black text-[#173f33]">{course.testimonial.name}</footer>
            </blockquote>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function CoursePanel({ course, onEnroll }: { course: TrainingPreviewCourse; onEnroll: () => void }) {
  return (
    <div className="relative w-full min-w-0">
      <div className="mx-auto w-full overflow-hidden rounded-[1.6rem] border border-[#d9dfd2] bg-[#fffdf8] shadow-[0_24px_60px_rgba(34,45,38,0.12)]">
        <div className="relative h-44 overflow-hidden bg-[#d9dfd2] sm:h-52">
          <Image src={course.imageSrc} alt={course.imageAlt} fill sizes="34rem" className="object-cover" priority />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,33,0.08)_0%,rgba(7,20,33,0.18)_40%,rgba(7,20,33,0.78)_100%)]" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="max-w-[24rem] text-sm font-semibold leading-6 text-white/88">{course.focusText}</p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid gap-3 rounded-[1.15rem] border border-[#e3ded2] bg-[#f7f3ea] p-3.5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6f8177]">Instructor</p>
              <p className="mt-1 text-base font-black text-[#173f33]">{course.instructorName}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniMetric icon={BadgeCheck} label="Level" value={course.experienceLabel} />
              <MiniMetric icon={Clock3} label="Duration" value={course.duration} />
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <InfoSection title="Skills" icon={Award} compact>
              <TagList items={course.skills} compact />
            </InfoSection>

            <InfoSection title="Tools" icon={Wrench} compact>
              <TagList items={course.tools} compact />
            </InfoSection>
          </div>

          <div className="mt-3 grid gap-2 rounded-[1.15rem] border border-[#e3ded2] bg-white p-3.5">
            <CompactFact icon={Award} label="Certificate" value={course.certificate} />
            <CompactFact icon={Languages} label="Taught in" value={course.taughtIn} />
          </div>

          <a
            href={`/programs/${course.slug}#training-application-form`}
            onClick={(event) => {
              event.preventDefault();
              onEnroll();
            }}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173f33] px-4 text-sm font-black text-white shadow-[0_18px_38px_rgba(23,63,51,0.18)] transition hover:-translate-y-0.5"
          >
            <span className="flex flex-col items-center leading-tight">
              <span>Enroll in program</span>
              <span className="mt-0.5 text-[11px] font-bold text-white/72">{formatEnrollDateLabel(course.batchDate)}</span>
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
      </div>
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
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[1.6rem] border border-[#e3ded2] bg-[#fbfaf6] shadow-[0_30px_90px_rgba(7,20,33,0.38)]">
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

function InfoSection({
  title,
  icon: Icon,
  compact = false,
  children,
}: {
  title: string;
  icon: LucideIcon;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-[1.15rem] border border-[#e3ded2] bg-[#fffdf8]", compact ? "p-3.5" : "mt-3 p-4")}>
      <div className="flex items-center gap-2 text-[#173f33]">
        <Icon className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-[0.14em]">{title}</p>
      </div>
      <div className={compact ? "mt-2" : "mt-3"}>{children}</div>
    </section>
  );
}

function TagList({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded-full border border-[#e3ded2] bg-white text-xs font-black text-[#315849]",
            compact ? "px-2.5 py-1" : "px-3 py-1.5",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function CompactFact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <p className="flex gap-2 text-sm leading-6 text-[#315849]">
      <Icon className="mt-1 h-4 w-4 shrink-0 text-[#b36b00]" aria-hidden="true" />
      <span>
        <span className="font-black text-[#173f33]">{label}: </span>
        {value}
      </span>
    </p>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e3ded2] bg-white p-3">
      <div className="flex items-center gap-1.5 text-[#b36b00]">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6f8177]">{label}</span>
      </div>
      <p className="mt-2 break-words text-sm font-black leading-5 text-[#173f33]">{value}</p>
    </div>
  );
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
      "Aspiring beekeeping entrepreneurs",
      "Agriculture and horticulture workers",
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
  return batchDate.toLowerCase().includes("contact") ? batchDate : `Starts ${batchDate}`;
}
