import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
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
    cta: string;
    backgroundSrc: string;
  }> = [
    {
      label: copy.home.cards[0].title,
      title: copy.home.cards[0].title,
      text: copy.home.cards[0].text,
      href: "/products",
      cta: localCopy.openCard,
      backgroundSrc: "/card-backgrounds/honey-bee-hive.jpg",
    },
    {
      label: localCopy.technologies,
      title: localCopy.technologies,
      text: localCopy.technologiesText,
      href: "/technologies",
      cta: localCopy.openTechnologies,
      backgroundSrc: "/card-backgrounds/honey-bee-tech-image.jpg",
    },
    {
      label: copy.home.cards[2].title,
      title: copy.home.cards[2].title,
      text: copy.home.cards[2].text,
      href: "/equipment",
      cta: localCopy.openCard,
      backgroundSrc: "/card-backgrounds/equipment-support-tools.png",
    },
    {
      label: copy.home.cards[3].title,
      title: copy.home.cards[3].title,
      text: copy.home.cards[3].text,
      href: "/events",
      cta: localCopy.openCard,
      backgroundSrc: "/card-backgrounds/events-and-workshops.png",
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
              <p className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-[rgba(179,107,0,0.14)] bg-[rgba(255,255,255,0.76)] py-2 pl-2 pr-4 text-[11px] font-black uppercase leading-5 tracking-[0.11em] text-[#9a5b00] shadow-[0_10px_30px_rgba(119,89,36,0.12)]">
                <span className="relative flex h-8 w-[4.8rem] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(31,53,43,0.1)] bg-white px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(61,41,10,0.08)]">
                  <Image
                    src="/nirdpr-logo-badge.jpeg"
                    alt="NIRDPR"
                    fill
                    sizes="5rem"
                    className="object-contain p-1"
                  />
                </span>
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                National Institute of Rural Development and Panchayati Raj
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

              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <HeroStat value="30+" label={copy.home.stats[0]} />
                <HeroStat value="25000+" label={copy.home.stats[1]} />
                <HeroStat value="100%" label={copy.home.stats[2]} />
                <HeroStat value="NIRDPR" label={copy.home.stats[3]} />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#2f473d]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(242,181,68,0.34)] bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(255,245,219,0.78))] px-5 py-3 font-black uppercase tracking-[0.12em] text-[#1f352b] shadow-[0_14px_34px_rgba(119,89,36,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
              <MapPin className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
              {copy.home.locationChip}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, title, text, href, cta, backgroundSrc }) => (
            <Link
              key={title}
              href={href}
              className="group relative overflow-hidden rounded-[2.2rem] border border-white/90 bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf7_100%)] p-3 shadow-[0_24px_60px_rgba(88,71,33,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_72px_rgba(88,71,33,0.18),inset_0_1px_0_rgba(255,255,255,0.98)]"
            >
              <div className="relative overflow-hidden rounded-[1.9rem] border border-white/80 shadow-[0_18px_38px_rgba(25,33,29,0.18)]">
                <div className="relative aspect-[1.28/1]">
                  <Image
                    src={backgroundSrc}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 18rem, (min-width: 768px) 45vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,20,0.06)_0%,rgba(7,16,20,0.18)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(4,10,12,0)_0%,rgba(4,10,12,0.58)_100%)]" />
                </div>
              </div>

              <div className="px-4 pb-4 pt-5 sm:px-5 sm:pb-5">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#a7a49d]">{label}</p>
                <h2 className="font-display mt-4 text-[2.15rem] leading-[0.94] tracking-[-0.045em] text-[#173f33]">
                  {title}
                </h2>
                <p className="mt-4 text-[1.02rem] leading-8 text-[#66776f]">{text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#f2b544]">
                  {cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.35rem] border border-white/80 bg-[linear-gradient(180deg,#fffdfa_0%,#f4ecdf_100%)] p-4 shadow-[0_30px_90px_rgba(96,73,24,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,251,244,0.9))] px-6 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_18px_42px_rgba(96,73,24,0.08)] sm:px-8 sm:py-9">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2f6a5e]">{copy.home.whyEyebrow}</p>
              <h2 className="font-display mt-4 max-w-sm text-[clamp(2.4rem,4vw,4.3rem)] leading-[0.92] tracking-[-0.05em] text-[#173f33]">
                {copy.home.whyTitle}
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-[#5c6d63]">
                {copy.home.whyBody}
              </p>

              <div className="mt-7 space-y-3">
                <div className="rounded-[1.35rem] border border-[rgba(47,106,94,0.1)] bg-[#f7f3ea] px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#2f6a5e]">{copy.home.values[0].title}</p>
                  <p className="mt-2 text-sm leading-7 text-[#66776f]">{copy.home.values[0].body}</p>
                </div>
                <div className="rounded-[1.35rem] border border-[rgba(47,106,94,0.1)] bg-[#f7f3ea] px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#2f6a5e]">{copy.home.values[1].title}</p>
                  <p className="mt-2 text-sm leading-7 text-[#66776f]">{copy.home.values[1].body}</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_26px_60px_rgba(17,41,34,0.18)] sm:min-h-[34rem]">
              <Image
                src="/field-beekeeping.jpg"
                alt="Field beekeeping landscape and training path"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,19,16,0.1)_0%,rgba(8,19,16,0.3)_100%)]" />
              <div className="absolute inset-y-[10%] left-[21%] w-px bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.68),rgba(255,255,255,0.1))]" />
              <div className="absolute inset-y-[22%] right-[26%] w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.62),rgba(255,255,255,0))]" />

              <div className="absolute left-[16%] top-[16%] h-4 w-4 rounded-full border-4 border-white/80 bg-[#f7f3ea] shadow-[0_8px_24px_rgba(0,0,0,0.18)]" />
              <div className="absolute right-[21%] top-[34%] h-4 w-4 rounded-full border-4 border-white/80 bg-[#f7f3ea] shadow-[0_8px_24px_rgba(0,0,0,0.18)]" />
              <div className="absolute left-[16%] bottom-[16%] h-4 w-4 rounded-full border-4 border-white/80 bg-[#f7f3ea] shadow-[0_8px_24px_rgba(0,0,0,0.18)]" />

              <div className="absolute left-[13%] top-[23%] max-w-[15rem] rounded-[1.2rem] bg-[rgba(244,245,237,0.9)] px-4 py-3 text-[#173f33] shadow-[0_18px_34px_rgba(0,0,0,0.16)] backdrop-blur-md">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d7f76]">Crop impact</p>
                <p className="mt-1 text-lg font-semibold leading-tight">Stronger pollination means better flowering and field stability.</p>
              </div>

              <div className="absolute right-[9%] top-[24%] max-w-[13rem] rounded-[1.2rem] bg-[rgba(244,245,237,0.9)] px-4 py-3 text-[#173f33] shadow-[0_18px_34px_rgba(0,0,0,0.16)] backdrop-blur-md">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d7f76]">Training trust</p>
                <p className="mt-1 text-base leading-6">Visible field practice makes the center feel real, active, and dependable.</p>
              </div>

              <div className="absolute bottom-[11%] left-[48%] -translate-x-1/2 rounded-full bg-[rgba(255,250,241,0.96)] px-5 py-3 text-center text-[#173f33] shadow-[0_18px_34px_rgba(0,0,0,0.18)]">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6d7f76]">Rural income</p>
                <p className="mt-1 text-xl font-semibold leading-none">Beekeeping skills turn into earning pathways.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative min-h-[20rem] overflow-hidden rounded-[1.7rem] border border-white/10 bg-black shadow-[0_26px_68px_rgba(0,0,0,0.34)] sm:min-h-[22rem] lg:min-h-[24rem]">
          <div className="absolute inset-0">
            <Image
              src="/quote-honey-bee-glow.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 72rem, 100vw"
              className="object-contain object-center opacity-100"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,214,157,0.12)_0%,rgba(255,214,157,0.03)_22%,rgba(0,0,0,0)_46%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.42)_32%,rgba(0,0,0,0.16)_58%,rgba(0,0,0,0.28)_100%)]" />

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
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-[rgba(31,53,43,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,252,247,0.72))] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_18px_40px_rgba(98,73,28,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_24px_52px_rgba(98,73,28,0.14)]">
      <div className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(242,181,68,0.7),transparent)]" />
      <p className="font-display text-[clamp(2.35rem,4vw,3.35rem)] leading-none tracking-[-0.04em] text-[#1f352b]">{value}</p>
      <p className="mt-3 text-sm font-medium tracking-[0.02em] text-[#54655d]">{label}</p>
    </div>
  );
}
