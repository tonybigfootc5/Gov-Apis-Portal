import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { getEvent } from "@/lib/data";
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
    description: event?.summary ?? "Honey House event.",
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm font-black text-[#feb96d]">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Events
      </Link>
      <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#feb96d]">{event.status}</p>
      <h1 className="font-display mt-3 text-5xl font-semibold tracking-tight text-[#ffd485] sm:text-6xl">{event.title}</h1>
      <p className="mt-5 text-lg leading-8 text-[#d4c4ac]">{event.summary}</p>
      <div className="glass-panel mt-8 rounded-xl p-6">
        <p className="font-black text-[#ffd485]">{formatDateTime(event.startsAt)}</p>
        <p className="mt-3 inline-flex gap-2 text-sm font-bold text-[#d4c4ac]">
          <MapPin className="h-4 w-4 text-[#feb96d]" aria-hidden="true" />
          {event.location}
        </p>
      </div>
      <div className="mt-8 whitespace-pre-line text-base leading-8 text-[#ecdfe8]">{event.description}</div>
    </article>
  );
}
