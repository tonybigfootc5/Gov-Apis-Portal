import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, MessageSquareText } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { getEvents } from "@/lib/data";
import { getTranslatedEventContent, t, type SiteLanguage } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events and Workshops",
  description: "Upcoming and completed apiculture events and workshops at API CULTURE.",
};

export default async function EventsPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      help: "How these pages help",
      dates: "Dates are visible before contact or travel planning.",
      location: "Location is included for public and institutional visitors.",
      nextStep: "The next step is clear: see details, then contact the center.",
    },
    te: {
      help: "ఈ పేజీలు ఎలా సహాయపడతాయి",
      dates: "సంప్రదింపు లేదా ప్రయాణ ప్రణాళికకు ముందే తేదీలు స్పష్టంగా కనిపిస్తాయి.",
      location: "ప్రజలు మరియు సంస్థాగత సందర్శకుల కోసం ప్రదేశం కూడా చూపబడుతుంది.",
      nextStep: "తదుపరి చర్య స్పష్టంగా ఉంటుంది: వివరాలు చూడండి, తరువాత కేంద్రాన్ని సంప్రదించండి.",
    },
    hi: {
      help: "ये पेज कैसे मदद करते हैं",
      dates: "संपर्क या यात्रा योजना से पहले तिथियां साफ दिखाई देती हैं।",
      location: "सार्वजनिक और संस्थागत आगंतुकों के लिए स्थान भी शामिल है।",
      nextStep: "अगला कदम स्पष्ट है: विवरण देखें, फिर केंद्र से संपर्क करें।",
    },
  } satisfies Record<SiteLanguage, Record<string, string>>;
  const pageCopy = copy[language];
  const events = await getEvents();
  const translatedEvents = events.map((event) => getTranslatedEventContent(event, language));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-end">
        <SectionHeading eyebrow={t(language, "home.events.eyebrow")} title={t(language, "events.page.title")}>
          {t(language, "events.page.body")}
        </SectionHeading>
        <div className="paper-panel rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">{pageCopy.help}</p>
          <div className="mt-5 grid gap-4 text-sm leading-7 text-[#516253]">
            <p className="inline-flex items-center gap-3"><CalendarDays className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />{pageCopy.dates}</p>
            <p className="inline-flex items-center gap-3"><MapPin className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />{pageCopy.location}</p>
            <p className="inline-flex items-center gap-3"><MessageSquareText className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />{pageCopy.nextStep}</p>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-6">
        {translatedEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.slug}`} className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] shadow-[0_24px_50px_rgba(64,44,8,0.08)] transition hover:border-[#b36b00]/40 md:flex-row">
            <div className="grid min-h-36 place-items-center border-b border-[rgba(27,59,43,0.12)] bg-[#f6efe4] p-6 text-center md:min-h-48 md:w-64 md:border-b-0 md:border-r md:p-8">
              <div className="hex-clip grid h-24 w-28 place-items-center border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] sm:h-28 sm:w-32">
                <span className="font-display text-4xl font-bold text-[#b36b00] sm:text-5xl">{formatDateTime(event.startsAt).slice(0, 2)}</span>
              </div>
            </div>
            <div className="relative flex-1 p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">{event.status}</p>
                  <h2 className="font-display mt-3 text-2xl font-semibold text-[#1b3b2b] group-hover:text-[#b36b00] sm:text-3xl">{event.title}</h2>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#b36b00]" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#516253]">{event.summary}</p>
              <div className="mt-6 flex flex-wrap gap-5 text-sm font-bold text-[#516253]">
                <span>{formatDateTime(event.startsAt)}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />{event.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
