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
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm font-black text-amber-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Events
      </Link>
      <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-amber-700">{event.status}</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl">{event.title}</h1>
      <p className="mt-5 text-lg leading-8 text-stone-700">{event.summary}</p>
      <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="font-black text-emerald-950">{formatDateTime(event.startsAt)}</p>
        <p className="mt-3 inline-flex gap-2 text-sm font-bold text-stone-700">
          <MapPin className="h-4 w-4 text-amber-700" aria-hidden="true" />
          {event.location}
        </p>
      </div>
      <div className="mt-8 whitespace-pre-line text-base leading-8 text-stone-800">{event.description}</div>
    </article>
  );
}
