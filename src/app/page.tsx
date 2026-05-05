import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  MapPin,
  Microscope,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { HeroBackgroundVideo } from "@/components/hero-background-video";
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
        <div className="pointer-events-none absolute inset-0">
          <HeroBackgroundVideo />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#171117_0%,rgba(23,17,23,0.94)_45%,rgba(23,17,23,0.35)_100%)]" />
          <div className="absolute inset-0 honeycomb-bg opacity-70" />
          
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

          <div className="relative hidden min-h-[560px] lg:block">
            <div className="pointer-events-none absolute right-2 top-6 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(244,179,21,0.24)_0%,rgba(244,179,21,0.1)_38%,rgba(244,179,21,0)_72%)] blur-3xl" />
            <div className="pointer-events-none hero-float absolute right-0 top-0 h-[455px] w-[500px]">
              <div className="hex-clip absolute inset-0 border border-[#ffd485]/25 bg-[linear-gradient(180deg,rgba(255,212,133,0.16)_0%,rgba(255,212,133,0.06)_45%,rgba(18,12,18,0.02)_100%)] shadow-[0_40px_120px_rgba(0,0,0,0.34)] backdrop-blur-[10px]" />
              <div className="hex-clip absolute inset-[18px] border border-[#ffd485]/20 bg-[linear-gradient(135deg,rgba(255,212,133,0.09)_0%,rgba(36,30,36,0.05)_48%,rgba(255,212,133,0.02)_100%)]" />
              <div className="absolute left-[78px] top-[82px] h-[292px] w-[292px] rounded-full border border-[#ffd485]/18 bg-[radial-gradient(circle,rgba(255,212,133,0.22)_0%,rgba(255,212,133,0.08)_34%,rgba(18,12,18,0)_70%)]" />
              <div className="absolute left-[145px] top-[124px] h-[156px] w-[156px] rounded-full border border-[#ffd485]/30 bg-[radial-gradient(circle,rgba(244,179,21,0.26)_0%,rgba(244,179,21,0.08)_50%,rgba(244,179,21,0)_100%)]" />
              <div className="absolute left-[160px] top-[139px] h-[126px] w-[126px] rounded-full border border-[#ffd485]/20" />
              <div className="absolute left-[64px] top-[56px] rounded-full border border-[#ffd485]/25 bg-[rgba(18,12,18,0.56)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffd485] backdrop-blur-xl">
                Live campus motion
              </div>
              <div className="absolute right-[68px] top-[100px] flex flex-col gap-3">
                <div className="glass-panel hero-float-delayed rounded-2xl px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#feb96d]">Location</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#ecdfe8]">
                    <MapPin className="h-4 w-4 text-[#ffd485]" aria-hidden="true" />
                    Rajendranagar, Hyderabad
                  </p>
                </div>
                <div className="glass-panel rounded-2xl px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#feb96d]">Focus</p>
                  <p className="mt-2 text-sm font-semibold text-[#ecdfe8]">Applied training, hive practice, rural enterprise</p>
                </div>
              </div>
              <div className="hero-float absolute bottom-[26px] left-[8px] rounded-[2rem] border border-[#ffd485]/26 bg-[linear-gradient(180deg,rgba(255,212,133,0.9)_0%,rgba(254,185,109,0.92)_100%)] px-8 py-7 text-[#3a2000] shadow-[0_32px_70px_rgba(0,0,0,0.3)]">
                <p className="font-display text-6xl font-bold leading-none">40+</p>
                <p className="mt-3 max-w-[220px] text-xs font-black uppercase tracking-[0.2em]">Training and field capability pathways</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
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

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-[#504533] bg-[#1c151c] p-6 shadow-2xl shadow-black/30 lg:grid-cols-[0.72fr_1fr] lg:p-8">
          <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] border border-[#6d582f] bg-[#120c12]">
            <Image
              src="/field-beekeeping.jpg"
              alt="Field beekeeping spotlight"
              fill
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,18,0.08)_0%,rgba(18,12,18,0.45)_100%)]" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#feb96d]">Field Spotlight</p>
            <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-[#ecdfe8] sm:text-5xl">
              Beekeeping practice, captured in the field
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d4c4ac]">
              API CULTURE connects classroom instruction with real-world observation, hive handling, and field-ready
              apiculture methods that learners can carry into rural enterprise and institutional training programs.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-black uppercase tracking-[0.14em] text-[#ffd485]">
              <span className="rounded-full border border-[#6d582f] px-4 py-2">Hands-on learning</span>
              <span className="rounded-full border border-[#6d582f] px-4 py-2">Applied beekeeping</span>
              <span className="rounded-full border border-[#6d582f] px-4 py-2">Field observation</span>
            </div>
          </div>
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
