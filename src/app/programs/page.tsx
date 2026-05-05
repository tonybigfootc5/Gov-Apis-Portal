import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getPrograms } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Dynamic apiculture and beekeeping training programs at API CULTURE.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <section className="honeycomb-bg mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="border-l-4 border-[#f4b315] pl-4 sm:pl-6">
        <SectionHeading eyebrow="Training programs" title="Professional beekeeping training catalog">
          API CULTURE offers comprehensive training programs managed from the admin dashboard and rendered with dynamic routes for search-friendly public access.
        </SectionHeading>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {programs.map((program) => (
          <Link key={program.id} href={`/programs/${program.slug}`} className="group relative overflow-hidden rounded-xl border border-[#504533] bg-[#201a20] p-5 shadow-xl transition hover:-translate-y-1 hover:border-[#ffd485] sm:p-7">
            <div className="absolute left-0 top-0 h-1.5 w-full bg-[#f4b315]" />
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">{program.level}</p>
            <h2 className="font-display mt-4 text-2xl font-semibold text-[#ecdfe8] group-hover:text-[#ffd485] sm:text-3xl">{program.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#d4c4ac]">{program.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-black text-[#d4c4ac] sm:justify-between">
              <span>{program.duration}</span>
              <span>{program.capacity} seats</span>
              <ArrowRight className="h-5 w-5 text-[#ffd485] sm:ml-auto" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
