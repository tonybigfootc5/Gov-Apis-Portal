import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProgram } from "@/lib/data";

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
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();
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
              {isFoundation ? "Live apiary foundation" : "Queen line development"}
            </div>
          </>
        ) : null}

        <div className="relative min-w-0">
          <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-black text-[#feb96d]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Training programs
          </Link>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">{program.level}</p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[#ffd485] sm:text-5xl lg:text-6xl">{program.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#d4c4ac] sm:text-lg sm:leading-8">{program.summary}</p>
          <div className="glass-panel mt-8 grid gap-4 rounded-xl p-6 sm:grid-cols-3">
            <Detail label="Duration" value={program.duration} />
            <Detail label="Capacity" value={`${program.capacity} participants`} />
            <Detail label="Fee" value={program.fee ?? "As notified"} />
          </div>
          <div className="mt-8 whitespace-pre-line text-base leading-8 text-[#ecdfe8]">{program.description}</div>
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
