import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "Gallery",
  description: "API CULTURE gallery and institutional visuals.",
};

const gallery = [
  ["Center signboard", "/honey-house-signboard.jpg"],
  ["Field beekeeping", "/field-beekeeping.jpg"],
  ["Scientific beekeeping foundation", "/scientific-foundation-bg.jpg"],
  ["Queen rearing and colony multiplication", "/queen-rearing-bg.jpg"],
];

export default async function GalleryPage() {
  const language = await getRequestLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-end">
        <SectionHeading eyebrow={t(language, "gallery.eyebrow")} title={t(language, "gallery.title")}>
          {t(language, "gallery.body")}
        </SectionHeading>
        <div className="rounded-[2rem] border border-[#504533] bg-[#1a141a] p-6 text-sm leading-7 text-[#d4c4ac] shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#feb96d]">Visual record</p>
          <p className="mt-4">The gallery now shows real campus and field imagery instead of filler visuals, so the page supports trust rather than looking like placeholder inventory.</p>
        </div>
      </div>
      <div className="mt-10 columns-1 gap-5 sm:gap-6 md:columns-2 lg:columns-3">
        {gallery.map(([title, src], index) => (
          <figure key={title} className="mb-5 break-inside-avoid overflow-hidden rounded-xl border border-[#504533] bg-[#201a20] shadow-xl sm:mb-6">
            <Image src={src} alt={title} width={1000} height={563} className="aspect-[4/3] w-full object-cover opacity-90 transition hover:scale-105 hover:opacity-100" />
            <figcaption className="bg-[#2f282e] p-4 text-xs font-black uppercase tracking-[0.12em] text-[#ffd485] sm:p-5 sm:text-sm sm:tracking-[0.14em]">{t(language, `gallery.image${index + 1}`)}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
