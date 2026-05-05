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
    description: program?.summary ?? "Honey House training program.",
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-black text-amber-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Training programs
      </Link>
      <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-amber-700">{program.level}</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl">{program.title}</h1>
      <p className="mt-5 text-lg leading-8 text-stone-700">{program.summary}</p>
      <div className="mt-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <Detail label="Duration" value={program.duration} />
        <Detail label="Capacity" value={`${program.capacity} participants`} />
        <Detail label="Fee" value={program.fee ?? "As notified"} />
      </div>
      <div className="mt-8 whitespace-pre-line text-base leading-8 text-stone-800">{program.description}</div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-1 font-black text-emerald-950">{value}</p>
    </div>
  );
}
