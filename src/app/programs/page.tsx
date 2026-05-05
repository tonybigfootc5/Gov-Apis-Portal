import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="honeycomb-bg mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="border-l-4 border-[#f4b315] pl-4 sm:pl-6">
        <SectionHeading eyebrow={t(language, "programs.eyebrow")} title={t(language, "programs.title")}>
          {t(language, "programs.body")}
        </SectionHeading>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {translatedPrograms.map((program) => {
          const isFoundation = program.slug === "scientific-beekeeping-foundation";

          return (
            <Link key={program.id} href={`/programs/${program.slug}`} className="group relative overflow-hidden rounded-xl border border-[#504533] bg-[#201a20] p-5 shadow-xl transition hover:-translate-y-1 hover:border-[#ffd485] sm:p-7">
              <div className="absolute left-0 top-0 h-1.5 w-full bg-[#f4b315]" />
              {isFoundation ? (
                <div className="mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.4rem] border border-[#ffd485]/25 bg-[rgba(18,12,18,0.72)] p-2 shadow-[0_20px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <Image
                    src="/scientific-beekeeping-icon.png"
                    alt="Scientific Beekeeping Foundation icon"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">{program.level}</p>
              <h2 className="font-display mt-4 text-2xl font-semibold text-[#ecdfe8] group-hover:text-[#ffd485] sm:text-3xl">{program.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#d4c4ac]">{program.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-black text-[#d4c4ac] sm:justify-between">
                <span>{program.duration}</span>
                <span>{program.capacity} {t(language, "programs.seats")}</span>
                <ArrowRight className="h-5 w-5 text-[#ffd485] sm:ml-auto" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
