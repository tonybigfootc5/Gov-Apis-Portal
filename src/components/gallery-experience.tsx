"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { galleryCategoryOptions, getGalleryCategoryLabel } from "@/lib/gallery";

type GalleryExperienceItem = {
  id: string;
  url: string;
  caption: string;
  date: string;
  place: string | null;
  category: string;
  year: number;
};

const aspectClasses = [
  "aspect-[4/5]",
  "aspect-[5/4]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[5/6]",
  "aspect-[16/11]",
];

export function GalleryExperience({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: GalleryExperienceItem[];
}) {
  const [category, setCategory] = useState<string>("ALL");
  const [year, setYear] = useState<number | "ALL">("ALL");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const years = useMemo(
    () => Array.from(new Set(items.map((item) => item.year))).sort((left, right) => right - left),
    [items],
  );

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === "ALL" || item.category === category) &&
          (year === "ALL" || item.year === year),
      ),
    [category, items, year],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (activeIndex === null) return;
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((current) => (current === null ? null : (current + 1) % filteredItems.length));
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current === null ? null : (current - 1 + filteredItems.length) % filteredItems.length));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, filteredItems.length]);

  const normalizedActiveIndex =
    activeIndex === null || !filteredItems.length ? null : Math.min(activeIndex, filteredItems.length - 1);
  const activeItem = normalizedActiveIndex === null ? null : filteredItems[normalizedActiveIndex] ?? null;

  return (
    <section className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[rgba(27,59,43,0.08)] bg-[linear-gradient(135deg,rgba(255,253,248,0.98),rgba(245,238,223,0.98))] p-6 shadow-[0_26px_70px_rgba(64,44,8,0.08)] sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,180,40,0.18),transparent_24rem),radial-gradient(circle_at_bottom_left,rgba(27,59,43,0.08),transparent_24rem)]" />
          <div className="relative">
            <div className="max-w-5xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b36b00]">{eyebrow}</p>
              <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-[#1b3b2b] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#516253] sm:text-lg">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] p-4 shadow-[0_18px_40px_rgba(64,44,8,0.06)] sm:p-5">
          <div className="flex flex-wrap gap-3">
            <FilterChip active={category === "ALL"} onClick={() => setCategory("ALL")}>
              All
            </FilterChip>
            {galleryCategoryOptions.map((option) => (
              <FilterChip
                key={option.value}
                active={category === option.value}
                onClick={() => setCategory(option.value)}
              >
                {option.label}
              </FilterChip>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 border-t border-[rgba(27,59,43,0.08)] pt-4">
            <FilterChip active={year === "ALL"} onClick={() => setYear("ALL")}>
              All years
            </FilterChip>
            {years.map((option) => (
              <FilterChip key={option} active={year === option} onClick={() => setYear(option)}>
                {option}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 2xl:columns-4">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffdf8] text-left shadow-[0_20px_48px_rgba(64,44,8,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(64,44,8,0.12)]"
            >
              <div className={`relative w-full overflow-hidden ${aspectClasses[index % aspectClasses.length]}`}>
                <Image
                  src={item.url}
                  alt={item.caption}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,14,0)_35%,rgba(12,18,14,0.28)_100%)]" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f4eddf] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#b36b00]">
                    {getGalleryCategoryLabel(item.category)}
                  </span>
                  <span className="rounded-full bg-[#eef4ef] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#21533f]">
                    {item.year}
                  </span>
                </div>
                <p className="text-base font-semibold leading-7 text-[#1b3b2b]">{item.caption}</p>
                <div className="grid gap-2 text-sm text-[#607366] sm:grid-cols-2">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                    {formatGalleryDate(item.date)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#b36b00]" aria-hidden="true" />
                    {item.place || "API CULTURE campus"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {!filteredItems.length ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[rgba(27,59,43,0.14)] bg-[#fffdf8] px-6 py-12 text-center text-[#607366]">
            No gallery images match the current filters.
          </div>
        ) : null}
      </div>

      {activeItem ? (
        <div className="fixed inset-0 z-50 bg-[rgba(11,18,15,0.88)] px-4 py-6 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex h-full max-w-7xl flex-col">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#f7e7b0]">
                {getGalleryCategoryLabel(activeItem.category)}
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[4.5rem_minmax(0,1fr)_23rem_4.5rem] lg:items-center">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null ? 0 : (current - 1 + filteredItems.length) % filteredItems.length,
                  )
                }
                className="hidden h-14 w-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white lg:inline-flex"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="relative min-h-[24rem] overflow-hidden rounded-[2.2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]">
                <Image
                  src={activeItem.url}
                  alt={activeItem.caption}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              <aside className="rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)] p-6 text-[#f5f1e3] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f0c65c]">Image details</p>
                <h2 className="font-display mt-4 text-3xl font-semibold leading-tight">{activeItem.caption}</h2>
                <dl className="mt-6 grid gap-4 text-sm leading-7 text-[#e2e7e3]">
                  <div>
                    <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f0c65c]">Date</dt>
                    <dd>{formatGalleryDate(activeItem.date)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f0c65c]">Time</dt>
                    <dd>{formatGalleryTime(activeItem.date)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f0c65c]">Place</dt>
                    <dd>{activeItem.place || "API CULTURE Technology Center"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f0c65c]">Archive group</dt>
                    <dd>{getGalleryCategoryLabel(activeItem.category)}</dd>
                  </div>
                </dl>
              </aside>

              <button
                type="button"
                onClick={() =>
                  setActiveIndex((current) => (current === null ? 0 : (current + 1) % filteredItems.length))
                }
                className="hidden h-14 w-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white lg:inline-flex"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current === null ? 0 : (current - 1 + filteredItems.length) % filteredItems.length))}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((current) => (current === null ? 0 : (current + 1) % filteredItems.length))}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-sm font-black tracking-[0.08em] transition ${
        active
          ? "bg-[#1b3b2b] text-[#faf8f2] shadow-[0_14px_26px_rgba(27,59,43,0.16)]"
          : "bg-[#f6efe3] text-[#1b3b2b] hover:bg-[#eadfca]"
      }`}
    >
      {children}
    </button>
  );
}

function formatGalleryDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatGalleryTime(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
