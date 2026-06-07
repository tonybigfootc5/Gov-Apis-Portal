import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleDot,
  GraduationCap,
  MapPin,
  Microscope,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { SectionHeading } from "@/components/section-heading";
import { getEvents, getPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { getTranslatedEventContent, getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const language = await getRequestLanguage();
  const [programs, events] = await Promise.all([getPrograms(), getEvents()]);
  const translatedPrograms = programs.map((program) => getTranslatedProgramContent(program, language));
  const translatedEvents = events.map((event) => getTranslatedEventContent(event, language));
  const featureCards = [
    [GraduationCap, t(language, "home.cards.training.title"), t(language, "home.cards.training.text")],
    [CalendarDays, t(language, "home.cards.workshops.title"), t(language, "home.cards.workshops.text")],
    [Microscope, t(language, "home.cards.tech.title"), t(language, "home.cards.tech.text")],
    [ShieldCheck, "Institutional support", "Public-facing training backed by a national rural development institute."],
  ] as const;

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <HeroBackgroundVideo />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,248,242,0.12)_0%,rgba(250,248,242,0.46)_22%,rgba(250,248,242,0.82)_54%,rgba(250,248,242,0.96)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,248,242,0.96)_0%,rgba(250,248,242,0.84)_42%,rgba(250,248,242,0.3)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.8fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fffdf8]/92 px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-[#b36b00] shadow-[0_18px_40px_rgba(64,44,8,0.08)] sm:text-xs sm:tracking-[0.22em]">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                <span>{institute.parent.split(",")[0]}</span>
              </p>
              <h1 className="font-display mt-8 max-w-4xl text-[clamp(3rem,10vw,6.7rem)] font-semibold leading-[0.94] tracking-tight text-[#1b3b2b]">
                Field-ready <span className="text-[#b36b00]">API CULTURE</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#435247] sm:mt-7 sm:text-xl sm:leading-9">
                {t(language, "home.hero.description")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.18em] text-[#1b3b2b]">
                <span className="rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8]/88 px-4 py-2">Rajendranagar, Hyderabad</span>
                <span className="rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8]/88 px-4 py-2">Hands-on training</span>
                <span className="rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8]/88 px-4 py-2">Field demonstrations</span>
              </div>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link
                  href="/programs"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ebb428] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#1b3b2b] shadow-[0_18px_40px_rgba(179,107,0,0.18)] transition hover:-translate-y-1 sm:w-auto sm:px-8"
                >
                  {t(language, "home.hero.cta.training")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[rgba(27,59,43,0.18)] bg-[#fffdf8]/88 px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#1b3b2b] transition hover:border-[#1b3b2b] sm:w-auto sm:px-8"
                >
                  {t(language, "home.hero.cta.mission")}
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="paper-panel rounded-[2rem] px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b36b00]">{t(language, "home.hero.location")}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[#1b3b2b]">
                  <MapPin className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                  Rajendranagar, Hyderabad
                </p>
              </div>
              <div className="paper-panel rounded-[2rem] px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b36b00]">{t(language, "home.hero.focus")}</p>
                <p className="mt-3 text-base font-semibold text-[#1b3b2b]">{t(language, "home.hero.focusText")}</p>
              </div>
              <div className="rounded-[2rem] bg-[linear-gradient(180deg,#ebb428_0%,#b36b00_100%)] px-5 py-6 text-[#faf8f2] shadow-[0_22px_50px_rgba(179,107,0,0.24)]">
                <p className="font-display text-5xl font-bold leading-none">40+</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-[#fff7df]">{t(language, "home.hero.stats")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featureCards.map(([Icon, title, text]) => (
            <div key={title as string} className="paper-panel rounded-[2rem] p-6 transition hover:-translate-y-1">
              <Icon className="h-7 w-7 text-[#b36b00]" aria-hidden="true" />
              <h2 className="font-display mt-5 text-2xl font-semibold text-[#1b3b2b]">{title as string}</h2>
              <p className="mt-3 text-sm leading-7 text-[#516253]">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-[2.25rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-5 shadow-[0_28px_70px_rgba(64,44,8,0.08)] sm:p-6 lg:grid-cols-[0.72fr_1fr] lg:p-8">
          <div className="relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-[rgba(27,59,43,0.12)] bg-[#ece3d3] sm:min-h-[420px]">
            <Image src="/field-beekeeping.jpg" alt="Field beekeeping spotlight" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,248,242,0.08)_0%,rgba(27,59,43,0.24)_100%)]" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b36b00]">Field Spotlight</p>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-[#1b3b2b] sm:text-5xl">
              {t(language, "home.fieldSpotlight.title")}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#516253]">
              {t(language, "home.fieldSpotlight.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-black uppercase tracking-[0.14em] text-[#1b3b2b]">
              <span className="rounded-full border border-[rgba(27,59,43,0.14)] bg-[#f6efe4] px-4 py-2">{t(language, "home.fieldSpotlight.tag1")}</span>
              <span className="rounded-full border border-[rgba(27,59,43,0.14)] bg-[#f6efe4] px-4 py-2">{t(language, "home.fieldSpotlight.tag2")}</span>
              <span className="rounded-full border border-[rgba(27,59,43,0.14)] bg-[#f6efe4] px-4 py-2">{t(language, "home.fieldSpotlight.tag3")}</span>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(27,59,43,0.12)] bg-[#f6efe4] px-4 py-4 text-sm text-[#516253]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">What people practice</p>
                <p className="mt-3">Hive observation, protective handling, colony care, and season-aware management.</p>
              </div>
              <div className="rounded-2xl border border-[rgba(27,59,43,0.12)] bg-[#f6efe4] px-4 py-4 text-sm text-[#516253]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">Why it matters</p>
                <p className="mt-3">The training is grounded in field readiness, not brochure language or abstract theory.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(27,59,43,0.1)] bg-[#f3ecdf] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={t(language, "home.training.eyebrow")} title={t(language, "home.training.title")}>
            {t(language, "home.training.body")}
          </SectionHeading>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {translatedPrograms.slice(0, 2).map((program) => {
              const isFoundation = program.slug === "scientific-beekeeping-foundation";
              const isQueenRearing = program.slug === "queen-rearing-and-colony-multiplication";

              return (
                <Link
                  key={program.id}
                  href={`/programs/${program.slug}`}
                  className="group relative overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-6 shadow-[0_24px_50px_rgba(64,44,8,0.08)] transition hover:border-[#b36b00]/40 sm:p-8"
                >
                  {isFoundation || isQueenRearing ? (
                    <div className="pointer-events-none absolute inset-0">
                      <Image
                        src={isFoundation ? "/scientific-foundation-bg.jpg" : "/queen-rearing-bg.jpg"}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover object-center opacity-28 transition duration-500 group-hover:scale-105 group-hover:opacity-36"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(250,248,242,0.92)_0%,rgba(250,248,242,0.68)_38%,rgba(250,248,242,0.94)_100%)]" />
                    </div>
                  ) : null}
                  <div className="absolute left-0 top-0 h-1.5 w-full bg-[#ebb428]" />
                  <div className="relative">
                    {isFoundation ? (
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#fffdf8]/82 p-2 shadow-[0_18px_40px_rgba(64,44,8,0.08)]">
                        <Image
                          src="/scientific-beekeeping-icon.png"
                          alt="Scientific Beekeeping Foundation icon"
                          width={1024}
                          height={1024}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <Sprout className="h-7 w-7 text-[#b36b00]" aria-hidden="true" />
                    )}
                    <h3 className="font-display mt-5 text-2xl font-semibold text-[#1b3b2b] group-hover:text-[#b36b00] sm:text-3xl">{program.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#516253]">{program.summary}</p>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">
                      {program.duration} / {program.level}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-[#1b3b2b]">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] px-3 py-1.5">
                        <CircleDot className="h-3.5 w-3.5 text-[#b36b00]" aria-hidden="true" />
                        Practical sessions
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] px-3 py-1.5">
                        <CircleDot className="h-3.5 w-3.5 text-[#b36b00]" aria-hidden="true" />
                        Capacity {program.capacity}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t(language, "home.events.eyebrow")} title={t(language, "home.events.title")}>
          {t(language, "home.events.body")}
        </SectionHeading>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.75fr]">
          <div className="grid gap-5">
            {translatedEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group relative grid gap-4 overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-5 shadow-[0_20px_45px_rgba(64,44,8,0.08)] transition hover:border-[#b36b00]/40 sm:grid-cols-[170px_1fr_auto] sm:items-center sm:p-6"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">{formatDate(event.startsAt)}</p>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#1b3b2b] sm:text-2xl">{event.title}</h3>
                  <p className="mt-2 text-sm text-[#516253]">{event.summary}</p>
                </div>
                <ArrowRight className="h-5 w-5 justify-self-start text-[#b36b00] sm:justify-self-auto" aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className="paper-panel rounded-[2rem] p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b36b00]">Participation flow</p>
            <div className="mt-6 grid gap-4 text-sm leading-7 text-[#516253]">
              <div className="rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] p-4">
                <p className="font-semibold text-[#1b3b2b]">1. Watch upcoming sessions</p>
                <p className="mt-2">Orientations and field sessions are published with date, location, and status.</p>
              </div>
              <div className="rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] p-4">
                <p className="font-semibold text-[#1b3b2b]">2. Contact the center</p>
                <p className="mt-2">Use the contact page or official details for enrollment, institutional visits, or collaboration.</p>
              </div>
              <div className="rounded-2xl border border-[rgba(27,59,43,0.1)] bg-[#f6efe4] p-4">
                <p className="font-semibold text-[#1b3b2b]">3. Join field-led learning</p>
                <p className="mt-2">The emphasis is applied practice, not empty event branding.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
