import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getEvents } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events and Workshops",
  description: "Upcoming and completed apiculture events and workshops at Honey House.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Events" title="Workshops, orientations, and field sessions">
        Publish timely events with structured status, dates, locations, and detailed public pages.
      </SectionHeading>
      <div className="mt-8 grid gap-5">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.slug}`} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">{event.status}</p>
                <h2 className="mt-3 text-2xl font-black text-emerald-950">{event.title}</h2>
              </div>
              <ArrowRight className="h-5 w-5 text-stone-500" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-700">{event.summary}</p>
            <div className="mt-5 flex flex-wrap gap-5 text-sm font-bold text-stone-700">
              <span>{formatDateTime(event.startsAt)}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-700" aria-hidden="true" />{event.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
