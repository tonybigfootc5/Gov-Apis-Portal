import type { Metadata } from "next";
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

  return (
    <article className="honeycomb-bg mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-black text-[#feb96d]">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Training programs
      </Link>
      <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">{program.level}</p>
      <h1 className="font-display mt-3 text-5xl font-semibold tracking-tight text-[#ffd485] sm:text-6xl">{program.title}</h1>
      <p className="mt-5 text-lg leading-8 text-[#d4c4ac]">{program.summary}</p>
      <div className="glass-panel mt-8 grid gap-4 rounded-xl p-6 sm:grid-cols-3">
        <Detail label="Duration" value={program.duration} />
        <Detail label="Capacity" value={`${program.capacity} participants`} />
        <Detail label="Fee" value={program.fee ?? "As notified"} />
      </div>
      <div className="mt-8 whitespace-pre-line text-base leading-8 text-[#ecdfe8]">{program.description}</div>
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
