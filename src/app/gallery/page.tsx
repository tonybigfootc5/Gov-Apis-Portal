import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Honey House gallery and institutional visuals.",
};

const gallery = [
  ["Center signboard", "/honey-house-signboard.jpg"],
  ["Apiary learning space", "/honey-house-signboard.jpg"],
  ["Training campus", "/honey-house-signboard.jpg"],
];

export default function GalleryPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Gallery" title="Visual record of the center">
        The gallery is ready for real field photos, event documentation, training batches, and infrastructure images.
      </SectionHeading>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {gallery.map(([title, src]) => (
          <figure key={title} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <Image src={src} alt={title} width={1000} height={563} className="aspect-[4/3] w-full object-cover" />
            <figcaption className="p-4 text-sm font-black text-emerald-950">{title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
