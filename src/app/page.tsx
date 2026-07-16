import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { HomeNavigationCards } from "@/components/home-navigation-cards";
import { TrainingAnnouncementPopup } from "@/components/training-announcement-popup";
import { getPopupAnnouncementPrograms } from "@/lib/data";
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
      openCard: string;
      quoteEyebrow: string;
      quoteAuthor: string;
    }
  > = {
    en: {
      technologies: "Technologies",
      technologiesText: "Explore the beekeeping and bee-product technologies taught at the center.",
      openTechnologies: "Open technologies",
      openCard: "Open page",
      quoteEyebrow: "Honey Bee In Nature",
      quoteAuthor: "Albert Einstein",
    },
    te: {
      technologies: "టెక్నాలజీలు",
      technologiesText: "కేంద్రంలో బోధించే తేనెటీగల పెంపకం మరియు తేనెటీగ ఉత్పత్తుల టెక్నాలజీలను తెలుసుకోండి.",
      openTechnologies: "టెక్నాలజీలు చూడండి",
      openCard: "పేజీ చూడండి",
      quoteEyebrow: "ప్రకృతిలో తేనెటీగ",
      quoteAuthor: "ఆల్బర్ట్ ఐన్‌స్టీన్",
    },
    hi: {
      technologies: "टेक्नोलॉजी",
      technologiesText: "केंद्र में सिखाई जाने वाली मधुमक्खी पालन और बी-प्रोडक्ट टेक्नोलॉजी देखें।",
      openTechnologies: "टेक्नोलॉजी देखें",
      openCard: "पेज देखें",
      quoteEyebrow: "प्रकृति में मधुमक्खी",
      quoteAuthor: "अल्बर्ट आइंस्टीन",
    },
  };
  const localCopy = pageCopy[language];
  const activeAnnouncementPrograms = (await getPopupAnnouncementPrograms()).map((program) =>
    getTranslatedProgramContent(program, language),
  );
  const cards: ReadonlyArray<{
    label: string;
    title: string;
    text: string;
    href: string;
    backgroundSrc: string;
  }> = [
    {
      label: copy.home.cards[0].title,
      title: copy.home.cards[0].title,
      text: copy.home.cards[0].text,
      href: "/products",
      backgroundSrc: "/card-backgrounds/honey-bee-hive.jpg",
    },
    {
      label: localCopy.technologies,
      title: localCopy.technologies,
      text: localCopy.technologiesText,
      href: "/technologies",
      backgroundSrc: "/card-backgrounds/honey-bee-tech-image.jpg",
    },
    {
      label: copy.home.cards[2].title,
      title: copy.home.cards[2].title,
      text: copy.home.cards[2].text,
      href: "/equipment",
      backgroundSrc: "/card-backgrounds/equipment-support-tools.png",
    },
    {
      label: copy.home.cards[3].title,
      title: copy.home.cards[3].title,
      text: copy.home.cards[3].text,
      href: "/events",
      backgroundSrc: "/card-backgrounds/events-and-workshops.png",
    },
  ] as const;
  const fieldGalleryTiles = [
    { image: trainingProgramGallery[0], className: "mt-10 aspect-[0.82/1.16]" },
    { image: trainingProgramGallery[1], className: "mt-2 aspect-[1/0.82]" },
    { image: trainingProgramGallery[2], className: "mt-16 aspect-[0.72/1.28]" },
    { image: trainingProgramGallery[3], className: "mt-0 aspect-[0.88/1.22]" },
    { image: trainingProgramGallery[4], className: "mt-6 aspect-[0.8/1.16]" },
    { image: trainingProgramGallery[5], className: "mt-12 aspect-[1/0.82]" },
    { image: trainingProgramGallery[6], className: "mt-1 aspect-[0.88/1.2]" },
    { image: trainingProgramGallery[7], className: "mt-9 aspect-[0.82/1.14]" },
  ] as const;
  return (
    <>
      <TrainingAnnouncementPopup programs={activeAnnouncementPrograms} />

      <section className="relative isolate overflow-hidden bg-[#f8faf7] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[1.55rem] border border-white/70 bg-[#15283a] shadow-[0_28px_70px_rgba(20,31,24,0.16)] sm:rounded-[1.85rem]">
          <div className="absolute inset-0">
            <HeroBackgroundVideo />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,36,42,0.08)_0%,rgba(24,36,42,0.1)_42%,rgba(12,21,27,0.36)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,22,0.16)_0%,rgba(4,14,22,0.02)_38%,rgba(4,14,22,0.24)_100%)]" />
          </div>

          <div className="relative z-10 flex min-h-[calc(100vh-2rem)] flex-col items-center px-5 pb-10 pt-28 text-center text-white sm:px-8 sm:pb-14 sm:pt-32 lg:px-12">
            <div className="mx-auto mt-10 max-w-5xl sm:mt-16">
              <h1 className="font-display mx-auto w-72 max-w-full text-[clamp(2.05rem,10vw,3.2rem)] leading-[0.98] tracking-[-0.025em] text-white [text-shadow:0_18px_42px_rgba(7,19,27,0.34)] sm:w-auto sm:max-w-5xl sm:text-[clamp(2.65rem,6.6vw,5.9rem)] sm:tracking-[-0.045em]">
                {copy.home.heroTitle.filter(Boolean).map((line) => (
                  <span key={line} className="mx-auto block w-full whitespace-normal sm:max-w-none">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mx-auto mt-5 w-72 max-w-full text-sm leading-6 text-white/82 sm:w-auto sm:max-w-2xl sm:text-base sm:leading-7">
                {copy.home.heroDescription}
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/programs"
                  className="inline-flex min-h-11 w-full max-w-[15rem] items-center justify-center gap-2 rounded-full bg-[#071421] px-5 py-2.5 text-sm font-medium text-white shadow-[0_16px_36px_rgba(7,20,33,0.28)] transition hover:-translate-y-0.5 hover:bg-[#132236] sm:w-auto sm:max-w-none"
                >
                  {copy.home.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-11 w-full max-w-[15rem] items-center justify-center rounded-full border border-white/26 bg-white/14 px-5 py-2.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/22 sm:w-auto sm:max-w-none"
                >
                  {copy.home.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="mt-auto flex w-full justify-end pt-12 sm:pt-14">
              <div className="flex w-full max-w-full flex-col items-center gap-3 text-[11px] font-medium text-white/84 sm:w-auto sm:items-end">
                <p className="inline-flex w-full max-w-[20rem] items-center gap-3 overflow-hidden rounded-full border border-white/20 bg-white/12 py-2 pl-2 pr-4 text-[10px] font-semibold uppercase leading-5 tracking-[0.14em] text-white/86 shadow-[0_12px_36px_rgba(6,18,26,0.16)] backdrop-blur-md sm:w-auto sm:max-w-full">
                  <span className="relative flex h-8 w-[4.6rem] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/92 px-2">
                    <Image
                      src="/nirdpr-logo-badge.jpeg"
                      alt="NIRDPR"
                      fill
                      sizes="5rem"
                      className="object-contain p-1"
                    />
                  </span>
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  <span className="min-w-0 truncate sm:hidden">NIRDPR training center</span>
                  <span className="hidden min-w-0 truncate sm:inline">National Institute of Rural Development and Panchayati Raj</span>
                </p>
                <div className="flex max-w-full flex-wrap items-center justify-center gap-3 rounded-full border border-white/16 bg-white/12 px-3 py-2 text-left text-white shadow-[0_18px_38px_rgba(7,20,33,0.18)] backdrop-blur-md sm:justify-end">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[11px] font-black text-[#071421]">30+</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f2b544] text-[10px] font-black text-[#071421]">25K</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[10px] font-black text-[#071421]">100</span>
                  <span className="hidden pr-2 text-[11px] font-medium leading-4 text-white/82 min-[430px]:block">
                    {copy.home.stats[0]}<br />
                    {copy.home.stats[1]}
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/12 px-3 py-2 backdrop-blur-md">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {copy.home.locationChip}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <HomeNavigationCards cards={cards} />
      </section>

      <section className="mx-auto max-w-[34rem] px-4 pb-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.8rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,253,250,0.42)_0%,rgba(243,236,222,0.2)_100%)] p-2 shadow-[0_22px_60px_rgba(96,73,24,0.12),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-[10px]">
          <div className="relative aspect-[941/1680] overflow-hidden rounded-[1.45rem] border border-white/35 shadow-[0_18px_46px_rgba(64,49,18,0.18)]">
            <Image
              src="/why-matters-bee-bloom-v2.png"
              alt="Bee approaching blossoms in close detail"
              fill
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,8,0.16)_0%,rgba(7,14,8,0.04)_24%,rgba(7,14,8,0.08)_58%,rgba(7,14,8,0.22)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_26%,rgba(255,241,197,0.08)_0%,rgba(255,241,197,0.03)_15%,rgba(255,241,197,0)_34%)]" />

            <div className="relative z-10 h-full px-4 py-4 sm:px-5 sm:py-5">
              <div className="absolute right-[11%] top-[14%]">
                <p className="whitespace-nowrap text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#fff4d2] [text-shadow:0_6px_18px_rgba(0,0,0,0.6)]">
                  {copy.home.whyEyebrow}
                </p>
              </div>

              <div className="absolute right-[11%] top-[24%] max-w-[8.75rem]">
                <p className="text-[0.72rem] font-medium leading-4 text-[#fffaf0] [text-shadow:0_8px_22px_rgba(0,0,0,0.62)]">
                  {copy.home.whyBody}
                </p>
              </div>

              <div className="absolute right-[11%] top-[45%] max-w-[8rem]">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ffe2a3] [text-shadow:0_6px_18px_rgba(0,0,0,0.5)]">Pollination</p>
                <p className="mt-1 text-[0.62rem] leading-4 text-[#fffaf0] [text-shadow:0_6px_18px_rgba(0,0,0,0.56)]">
                  {copy.home.values[0].body}
                </p>
              </div>

              <div className="absolute right-[11%] top-[60%] max-w-[8rem]">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#ffe2a3] [text-shadow:0_6px_18px_rgba(0,0,0,0.5)]">Livelihoods</p>
                <p className="mt-1 text-[0.62rem] leading-4 text-[#fffaf0] [text-shadow:0_6px_18px_rgba(0,0,0,0.56)]">
                  {copy.home.values[1].body}
                </p>
              </div>

              <div className="absolute bottom-[6%] left-[8%] max-w-[11.25rem]">
                <h2 className="font-display text-[clamp(1.6rem,6.1vw,3.15rem)] leading-[0.88] tracking-[-0.05em] text-[#fffaf0] [text-shadow:0_4px_0_rgba(71,52,15,0.22),0_16px_34px_rgba(0,0,0,0.58)]">
                  <span className="block">Strong</span>
                  <span className="block">Beekeeping</span>
                  <span className="block">Systems</span>
                </h2>
                <p className="mt-2 max-w-[8rem] text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[#fff4d2] [text-shadow:0_6px_18px_rgba(0,0,0,0.52)]">
                  Create value beyond honey
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[78rem] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative aspect-[7/3] min-h-[18rem] overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.2)] bg-black shadow-[0_26px_72px_rgba(0,0,0,0.22)]">
          <Image
            src="/quote-honey-bee-glow.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 78rem, 100vw"
            className="object-cover object-[38%_48%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,9,8,0.08)_0%,rgba(5,9,8,0.04)_22%,rgba(5,9,8,0.14)_42%,rgba(5,9,8,0.52)_68%,rgba(5,9,8,0.9)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_37%_48%,rgba(255,214,157,0.2)_0%,rgba(255,214,157,0.12)_11%,rgba(255,214,157,0)_34%)]" />

          <div className="relative z-10 ml-auto flex h-full max-w-[29rem] flex-col justify-end px-6 py-6 text-right sm:px-8 sm:py-8 lg:max-w-[33rem] lg:px-10 lg:py-9">
            <div className="flex items-center justify-end gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#d9bc72]">
              Pollination truth
              <span className="h-px w-10 bg-[linear-gradient(90deg,rgba(217,188,114,0.95),rgba(217,188,114,0.08))]" />
            </div>

            <blockquote className="font-display mt-4 text-[clamp(1.55rem,2.5vw,2.75rem)] leading-[1.03] tracking-[-0.045em] text-white">
              <span className="block">“If the honey bee disappeared</span>
              <span className="block">from the surface of the globe,</span>
              <span className="block">man would have only four</span>
              <span className="block text-white/92">years of life left.”</span>
            </blockquote>

            <p className="mt-4 ml-auto max-w-[24rem] text-[0.95rem] leading-7 text-white/74">
              No more bees means no pollination, no resilient cropping systems, and no stable chain between farming, food, and rural life.
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <span className="inline-flex items-center rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#f2d38e] backdrop-blur-sm">
                Pollination
              </span>
              <span className="inline-flex items-center rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#f2d38e] backdrop-blur-sm">
                Food systems
              </span>
              <span className="inline-flex items-center rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#f2d38e] backdrop-blur-sm">
                Rural livelihoods
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative min-h-[20rem] overflow-hidden rounded-[1.7rem] border border-white/10 bg-black shadow-[0_26px_68px_rgba(0,0,0,0.34)] sm:min-h-[22rem] lg:min-h-[24rem]">
          <div className="absolute inset-0">
            <Image
              src="/quote-honey-bee-glow.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 72rem, 100vw"
              className="object-contain object-[78%_50%] opacity-100"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,214,157,0.12)_0%,rgba(255,214,157,0.03)_22%,rgba(0,0,0,0)_46%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.64)_34%,rgba(0,0,0,0.18)_62%,rgba(0,0,0,0.14)_100%)]" />

          <div className="relative z-10 flex min-h-[20rem] items-center p-5 sm:min-h-[22rem] sm:p-7 lg:min-h-[24rem] lg:px-10 lg:py-8">
            <div className="w-full max-w-[34rem] rounded-[1.45rem] border border-white/14 bg-[rgba(0,0,0,0.36)] p-5 text-left shadow-[0_20px_44px_rgba(0,0,0,0.24)] backdrop-blur-[6px] sm:p-6 lg:p-7">
              <blockquote className="font-display text-[clamp(1.22rem,1.8vw,1.82rem)] leading-[1.12] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.76)]">
                <span className="block">“If the honey bee disappeared from the surface of the globe, man would have only four years of life left.</span>
                <span className="block">No more bees, no more pollination, no more plants, no more animals, no more man.”</span>
              </blockquote>
              <div className="mt-5 h-px w-full max-w-[30rem] bg-[linear-gradient(90deg,rgba(255,255,255,0.56),rgba(255,255,255,0.12),transparent)]" />
              <p className="mt-3 max-w-[30rem] text-sm leading-6 text-white/72">
                A quiet reminder that pollination, farming, and rural livelihood are connected systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="section-frame overflow-hidden rounded-[2.1rem] px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="hidden items-start justify-center gap-4 lg:flex xl:gap-5">
              {fieldGalleryTiles.slice(0, 4).map(({ image, className }) => (
                <div
                  key={image.label}
                  className={`group relative w-full max-w-[9.4rem] overflow-hidden rounded-[1.55rem] border border-white/45 bg-white/40 shadow-[0_24px_44px_rgba(77,61,25,0.12)] ${className}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={240}
                    height={320}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              ))}

              <div className="w-[1.15rem]" />

              {fieldGalleryTiles.slice(4).map(({ image, className }) => (
                <div
                  key={image.label}
                  className={`group relative w-full max-w-[9.4rem] overflow-hidden rounded-[1.55rem] border border-white/45 bg-white/40 shadow-[0_24px_44px_rgba(77,61,25,0.12)] ${className}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={240}
                    height={320}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 lg:hidden">
              {fieldGalleryTiles.map(({ image, className }) => (
                <div
                  key={image.label}
                  className={`group relative overflow-hidden rounded-[1.35rem] border border-white/40 bg-white/40 shadow-[0_18px_34px_rgba(77,61,25,0.1)] ${className.replace(/mt-\d+/g, "mt-0")}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={320}
                    height={380}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>

            <div className="mx-auto mt-8 max-w-3xl text-center lg:mt-10">
              <span className="inline-flex items-center rounded-full border border-[rgba(41,56,49,0.14)] bg-[rgba(255,255,255,0.76)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#2f6a5e] shadow-[0_10px_24px_rgba(96,73,24,0.08)]">
                {copy.home.fieldEyebrow}
              </span>
              <h2 className="font-display mt-5 text-[clamp(2.2rem,4.6vw,4.15rem)] leading-[0.94] tracking-[-0.05em] text-[#173f33]">
                {copy.home.fieldTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[0.98rem] leading-7 text-[#5f7168]">
                Practical sessions, live demonstrations, and learner moments arranged as a clearer public window into the center&apos;s real field work.
              </p>
              <Link
                href="/gallery"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(41,56,49,0.12)] bg-[rgba(255,255,255,0.82)] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#1f352b] shadow-[0_16px_34px_rgba(96,73,24,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(96,73,24,0.12)]"
              >
                {copy.home.galleryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
