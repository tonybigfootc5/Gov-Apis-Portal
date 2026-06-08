import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { TrainingApplicationForm } from "@/components/training-application-form";
import { getProgram } from "@/lib/data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  return {
    title: program?.title ?? "Program",
    description: program?.summary ?? "API CULTURE training program.",
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const language = await getRequestLanguage();
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();
  const translatedProgram = getTranslatedProgramContent(program, language);
  const selectedService = {
    title: translatedProgram.title,
    duration: translatedProgram.duration,
    level: translatedProgram.level,
  };
  const isQueenRearing = slug === "queen-rearing-and-colony-multiplication";
  const isFoundation = slug === "scientific-beekeeping-foundation";
  const programBackgroundSrc =
    slug === "queen-rearing-and-colony-multiplication"
      ? "/queen-rearing-bg.jpg"
      : slug === "scientific-beekeeping-foundation"
        ? "/scientific-foundation-bg.jpg"
        : null;

  return (
    <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        className={`relative overflow-hidden rounded-[2rem] border border-[#504533] ${
          isQueenRearing || isFoundation ? "bg-[#f4ead8]" : "bg-[#fffdf8]"
        } p-5 shadow-[0_28px_70px_rgba(64,44,8,0.1)] sm:p-8 lg:p-10`}
      >
        {programBackgroundSrc ? (
          <>
            <div className="pointer-events-none absolute inset-0">
              <Image
                src={programBackgroundSrc}
                alt=""
                fill
                priority
                sizes="100vw"
                className={`object-cover ${isFoundation ? "object-center opacity-18" : "object-center opacity-22"}`}
              />
              <div
                className={`absolute inset-0 ${
                  isFoundation
                    ? "bg-[linear-gradient(135deg,rgba(250,248,242,0.96)_0%,rgba(250,248,242,0.86)_36%,rgba(244,234,216,0.95)_100%)]"
                    : "bg-[linear-gradient(135deg,rgba(250,248,242,0.95)_0%,rgba(250,248,242,0.82)_34%,rgba(244,234,216,0.94)_100%)]"
                }`}
              />
              <div
                className={`absolute inset-0 ${
                  isFoundation
                    ? "bg-[radial-gradient(circle_at_top_left,rgba(235,180,40,0.16)_0%,rgba(235,180,40,0.05)_22%,rgba(250,248,242,0)_48%),radial-gradient(circle_at_bottom_right,rgba(27,59,43,0.12)_0%,rgba(27,59,43,0.04)_24%,rgba(250,248,242,0)_54%)]"
                    : "bg-[radial-gradient(circle_at_bottom_left,rgba(235,180,40,0.18)_0%,rgba(235,180,40,0.06)_24%,rgba(250,248,242,0)_54%),radial-gradient(circle_at_top_right,rgba(27,59,43,0.08)_0%,rgba(27,59,43,0.03)_18%,rgba(250,248,242,0)_42%)]"
                }`}
              />
              <div className="absolute inset-0 honeycomb-bg opacity-[0.08]" />
            </div>
            <div className="pointer-events-none absolute right-8 top-8 hidden rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8]/88 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#b36b00] backdrop-blur-xl md:block">
              {isFoundation ? t(language, "programs.detail.foundationBadge") : t(language, "programs.detail.queenBadge")}
            </div>
            {isFoundation ? (
              <div className="pointer-events-none absolute bottom-8 right-8 hidden h-28 w-28 items-center justify-center rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8]/88 p-3 shadow-[0_24px_55px_rgba(64,44,8,0.12)] backdrop-blur-xl md:flex">
                <Image
                  src="/scientific-beekeeping-icon.png"
                  alt="Scientific Beekeeping Foundation icon"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
            ) : null}
          </>
        ) : null}

        <div className="relative min-w-0">
          <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-black text-[#b36b00]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t(language, "programs.back")}
          </Link>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#b36b00]">{translatedProgram.level}</p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[#1b3b2b] sm:text-5xl lg:text-6xl">{translatedProgram.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#516253] sm:text-lg sm:leading-8">{translatedProgram.summary}</p>
          <div className="glass-panel mt-8 grid gap-4 rounded-[1.5rem] p-6 sm:grid-cols-3">
            <Detail label={t(language, "programs.detail.duration")} value={translatedProgram.duration} />
            <Detail label={t(language, "programs.detail.capacity")} value={`${translatedProgram.capacity} participants`} />
            <Detail label={t(language, "programs.detail.fee")} value={translatedProgram.fee ?? t(language, "programs.detail.fallbackFee")} />
          </div>
          <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-[rgba(27,59,43,0.12)] bg-[#f6efe4] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b36b00]">Application flow</p>
              <p className="mt-3 text-sm leading-7 text-[#516253]">
                You are now inside the selected training. Review the details, then use the application form below to apply directly for this training only.
              </p>
            </div>
            <a
              href="#training-application-form"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b3b2b] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#faf8f2] shadow-[0_18px_40px_rgba(27,59,43,0.16)]"
            >
              Fill this training form
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-8 whitespace-pre-line text-base leading-8 text-[#435247]">{translatedProgram.description}</div>
        </div>
      </div>

      <section id="training-application-form" className="mt-10 rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(180deg,#fbf7ee_0%,#f3ecdf_100%)] p-5 shadow-[0_28px_70px_rgba(64,44,8,0.08)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">Selected training</p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-[#1b3b2b]">{translatedProgram.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#516253]">{translatedProgram.summary}</p>
              <div className="mt-5 grid gap-3 text-sm text-[#1b3b2b]">
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />Duration: {translatedProgram.duration}</p>
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />Level: {translatedProgram.level}</p>
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />Capacity: {translatedProgram.capacity} participants</p>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">Before filling</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-[#516253]">
                <p className="inline-flex items-start gap-3"><FileText className="mt-1 h-4 w-4 shrink-0 text-[#b36b00]" aria-hidden="true" />The form below is already connected to this training, so there is no need to choose the service again.</p>
                <p className="inline-flex items-start gap-3"><FileText className="mt-1 h-4 w-4 shrink-0 text-[#b36b00]" aria-hidden="true" />Keep the applicant photo ready before the final step.</p>
                <p className="inline-flex items-start gap-3"><FileText className="mt-1 h-4 w-4 shrink-0 text-[#b36b00]" aria-hidden="true" />If the applicant does not have email or residence phone, those fields can stay blank.</p>
              </div>
            </div>
          </div>

          <TrainingApplicationForm serviceOptions={[selectedService]} selectedServiceTitle={selectedService.title} />
        </div>
      </section>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6b7a70]">{label}</p>
      <p className="mt-1 font-black text-[#1b3b2b]">{value}</p>
    </div>
  );
}
