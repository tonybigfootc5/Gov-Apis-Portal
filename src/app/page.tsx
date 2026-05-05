import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  Microscope,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getEvents, getPrograms } from "@/lib/data";
import { institute } from "@/lib/fallback-data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [programs, events] = await Promise.all([getPrograms(), getEvents()]);

  return (
    <>
      <section className="relative isolate min-h-[820px] overflow-hidden bg-[#120c12]">
        <div className="absolute inset-0">
          <Image
            src="/honey-house-signboard.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-35 saturate-125"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#171117_0%,rgba(23,17,23,0.94)_45%,rgba(23,17,23,0.35)_100%)]" />
          <div className="absolute inset-0 honeycomb-bg opacity-70" />
          
          {/* Bee illustrations */}
          <div className="absolute top-20 right-10 h-20 w-20 opacity-60">
            <Image src="/bee-icon.svg" alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-32 left-20 h-24 w-24 opacity-40">
            <Image src="/hive-hexagon.svg" alt="" fill className="object-contain" />
          </div>
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-78px)] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-3 rounded border border-[#ffd485]/30 bg-[#f4b315] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#271900] shadow-xl shadow-black/30">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              {institute.parent.split(",")[0]}
            </p>
            <h1 className="font-display mt-8 text-6xl font-semibold leading-[1.02] tracking-tight text-[#ecdfe8] sm:text-7xl lg:text-8xl">
              Advanced <span className="text-[#ffd485]">API CULTURE</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-[#d4c4ac]">
              API CULTURE is a field-focused apiculture technology center for scientific beekeeping training,
              rural enterprise, workshops, and institutional collaboration.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/programs"
                className="hex-soft inline-flex items-center gap-3 bg-[#f4b315] px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#271900] shadow-xl shadow-black/30 transition hover:-translate-y-1"
              >
                Training catalog <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 rounded border-2 border-[#504533] px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#ecdfe8] transition hover:border-[#ffd485] hover:bg-[#241e24]"
              >
                Learn mission
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] lg:block">
            <div className="hex-clip absolute right-0 top-4 h-[430px] w-[470px] bg-[#f4b315] p-2 shadow-2xl shadow-black/50">
              <div className="hex-clip relative h-full w-full overflow-hidden bg-[#241e24]">
                <Image src="/beekeeping-illustration.svg" alt="API CULTURE beekeeping" fill className="object-cover" />
              </div>
            </div>
            <div className="hex-clip absolute bottom-6 left-0 grid h-56 w-64 place-items-center bg-[#feb96d] p-8 text-center text-[#492900] shadow-2xl shadow-black/40">
              <div>
                <p className="font-display text-6xl font-bold">40+</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.2em]">Training and field capability pathways</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 grid place-items-center">
          <div className="h-16 w-16 opacity-70">
            <Image src="/bee-icon.svg" alt="" fill className="object-contain" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            [GraduationCap, "Applied training", "Structured beekeeping programs"],
            [CalendarDays, "Workshops", "Events and orientation sessions"],
            [Microscope, "Technology center", "Field-ready apiculture practices"],
            [ShieldCheck, "Secure admin", "Protected CRUD and validated inputs"],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="glass-panel rounded-xl p-6 transition hover:-translate-y-1">
              <Icon className="h-7 w-7 text-[#ffd485]" aria-hidden="true" />
              <h2 className="font-display mt-5 text-2xl font-semibold text-[#ffd485]">{title as string}</h2>
              <p className="mt-3 text-sm leading-6 text-[#d4c4ac]">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#504533]/60 bg-[#201a20] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Training" title="Professional programs for practical apiculture capability">
            The training catalog is dynamic and managed through the secure admin dashboard backed by PostgreSQL and Prisma. All API CULTURE programs are designed for hands-on learning.
          </SectionHeading>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {programs.slice(0, 2).map((program) => (
              <Link
                key={program.id}
                href={`/programs/${program.slug}`}
                className="group relative overflow-hidden rounded-xl border border-[#504533] bg-[#120c12] p-8 shadow-xl transition hover:border-[#ffd485]/70"
              >
                <div className="absolute right-2 top-2 h-12 w-12 opacity-10">
                  <Image src="/bee-icon.svg" alt="" fill className="object-contain" />
                </div>
                <div className="absolute left-0 top-0 h-1.5 w-full bg-[#f4b315]" />
                <Sparkles className="h-7 w-7 text-[#ffd485]" aria-hidden="true" />
                <h3 className="font-display mt-5 text-3xl font-semibold text-[#ecdfe8] group-hover:text-[#ffd485]">{program.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#d4c4ac]">{program.summary}</p>
                <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">
                  {program.duration} / {program.level}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Events" title="Workshops and public programs">
          Publish orientations, workshops, and field sessions with dynamic event detail pages hosted by API CULTURE.
        </SectionHeading>
        <div className="mt-10 grid gap-5">
          {events.slice(0, 3).map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group relative grid gap-4 overflow-hidden rounded-xl border border-[#504533] bg-[#241e24] p-6 shadow-xl transition hover:border-[#ffd485]/70 sm:grid-cols-[170px_1fr_auto] sm:items-center"
            >
              <div className="absolute right-4 top-4 h-8 w-8 opacity-20 group-hover:opacity-30 transition">
                <Image src="/bee-icon.svg" alt="" fill className="object-contain" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">{formatDate(event.startsAt)}</p>
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#ecdfe8]">{event.title}</h3>
                <p className="mt-2 text-sm text-[#d4c4ac]">{event.summary}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#ffd485]" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
