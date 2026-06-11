import type { Metadata } from "next";
import { GalleryExperience } from "@/components/gallery-experience";
import { getGalleryImages } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "Gallery",
  description: "API CULTURE gallery and institutional visuals.",
};

export default async function GalleryPage() {
  const language = await getRequestLanguage();
  const images = await getGalleryImages();

  return (
    <GalleryExperience
      eyebrow={t(language, "gallery.eyebrow")}
      title={t(language, "gallery.title")}
      subtitle={t(language, "gallery.body")}
      items={images.map((image) => ({
        id: image.id,
        url: image.url,
        caption: image.caption,
        date: image.date.toISOString(),
        place: image.place,
        category: image.category,
        year: image.year,
      }))}
    />
  );
}
