import type { SiteLanguage } from "@/lib/i18n";

export const galleryCategoryOptions = [
  { value: "TRAINING_PROGRAMS", label: "Training Programs" },
  { value: "FIELD_VISITS", label: "Field Visits" },
  { value: "AWARENESS_EVENTS", label: "Awareness & Events" },
  { value: "DIGNITARIES_VISITS", label: "Dignitaries Visits" },
  { value: "CAMPUS_INFRASTRUCTURE", label: "Campus & Infrastructure" },
  { value: "BEE_HIVE_PRODUCTS", label: "Bee Hive Products" },
] as const;

export type GalleryCategory = (typeof galleryCategoryOptions)[number]["value"];

const localizedGalleryCategoryLabels: Partial<Record<SiteLanguage, Record<string, string>>> = {
  te: {
    TRAINING_PROGRAMS: "శిక్షణ కార్యక్రమాలు",
    FIELD_VISITS: "ఫీల్డ్ సందర్శనలు",
    AWARENESS_EVENTS: "అవగాహన & ఈవెంట్లు",
    DIGNITARIES_VISITS: "గౌరవ అతిథుల సందర్శనలు",
    CAMPUS_INFRASTRUCTURE: "క్యాంపస్ & మౌలిక సదుపాయాలు",
    BEE_HIVE_PRODUCTS: "బీ హైవ్ ఉత్పత్తులు",
  },
  hi: {
    TRAINING_PROGRAMS: "प्रशिक्षण कार्यक्रम",
    FIELD_VISITS: "फील्ड विज़िट",
    AWARENESS_EVENTS: "जागरूकता और कार्यक्रम",
    DIGNITARIES_VISITS: "विशिष्ट अतिथि दौरे",
    CAMPUS_INFRASTRUCTURE: "परिसर और अवसंरचना",
    BEE_HIVE_PRODUCTS: "मधुमक्खी छत्ता उत्पाद",
  },
};

export function getGalleryCategoryLabel(category: string, language: SiteLanguage = "en") {
  return (
    localizedGalleryCategoryLabels[language]?.[category] ??
    galleryCategoryOptions.find((option) => option.value === category)?.label ??
    category
  );
}
