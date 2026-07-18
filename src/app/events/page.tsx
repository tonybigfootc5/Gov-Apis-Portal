import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftCircle, ArrowRight, CalendarDays, Grid2X2, List, MapPin } from "lucide-react";
import { getEvents } from "@/lib/data";
import { fallbackEvents } from "@/lib/fallback-data";
import { getTranslatedEventContent } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events and Workshops",
  description: "Upcoming and completed apiculture events and workshops at API CULTURE.",
};

const eventImages = [
  "/card-backgrounds/events-and-workshops.png",
  "/training-field-visuals/image6.jpeg",
  "/training-field-visuals/image2.jpeg",
  "/field-beekeeping.jpg",
] as const;

export default async function EventsPage() {
  const language = await getRequestLanguage();
  const events = await getEvents();
  const displayEvents = events.length > 0 ? events : fallbackEvents;
  const translatedEvents = displayEvents.map((event) => getTranslatedEventContent(event, language));

  return (
    <section className="bg-[#f8faf7] text-[#242824]">
      <div className="relative min-h-[31rem] overflow-hidden bg-[#111714]">
        <Image
          src="/events-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,16,0.38),rgba(12,16,16,0.58)_45%,rgba(12,16,16,0.82))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.22),rgba(255,255,255,0)_31%)]" />

        <div className="relative z-10 mx-auto flex min-h-[31rem] max-w-7xl flex-col items-center justify-center px-4 pb-12 pt-28 text-center sm:px-6 lg:px-8">
          <h1 className="text-[clamp(3.4rem,8vw,7.8rem)] font-black uppercase leading-none tracking-[0.34em] text-white">
            Events
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 border-b border-[#d9ddd3] pb-10">
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#59645d]">Upcoming Events</h2>
          <div className="hidden items-center gap-9 text-xs font-black uppercase tracking-[0.08em] text-[#a5aaa4] md:flex">
            <span className="grid justify-items-center gap-2 text-[#55b8a3]">
              <List className="h-7 w-7" aria-hidden="true" />
              List
            </span>
            <span className="grid justify-items-center gap-2">
              <Grid2X2 className="h-7 w-7" aria-hidden="true" />
              Month
            </span>
          </div>
        </div>

        <div>
          {translatedEvents.map((event, index) => {
            const date = new Date(event.startsAt);
            const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
            const day = date.toLocaleString("en-US", { day: "2-digit" });
            const imageSrc = eventImages[index % eventImages.length];

            return (
              <article key={event.id} className="grid gap-8 border-b border-[#d9ddd3] py-14 lg:grid-cols-[6rem_1fr_1fr] lg:gap-12">
                <div className="flex items-start gap-5 lg:block">
                  <p className="text-2xl font-black uppercase tracking-[0.18em] text-[#666d68]">{month}</p>
                  <span className="mt-3 hidden h-px w-8 bg-[#c5c9c1] lg:block" />
                  <p className="text-6xl font-black leading-none tracking-[-0.05em] text-[#5b615d]">{day}</p>
                </div>

                <div className="relative min-h-[18rem] overflow-hidden bg-[#dfe4dc]">
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 36rem, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">{event.status}</p>
                  <h3 className="mt-3 text-[clamp(2rem,3vw,3.2rem)] font-bold leading-tight tracking-[-0.04em] text-[#5a5e5b]">
                    {event.title}
                  </h3>
                  <div className="mt-4 grid gap-2 text-lg font-semibold leading-7 text-[#7b817c]">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                      {event.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                      {formatDateTime(event.startsAt)}
                    </span>
                  </div>
                  <p className="mt-6 max-w-xl text-base leading-8 text-[#626963]">{event.summary}</p>
                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-7 inline-flex items-center justify-between gap-8 border-t border-[#cfd4cc] pt-6 text-lg font-bold text-[#626963] transition hover:text-[#b36b00]"
                  >
                    View Event Details
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <Link href="/articles" className="mt-14 inline-flex items-center gap-4 text-2xl font-bold tracking-[-0.03em] text-[#6a706c] transition hover:text-[#b36b00]">
          <ArrowLeftCircle className="h-8 w-8" aria-hidden="true" />
          Previous Events
        </Link>
      </div>
    </section>
  );
}
