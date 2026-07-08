import type { Metadata } from "next";
import { GalleryExperience } from "@/components/gallery-experience";
import { getGalleryImages } from "@/lib/data";
import { getLocalizedGalleryItem } from "@/lib/public-content";
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
      language={language}
      items={images.map((image) => {
        const localizedImage = getLocalizedGalleryItem(image, language);
        return {
          id: localizedImage.id,
          url: localizedImage.url,
          caption: localizedImage.caption,
          date: localizedImage.date.toISOString(),
          place: localizedImage.place,
          category: localizedImage.category,
          year: localizedImage.year,
        };
      })}
    />
  );
}
