import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
  const isQueenRearing = slug === "queen-rearing-and-colony-multiplication";
  const isFoundation = slug === "scientific-beekeeping-foundation";
  const programBackgroundSrc =
    slug === "queen-rearing-and-colony-multiplication"
      ? "/queen-rearing-bg.jpg"
      : slug === "scientific-beekeeping-foundation"
        ? "/scientific-foundation-bg.jpg"
        : null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        className={`relative overflow-hidden rounded-[2rem] border border-[#504533] ${
          isQueenRearing || isFoundation ? "bg-[#120c12]" : "honeycomb-bg bg-transparent"
        } p-5 shadow-2xl shadow-black/25 sm:p-8 lg:p-10`}
      >
        {programBackgroundSrc ? (
          <>
            <div className="pointer-events-none absolute inset-0">
              <Image
                src={programBackgroundSrc}
                alt=""
                fill
                priority
                className={`object-cover ${isFoundation ? "object-center opacity-24" : "object-center opacity-32"}`}
              />
              <div
                className={`absolute inset-0 ${
                  isFoundation
                    ? "bg-[linear-gradient(135deg,rgba(18,12,18,0.86)_0%,rgba(18,12,18,0.56)_34%,rgba(18,12,18,0.84)_100%)]"
                    : "bg-[linear-gradient(135deg,rgba(18,12,18,0.9)_0%,rgba(18,12,18,0.68)_34%,rgba(18,12,18,0.84)_100%)]"
                }`}
              />
              <div
                className={`absolute inset-0 ${
                  isFoundation
                    ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.05)_20%,rgba(18,12,18,0)_48%),radial-gradient(circle_at_bottom_right,rgba(244,179,21,0.18)_0%,rgba(244,179,21,0.06)_26%,rgba(18,12,18,0)_58%)]"
                    : "bg-[radial-gradient(circle_at_bottom_left,rgba(244,179,21,0.22)_0%,rgba(244,179,21,0.08)_24%,rgba(18,12,18,0)_54%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_18%,rgba(18,12,18,0)_42%)]"
                }`}
              />
              <div className="absolute inset-0 honeycomb-bg opacity-25" />
            </div>
            <div className="pointer-events-none absolute right-8 top-8 hidden rounded-full border border-[#ffd485]/30 bg-[rgba(18,12,18,0.45)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffd485] backdrop-blur-xl md:block">
              {isFoundation ? t(language, "programs.detail.foundationBadge") : t(language, "programs.detail.queenBadge")}
            </div>
            {isFoundation ? (
              <div className="pointer-events-none absolute bottom-8 right-8 hidden h-28 w-28 items-center justify-center rounded-[2rem] border border-[#ffd485]/25 bg-[rgba(18,12,18,0.56)] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl md:flex">
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
          <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-black text-[#feb96d]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t(language, "programs.back")}
          </Link>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">{translatedProgram.level}</p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[#ffd485] sm:text-5xl lg:text-6xl">{translatedProgram.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#d4c4ac] sm:text-lg sm:leading-8">{translatedProgram.summary}</p>
          <div className="glass-panel mt-8 grid gap-4 rounded-xl p-6 sm:grid-cols-3">
            <Detail label={t(language, "programs.detail.duration")} value={translatedProgram.duration} />
            <Detail label={t(language, "programs.detail.capacity")} value={`${translatedProgram.capacity} participants`} />
            <Detail label={t(language, "programs.detail.fee")} value={translatedProgram.fee ?? t(language, "programs.detail.fallbackFee")} />
          </div>
          <div className="mt-8 whitespace-pre-line text-base leading-8 text-[#ecdfe8]">{translatedProgram.description}</div>
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d4c4ac]">{label}</p>
      <p className="mt-1 font-black text-[#ffd485]">{value}</p>
    </div>
  );
}
