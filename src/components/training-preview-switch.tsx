"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  IndianRupee,
  Mail,
  Signal,
  Star,
  Users2,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
};

type TrainingPreviewSwitchProps = {
  courses: TrainingPreviewCourse[];
};

export function TrainingPreviewSwitch({ courses }: TrainingPreviewSwitchProps) {
  const [active, setActive] = React.useState(0);
  const course = courses[active] ?? courses[0];

  if (!course) return null;

  return (
    <section className="relative overflow-hidden bg-[#fbfaf6] px-4 py-10 text-[#14241f] sm:px-6 lg:px-8 lg:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#f8faf7_0%,#fff8ea_48%,#f8faf7_100%)]" />
      <div className="pointer-events-none absolute left-0 top-20 h-px w-full bg-[#173f33]/10" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid min-h-[calc(100vh-8rem)] gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:items-center">
          <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-start">
            <TabRail courses={courses} active={active} onSelect={setActive} />
            <CoursePanel course={course} />
          </div>

          <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-[#e2d2b2] bg-[#fffdf8] py-1 pl-1.5 pr-3 shadow-[0_14px_34px_rgba(143,116,67,0.12)]">
              <span className="rounded-lg bg-[#173f33] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#fff8ea]">
                New
              </span>
              <span className="text-sm font-semibold text-[#66776f]">Field-led apiculture courses</span>
            </div>

            <h1 className="text-balance font-display text-[clamp(2.7rem,5.2vw,5.7rem)] font-semibold leading-[0.92] text-[#173f33]">
              Training programs, selected without the guesswork.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5c6d63] sm:text-lg">
              Pick a course stage, compare the live details, and move directly into the program page when you are ready to apply.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              <Rating score="4.9" label="practice quality" />
              <Rating score="4.8" label="field support" />
              <Rating score="4.9" label="learner value" />
            </div>

            <div className="mt-8 w-full max-w-[28rem] lg:max-w-none">
              <label htmlFor="training-interest" className="text-sm font-semibold text-[#66776f]">
                Course assistance
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#d9dfd2] bg-white px-3 shadow-[0_14px_34px_rgba(34,45,38,0.08)] transition focus-within:border-[#173f33] focus-within:ring-2 focus-within:ring-[#173f33]/16">
                <Mail className="h-5 w-5 shrink-0 text-[#b36b00]" aria-hidden="true" />
                <input
                  id="training-interest"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 w-full bg-transparent text-sm text-[#14241f] outline-none placeholder:text-[#8b9891]"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href={`/programs/${course.slug}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#173f33] px-4 text-sm font-black text-white shadow-[0_18px_38px_rgba(23,63,51,0.18)] transition hover:-translate-y-0.5"
              >
                View selected course
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d9dfd2] bg-white px-4 text-sm font-black text-[#315849] transition hover:-translate-y-0.5 hover:border-[#b36b00]"
              >
                Talk to the center
              </Link>
            </div>

            <div className="mt-7 flex flex-col items-center gap-3 lg:flex-row">
              <div className="flex items-center">
                {["BK", "HP", "QR", "RJ", "TC"].map((initials, index) => (
                  <span
                    key={initials}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full border-2 border-[#fbfaf6] bg-[#173f33] text-[10px] font-black text-[#fff8ea]",
                      index > 0 && "-ml-2",
                    )}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-[#66776f]">structured for farmers, SHGs, entrepreneurs, and trainers</span>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden border-y border-[#e3ded2]">
          <div className="flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {["Hive setup", "Field practice", "Processing", "Queen work", "Market readiness", "Center support"].map((item, index) => (
              <div key={item} className="flex shrink-0 items-center">
                <div className="flex min-w-[12rem] items-center justify-center px-6 py-5 text-sm font-black text-[#66776f]">
                  {item}
                </div>
                {index < 5 ? <div aria-hidden className="h-9 w-px bg-[#e3ded2]" /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
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
      className="flex shrink-0 gap-2 overflow-x-auto [scrollbar-width:none] md:w-36 md:flex-col md:overflow-visible [&::-webkit-scrollbar]:hidden"
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
              "whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b36b00] focus-visible:ring-offset-2",
              isActive
                ? "bg-white font-black text-[#173f33] shadow-[0_14px_34px_rgba(34,45,38,0.12)] ring-1 ring-[#e3ded2]"
                : "font-bold text-[#6f8177] hover:bg-white/70 hover:text-[#173f33]",
            )}
          >
            {course.tabLabel}
          </button>
        );
      })}
    </div>
  );
}

function CoursePanel({ course }: { course: TrainingPreviewCourse }) {
  return (
    <div className="relative w-full min-w-0">
      <div className="mx-auto w-full max-w-[28rem] overflow-hidden rounded-t-[2.4rem] bg-white/76 px-2 pt-2 shadow-[0_26px_70px_rgba(34,45,38,0.14)] ring-1 ring-[#d9dfd2] [mask-image:linear-gradient(to_bottom,black_86%,transparent)]">
        <div className="h-[38rem] overflow-hidden rounded-t-[2rem] bg-[#f3eee5] ring-1 ring-[#173f33]/10">
          <div className="flex items-center justify-between px-6 py-3 text-xs text-[#173f33]">
            <span className="font-black">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="h-4 w-4" aria-hidden="true" />
              <Wifi className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mx-auto h-1.5 w-10 rounded-full bg-[#173f33]/15" />

          <div className="p-5">
            <div className="relative h-48 overflow-hidden rounded-[1.55rem] bg-[#d9dfd2]">
              <Image src={course.imageSrc} alt={course.imageAlt} fill sizes="28rem" className="object-cover" priority />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,33,0)_38%,rgba(7,20,33,0.72)_100%)]" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#ffd485]">{course.focusLabel}</p>
                <h2 className="mt-1 text-2xl font-black leading-none text-white">{course.title}</h2>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <MiniMetric icon={Clock3} label="Duration" value={course.duration} />
              <MiniMetric icon={Users2} label="Capacity" value={course.capacity} />
              <MiniMetric icon={IndianRupee} label="Fee" value={course.fee} />
              <MiniMetric icon={CalendarDays} label="Batch" value={course.batchDate} />
            </div>

            <p className="mt-5 text-sm leading-6 text-[#5c6d63]">{course.summary}</p>

            <div className="mt-5 rounded-[1.35rem] border border-[#e3ded2] bg-[#fffdf8] p-4">
              <div className="flex items-center gap-2 text-[#173f33]">
                <BadgeCheck className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                <p className="text-xs font-black uppercase tracking-[0.14em]">Course details</p>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5c6d63]">{course.description}</p>
            </div>

            <div className="mt-4 grid gap-2">
              {course.outcomes.slice(0, 3).map((outcome) => (
                <p key={outcome} className="flex gap-2 text-sm leading-6 text-[#315849]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#b36b00]" aria-hidden="true" />
                  {outcome}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e3ded2] bg-white p-3">
      <div className="flex items-center gap-1.5 text-[#b36b00]">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6f8177]">{label}</span>
      </div>
      <p className="mt-2 text-sm font-black text-[#173f33]">{value}</p>
    </div>
  );
}

function Rating({ score, label }: { score: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e3ded2] bg-white/78 py-1 pl-2 pr-3 shadow-[0_10px_28px_rgba(34,45,38,0.06)]">
      <Star className="h-3.5 w-3.5 fill-[#f2b544] text-[#f2b544]" aria-hidden="true" />
      <span className="text-sm font-black text-[#173f33]">{score}</span>
      <span className="text-sm font-semibold text-[#66776f]">{label}</span>
    </div>
  );
}
