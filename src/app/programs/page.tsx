import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock3, GraduationCap, Sparkles, Users2 } from "lucide-react";
import { getPrograms } from "@/lib/data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { trainingProgramCatalogBySlug, trainingProgramGallery } from "@/lib/training-programs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Dynamic apiculture and beekeeping training programs at API CULTURE.",
};

const duplicatedGallery = [...trainingProgramGallery, ...trainingProgramGallery];

export default async function ProgramsPage() {
  const language = await getRequestLanguage();
  const programs = await getPrograms();
  const translatedPrograms = programs.map((program) => {
    const translatedProgram = getTranslatedProgramContent(program, language);
    const presentation = trainingProgramCatalogBySlug[program.slug];

    return {
      ...translatedProgram,
      presentation,
    };
  });

  return (
    <section className="bg-[#f5f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#dbe4f0] bg-[linear-gradient(135deg,#eef4ff_0%,#f7f9fc_55%,#edf2fa_100%)] p-6 shadow-[0_18px_45px_rgba(31,55,92,0.08)] sm:p-8 lg:p-10">
          <div className="absolute right-[-6rem] top-[-5rem] h-80 w-80 rounded-full border-[34px] border-[#d8e6ff] opacity-70" />
          <div className="absolute right-[8rem] top-[4rem] h-44 w-44 rounded-full border border-[#adc6ef] opacity-70" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#295fa8]">{t(language, "programs.eyebrow")}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-[#101828] sm:text-5xl lg:text-6xl">
                Beekeeping training programs with clear outcomes and direct application
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#475467] sm:text-lg">
                Open a training to see its duration, who it is for, what you will learn, and the form to apply for that exact program.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#d4def0] bg-white px-4 py-2 text-sm font-semibold text-[#344054]">
                  4 training options
                </span>
                <span className="rounded-full border border-[#d4def0] bg-white px-4 py-2 text-sm font-semibold text-[#344054]">
                  Real field images
                </span>
                <span className="rounded-full border border-[#d4def0] bg-white px-4 py-2 text-sm font-semibold text-[#344054]">
                  Training-wise application
                </span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#dbe4f0] bg-white p-5 shadow-[0_12px_30px_rgba(16,24,40,0.06)]">
              <p className="text-sm font-semibold text-[#101828]">Application flow</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-[#475467]">
                <p className="inline-flex gap-3"><span className="mt-1 text-[#295fa8]">1.</span>Choose the training you want.</p>
                <p className="inline-flex gap-3"><span className="mt-1 text-[#295fa8]">2.</span>Open its page and review the details.</p>
                <p className="inline-flex gap-3"><span className="mt-1 text-[#295fa8]">3.</span>Use the form inside that training page.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 z-10 rounded-[1.5rem] border border-[#dbe4f0] bg-white shadow-[0_20px_50px_rgba(16,24,40,0.08)]">
          <div className="grid divide-y divide-[#e8eef6] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
            <StatCard label="Programs" value="4 course tracks" detail="Foundation to specialized practical training" />
            <StatCard label="Level" value="Beginner to advanced" detail="Simple entry and skill-building progression" />
            <StatCard label="Duration" value="2 to 10 days" detail="Short focused modules and longer field batches" />
            <StatCard label="Format" value="Applied learning" detail="Field practice, processing, and supervised training" />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#dbe4f0] bg-[#0f1728] p-4 shadow-[0_20px_50px_rgba(15,23,40,0.18)]">
          <div className="flex items-center gap-3 px-1 pb-4">
            <Sparkles className="h-4 w-4 text-[#8bb8ff]" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c9dcff]">Training visuals from the field</p>
          </div>
          <div className="relative overflow-hidden rounded-[1.25rem]">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(90deg,#0f1728_0%,rgba(15,23,40,0)_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(270deg,#0f1728_0%,rgba(15,23,40,0)_100%)]" />
            <div className="marquee-track flex gap-4 py-1">
              {duplicatedGallery.map((image, index) => (
                <div
                  key={`${image.label}-${index}`}
                  className="relative h-36 w-[17rem] shrink-0 overflow-hidden rounded-[1rem] border border-white/10 bg-[#172338] sm:h-44 sm:w-[21rem]"
                >
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 21rem, 17rem" className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0)_30%,rgba(7,10,18,0.82)_100%)]" />
                  <p className="absolute bottom-3 left-3 rounded-full bg-[rgba(255,255,255,0.1)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {image.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-b border-[#dbe4f0] pb-4">
          <span className="rounded-lg bg-[#e8f0ff] px-4 py-2 text-sm font-semibold text-[#295fa8]">About</span>
          <span className="px-4 py-2 text-sm font-semibold text-[#344054]">Outcomes</span>
          <span className="px-4 py-2 text-sm font-semibold text-[#344054]">Courses</span>
          <span className="px-4 py-2 text-sm font-semibold text-[#344054]">Apply</span>
        </div>

        <div className="mt-8 grid gap-6">
          {translatedPrograms.map((program) => {
            const presentation = program.presentation;

            return (
              <Link
                key={program.id}
                href={`/programs/${program.slug}`}
                className="grid gap-0 overflow-hidden rounded-[1.5rem] border border-[#dbe4f0] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.06)] transition hover:border-[#bfd2f2] hover:shadow-[0_16px_34px_rgba(16,24,40,0.09)] lg:grid-cols-[minmax(0,1.2fr)_22rem]"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#d8e6ff] bg-[#f4f8ff] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#295fa8]">
                      {presentation?.focusLabel ?? program.level}
                    </span>
                    <span className="text-sm font-semibold text-[#475467]">{program.duration}</span>
                  </div>

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#101828]">
                    {program.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-8 text-[#475467]">
                    {program.summary}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MiniInfo icon={Clock3} label="Duration" value={program.duration} />
                    <MiniInfo icon={Users2} label="Capacity" value={`${program.capacity} ${t(language, "programs.seats")}`} />
                    <MiniInfo icon={GraduationCap} label="Level" value={program.level} />
                    <MiniInfo icon={Sparkles} label="Focus" value={presentation?.highlights?.[0] ?? "Field learning"} />
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-[#101828]">What you&apos;ll learn</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {(presentation?.outcomes ?? []).slice(0, 4).map((outcome) => (
                        <p key={outcome} className="inline-flex gap-3 text-sm leading-7 text-[#475467]">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-[#295fa8]" aria-hidden="true" />
                          {outcome}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {(presentation?.skills ?? []).map((skill) => (
                      <span key={skill} className="rounded-full bg-[#edf3ff] px-3 py-2 text-xs font-semibold text-[#295fa8]">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0b63ce]">
                    View training details
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>

                <div className="relative min-h-[18rem] border-t border-[#dbe4f0] bg-[#eef4ff] lg:min-h-full lg:border-l lg:border-t-0">
                  {presentation ? (
                    <Image src={presentation.imageSrc} alt={presentation.imageAlt} fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,40,0.04)_0%,rgba(16,24,40,0.28)_100%)]" />
                  <div className="absolute inset-x-4 bottom-4 rounded-[1rem] border border-white/50 bg-[rgba(255,255,255,0.86)] p-4 backdrop-blur-sm">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#295fa8]">Best suited for</p>
                    <p className="mt-2 text-sm leading-7 text-[#344054]">
                      {presentation?.targetAudience ?? "Eligible applicants interested in beekeeping training."}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
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

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1rem] border border-[#e5ecf6] bg-[#fafcff] p-4">
      <div className="flex items-center gap-2 text-[#295fa8]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#667085]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-[#101828]">{value}</p>
    </div>
  );
}
