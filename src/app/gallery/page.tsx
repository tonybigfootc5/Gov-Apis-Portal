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
  ["Apiary learning space", "/hive-hexagon.svg"],
  ["Training campus", "/honey-house-signboard.jpg"],
];

export default async function GalleryPage() {
  const language = await getRequestLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading eyebrow={t(language, "gallery.eyebrow")} title={t(language, "gallery.title")}>
        {t(language, "gallery.body")}
      </SectionHeading>
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
