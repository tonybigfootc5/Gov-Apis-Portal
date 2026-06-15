import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { TrainingApplicationForm } from "@/components/training-application-form";
import { getProgram } from "@/lib/data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { trainingProgramCatalogBySlug } from "@/lib/training-programs";

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
  const presentation = trainingProgramCatalogBySlug[program.slug];
  const selectedService = {
    title: translatedProgram.title,
    duration: translatedProgram.duration,
    level: translatedProgram.level,
  };
  const sectionLinks = [
    { href: "#about-training", label: "About", active: true },
    { href: "#training-outcomes", label: "Outcomes", active: false },
    { href: "#training-skills", label: "Skills", active: false },
    { href: "#training-application-form", label: "Apply", active: false },
  ] as const;

  return (
    <article className="bg-[#f5f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#dbe4f0] bg-[linear-gradient(135deg,#eef4ff_0%,#f7f9fc_55%,#edf2fa_100%)] shadow-[0_18px_45px_rgba(31,55,92,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_26rem]">
            <div className="p-6 sm:p-8 lg:p-10">
              <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#295fa8]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t(language, "programs.back")}
              </Link>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-[#295fa8]">
                {presentation?.detailBadge ?? translatedProgram.level}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-[#101828] sm:text-5xl">
                {translatedProgram.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#475467] sm:text-lg">
                {translatedProgram.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(presentation?.skills ?? []).map((skill) => (
                  <span key={skill} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#295fa8] shadow-[0_2px_8px_rgba(16,24,40,0.05)]">
                    {skill}
                  </span>
                ))}
              </div>

              <a
                href="#training-application-form"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#0b63ce] px-6 py-4 text-base font-semibold text-white shadow-[0_14px_30px_rgba(11,99,206,0.24)]"
              >
                Apply for this training
              </a>
            </div>

            <div className="relative min-h-[20rem] border-t border-[#dbe4f0] lg:min-h-full lg:border-l lg:border-t-0">
              {presentation ? (
                <Image
                  src={presentation.imageSrc}
                  alt={presentation.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 26rem, 100vw"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,40,0.06)_0%,rgba(16,24,40,0.28)_100%)]" />
            </div>
          </div>
        </div>

        <div className="relative -mt-6 z-10 rounded-[1.5rem] border border-[#dbe4f0] bg-white shadow-[0_20px_50px_rgba(16,24,40,0.08)]">
          <div className="grid divide-y divide-[#e8eef6] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
            <StatCard label="Duration" value={translatedProgram.duration} detail="Planned training period" />
            <StatCard label="Level" value={translatedProgram.level} detail="Recommended entry stage" />
            <StatCard label="Capacity" value={`${translatedProgram.capacity} participants`} detail="Batch size for guided learning" />
            <StatCard label="Format" value="Field and practical" detail="Hands-on learning with trainer support" />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-b border-[#dbe4f0] pb-4">
          {sectionLinks.map((section) => (
            <a
              key={section.label}
              href={section.href}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition hover:text-[#0b63ce] ${
                section.active ? "bg-[#e8f0ff] text-[#295fa8]" : "text-[#344054]"
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-6">
          <section id="about-training" className="rounded-[1.5rem] border border-[#dbe4f0] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.06)] sm:p-6">
            <h2 className="text-2xl font-semibold text-[#101828]">About this training</h2>
            <p className="mt-4 text-base leading-8 text-[#475467]">{translatedProgram.description}</p>
          </section>

          <section id="training-outcomes" className="rounded-[1.5rem] border border-[#dbe4f0] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.06)] sm:p-6">
            <h2 className="text-2xl font-semibold text-[#101828]">What you&apos;ll learn</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(presentation?.outcomes ?? []).map((outcome) => (
                <p key={outcome} className="inline-flex gap-3 text-sm leading-7 text-[#475467]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#295fa8]" aria-hidden="true" />
                  {outcome}
                </p>
              ))}
            </div>
          </section>

          <section id="training-skills" className="rounded-[1.5rem] border border-[#dbe4f0] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.06)] sm:p-6">
            <h2 className="text-2xl font-semibold text-[#101828]">Skills you&apos;ll gain</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {(presentation?.skills ?? []).map((skill) => (
                <span key={skill} className="rounded-full bg-[#edf3ff] px-4 py-2 text-sm font-semibold text-[#295fa8]">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section id="training-application-form" className="rounded-[1.5rem] border border-[#dbe4f0] bg-white p-5 shadow-[0_10px_28px_rgba(16,24,40,0.06)] sm:p-6">
            <div className="mb-6 rounded-[1.25rem] border border-[#e5ecf6] bg-[#fafcff] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#295fa8]">Application</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#101828]">Apply for {translatedProgram.title}</h2>
            </div>

            <TrainingApplicationForm serviceOptions={[selectedService]} selectedServiceTitle={selectedService.title} />
          </section>
        </div>
      </div>
    </article>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[#101828]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#667085]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[#475467]">{detail}</p>
    </div>
  );
}
