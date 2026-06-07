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
      <section className="relative isolate overflow-hidden bg-[#120c12]">
        <div className="pointer-events-none absolute inset-0">
          <HeroBackgroundVideo />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,18,0.3)_0%,rgba(18,12,18,0.62)_28%,rgba(18,12,18,0.82)_62%,rgba(18,12,18,0.96)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,12,18,0.9)_0%,rgba(18,12,18,0.72)_45%,rgba(18,12,18,0.3)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pb-18 sm:pt-20 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="max-w-3xl">
            <p className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-[1.75rem] border border-[#ffd485]/30 bg-[#f4b315] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-[#271900] shadow-xl shadow-black/30 sm:text-xs sm:tracking-[0.22em]">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              <span>{institute.parent.split(",")[0]}</span>
            </p>
            <h1 className="font-display mt-8 max-w-4xl text-[clamp(3rem,10vw,6.75rem)] font-semibold leading-[0.96] tracking-tight text-[#f8f1ed]">
              {t(language, "home.hero.titlePrefix")} <span className="text-[#ffd485]">{t(language, "home.hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#e2d5c3] sm:mt-7 sm:text-xl sm:leading-9">
              {t(language, "home.hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.18em] text-[#f5d592]">
              <span className="rounded-full border border-[#ffd485]/25 bg-black/20 px-4 py-2 backdrop-blur-sm">Rajendranagar, Hyderabad</span>
              <span className="rounded-full border border-[#ffd485]/25 bg-black/20 px-4 py-2 backdrop-blur-sm">Hands-on training</span>
              <span className="rounded-full border border-[#ffd485]/25 bg-black/20 px-4 py-2 backdrop-blur-sm">Field demonstrations</span>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/programs"
                className="hex-soft inline-flex w-full items-center justify-center gap-3 bg-[#f4b315] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#271900] shadow-xl shadow-black/30 transition hover:-translate-y-1 sm:w-auto sm:px-8"
              >
                {t(language, "home.hero.cta.training")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="inline-flex w-full items-center justify-center gap-3 rounded border-2 border-[#504533] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#ecdfe8] transition hover:border-[#ffd485] hover:bg-[#241e24] sm:w-auto sm:px-8"
              >
                {t(language, "home.hero.cta.mission")}
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-3xl px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#feb96d]">{t(language, "home.hero.location")}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[#f7efe8]">
                  <MapPin className="h-4 w-4 text-[#ffd485]" aria-hidden="true" />
                  Rajendranagar, Hyderabad
                </p>
              </div>
              <div className="glass-panel rounded-3xl px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#feb96d]">{t(language, "home.hero.focus")}</p>
                <p className="mt-3 text-base font-semibold text-[#f7efe8]">{t(language, "home.hero.focusText")}</p>
              </div>
              <div className="rounded-3xl border border-[#ffd485]/26 bg-[linear-gradient(180deg,rgba(255,212,133,0.94)_0%,rgba(254,185,109,0.94)_100%)] px-5 py-5 text-[#3a2000] shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
                <p className="font-display text-5xl font-bold leading-none">40+</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.2em]">{t(language, "home.hero.stats")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featureCards.map(([Icon, title, text]) => (
            <div key={title as string} className="glass-panel rounded-xl p-6 transition hover:-translate-y-1">
              <Icon className="h-7 w-7 text-[#ffd485]" aria-hidden="true" />
              <h2 className="font-display mt-5 text-2xl font-semibold text-[#ffd485]">{title as string}</h2>
              <p className="mt-3 text-sm leading-6 text-[#d4c4ac]">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-[#504533] bg-[#1c151c] p-5 shadow-2xl shadow-black/30 sm:p-6 lg:grid-cols-[0.72fr_1fr] lg:p-8">
          <div className="relative min-h-[280px] overflow-hidden rounded-[1.5rem] border border-[#6d582f] bg-[#120c12] sm:min-h-[420px]">
            <Image
              src="/field-beekeeping.jpg"
              alt="Field beekeeping spotlight"
              fill
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,18,0.08)_0%,rgba(18,12,18,0.45)_100%)]" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#feb96d]">Field Spotlight</p>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-[#ecdfe8] sm:text-5xl">
              {t(language, "home.fieldSpotlight.title")}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d4c4ac]">
              {t(language, "home.fieldSpotlight.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-black uppercase tracking-[0.14em] text-[#ffd485]">
              <span className="rounded-full border border-[#6d582f] px-4 py-2">{t(language, "home.fieldSpotlight.tag1")}</span>
              <span className="rounded-full border border-[#6d582f] px-4 py-2">{t(language, "home.fieldSpotlight.tag2")}</span>
              <span className="rounded-full border border-[#6d582f] px-4 py-2">{t(language, "home.fieldSpotlight.tag3")}</span>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#504533] bg-[#181218] px-4 py-4 text-sm text-[#d4c4ac]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">What people practice</p>
                <p className="mt-3">Hive observation, protective handling, colony care, and season-aware management.</p>
              </div>
              <div className="rounded-2xl border border-[#504533] bg-[#181218] px-4 py-4 text-sm text-[#d4c4ac]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">Why it matters</p>
                <p className="mt-3">The training is grounded in field readiness, not brochure language or abstract theory.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#504533]/60 bg-[#201a20] py-20">
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
                  className="group relative overflow-hidden rounded-xl border border-[#504533] bg-[#120c12] p-6 shadow-xl transition hover:border-[#ffd485]/70 sm:p-8"
                >
                  {isFoundation || isQueenRearing ? (
                    <div className="pointer-events-none absolute inset-0">
                      <Image
                        src={isFoundation ? "/scientific-foundation-bg.jpg" : "/queen-rearing-bg.jpg"}
                        alt=""
                        fill
                        className={`object-cover object-center transition duration-500 group-hover:scale-105 ${
                          isFoundation ? "opacity-35 group-hover:opacity-45" : "opacity-34 group-hover:opacity-44"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 ${
                          isFoundation
                            ? "bg-[linear-gradient(135deg,rgba(18,12,18,0.82)_0%,rgba(18,12,18,0.58)_38%,rgba(18,12,18,0.86)_100%)]"
                            : "bg-[linear-gradient(135deg,rgba(18,12,18,0.88)_0%,rgba(18,12,18,0.66)_34%,rgba(18,12,18,0.84)_100%)]"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 ${
                          isFoundation
                            ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_18%,rgba(18,12,18,0)_44%),radial-gradient(circle_at_bottom_right,rgba(244,179,21,0.18)_0%,rgba(244,179,21,0.05)_26%,rgba(18,12,18,0)_56%)]"
                            : "bg-[radial-gradient(circle_at_bottom_left,rgba(244,179,21,0.22)_0%,rgba(244,179,21,0.06)_24%,rgba(18,12,18,0)_54%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_18%,rgba(18,12,18,0)_42%)]"
                        }`}
                      />
                    </div>
                  ) : null}
                  <div className="absolute left-0 top-0 h-1.5 w-full bg-[#f4b315]" />
                  <div className="relative">
                    {isFoundation ? (
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ffd485]/25 bg-[rgba(18,12,18,0.72)] p-2 shadow-[0_20px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                        <Image
                          src="/scientific-beekeeping-icon.png"
                          alt="Scientific Beekeeping Foundation icon"
                          width={1024}
                          height={1024}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <Sprout className="h-7 w-7 text-[#ffd485]" aria-hidden="true" />
                    )}
                    <h3 className="font-display mt-5 text-2xl font-semibold text-[#ecdfe8] group-hover:text-[#ffd485] sm:text-3xl">{program.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#d4c4ac]">{program.summary}</p>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">
                      {program.duration} / {program.level}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-[#ecdfe8]">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd485]/20 bg-black/15 px-3 py-1.5">
                        <CircleDot className="h-3.5 w-3.5 text-[#ffd485]" aria-hidden="true" />
                        Practical sessions
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd485]/20 bg-black/15 px-3 py-1.5">
                        <CircleDot className="h-3.5 w-3.5 text-[#ffd485]" aria-hidden="true" />
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
              className="group relative grid gap-4 overflow-hidden rounded-xl border border-[#504533] bg-[#241e24] p-5 shadow-xl transition hover:border-[#ffd485]/70 sm:grid-cols-[170px_1fr_auto] sm:items-center sm:p-6"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">{formatDate(event.startsAt)}</p>
              <div>
                <h3 className="font-display text-xl font-semibold text-[#ecdfe8] sm:text-2xl">{event.title}</h3>
                <p className="mt-2 text-sm text-[#d4c4ac]">{event.summary}</p>
              </div>
              <ArrowRight className="h-5 w-5 justify-self-start text-[#ffd485] sm:justify-self-auto" aria-hidden="true" />
            </Link>
          ))}
          </div>
          <div className="rounded-[2rem] border border-[#504533] bg-[#181218] p-6 shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#feb96d]">Participation flow</p>
            <div className="mt-6 grid gap-4 text-sm leading-7 text-[#d4c4ac]">
              <div className="rounded-2xl border border-[#504533] bg-[#201a20] p-4">
                <p className="font-semibold text-[#ffd485]">1. Watch upcoming sessions</p>
                <p className="mt-2">Orientations and field sessions are published with date, location, and status.</p>
              </div>
              <div className="rounded-2xl border border-[#504533] bg-[#201a20] p-4">
                <p className="font-semibold text-[#ffd485]">2. Contact the center</p>
                <p className="mt-2">Use the contact page or official details for enrollment, institutional visits, or collaboration.</p>
              </div>
              <div className="rounded-2xl border border-[#504533] bg-[#201a20] p-4">
                <p className="font-semibold text-[#ffd485]">3. Join field-led learning</p>
                <p className="mt-2">The emphasis is applied practice, not empty event branding.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
