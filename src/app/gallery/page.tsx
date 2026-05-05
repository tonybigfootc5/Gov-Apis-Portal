import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Gallery",
  description: "API CULTURE gallery and institutional visuals.",
};

const gallery = [
  ["Center signboard", "/honey-house-signboard.jpg"],
  ["Apiary learning space", "/hive-hexagon.svg"],
  ["Training campus", "/honey-house-signboard.jpg"],
];

export default function GalleryPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Gallery" title="Visual record of the center">
        API CULTURE gallery showcases field photos, event documentation, training batches, and infrastructure images from our beekeeping technology center.
      </SectionHeading>
      <div className="mt-10 columns-1 gap-6 md:columns-2 lg:columns-3">
        {gallery.map(([title, src]) => (
          <figure key={title} className="mb-6 break-inside-avoid overflow-hidden rounded-xl border border-[#504533] bg-[#201a20] shadow-xl">
            <Image src={src} alt={title} width={1000} height={563} className="aspect-[4/3] w-full object-cover opacity-90 transition hover:scale-105 hover:opacity-100" />
            <figcaption className="bg-[#2f282e] p-5 text-sm font-black uppercase tracking-[0.14em] text-[#ffd485]">{title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
