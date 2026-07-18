import type { Metadata } from "next";
import { TrainingPreviewSwitch, type TrainingPreviewCourse } from "@/components/training-preview-switch";
import { getPrograms } from "@/lib/data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { trainingProgramCatalogBySlug } from "@/lib/training-programs";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Apiculture training programs at API CULTURE.",
};

export default async function ProgramsPage() {
  const language = await getRequestLanguage();
  const programs = await getPrograms();

  const courses: TrainingPreviewCourse[] = programs.slice(0, 4).map((program) => {
    const translatedProgram = getTranslatedProgramContent(program, language);
    const presentation = trainingProgramCatalogBySlug[program.slug];

    return {
      id: program.id,
      slug: program.slug,
      tabLabel: translatedProgram.title,
      title: translatedProgram.title,
      summary: translatedProgram.summary,
      description: translatedProgram.description,
      duration: translatedProgram.duration,
      level: translatedProgram.level,
      fee: translatedProgram.fee ?? t(language, "programs.detail.fallbackFee"),
      capacity: `${translatedProgram.capacity} ${t(language, "programs.seats")}`,
      batchDate: translatedProgram.batchStartsAt ? formatDate(translatedProgram.batchStartsAt) : "Contact the center for start date",
      focusLabel: presentation?.focusLabel ?? translatedProgram.level,
      focusText: presentation?.focusText ?? translatedProgram.summary,
      targetAudience: presentation?.targetAudience ?? "Eligible applicants interested in beekeeping training.",
      imageSrc: presentation?.imageSrc ?? "/training-field-visuals/image2.jpeg",
      imageAlt: presentation?.imageAlt ?? translatedProgram.title,
      outcomes: presentation?.outcomes ?? [],
      skills: presentation?.skills ?? [],
      instructorName: presentation?.instructorName ?? "Api Culture Training Faculty",
      rating: presentation?.rating ?? "4.8",
      ratingLabel: presentation?.ratingLabel ?? "Program reviews",
      experienceLabel: presentation?.experienceLabel ?? translatedProgram.level,
      tools: presentation?.tools ?? [],
      certificate: presentation?.certificate ?? "Physical certificate issued after completion",
      taughtIn: presentation?.taughtIn ?? "English and Telugu",
      testimonial: presentation?.testimonial ?? {
        quote: "Field-led practice made the training practical and clear.",
        name: "Program trainee",
      },
    };
  });

  return <TrainingPreviewSwitch courses={courses} language={language} />;
}
