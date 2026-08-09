import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, HelpCircle, Mail, MapPin, MessageCircle, Phone, Timer } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { TrainingPreviewSwitch, type TrainingPreviewCourse } from "@/components/training-preview-switch";
import AboutUsSection from "@/components/ui/about-us-section";
import { getPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getProgramEnrollmentState } from "@/lib/program-enrollment";
import { getRequestLanguage } from "@/lib/request-language";
import { getSiteCopy } from "@/lib/site-copy";
import { trainingProgramCatalogBySlug } from "@/lib/training-programs";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const contactFaqCategories = [
  {
    category: "Training Enrollment",
    questions: [
      {
        question: "How do I enroll for a training program?",
        answer: "Open Programs, choose the training, fill the application form, review the details, and complete the online payment.",
      },
      {
        question: "When is my enrollment confirmed?",
        answer: "Enrollment is confirmed automatically after the payment gateway marks the transaction successful.",
      },
      {
        question: "Can I enroll if a program says Coming soon?",
        answer: "No. Coming soon means the batch date is not fixed yet. Contact 93955077066 for the next update.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        question: "What should I do after payment?",
        answer: "Wait for the success page. It shows the PhonePe transaction ID, invoice number, amount, program, and enrollment ID.",
      },
      {
        question: "What if my payment fails or expires?",
        answer: "Failed or expired payments do not enroll the student. Start the application payment again or contact the center if money was debited.",
      },
      {
        question: "Where can I find my receipt?",
        answer: "The successful payment page has a Download Successful Card button with a QR code for verification.",
      },
    ],
  },
  {
    category: "Documents",
    questions: [
      {
        question: "Is Aadhaar required?",
        answer: "Yes. Enter the Aadhaar number carefully because it appears on the successful enrollment confirmation.",
      },
      {
        question: "Do I need to upload a photo?",
        answer: "Yes. A clear applicant photo is required before submitting the training application.",
      },
      {
        question: "Can I change details after payment?",
        answer: "Contact the center with your invoice number, enrollment ID, and mobile number for correction support.",
      },
    ],
  },
  {
    category: "Batch and Venue",
    questions: [
      {
        question: "Where is the training conducted?",
        answer: "Training is conducted at the API CULTURE Technology Center facilities in Rajendranagar, Hyderabad.",
      },
      {
        question: "When does enrollment close?",
        answer: "Enrollment closes automatically at 12:00 AM on the batch start date.",
      },
      {
        question: "Are Honey Processing and Queen Bee batches always available?",
        answer: "No. These batches are opened manually by admin only when a batch date is fixed.",
      },
    ],
  },
];

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
        <div className="mx-auto grid max-w-[94rem] gap-8 rounded-[2rem] border border-[#ece8de] bg-[#f4f3ee] p-6 shadow-[0_28px_80px_rgba(30,34,28,0.12)] lg:grid-cols-[0.92fr_1.08fr] lg:p-10">
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
          </div>

          <div className="self-start">
            <ContactForm language={language} variant="contactPage" />
          </div>
        </div>

        <section className="mx-auto mt-8 max-w-[94rem] overflow-hidden rounded-[1.35rem] border border-[#e2ded4] bg-[#fffdf8] p-4 shadow-[0_18px_42px_rgba(30,34,28,0.08)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#173f33] text-[#fff9ec]">
                <HelpCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9c6a18]">FAQ</p>
                <h3 className="text-xl font-black text-[#171a16]">Quick answers before calling</h3>
              </div>
            </div>
            <span className="rounded-full bg-[#f1ecdf] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#173f33]">
              Scroll categories
            </span>
          </div>
          <div className="mt-4 flex max-h-[24rem] snap-x gap-3 overflow-x-auto pb-2">
            {contactFaqCategories.map((category) => (
              <article key={category.category} className="w-[18.5rem] shrink-0 snap-start rounded-[1rem] border border-[#ece8de] bg-white p-4">
                <p className="text-sm font-black text-[#173f33]">{category.category}</p>
                <div className="mt-3 grid gap-3">
                  {category.questions.map((item) => (
                    <div key={item.question} className="rounded-[0.85rem] bg-[#f6f4ee] p-3">
                      <p className="text-sm font-black leading-5 text-[#171a16]">{item.question}</p>
                      <p className="mt-2 text-xs font-semibold leading-5 text-[#555a51]">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </article>
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
