import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ChevronDown, Link2, Mail, MapPin, MessageCircle, Phone, Timer } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { TrainingPreviewSwitch, type TrainingPreviewCourse } from "@/components/training-preview-switch";
import AboutUsSection from "@/components/ui/about-us-section";
import { contactFaqCategories } from "@/lib/contact-faq";
import { getPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getProgramEnrollmentState } from "@/lib/program-enrollment";
import { getRequestLanguage } from "@/lib/request-language";
import { getSiteCopy } from "@/lib/site-copy";
import { trainingProgramCatalogBySlug } from "@/lib/training-programs";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const language = await getRequestLanguage();
  const copy = getSiteCopy(language);
  const programs = await getPrograms();
  const courses: TrainingPreviewCourse[] = programs.slice(0, 3).map((program) => {
    const translatedProgram = getTranslatedProgramContent(program, language);
    const presentation = trainingProgramCatalogBySlug[program.slug];
    const enrollmentState = getProgramEnrollmentState(program);

    return {
      id: program.id,
      slug: program.slug,
      serviceTitle: presentation?.title ?? program.title,
      tabLabel: translatedProgram.title,
      title: translatedProgram.title,
      summary: translatedProgram.summary,
      description: translatedProgram.description,
      duration: translatedProgram.duration,
      level: translatedProgram.level,
      fee: translatedProgram.fee ?? t(language, "programs.detail.fallbackFee"),
      capacity: `${translatedProgram.capacity} ${t(language, "programs.seats")}`,
      batchDate: translatedProgram.batchStartsAt ? formatDate(translatedProgram.batchStartsAt) : "Coming soon",
      focusLabel: presentation?.focusLabel ?? translatedProgram.level,
      focusText: presentation?.focusText ?? translatedProgram.summary,
      targetAudience: presentation?.targetAudience ?? "Eligible applicants interested in beekeeping training.",
      imageSrc: presentation?.imageSrc ?? "/training-field-visuals/image2.jpeg",
      imageAlt: presentation?.imageAlt ?? translatedProgram.title,
      outcomes: presentation?.outcomes ?? [],
      skills: presentation?.skills ?? [],
      rating: presentation?.rating ?? "4.8",
      ratingLabel: presentation?.ratingLabel ?? "Program reviews",
      experienceLabel: presentation?.experienceLabel ?? translatedProgram.level,
      tools: presentation?.tools ?? [],
      certificate: presentation?.certificate ?? "Physical certificate issued after completion",
      taughtIn: presentation?.taughtIn ?? "English and Telugu",
      enrollmentOpen: enrollmentState.canEnroll,
      enrollmentStatusLabel: enrollmentState.statusLabel,
      enrollmentMessage: enrollmentState.message,
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
    { value: "KGMV", label: copy.home.stats[4] ?? "Rajendranagar office" },
  ] as const;

  return (
    <main className="bg-[#f8faf7] text-[#14241f]">
      <section className="px-3 pt-4 sm:px-5 lg:px-8">
        <div className="mx-auto max-w-[94rem] pt-[4.65rem]">
          <div className="relative mx-0 overflow-hidden rounded-[1.85rem] bg-[#0d1d18]" style={{ minHeight: "51rem" }}>
            <HeroBackgroundVideo />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,18,0.18)_0%,rgba(7,20,18,0.06)_28%,rgba(9,20,18,0.34)_58%,rgba(6,14,11,0.78)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,18,0.24)_0%,rgba(7,20,18,0.1)_38%,rgba(7,20,18,0.22)_100%)]" />

            <div className="relative z-10 px-5 pb-36 text-center sm:px-8 lg:px-12" style={{ paddingTop: "8.5rem" }}>
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

            <svg
              className="pointer-events-none absolute inset-x-0 -bottom-px z-20 h-[8.1rem] w-full drop-shadow-[0_-18px_48px_rgba(7,20,18,0.13)] sm:h-[6.7rem] lg:h-[5.8rem]"
              viewBox="0 0 1000 108"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 108V34C0 12 18 0 52 0H404C442 0 468 28 500 28C532 28 558 0 596 0H948C982 0 1000 12 1000 34V108H0Z"
                fill="#f8faf7"
              />
            </svg>
            <span className="pointer-events-none absolute bottom-0 left-0 z-[21] h-10 w-14 bg-[#f8faf7]" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-0 right-0 z-[21] h-10 w-14 bg-[#f8faf7]" aria-hidden="true" />

            <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-4 pt-7 sm:px-8 sm:pb-4 sm:pt-6 lg:px-12 lg:pb-3 lg:pt-5">
              <div className="relative grid grid-cols-2 gap-y-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
                {stats.map((stat, index) => (
                  <StatItem key={stat.value} stat={stat} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="training-section" className="scroll-mt-28">
        <TrainingPreviewSwitch courses={courses} language={language} />
      </section>

      <section className="mx-auto max-w-[94rem] px-3 py-10 sm:px-5 sm:py-12 lg:px-8 lg:py-14">
        <div className="mb-7 h-px w-full bg-[linear-gradient(90deg,rgba(179,107,0,0),rgba(179,107,0,0.35),rgba(23,63,51,0.12),rgba(179,107,0,0))]" />
        <figure className="relative mx-auto overflow-hidden rounded-[1.7rem] border border-[#16281f] bg-[#06130f] shadow-[0_34px_110px_rgba(10,25,18,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <Image
            src="/einstein-quote-premium.png"
            alt="Premium Einstein honey bee quote artwork explaining the importance of bees, pollination, plants, animals, and people."
            width={1708}
            height={921}
            sizes="(min-width: 1800px) 1792px, 100vw"
            className="block h-auto w-full"
            priority
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,225,145,0),rgba(255,225,145,0.78),rgba(255,225,145,0))]" aria-hidden="true" />
        </figure>
        <div className="mt-7 h-px w-full bg-[linear-gradient(90deg,rgba(179,107,0,0),rgba(23,63,51,0.12),rgba(179,107,0,0.35),rgba(179,107,0,0))]" />
      </section>

      <AboutUsSection language={language} />

      <section id="contact-section" className="scroll-mt-28 px-3 py-14 sm:px-5 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto mb-10 h-px max-w-[94rem] bg-[linear-gradient(90deg,rgba(179,107,0,0),rgba(23,63,51,0.18),rgba(179,107,0,0))]" />
        <div className="mx-auto mb-7 max-w-[94rem]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ecebe6] px-3 py-2 text-sm font-semibold text-[#171a16]">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {t(language, "contact.eyebrow")}
          </span>
          <h2 className="mt-4 max-w-4xl text-[clamp(3rem,6vw,5.4rem)] font-black leading-[0.86] tracking-[-0.06em] text-[#121512]">
            {t(language, "contact.title")}
          </h2>
        </div>
        <div className="mx-auto grid max-w-[94rem] gap-8 rounded-[2rem] border border-[#ece8de] bg-[#f4f3ee] p-6 shadow-[0_28px_80px_rgba(30,34,28,0.12)] lg:grid-cols-[0.92fr_1.08fr] lg:p-10">
          <div className="grid content-center gap-5 text-[#171a16]">
            {institute.offices.map((office) => (
              <ContactLine key={office.label} icon={<MapPin className="h-5 w-5" aria-hidden="true" />} title={office.label}>
                <a href={office.mapsUrl} target="_blank" rel="noreferrer" className="underline decoration-[#c8a65c]/50 underline-offset-4 transition hover:text-[#121512]">
                  {office.address}
                </a>
              </ContactLine>
            ))}
            <ContactLine icon={<Timer className="h-5 w-5" aria-hidden="true" />} title="Office Working Hours">
              {institute.officeHours}
            </ContactLine>
            <ContactLine icon={<Phone className="h-5 w-5" aria-hidden="true" />} title={t(language, "contact.phone")}>
              {institute.phone.join(" / ")}
            </ContactLine>
            <ContactLine icon={<Mail className="h-5 w-5" aria-hidden="true" />} title={t(language, "contact.email")}>
              {institute.email}
            </ContactLine>
          </div>

          <div className="self-start">
            <ContactForm language={language} variant="contactPage" />
          </div>
        </div>

        <section className="mx-auto mt-10 max-w-[94rem]">
          <h2 className="mb-6 text-center text-[clamp(2.25rem,5vw,4.8rem)] font-black leading-[0.9] tracking-[-0.04em] text-[#121512]">
            Got Questions?
          </h2>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-b border-[#e4e1d8] pb-5">
            {contactFaqCategories.map((category, index) => (
              <a
                key={category.category}
                href={`#faq-${category.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className={cn(
                  "text-[11px] font-black uppercase tracking-[0.22em] transition hover:text-[#173f33]",
                  index === 0 ? "text-[#173f33]" : "text-[#a8ada5]",
                )}
              >
                {category.category} ({category.questions.length})
              </a>
            ))}
          </div>

          <div className="max-h-[42rem] overflow-y-auto pr-1">
            {contactFaqCategories.map((category, categoryIndex) => (
              <div
                key={category.category}
                id={`faq-${category.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="scroll-mt-32 pt-2 first:pt-0"
              >
                {categoryIndex > 0 ? (
                  <h3 className="mb-3 mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">
                    {category.category}
                  </h3>
                ) : null}
                <div className="grid gap-3">
                  {category.questions.map((item, questionIndex) => {
                    const isFirstQuestion = categoryIndex === 0 && questionIndex === 0;

                    return (
                      <details
                        key={item.question}
                        open={isFirstQuestion}
                        className="group rounded-[0.35rem] bg-[#f5f6f7] px-4 shadow-[0_8px_22px_rgba(20,28,22,0.035)] open:bg-[#f7f8f8]"
                      >
                        <summary className="flex min-h-[4.15rem] cursor-pointer list-none items-center gap-4 py-3 text-left [&::-webkit-details-marker]:hidden">
                          <Link2 className="h-4 w-4 shrink-0 text-[#aab1af]" aria-hidden="true" />
                          <span className="min-w-0 flex-1 text-sm font-black leading-5 text-[#5f6b70]">
                            {item.question}
                          </span>
                          <ChevronDown className="h-4 w-4 shrink-0 text-[#b5bbb9] transition group-open:rotate-180 group-open:text-[#4b91d1]" aria-hidden="true" />
                        </summary>
                        <p className="border-t border-[#e8ecec] pb-5 pl-8 pr-8 pt-1 text-sm font-semibold leading-6 text-[#6f7b80]">
                          {item.answer}
                        </p>
                      </details>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
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

function StatItem({ stat, index }: { stat: { value: string; label: string }; index: number }) {
  return (
    <div
      className={cn(
        "flex min-h-12 flex-col items-center justify-center border-[#dce4dd] px-3 pb-2 text-center lg:border-b-0 lg:px-7 lg:pb-0",
        index % 2 === 0 ? "border-r sm:border-r-0" : "",
        index < 4 ? "border-b sm:border-b-0" : "",
        index % 3 !== 2 && index !== 4 ? "sm:border-r" : "",
        index < 3 ? "sm:border-b" : "",
        index !== 4 ? "lg:border-r" : "lg:border-r-0",
      )}
    >
      <p
        className="text-[clamp(1.22rem,1.85vw,1.72rem)] font-black leading-none text-[#071421]"
        style={{ textShadow: "0 1px 0 rgba(255,255,255,0.74), 0 8px 22px rgba(255,255,255,0.32)" }}
      >
        {stat.value}
      </p>
      <p
        className="mt-1.5 text-xs font-bold leading-snug text-[#315849]"
        style={{ textShadow: "0 1px 0 rgba(255,255,255,0.68)" }}
      >
        {stat.label}
      </p>
    </div>
  );
}
