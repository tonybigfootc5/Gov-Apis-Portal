import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { getRequestLanguage } from "@/lib/request-language";
import { getSiteCopy } from "@/lib/site-copy";

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

  return (
    <main className="bg-[#f8faf7] text-[#14241f]">
      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl pt-[4.65rem]">
          <div className="relative mx-0 overflow-hidden rounded-[1.85rem] bg-[#0d1d18]" style={{ minHeight: "50rem" }}>
            <HeroBackgroundVideo />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,18,0.18)_0%,rgba(7,20,18,0.06)_28%,rgba(9,20,18,0.34)_58%,rgba(6,14,11,0.78)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,18,0.24)_0%,rgba(7,20,18,0.1)_38%,rgba(7,20,18,0.22)_100%)]" />

            <div className="relative z-10 px-5 pb-8 text-center sm:px-8 lg:px-12" style={{ paddingTop: "8.5rem" }}>
              <h1
                className="font-display mx-auto max-w-4xl text-white"
                style={{ fontSize: "clamp(2.7rem, 6vw, 5.6rem)", lineHeight: 0.96, letterSpacing: "0" }}
              >
                {copy.home.heroTitle.filter(Boolean).join(" ")}
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white">
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
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/70 bg-white/18 px-6 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(34,45,38,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white"
                >
                  {copy.home.secondaryCta}
                </Link>
              </div>

              <span className="mx-auto mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/28 bg-[rgba(7,20,33,0.42)] px-4 py-2 text-xs font-bold text-white shadow-[0_14px_34px_rgba(7,20,33,0.22)] backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {copy.home.locationChip}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 lg:p-7">
              <div
                className="grid overflow-hidden rounded-[1.35rem] border border-white/45 shadow-[0_26px_68px_rgba(2,8,12,0.36),0_0_0_1px_rgba(255,255,255,0.24),inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(255,255,255,0.2)] backdrop-blur-[30px] backdrop-saturate-150 sm:grid-cols-2 lg:grid-cols-4"
                style={{
                  backgroundColor: "rgba(245, 248, 246, 0.42)",
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.18) 36%, rgba(230,235,232,0.24) 68%, rgba(255,255,255,0.48)), radial-gradient(ellipse at 50% 110%, rgba(255,255,255,0.72), rgba(255,255,255,0) 58%), radial-gradient(ellipse at 12% 0%, rgba(255,255,255,0.45), rgba(255,255,255,0) 42%)",
                  backdropFilter: "blur(30px) saturate(150%)",
                  boxShadow:
                    "0 26px 68px rgba(2,8,12,0.36), inset 0 1px 0 rgba(255,255,255,0.72), inset 0 18px 36px rgba(255,255,255,0.18), inset 0 -26px 46px rgba(4,12,16,0.14)",
                  WebkitBackdropFilter: "blur(30px) saturate(150%)",
                }}
              >
                {stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="border-b px-5 py-3 last:border-b-0 sm:py-4 sm:odd:border-r sm:even:border-r-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                    style={{
                      borderColor: "rgba(255,255,255,0.28)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.03) 58%, rgba(255,255,255,0.12))",
                      boxShadow: "inset 1px 0 0 rgba(255,255,255,0.22)",
                    }}
                  >
                    <p
                      className="text-[clamp(1.55rem,2.6vw,2.25rem)] font-black leading-none text-[#071421]"
                      style={{ textShadow: "0 1px 0 rgba(255,255,255,0.72), 0 8px 22px rgba(255,255,255,0.34)" }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="mt-2 text-sm font-bold text-[#315849]"
                      style={{ textShadow: "0 1px 0 rgba(255,255,255,0.68), 0 7px 18px rgba(255,255,255,0.28)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8">
        <figure className="relative grid min-h-[29rem] items-center overflow-visible py-10 lg:grid-cols-[1fr_0.82fr_1fr] lg:py-14">
          <div className="pointer-events-none absolute inset-x-10 top-1/2 hidden h-px bg-[linear-gradient(90deg,rgba(179,107,0,0),rgba(179,107,0,0.34),rgba(179,107,0,0))] lg:block" aria-hidden="true" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d6c27d]/35 lg:block" aria-hidden="true" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#173f33]/10 lg:block" aria-hidden="true" />

          <blockquote
            className="relative z-10 mx-auto max-w-[30rem] text-center font-display text-[clamp(2.25rem,4.8vw,5.15rem)] font-semibold leading-[0.9] text-[#073f37] lg:mx-0 lg:max-w-[35rem] lg:text-right"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.96), 0 18px 34px rgba(7,20,33,0.1)" }}
          >
            <span className="mr-2 align-top text-[0.58em] leading-none text-[#b36b00]">&ldquo;</span>If the honey bee disappeared from the surface of the globe the man would only have four years of life left.
          </blockquote>

          <div className="relative z-20 mx-auto -my-4 w-[min(27rem,78vw)] lg:-mx-8 lg:-my-10 lg:w-[34rem]" style={{ aspectRatio: "2 / 3" }}>
            <div className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,210,92,0.26),rgba(255,210,92,0)_66%)] blur-2xl" aria-hidden="true" />
            <Image
              src="/hero-section-center-art.png"
              alt="Apiculture visual accent"
              fill
              sizes="(min-width: 1024px) 34rem, 78vw"
              className="object-contain drop-shadow-[0_34px_62px_rgba(7,20,33,0.18)]"
              priority
            />
          </div>

          <figcaption
            className="relative z-10 mx-auto max-w-[30rem] text-center font-display text-[clamp(2.25rem,4.8vw,5.15rem)] font-semibold leading-[0.9] text-[#073f37] lg:mx-0 lg:max-w-[35rem] lg:text-left"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.96), 0 18px 34px rgba(7,20,33,0.1)" }}
          >
            No more bees, No more pollination, No more plants, No more animals, No more man.<span className="ml-2 text-[#b36b00]">&rdquo;</span>
            <span className="mt-6 block font-sans text-[0.78rem] font-black uppercase leading-none tracking-[0.42em] text-[#b36b00]">
              Albert Einstein
            </span>
          </figcaption>
        </figure>
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

    </main>
  );
}
