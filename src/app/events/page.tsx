import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getEvents } from "@/lib/data";
import { getTranslatedEventContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events and Workshops",
  description: "Upcoming and completed apiculture events and workshops at API CULTURE.",
};

export default async function EventsPage() {
  const language = await getRequestLanguage();
  const events = await getEvents();
  const translatedEvents = events.map((event) => getTranslatedEventContent(event, language));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading eyebrow={t(language, "home.events.eyebrow")} title={t(language, "events.page.title")}>
        {t(language, "events.page.body")}
      </SectionHeading>
      <div className="mt-10 grid gap-6">
        {translatedEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.slug}`} className="group relative flex flex-col overflow-hidden rounded-xl border border-[#504533] bg-[#201a20] shadow-xl transition hover:border-[#ffd485]/70 md:flex-row">
            <div className="grid min-h-36 place-items-center border-b border-[#504533] bg-[#2f282e] p-6 text-center md:min-h-48 md:w-64 md:border-b-0 md:border-r md:p-8">
              <div className="hex-clip grid h-24 w-28 place-items-center border border-[#ffd485]/30 bg-[#f4b315]/10 sm:h-28 sm:w-32">
                <span className="font-display text-4xl font-bold text-[#ffd485] sm:text-5xl">{formatDateTime(event.startsAt).slice(0, 2)}</span>
              </div>
            </div>
            <div className="relative flex-1 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#feb96d]">{event.status}</p>
                <h2 className="font-display mt-3 text-2xl font-semibold text-[#ecdfe8] group-hover:text-[#ffd485] sm:text-3xl">{event.title}</h2>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#ffd485]" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm leading-7 text-[#d4c4ac]">{event.summary}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm font-bold text-[#d4c4ac]">
              <span>{formatDateTime(event.startsAt)}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#feb96d]" aria-hidden="true" />{event.location}</span>
            </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
