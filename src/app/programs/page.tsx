import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getPrograms } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Dynamic apiculture and beekeeping training programs at Honey House.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Training programs" title="Professional beekeeping training catalog">
        Programs are managed from the admin dashboard and rendered with dynamic routes for search-friendly public access.
      </SectionHeading>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {programs.map((program) => (
          <Link key={program.id} href={`/programs/${program.slug}`} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">{program.level}</p>
            <h2 className="mt-3 text-2xl font-black text-emerald-950">{program.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">{program.summary}</p>
            <div className="mt-5 flex items-center justify-between gap-4 text-sm font-black text-stone-700">
              <span>{program.duration}</span>
              <span>{program.capacity} seats</span>
              <ArrowRight className="h-5 w-5 text-amber-700" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
