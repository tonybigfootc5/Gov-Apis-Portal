import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDot, GraduationCap, Timer } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getPrograms } from "@/lib/data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Dynamic apiculture and beekeeping training programs at API CULTURE.",
};

export default async function ProgramsPage() {
  const language = await getRequestLanguage();
  const programs = await getPrograms();
  const translatedPrograms = programs.map((program) => getTranslatedProgramContent(program, language));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-end">
        <div className="border-l-4 border-[#ebb428] pl-4 sm:pl-6">
          <SectionHeading eyebrow={t(language, "programs.eyebrow")} title={t(language, "programs.title")}>
            {t(language, "programs.body")}
          </SectionHeading>
        </div>
        <div className="paper-panel rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">How to apply</p>
          <div className="mt-5 grid gap-4 text-sm leading-7 text-[#516253]">
            <p className="inline-flex items-center gap-3"><GraduationCap className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />Choose the training the applicant wants</p>
            <p className="inline-flex items-center gap-3"><Timer className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />Open that training to see its full details</p>
            <p className="inline-flex items-center gap-3"><CircleDot className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />Fill the application form inside the selected training page</p>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {translatedPrograms.map((program) => {
          const isFoundation = program.slug === "scientific-beekeeping-foundation";

          return (
            <Link key={program.id} href={`/programs/${program.slug}`} className="group relative overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-5 shadow-[0_24px_50px_rgba(64,44,8,0.08)] transition hover:-translate-y-1 hover:border-[#b36b00]/40 sm:p-7">
              <div className="absolute left-0 top-0 h-1.5 w-full bg-[#ebb428]" />
              {isFoundation ? (
                <div className="mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.4rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-2 shadow-[0_18px_40px_rgba(64,44,8,0.08)]">
                  <Image
                    src="/scientific-beekeeping-icon.png"
                    alt="Scientific Beekeeping Foundation icon"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">{program.level}</p>
              <h2 className="font-display mt-4 text-2xl font-semibold text-[#1b3b2b] group-hover:text-[#b36b00] sm:text-3xl">{program.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#516253]">{program.summary}</p>
              <div className="mt-5 grid gap-2 text-sm text-[#1b3b2b]">
                <p className="inline-flex items-center gap-2"><CircleDot className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />Capacity: {program.capacity} {t(language, "programs.seats")}</p>
                <p className="inline-flex items-center gap-2"><CircleDot className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />Duration: {program.duration}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-black text-[#516253] sm:justify-between">
                <span>{program.duration}</span>
                <span>{program.capacity} {t(language, "programs.seats")}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f6efe4] px-3 py-2 text-xs uppercase tracking-[0.14em] text-[#1b3b2b] sm:ml-auto">
                  Open training
                  <ArrowRight className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
