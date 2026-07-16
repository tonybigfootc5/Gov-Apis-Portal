import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { getRequestLanguage } from "@/lib/request-language";
import { getSiteCopy } from "@/lib/site-copy";
import { trainingProgramGallery } from "@/lib/training-programs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const language = await getRequestLanguage();
  const copy = getSiteCopy(language);

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
      label: "Training",
      title: copy.home.cards[1].title,
      text: copy.home.cards[1].text,
      href: "/programs",
      backgroundSrc: "/training-field-visuals/image2.jpeg",
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

  const stats = [
    { value: "20+", label: copy.home.stats[0] },
    { value: "25K+", label: copy.home.stats[1] },
    { value: "100+", label: "Learners supported" },
    { value: "NIRDPR", label: "Training center" },
  ] as const;

  const featureTiles = [
    {
      title: "Field practice",
      text: "Hands-on sessions for colony care, honey processing, and field-ready beekeeping systems.",
      image: trainingProgramGallery[1],
    },
    {
      title: "Technology transfer",
      text: "Practical exposure to hive products, equipment, queen rearing, and processing methods.",
      image: trainingProgramGallery[3],
    },
    {
      title: "Rural livelihood",
      text: "Clear training pathways for farmers, trainees, women groups, and future entrepreneurs.",
      image: trainingProgramGallery[5],
    },
  ] as const;

  return (
    <main className="bg-[#f8faf7] text-[#14241f]">
      <section className="px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#e5e1d8] bg-[#fbfaf6] shadow-[0_24px_70px_rgba(34,45,38,0.12)]">
          <div className="relative mx-0 overflow-hidden bg-[#0d1d18]" style={{ minHeight: "48rem" }}>
            <HeroBackgroundVideo />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,247,0.82)_0%,rgba(248,250,247,0.7)_28%,rgba(9,20,18,0.36)_58%,rgba(6,14,11,0.78)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,250,247,0.2)_0%,rgba(248,250,247,0.5)_38%,rgba(248,250,247,0.16)_100%)]" />

            <div className="relative z-10 px-5 pb-8 text-center sm:px-8 lg:px-12" style={{ paddingTop: "9.5rem" }}>
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#dce2d6] bg-white/86 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#1f6a4c] shadow-[0_12px_28px_rgba(7,20,33,0.08)] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#2f9b5f]" />
                {copy.home.portalChip}
              </div>

              <h1
                className="font-display mx-auto mt-7 max-w-4xl text-[#111a17]"
                style={{ fontSize: "clamp(2.7rem, 6vw, 5.6rem)", lineHeight: 0.96, letterSpacing: "0" }}
              >
                {copy.home.heroTitle.filter(Boolean).join(" ")}
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#40564d]">
                {copy.home.heroDescription}
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/programs"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#071421] px-6 py-3 text-sm font-black text-white shadow-[0_18px_38px_rgba(7,20,33,0.24)] transition hover:-translate-y-0.5 hover:bg-[#132236]"
                >
                  {copy.home.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d5d7ce] bg-white/84 px-6 py-3 text-sm font-black text-[#173f33] shadow-[0_12px_28px_rgba(34,45,38,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#bfc8b7]"
                >
                  {copy.home.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 text-white sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-9">
              <div>
                <p className="max-w-md text-[clamp(1.8rem,3.2vw,3.1rem)] font-black leading-[0.96]">
                  The journey to stronger beekeeping systems.
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/78">
                  Practical learning, field support, and technology exposure from Rajendranagar, Hyderabad.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/28 bg-[rgba(7,20,33,0.42)] px-4 py-2 text-xs font-bold text-white shadow-[0_14px_34px_rgba(7,20,33,0.22)] backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {copy.home.locationChip}
              </span>
            </div>
          </div>

          <div className="grid border-t border-[#ebe7dd] bg-white md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.value} className="border-b border-[#ebe7dd] px-7 py-6 md:border-b-0 md:border-r last:md:border-r-0">
                <p className="text-[clamp(1.75rem,3vw,2.55rem)] font-black leading-none text-[#101a16]">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-[#6b766e]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-18 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="text-left">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#b36b00]">2026</p>
          <h2 className="font-display mt-7 max-w-xl text-[clamp(2.1rem,4vw,4.4rem)] leading-[0.98] text-[#173f33]">
            Despite advances in agri-tech, field learning still decides confidence.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {featureTiles.map((tile) => (
            <article key={tile.title} className="overflow-hidden rounded-[1.4rem] border border-[#e3ded2] bg-white shadow-[0_18px_42px_rgba(34,45,38,0.08)]">
              <div className="relative" style={{ aspectRatio: "4 / 3" }}>
                <Image src={tile.image.src} alt={tile.image.alt} fill sizes="(min-width: 1024px) 24vw, 90vw" className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black text-[#173f33]">{tile.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#66776f]">{tile.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-18 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <Link
              key={card.title}
              href={card.href}
              className="group overflow-hidden rounded-[1.55rem] border border-[#e3ded2] bg-white shadow-[0_18px_42px_rgba(34,45,38,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(34,45,38,0.12)]"
            >
              <div className="relative" style={{ aspectRatio: "1.18 / 0.84" }}>
                <Image src={card.backgroundSrc} alt="" fill sizes="(min-width: 1280px) 18rem, (min-width: 768px) 45vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                <div className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-black text-[#173f33]">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#b36b00]">{card.label}</p>
                <h3 className="font-display mt-4 text-3xl leading-none text-[#173f33]">{card.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#66776f]">{card.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[1.8rem] border border-[#e3ded2] bg-white shadow-[0_20px_54px_rgba(34,45,38,0.1)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[21rem]">
            <Image
              src="/training-field-visuals/image7.jpeg"
              alt="Training field visual"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,33,0.42),rgba(7,20,33,0.04))]" />
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/28 bg-white/18 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              NIRDPR Training Center
            </div>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-9">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#b36b00]">{copy.home.whyEyebrow}</p>
            <h2 className="font-display mt-5 text-[clamp(2rem,3.6vw,3.5rem)] leading-[0.98] text-[#173f33]">
              {copy.home.whyTitle}
            </h2>
            <p className="mt-5 text-base leading-7 text-[#66776f]">{copy.home.whyBody}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {copy.home.values.map((item) => (
                <span key={item.title} className="rounded-full border border-[#d9dfd2] bg-[#f8faf7] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#315849]">
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
