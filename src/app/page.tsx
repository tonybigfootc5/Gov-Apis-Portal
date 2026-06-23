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
import { getPopupAnnouncementPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { trainingProgramGallery } from "@/lib/training-programs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const language = await getRequestLanguage();
  const activeAnnouncementPrograms = (await getPopupAnnouncementPrograms()).map((program) =>
    getTranslatedProgramContent(program, language),
  );
  const experienceYears = new Date().getFullYear() - 2004;
  const cards = [
    [GraduationCap, "Applied training", "Programs designed around field readiness, not brochure talk."],
    [CalendarDays, "Current batches", "Clear batch-led enrollment with direct progression to payment."],
    [Microscope, "Practical methods", "Scientific beekeeping, processing, and specialized production tracks."],
    [ShieldCheck, "Institutional backing", "Anchored within a national public-sector development ecosystem."],
  ] as const;

  return (
    <>
      <TrainingAnnouncementPopup programs={activeAnnouncementPrograms} />

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <HeroBackgroundVideo />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.22)_0%,rgba(4,6,10,0.46)_54%,rgba(4,6,10,0.78)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,138,42,0.2),transparent_24rem),radial-gradient(circle_at_top_right,rgba(142,197,255,0.18),transparent_28rem)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="neo-shell max-w-5xl rounded-[2.6rem] p-6 sm:p-8 lg:p-10">
            <div className="relative z-10">
              <p className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#ffd37c] shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                {institute.parent.split(",")[0]}
              </p>

              <h1 className="font-display mt-6 max-w-5xl text-[clamp(3.6rem,9vw,7.3rem)] leading-[0.88] text-bright [text-shadow:0_10px_34px_rgba(0,0,0,0.34)]">
                Apiculture training
                <br />
                rebuilt for launch.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-[#dbe5f2] sm:text-lg">
                {t(language, "home.hero.description")} Enrollment now points straight into the real payment flow with a cleaner, faster public experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/programs"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
                >
                  View programs
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/8 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#f4efe4]"
                >
                  About the center
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <HeroStat value={`${experienceYears}+`} label="Years active" />
                <HeroStat value="30" label="Seats per batch" />
                <HeroStat value="4" label="Current program tracks" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-dim">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2">
              <MapPin className="h-4 w-4 text-[#8ec5ff]" aria-hidden="true" />
              Rajendranagar, Hyderabad
            </span>
            <span className="rounded-full border border-white/10 bg-white/4 px-4 py-2">
              Public-facing training portal
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(([Icon, title, text]) => (
            <div key={title} className="section-frame rounded-[1.8rem] p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2b544]/12 text-[#f2b544]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-5 text-3xl text-bright">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-dim">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="section-frame rounded-[2rem] p-6 sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">Why this matters</p>
            <h2 className="font-display mt-4 text-4xl text-bright sm:text-5xl">
              Strong beekeeping systems create value far beyond honey.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-dim">
              Practical apiculture strengthens pollination, creates rural income, and supports more resilient production systems. A training center should make that value visible in the field and online.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ValueCard title="Pollination" body="Healthy colonies support better flowering, fruit set, and crop confidence." />
              <ValueCard title="Livelihoods" body="Honey, wax, and allied products open local earning pathways when training is solid." />
            </div>
          </div>

          <div className="section-frame rounded-[2rem] p-4">
            <div className="relative min-h-[24rem] overflow-hidden rounded-[1.6rem]">
              <Image
                src="/field-beekeeping.jpg"
                alt="Field beekeeping session"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,20,0.08)_0%,rgba(10,13,20,0.68)_100%)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="section-frame overflow-hidden rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">From the field</p>
              <h2 className="font-display mt-4 text-4xl text-bright">A sharper public face for a real training ecosystem.</h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#f4efe4]"
            >
              Open gallery
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trainingProgramGallery.slice(0, 4).map((image) => (
              <div key={image.label} className="relative min-h-[16rem] overflow-hidden rounded-[1.4rem] border border-white/10">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1280px) 20vw, (min-width: 768px) 40vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.02)_30%,rgba(7,10,18,0.82)_100%)]" />
                <p className="absolute bottom-3 left-3 rounded-full border border-white/12 bg-black/35 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                  {image.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
      <p className="font-display text-4xl text-bright">{value}</p>
      <p className="mt-2 text-sm text-dim">{label}</p>
    </div>
  );
}

function ValueCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/4 p-5">
      <p className="text-lg font-semibold text-bright">{title}</p>
      <p className="mt-3 text-sm leading-7 text-dim">{body}</p>
    </div>
  );
}
