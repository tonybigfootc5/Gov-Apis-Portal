import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Microscope,
  Quote,
  ShieldCheck,
  Sprout,
  SunMedium,
} from "lucide-react";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { TrainingAnnouncementPopup } from "@/components/training-announcement-popup";
import { getPopupAnnouncementPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const dynamic = "force-dynamic";

export default async function Home() {
  const language = await getRequestLanguage();
  const activeAnnouncementPrograms = (await getPopupAnnouncementPrograms()).map((program) =>
    getTranslatedProgramContent(program, language),
  );
  const experienceYears = new Date().getFullYear() - 2004;
  const heroStats = [
    {
      value: "40+",
      label: "Capability pathways",
      note: "Training and field capability pathways shaped for practical beekeeping growth.",
    },
    {
      value: `${experienceYears}+`,
      label: "Years of experience",
      note: "Built on a mission that has been growing since 2004 with sustained institutional support.",
    },
    {
      value: "30",
      label: "Participants per batch",
      note: "Focused batch sizes that keep guidance practical, visible, and easy to follow.",
    },
  ] as const;
  const featureCards = [
    [GraduationCap, t(language, "home.cards.training.title"), t(language, "home.cards.training.text")],
    [CalendarDays, t(language, "home.cards.workshops.title"), t(language, "home.cards.workshops.text")],
    [Microscope, t(language, "home.cards.tech.title"), t(language, "home.cards.tech.text")],
    [ShieldCheck, "Institutional support", "Public-facing training backed by a national rural development institute."],
  ] as const;
  const honeyImportance = {
    eyebrow: "Why honey matters",
    title: "Honey is more than a product. It is a living sign of healthy fields, thriving pollination, and rural resilience.",
    quote:
      "If the bee disappeared off the surface of the globe, then man would have only four years of life left.",
    quoteLabel: "Often attributed to Albert Einstein",
    quoteNote: "Popular attribution in public discourse; no verified documented source.",
    body:
      "Honey reflects the health of the ecosystem behind it. Every well-managed colony supports pollination, strengthens crop productivity, and creates meaningful income opportunities for farming families, women groups, and future rural entrepreneurs.",
    highlights: [
      [Sprout, "Pollination power", "Bee activity supports flowering, fruit setting, seed formation, and stronger farm biodiversity."],
      [SunMedium, "Rural livelihoods", "Honey, wax, and allied hive products open practical income pathways when training and field support are in place."],
      [HeartHandshake, "Human connection", "Healthy bee systems link nature, agriculture, nutrition, and community confidence in one chain."],
    ] as const,
    statValue: "One healthy hive",
    statLabel: "can support far more than honey alone through pollination, crop confidence, and local livelihood value.",
  } as const;

  return (
    <>
      <TrainingAnnouncementPopup programs={activeAnnouncementPrograms} />

      <section id="home" className="relative isolate overflow-hidden bg-[#101712] scroll-mt-32">
        <div className="absolute inset-0">
          <HeroBackgroundVideo />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,203,97,0.12),transparent_18rem),radial-gradient(circle_at_top_left,rgba(235,180,40,0.14),transparent_22rem),linear-gradient(180deg,rgba(7,12,10,0.44)_0%,rgba(7,12,10,0.24)_38%,rgba(7,12,10,0.68)_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgba(3,7,5,0.84)_0%,rgba(3,7,5,0.56)_34%,rgba(3,7,5,0.18)_72%,rgba(3,7,5,0)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(16,23,18,0)_0%,rgba(16,23,18,0.56)_100%)]" />
          <div className="pointer-events-none absolute -left-8 top-24 h-56 w-56 bg-[radial-gradient(circle,rgba(244,203,97,0.14)_0%,rgba(244,203,97,0)_70%)]" />
          <div className="pointer-events-none absolute right-10 top-28 hidden opacity-70 lg:block">
            <div className="hero-hex-cluster">
              <span className="hero-hex hero-hex-lg" />
              <span className="hero-hex hero-hex-sm" />
              <span className="hero-hex hero-hex-md" />
              <span className="hero-hex hero-hex-xs" />
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-between px-4 pb-28 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 lg:pb-14 lg:pt-14">
          <div className="flex items-start justify-between gap-6">
            <p className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-white/14 bg-[rgba(255,250,240,0.08)] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-[#f4cb61] shadow-[0_18px_40px_rgba(0,0,0,0.2)] backdrop-blur-md sm:text-xs sm:tracking-[0.22em]">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              <span>{institute.parent.split(",")[0]}</span>
            </p>
            <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-3">
              <div className="rounded-[1.6rem] border border-white/14 bg-[rgba(255,250,240,0.08)] px-5 py-4 text-right text-[#fff8ea] backdrop-blur-md">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f4cb61]">Location</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-[#f4cb61]" aria-hidden="true" />
                  Rajendranagar, Hyderabad
                </p>
              </div>
              <div className="max-w-xs rounded-[1.8rem] border border-[rgba(244,203,97,0.24)] bg-[linear-gradient(180deg,rgba(28,31,21,0.78)_0%,rgba(79,58,18,0.72)_100%)] p-5 text-[#fff8ea] backdrop-blur-md">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f4cb61]">Quick impact</p>
                <div className="mt-4 grid gap-3">
                  {heroStats.slice(0, 2).map((stat) => (
                    <div key={stat.label} className="rounded-[1.3rem] border border-white/10 bg-[rgba(255,250,240,0.06)] px-4 py-3">
                      <p className="font-display text-3xl font-semibold leading-none">{stat.value}</p>
                      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#f4cb61]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,38rem)_1fr]">
            <div className="max-w-4xl pb-4">
              <h1 className="font-display max-w-4xl text-[clamp(3.3rem,9vw,6.8rem)] font-semibold leading-[0.9] tracking-tight text-[#fff8ea] [text-shadow:0_10px_32px_rgba(0,0,0,0.45)]">
                Field-ready API
                <br />
                <span className="text-[#f4cb61]">CULTURE</span>
              </h1>
              <div className="mt-5 flex items-start gap-4">
                <div className="hidden h-px w-20 bg-[linear-gradient(90deg,rgba(244,203,97,0.9),rgba(244,203,97,0))] sm:block" />
                <p className="max-w-2xl text-base leading-8 text-[#f3ead9] [text-shadow:0_6px_24px_rgba(0,0,0,0.35)] sm:text-lg sm:leading-8">
                  {t(language, "home.hero.description")}
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.18em] text-[#fff3d2]">
                <span className="rounded-full border border-white/14 bg-black/20 px-4 py-2 backdrop-blur-sm">Hands-on training</span>
                <span className="rounded-full border border-white/14 bg-black/20 px-4 py-2 backdrop-blur-sm">Pollination awareness</span>
                <span className="rounded-full border border-white/14 bg-black/20 px-4 py-2 backdrop-blur-sm">Rural enterprise</span>
              </div>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
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

            <div className="flex justify-end lg:hidden">
              <div className="w-full max-w-md rounded-[1.8rem] border border-[rgba(244,203,97,0.24)] bg-[linear-gradient(180deg,rgba(28,31,21,0.78)_0%,rgba(79,58,18,0.72)_100%)] p-5 text-[#fff8ea] backdrop-blur-md">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f4cb61]">{t(language, "home.hero.stats")}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="rounded-[1.3rem] border border-white/10 bg-[rgba(255,250,240,0.06)] px-4 py-3">
                      <p className="font-display text-3xl font-semibold leading-none">{stat.value}</p>
                      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#f4cb61]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:block" />
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <div className="max-w-sm rounded-[1.8rem] border border-white/12 bg-[rgba(255,250,240,0.08)] px-5 py-4 text-[#efe4d1] backdrop-blur-md">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f4cb61]">Live field atmosphere</p>
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
        <div className="overflow-hidden rounded-[2.5rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(135deg,#fffdf8_0%,#f8f0e2_52%,#f2e4c5_100%)] shadow-[0_28px_70px_rgba(64,44,8,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(235,180,40,0.16),transparent_18rem)]" />
              <div className="relative">
                <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(179,107,0,0.18)] bg-[#fff8e8] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#b36b00]">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  {honeyImportance.eyebrow}
                </p>
                <h2 className="font-display mt-6 max-w-4xl text-3xl font-semibold leading-tight text-[#1b3b2b] sm:text-5xl">
                  {honeyImportance.title}
                </h2>
                <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8]/90 p-6 shadow-[0_18px_50px_rgba(64,44,8,0.06)] backdrop-blur-sm">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,253,248,0.96)_0%,rgba(255,253,248,0.92)_62%,rgba(246,239,228,0.88)_100%)]" />
                  <div className="relative">
                  <Quote className="h-9 w-9 text-[#b36b00]" aria-hidden="true" />
                  <p className="font-display mt-4 max-w-3xl text-2xl leading-tight text-[#1b3b2b] sm:text-3xl">
                    {honeyImportance.quote}
                  </p>
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#7b6951]">
                    {honeyImportance.quoteLabel}
                  </p>
                  <p className="mt-2 max-w-xl text-xs leading-6 text-[#7b6951]">{honeyImportance.quoteNote}</p>
                  </div>
                </div>
                <p className="mt-8 max-w-3xl text-base leading-8 text-[#516253]">
                  {honeyImportance.body}
                </p>
                <div className="mt-8 rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#173f33] px-5 py-5 text-[#fff8ea] shadow-[0_24px_60px_rgba(27,59,43,0.16)]">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f4cb61]">What one hive can mean</p>
                  <p className="font-display mt-3 text-3xl font-semibold leading-tight text-[#fff8ea]">{honeyImportance.statValue}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d9dfd8]">{honeyImportance.statLabel}</p>
                </div>
              </div>
            </div>

            <div className="relative border-t border-[rgba(27,59,43,0.08)] bg-[#fffaf1] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(235,180,40,0.24)_0%,rgba(235,180,40,0)_72%)]" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#ece3d3]">
                <Image
                  src="/field-beekeeping.jpg"
                  alt="Beekeeping field work showing the wider importance of bees and honey"
                  width={900}
                  height={1080}
                  className="h-[320px] w-full object-cover sm:h-[420px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,248,242,0.04)_0%,rgba(27,59,43,0.38)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="rounded-[1.5rem] border border-white/16 bg-[rgba(16,23,18,0.58)] p-4 text-[#fff8ea] backdrop-blur-md">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f4cb61]">Deep importance</p>
                    <p className="mt-3 text-sm leading-7 text-[#f4edde]">
                      Honey stands at the meeting point of ecology, agriculture, and human effort. It is the visible reward of an invisible chain of care.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {honeyImportance.highlights.map(([Icon, title, text]) => (
                  <div
                    key={title}
                    className="rounded-[1.75rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-5 shadow-[0_16px_40px_rgba(64,44,8,0.05)]"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6efe4] text-[#b36b00]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-[#1b3b2b]">{title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[#516253]">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
