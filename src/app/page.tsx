import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getEvents, getPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [programs, events] = await Promise.all([getPrograms(), getEvents()]);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-emerald-950 text-white">
        <div className="absolute inset-0 opacity-25">
          <Image src="/honey-house-signboard.jpg" alt="" fill priority className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#052e24_0%,rgba(5,46,36,0.92)_44%,rgba(146,64,14,0.62)_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-69px)] max-w-7xl content-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="inline-flex rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-200">
              {institute.legalName}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Honey House
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">
              A future-ready apiculture culture and beekeeping technology center for training, rural enterprise, field demonstrations, and institutional collaboration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/programs" className="inline-flex items-center gap-2 rounded-md bg-amber-300 px-5 py-3 text-sm font-black text-emerald-950 shadow-lg shadow-amber-950/20">
                Explore training <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-black text-white">
                Contact center
              </Link>
            </div>
          </div>
          <div className="grid content-end gap-3">
            {[
              ["Government aligned", "Institutional-grade information architecture and secure admin operations."],
              ["Training led", "Dynamic programs for farmers, entrepreneurs, and extension professionals."],
              ["Field connected", "Events, workshops, gallery, and center contact channels built for real use."],
            ].map(([title, text], index) => (
              <div key={title} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-amber-300 text-emerald-950">{index + 1}</span>
                  <div>
                    <h2 className="font-black">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-emerald-50">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [GraduationCap, "Applied training", "Structured beekeeping programs"],
            [CalendarDays, "Workshops", "Events and orientation sessions"],
            [ShieldCheck, "Secure admin", "Protected CRUD and validated inputs"],
            [Sparkles, "Optimized", "Next/Image, SEO, sitemap, Vercel ready"],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-amber-700" aria-hidden="true" />
              <h2 className="mt-4 font-black text-emerald-950">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Training" title="Programs built for practical apiculture capability">
            The training catalog is dynamic and managed through the admin dashboard backed by PostgreSQL and Prisma.
          </SectionHeading>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {programs.slice(0, 2).map((program) => (
              <Link key={program.id} href={`/programs/${program.slug}`} className="group rounded-lg border border-stone-200 bg-[#fffaf0] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <BadgeCheck className="h-6 w-6 text-emerald-800" aria-hidden="true" />
                <h3 className="mt-4 text-2xl font-black text-emerald-950">{program.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-700">{program.summary}</p>
                <p className="mt-5 text-sm font-black text-amber-700">{program.duration} / {program.level}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Events" title="Workshops and public programs">
          Publish orientations, workshops, and field sessions with dynamic event detail pages.
        </SectionHeading>
        <div className="mt-8 grid gap-4">
          {events.slice(0, 3).map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="grid gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-amber-300 sm:grid-cols-[160px_1fr_auto] sm:items-center">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">{formatDate(event.startsAt)}</p>
              <div>
                <h3 className="text-xl font-black text-emerald-950">{event.title}</h3>
                <p className="mt-1 text-sm text-stone-700">{event.summary}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-stone-500" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
