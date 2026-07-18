import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { TrainingPreviewSwitch, type TrainingPreviewCourse } from "@/components/training-preview-switch";
import AboutUsSection from "@/components/ui/about-us-section";
import { getPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { getSiteCopy } from "@/lib/site-copy";
import { trainingProgramCatalogBySlug } from "@/lib/training-programs";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const language = await getRequestLanguage();
  const copy = getSiteCopy(language);
  const programs = await getPrograms();
  const courses: TrainingPreviewCourse[] = programs.slice(0, 4).map((program) => {
    const translatedProgram = getTranslatedProgramContent(program, language);
    const presentation = trainingProgramCatalogBySlug[program.slug];

    return {
      id: program.id,
      slug: program.slug,
      tabLabel: translatedProgram.title,
      title: translatedProgram.title,
      summary: translatedProgram.summary,
      description: translatedProgram.description,
      duration: translatedProgram.duration,
      level: translatedProgram.level,
      fee: translatedProgram.fee ?? t(language, "programs.detail.fallbackFee"),
      capacity: `${translatedProgram.capacity} ${t(language, "programs.seats")}`,
      batchDate: translatedProgram.batchStartsAt ? formatDate(translatedProgram.batchStartsAt) : "Contact the center for start date",
      focusLabel: presentation?.focusLabel ?? translatedProgram.level,
      focusText: presentation?.focusText ?? translatedProgram.summary,
      targetAudience: presentation?.targetAudience ?? "Eligible applicants interested in beekeeping training.",
      imageSrc: presentation?.imageSrc ?? "/training-field-visuals/image2.jpeg",
      imageAlt: presentation?.imageAlt ?? translatedProgram.title,
      outcomes: presentation?.outcomes ?? [],
      skills: presentation?.skills ?? [],
      instructorName: presentation?.instructorName ?? "Api Culture Training Faculty",
      rating: presentation?.rating ?? "4.8",
      ratingLabel: presentation?.ratingLabel ?? "Program reviews",
      experienceLabel: presentation?.experienceLabel ?? translatedProgram.level,
      tools: presentation?.tools ?? [],
      certificate: presentation?.certificate ?? "Physical certificate issued after completion",
      taughtIn: presentation?.taughtIn ?? "English and Telugu",
      testimonial: presentation?.testimonial ?? {
        quote: "Field-led practice made the training practical and clear.",
        name: "Program trainee",
      },
    };
  });

  const stats = [
    { value: "25+", label: copy.home.stats[0] },
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
                  href="/#training-section"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f2b544,#ff8a2a)] px-6 py-3 text-sm font-black text-[#071421] shadow-[0_18px_38px_rgba(179,107,0,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  {copy.home.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/#about-section"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/70 bg-white/18 px-6 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(34,45,38,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white"
                >
                  {copy.home.secondaryCta}
                </Link>
              </div>

              <span className="mx-auto mt-5 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/30 bg-[rgba(7,20,33,0.48)] px-5 py-2.5 text-sm font-black text-white shadow-[0_16px_38px_rgba(7,20,33,0.24)] backdrop-blur-md">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {copy.home.locationChip}
              </span>
            </div>

          </div>

          <div className="relative z-20 -mt-7 px-3 sm:-mt-8 sm:px-5 lg:px-7">
            <div
              className="grid overflow-hidden rounded-[1.35rem] border border-white/45 shadow-[0_26px_68px_rgba(2,8,12,0.28),0_0_0_1px_rgba(255,255,255,0.24),inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(255,255,255,0.2)] backdrop-blur-[30px] backdrop-saturate-150 sm:grid-cols-2 lg:grid-cols-4"
              style={{
                backgroundColor: "rgba(245, 248, 246, 0.68)",
                backgroundImage:
                  "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.24) 36%, rgba(230,235,232,0.34) 68%, rgba(255,255,255,0.58)), radial-gradient(ellipse at 50% 110%, rgba(255,255,255,0.72), rgba(255,255,255,0) 58%), radial-gradient(ellipse at 12% 0%, rgba(255,255,255,0.45), rgba(255,255,255,0) 42%)",
                backdropFilter: "blur(30px) saturate(150%)",
                boxShadow:
                  "0 26px 68px rgba(2,8,12,0.28), inset 0 1px 0 rgba(255,255,255,0.72), inset 0 18px 36px rgba(255,255,255,0.18), inset 0 -26px 46px rgba(4,12,16,0.14)",
                WebkitBackdropFilter: "blur(30px) saturate(150%)",
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="border-b px-5 py-4 last:border-b-0 sm:odd:border-r sm:even:border-r-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                  style={{
                    borderColor: "rgba(255,255,255,0.32)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.05) 58%, rgba(255,255,255,0.14))",
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
      </section>

      <section id="training-section" className="scroll-mt-28 pt-4">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b36b00]">Training</p>
          <h2 className="font-display mt-4 max-w-4xl text-[clamp(2.5rem,5vw,5.2rem)] leading-[0.92] text-[#173f33]">
            Training programs
          </h2>
        </div>
        <TrainingPreviewSwitch courses={courses} language={language} />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mb-7 h-px w-full bg-[linear-gradient(90deg,rgba(179,107,0,0),rgba(179,107,0,0.35),rgba(23,63,51,0.12),rgba(179,107,0,0))]" />
        <figure className="relative mx-auto grid max-w-[46rem] items-center gap-5 overflow-hidden rounded-[1.25rem] border border-[#e2dccd] bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(244,241,233,0.74))] p-4 shadow-[0_20px_54px_rgba(23,63,51,0.07)] sm:p-5 md:max-w-[52rem] md:grid-cols-[minmax(0,1fr)_minmax(10rem,0.34fr)] lg:max-w-[58rem] lg:gap-7 lg:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(179,107,0,0),rgba(179,107,0,0.38),rgba(179,107,0,0))]" aria-hidden="true" />
          <blockquote
            className="relative z-10 text-left font-display text-[clamp(1.22rem,5vw,2rem)] font-semibold leading-[1.08] text-[#073f37] sm:text-[clamp(1.55rem,4vw,2.55rem)] md:text-[clamp(1.65rem,3.4vw,2.65rem)] lg:text-[clamp(1.9rem,3vw,3rem)]"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.96), 0 18px 34px rgba(7,20,33,0.08)" }}
          >
            <span className="mr-2 align-top text-[0.58em] leading-none text-[#b36b00]">&ldquo;</span>
            If the honey bee disappeared from the surface of the globe the man would only have four years of life left. No more bees, No more pollination, No more plants, No more animals, No more man.
            <span className="ml-2 text-[#b36b00]">&rdquo;</span>
            <span className="mt-4 block font-sans text-[0.62rem] font-black uppercase leading-none tracking-[0.3em] text-[#b36b00] sm:text-[0.68rem]">
              Albert Einstein
            </span>
          </blockquote>

          <div className="relative z-10 mx-auto w-[min(12rem,54vw)] self-center md:w-full md:max-w-[13rem] lg:max-w-[15rem]" style={{ aspectRatio: "1 / 1.08" }}>
            <div className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,210,92,0.28),rgba(255,210,92,0)_66%)] blur-2xl" aria-hidden="true" />
            <Image
              src="/hero-section-center-art.png"
              alt="Apiculture visual accent"
              fill
              sizes="(min-width: 1024px) 15rem, (min-width: 768px) 13rem, 54vw"
              className="object-contain drop-shadow-[0_20px_38px_rgba(7,20,33,0.14)]"
            />
          </div>
        </figure>
        <div className="mt-7 h-px w-full bg-[linear-gradient(90deg,rgba(179,107,0,0),rgba(23,63,51,0.12),rgba(179,107,0,0.35),rgba(179,107,0,0))]" />
      </section>

      <AboutUsSection language={language} />

      <section id="contact-section" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 h-px max-w-7xl bg-[linear-gradient(90deg,rgba(179,107,0,0),rgba(23,63,51,0.18),rgba(179,107,0,0))]" />
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#ece8de] bg-[#f4f3ee] p-6 shadow-[0_28px_80px_rgba(30,34,28,0.12)] lg:grid-cols-[0.92fr_1.08fr] lg:p-10">
          <div className="grid content-between gap-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ecebe6] px-3 py-2 text-sm font-semibold text-[#171a16]">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {t(language, "contact.eyebrow")}
              </span>
              <h2 className="mt-6 text-[clamp(3rem,6vw,5.4rem)] font-black leading-[0.86] tracking-[-0.06em] text-[#121512]">
                {t(language, "contact.title")}
              </h2>
            </div>

            <div className="grid gap-5 text-[#171a16]">
              <ContactLine icon={<MapPin className="h-5 w-5" aria-hidden="true" />} title="Center location">
                {institute.address}
              </ContactLine>
              <ContactLine icon={<Phone className="h-5 w-5" aria-hidden="true" />} title={t(language, "contact.phone")}>
                {institute.phone.join(" / ")}
              </ContactLine>
              <ContactLine icon={<Mail className="h-5 w-5" aria-hidden="true" />} title={t(language, "contact.email")}>
                {institute.email}
              </ContactLine>
            </div>
          </div>

          <div className="self-start">
            <ContactForm language={language} variant="contactPage" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactLine({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ecebe6] text-[#171a16]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-base font-black">{title}</span>
        <span className="mt-1 block break-words text-base leading-6 text-[#464942]">{children}</span>
      </span>
    </div>
  );
}
