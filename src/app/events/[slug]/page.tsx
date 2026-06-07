import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { getEvent } from "@/lib/data";
import { getTranslatedEventContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  return {
    title: event?.title ?? "Event",
    description: event?.summary ?? "API CULTURE event.",
  };
}

export default async function EventDetailPage({ params }: Props) {
  const language = await getRequestLanguage();
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const translatedEvent = getTranslatedEventContent(event, language);

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-6 shadow-[0_28px_70px_rgba(64,44,8,0.08)] sm:p-8 lg:p-10">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm font-black text-[#b36b00]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t(language, "events.back")}
        </Link>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#b36b00]">{translatedEvent.status}</p>
        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[#1b3b2b] sm:text-5xl lg:text-6xl">{translatedEvent.title}</h1>
        <p className="mt-5 text-base leading-7 text-[#516253] sm:text-lg sm:leading-8">{translatedEvent.summary}</p>
        <div className="glass-panel mt-8 rounded-[1.5rem] p-6">
          <p className="font-black text-[#1b3b2b]">{formatDateTime(translatedEvent.startsAt)}</p>
          <p className="mt-3 inline-flex flex-wrap gap-2 text-sm font-bold text-[#516253]">
            <MapPin className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
            {translatedEvent.location}
          </p>
        </div>
        <div className="mt-8 whitespace-pre-line text-base leading-8 text-[#435247]">{translatedEvent.description}</div>
      </div>
    </article>
  );
}
