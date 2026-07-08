import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Quote,
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
import { getTranslatedProgramContent } from "@/lib/i18n";
import type { SiteLanguage } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { getSiteCopy } from "@/lib/site-copy";
import { trainingProgramGallery } from "@/lib/training-programs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const language = await getRequestLanguage();
  const copy = getSiteCopy(language);
  const pageCopy: Record<
    SiteLanguage,
    {
      technologies: string;
      technologiesText: string;
      openTechnologies: string;
      quoteEyebrow: string;
      quoteAuthor: string;
    }
  > = {
    en: {
      technologies: "Technologies",
      technologiesText: "Explore the beekeeping and bee-product technologies taught at the center.",
      openTechnologies: "Open technologies",
      quoteEyebrow: "Honey Bee In Nature",
      quoteAuthor: "Albert Einstein",
    },
    te: {
      technologies: "టెక్నాలజీలు",
      technologiesText: "కేంద్రంలో బోధించే తేనెటీగల పెంపకం మరియు తేనెటీగ ఉత్పత్తుల టెక్నాలజీలను తెలుసుకోండి.",
      openTechnologies: "టెక్నాలజీలు చూడండి",
      quoteEyebrow: "ప్రకృతిలో తేనెటీగ",
      quoteAuthor: "ఆల్బర్ట్ ఐన్‌స్టీన్",
    },
    hi: {
      technologies: "टेक्नोलॉजी",
      technologiesText: "केंद्र में सिखाई जाने वाली मधुमक्खी पालन और बी-प्रोडक्ट टेक्नोलॉजी देखें।",
      openTechnologies: "टेक्नोलॉजी देखें",
      quoteEyebrow: "प्रकृति में मधुमक्खी",
      quoteAuthor: "अल्बर्ट आइंस्टीन",
    },
  };
  const localCopy = pageCopy[language];
  const activeAnnouncementPrograms = (await getPopupAnnouncementPrograms()).map((program) =>
    getTranslatedProgramContent(program, language),
  );
  const cards: ReadonlyArray<{
    icon: typeof GraduationCap;
    title: string;
    text: string;
    href?: string;
  }> = [
    {
      icon: GraduationCap,
      title: copy.home.cards[0].title,
      text: copy.home.cards[0].text,
    },
    {
      icon: Microscope,
      title: localCopy.technologies,
      text: localCopy.technologiesText,
      href: "/technologies",
    },
    {
      icon: CalendarDays,
      title: copy.home.cards[2].title,
      text: copy.home.cards[2].text,
    },
    {
      icon: ShieldCheck,
      title: copy.home.cards[3].title,
      text: copy.home.cards[3].text,
    },
  ] as const;

  return (
    <>
      <TrainingAnnouncementPopup programs={activeAnnouncementPrograms} />

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <HeroBackgroundVideo />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,27,23,0.14)_0%,rgba(38,37,27,0.18)_46%,rgba(74,56,29,0.34)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,179,71,0.12),transparent_24rem),radial-gradient(circle_at_top_right,rgba(142,197,255,0.12),transparent_28rem),radial-gradient(circle_at_bottom_center,rgba(255,224,166,0.12),transparent_30rem)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-5xl rounded-[2.6rem] border border-[rgba(255,255,255,0.62)] bg-[linear-gradient(180deg,rgba(255,253,248,0.84),rgba(255,248,236,0.74))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_28px_72px_rgba(119,89,36,0.16)] backdrop-blur-[18px] sm:p-8 lg:p-10">
            <div className="relative z-10">
              <p className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-[rgba(179,107,0,0.14)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00] shadow-[0_10px_30px_rgba(119,89,36,0.12)]">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                {institute.parent.split(",")[0]}
              </p>

              <h1 className="font-display mt-6 max-w-5xl text-[clamp(3.6rem,9vw,7.3rem)] leading-[0.9] text-[#1d392e]">
                {copy.home.heroTitle.filter(Boolean).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-[#42584e] sm:text-lg">
                {copy.home.heroDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/programs"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
                >
                  {copy.home.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(31,53,43,0.12)] bg-[rgba(255,255,255,0.74)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#1f352b]"
                >
                  {copy.home.secondaryCta}
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <HeroStat value="30+" label={copy.home.stats[0]} />
                <HeroStat value="25000+" label={copy.home.stats[1]} />
                <HeroStat value="100%" label={copy.home.stats[2]} />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#2f473d]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(31,53,43,0.12)] bg-[rgba(255,255,255,0.62)] px-4 py-2 shadow-[0_10px_24px_rgba(119,89,36,0.1)] backdrop-blur-md">
              <MapPin className="h-4 w-4 text-[#8ec5ff]" aria-hidden="true" />
              {copy.home.locationChip}
            </span>
            <span className="rounded-full border border-[rgba(31,53,43,0.12)] bg-[rgba(255,255,255,0.62)] px-4 py-2 shadow-[0_10px_24px_rgba(119,89,36,0.1)] backdrop-blur-md">
              {copy.home.portalChip}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ icon: Icon, title, text, href }) => {
            const content = (
              <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2b544]/12 text-[#f2b544]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-5 text-3xl text-bright">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-dim">{text}</p>
              {href ? (
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#f2b544]">
                  {localCopy.openTechnologies}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              ) : null}
              </>
            );

            if (href) {
              return (
                <Link
                  key={title}
                  href={href}
                  className="section-frame rounded-[1.8rem] p-6 transition hover:-translate-y-1 hover:border-[rgba(199,123,34,0.24)]"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={title} className="section-frame rounded-[1.8rem] p-6">
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="section-frame rounded-[2rem] p-6 sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">{copy.home.whyEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl text-bright sm:text-5xl">
              {copy.home.whyTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-dim">
              {copy.home.whyBody}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ValueCard title={copy.home.values[0].title} body={copy.home.values[0].body} />
              <ValueCard title={copy.home.values[1].title} body={copy.home.values[1].body} />
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

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-[rgba(41,56,49,0.08)] bg-[linear-gradient(135deg,rgba(255,253,248,0.92),rgba(247,238,220,0.9))] p-6 shadow-[0_24px_60px_rgba(78,55,15,0.08)] sm:p-8 lg:p-10">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#f2b544]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#88a37c]/10 blur-3xl" />
          <div className="absolute right-8 top-8 hidden opacity-80 lg:block">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className="h-4 w-4 bg-[linear-gradient(180deg,#f6d36f,#dba33b)] opacity-70 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]"
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#b36b00]">{localCopy.quoteEyebrow}</p>
            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#f2b544]/25 bg-white/75 text-[#b36b00] shadow-[0_10px_28px_rgba(100,70,16,0.08)]">
              <Quote className="h-6 w-6" aria-hidden="true" />
            </div>
            <blockquote className="font-display mt-6 text-3xl leading-tight text-[#1f352b] sm:text-4xl lg:text-[2.9rem]">
              “If the honey bee disappeared from the surface of the globe the man would only have four years of life left.
              No more bees, No more pollination, No more plants, No more animals, No more man.”
            </blockquote>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-[#7d8b74]">{localCopy.quoteAuthor}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="section-frame overflow-hidden rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{copy.home.fieldEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl text-bright">{copy.home.fieldTitle}</h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.78)] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1f352b]"
            >
              {copy.home.galleryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trainingProgramGallery.slice(0, 4).map((image, index) => (
              <div key={image.label} className="relative min-h-[16rem] overflow-hidden rounded-[1.4rem] border border-white/10">
                <Image src={image.src} alt={copy.home.galleryLabels[index]} fill sizes="(min-width: 1280px) 20vw, (min-width: 768px) 40vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.02)_30%,rgba(7,10,18,0.82)_100%)]" />
                <p className="absolute bottom-3 left-3 rounded-full border border-[rgba(255,255,255,0.24)] bg-[rgba(17,28,24,0.56)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#fff9ef] backdrop-blur-sm">
                  {copy.home.galleryLabels[index]}
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
    <div className="rounded-[1.4rem] border border-[rgba(31,53,43,0.1)] bg-[rgba(255,255,255,0.56)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-md">
      <p className="font-display text-4xl text-[#1f352b]">{value}</p>
      <p className="mt-2 text-sm text-[#54655d]">{label}</p>
    </div>
  );
}

function ValueCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[rgba(41,56,49,0.08)] bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_16px_40px_rgba(120,95,41,0.08)]">
      <p className="text-lg font-semibold text-bright">{title}</p>
      <p className="mt-3 text-sm leading-7 text-dim">{body}</p>
    </div>
  );
}
