import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock3, GraduationCap, Users2 } from "lucide-react";
import { getPrograms } from "@/lib/data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { trainingProgramCatalogBySlug, trainingProgramGallery } from "@/lib/training-programs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Apiculture training programs at API CULTURE.",
};

const duplicatedGallery = [...trainingProgramGallery, ...trainingProgramGallery];

export default async function ProgramsPage() {
  const language = await getRequestLanguage();
  const programs = await getPrograms();
  const translatedPrograms = programs.map((program) => ({
    ...getTranslatedProgramContent(program, language),
    presentation: trainingProgramCatalogBySlug[program.slug],
  }));

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="neo-shell rounded-[2.4rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#8ec5ff]">{t(language, "programs.eyebrow")}</p>
              <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.92] text-bright sm:text-6xl lg:text-7xl">
                Training that feels practical before the first hive is even opened.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-dim sm:text-lg">
                Choose a program, review the outcomes, and apply directly from the detail page. No filler, no dead-end steps.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Chip>Live batch flow</Chip>
                <Chip>Field-first curriculum</Chip>
                <Chip>Direct application + payment</Chip>
              </div>
            </div>

            <div className="section-frame rounded-[1.7rem] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">Snapshot</p>
              <div className="mt-5 grid gap-4">
                <QuickStat value={`${translatedPrograms.length}`} label="Active programs" />
                <QuickStat value="2-10 days" label="Typical duration" />
                <QuickStat value="Field + lab" label="Delivery mode" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#f4ecde_100%)] p-4 shadow-[0_22px_60px_rgba(171,141,92,0.14)]">
          <div className="flex items-center justify-between gap-4 px-2 pb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8ec5ff]">Field visuals</p>
            <p className="text-xs text-dim">Scroll-free visual context while you compare options.</p>
          </div>
          <div className="relative overflow-hidden rounded-[1.4rem]">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(90deg,#fffdf8_0%,rgba(255,253,248,0)_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(270deg,#fffdf8_0%,rgba(255,253,248,0)_100%)]" />
            <div className="marquee-track flex gap-4 py-1">
              {duplicatedGallery.map((image, index) => (
                <div
                  key={`${image.label}-${index}`}
                  className="relative h-40 w-[18rem] shrink-0 overflow-hidden rounded-[1.2rem] border border-[rgba(41,56,49,0.1)] bg-[#f3ecdf] sm:h-48 sm:w-[24rem]"
                >
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 24rem, 18rem" className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,27,22,0)_28%,rgba(17,27,22,0.6)_100%)]" />
                  <p className="absolute bottom-3 left-3 rounded-full border border-[rgba(255,255,255,0.24)] bg-[rgba(17,28,24,0.56)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#fff9ef] backdrop-blur-sm">
                    {image.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {translatedPrograms.map((program) => {
            const presentation = program.presentation;

            return (
              <Link
                key={program.id}
                href={`/programs/${program.slug}`}
                className="group grid gap-0 overflow-hidden rounded-[1.8rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e7_100%)] shadow-[0_18px_50px_rgba(171,141,92,0.12)] transition hover:-translate-y-1 hover:border-[rgba(199,123,34,0.24)] lg:grid-cols-[minmax(0,1.12fr)_24rem]"
              >
                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#8ec5ff]/22 bg-[#8ec5ff]/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#547ba1]">
                      {presentation?.focusLabel ?? program.level}
                    </span>
                    <span className="text-sm font-semibold text-dim">{program.duration}</span>
                  </div>

                  <h2 className="font-display mt-4 text-4xl leading-tight text-bright">
                    {program.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-dim">
                    {program.summary}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MiniInfo icon={Clock3} label="Duration" value={program.duration} />
                    <MiniInfo icon={Users2} label="Capacity" value={`${program.capacity} ${t(language, "programs.seats")}`} />
                    <MiniInfo icon={GraduationCap} label="Level" value={program.level} />
                    <MiniInfo icon={ArrowRight} label="Focus" value={presentation?.highlights?.[0] ?? "Field learning"} />
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-bright">Key outcomes</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {(presentation?.outcomes ?? []).slice(0, 4).map((outcome) => (
                        <p key={outcome} className="inline-flex gap-3 text-sm leading-7 text-dim">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-[#f2b544]" aria-hidden="true" />
                          {outcome}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#f2b544]">
                    View program
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </div>

                <div className="relative min-h-[18rem] border-t border-[rgba(41,56,49,0.1)] bg-[#f3ecdf] lg:min-h-full lg:border-l lg:border-t-0">
                  {presentation ? (
                    <Image src={presentation.imageSrc} alt={presentation.imageAlt} fill sizes="(min-width: 1024px) 24rem, 100vw" className="object-cover" />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,27,22,0.04)_0%,rgba(17,27,22,0.54)_100%)]" />
                  <div className="absolute inset-x-4 bottom-4 rounded-[1.2rem] border border-[rgba(255,255,255,0.24)] bg-[rgba(17,28,24,0.56)] p-4 backdrop-blur-md">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8ec5ff]">Best suited for</p>
                    <p className="mt-2 text-sm leading-7 text-[#fff9ef]">
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

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] px-4 py-2 text-sm font-semibold text-[#1f352b]">
      {children}
    </span>
  );
}

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-4">
      <p className="text-lg font-semibold text-bright">{value}</p>
      <p className="mt-1 text-sm text-dim">{label}</p>
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
    <div className="rounded-[1.1rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-4">
      <div className="flex items-center gap-2 text-[#8ec5ff]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6f8177]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-bright">{value}</p>
    </div>
  );
}
