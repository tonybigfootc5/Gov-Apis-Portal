import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  MapPin,
  Microscope,
  ShieldCheck,
} from "lucide-react";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { TrainingAnnouncementPopup } from "@/components/training-announcement-popup";
import { getAnnouncementPrograms, getPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const dynamic = "force-dynamic";

export default async function Home() {
  const language = await getRequestLanguage();
  const programs = await getPrograms();
  const activeAnnouncementPrograms = getAnnouncementPrograms(programs).map((program) => getTranslatedProgramContent(program, language));
  const featureCards = [
    [GraduationCap, t(language, "home.cards.training.title"), t(language, "home.cards.training.text")],
    [CalendarDays, t(language, "home.cards.workshops.title"), t(language, "home.cards.workshops.text")],
    [Microscope, t(language, "home.cards.tech.title"), t(language, "home.cards.tech.text")],
    [ShieldCheck, "Institutional support", "Public-facing training backed by a national rural development institute."],
  ] as const;

  return (
    <>
      <TrainingAnnouncementPopup programs={activeAnnouncementPrograms} />

      <section id="home" className="relative isolate overflow-hidden bg-[#101712] scroll-mt-32">
        <div className="absolute inset-0">
          <HeroBackgroundVideo />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(235,180,40,0.12),transparent_22rem),linear-gradient(110deg,rgba(6,10,8,0.36)_10%,rgba(7,12,10,0.18)_42%,rgba(7,12,10,0.28)_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[62%] bg-[linear-gradient(90deg,rgba(3,7,5,0.72)_0%,rgba(3,7,5,0.52)_36%,rgba(3,7,5,0.18)_72%,rgba(3,7,5,0)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(16,23,18,0)_0%,rgba(16,23,18,0.38)_100%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-18 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-28">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="max-w-4xl">
              <p className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-white/14 bg-[rgba(255,250,240,0.1)] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-[#f4cb61] shadow-[0_18px_40px_rgba(0,0,0,0.2)] backdrop-blur-md sm:text-xs sm:tracking-[0.22em]">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                <span>{institute.parent.split(",")[0]}</span>
              </p>
              <h1 className="font-display mt-8 max-w-4xl text-[clamp(3.2rem,10vw,7rem)] font-semibold leading-[0.92] tracking-tight text-[#fff8ea] [text-shadow:0_10px_32px_rgba(0,0,0,0.45)]">
                Field-ready <span className="text-[#f4cb61]">API CULTURE</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#f3ead9] [text-shadow:0_6px_24px_rgba(0,0,0,0.35)] sm:mt-7 sm:text-xl sm:leading-9">
                {t(language, "home.hero.description")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.18em] text-[#fff3d2]">
                <span className="rounded-full border border-white/14 bg-black/20 px-4 py-2 backdrop-blur-sm">Rajendranagar, Hyderabad</span>
                <span className="rounded-full border border-white/14 bg-black/20 px-4 py-2 backdrop-blur-sm">Hands-on training</span>
                <span className="rounded-full border border-white/14 bg-black/20 px-4 py-2 backdrop-blur-sm">Field demonstrations</span>
              </div>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link
                  href="/programs"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ebb428] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#1b3b2b] shadow-[0_22px_50px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 sm:w-auto sm:px-8"
                >
                  {t(language, "home.hero.cta.training")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/18 bg-[rgba(255,250,240,0.12)] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#fff8ea] backdrop-blur-md transition hover:border-white/36 hover:bg-[rgba(255,250,240,0.18)] sm:w-auto sm:px-8"
                >
                  {t(language, "home.hero.cta.mission")}
                </Link>
              </div>
            </div>

            <div className="grid gap-4 lg:justify-items-end">
              <div className="w-full max-w-sm rounded-[2rem] border border-white/18 bg-[rgba(8,12,10,0.28)] px-5 py-5 text-[#fff8ea] shadow-[0_28px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f4cb61]">{t(language, "home.hero.location")}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#fff8ea]">
                  <MapPin className="h-4 w-4 text-[#f4cb61]" aria-hidden="true" />
                  Rajendranagar, Hyderabad
                </p>
                <p className="mt-3 text-sm leading-7 text-[#efe4d1]">{t(language, "home.hero.focusText")}</p>
              </div>
              <div className="grid w-full max-w-sm gap-4 sm:grid-cols-[1fr_auto] lg:grid-cols-1">
                <div className="rounded-[2rem] border border-white/18 bg-[rgba(8,12,10,0.28)] px-5 py-5 text-[#fff8ea] shadow-[0_28px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f4cb61]">Live field atmosphere</p>
                  <p className="mt-3 text-sm leading-7 text-[#efe4d1]">
                    The landing section now opens directly into the field footage so the site feels closer to the real training environment.
                  </p>
                </div>
                <div className="rounded-[2rem] border border-[rgba(244,203,97,0.34)] bg-[linear-gradient(180deg,rgba(244,203,97,0.42)_0%,rgba(179,107,0,0.38)_100%)] px-5 py-6 text-[#faf8f2] shadow-[0_22px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <p className="font-display text-5xl font-bold leading-none">40+</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-[#fff7df]">{t(language, "home.hero.stats")}</p>
                </div>
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
    </>
  );
}
