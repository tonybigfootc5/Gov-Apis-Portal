export const galleryCategoryOptions = [
  { value: "TRAINING_PROGRAMS", label: "Training Programs" },
  { value: "FIELD_VISITS", label: "Field Visits" },
  { value: "AWARENESS_EVENTS", label: "Awareness & Events" },
  { value: "DIGNITARIES_VISITS", label: "Dignitaries Visits" },
  { value: "CAMPUS_INFRASTRUCTURE", label: "Campus & Infrastructure" },
  { value: "BEE_HIVE_PRODUCTS", label: "Bee Hive Products" },
] as const;

export type GalleryCategory = (typeof galleryCategoryOptions)[number]["value"];

export function getGalleryCategoryLabel(category: string) {
  return galleryCategoryOptions.find((option) => option.value === category)?.label ?? category;
}
