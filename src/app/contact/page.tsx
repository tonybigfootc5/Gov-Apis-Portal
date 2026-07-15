import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { institute } from "@/lib/fallback-data";
import { t } from "@/lib/i18n";
import { getLocalizedLegalName } from "@/lib/public-content";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact API CULTURE Technology Center.",
};

export default async function ContactPage() {
  const language = await getRequestLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <SectionHeading eyebrow={t(language, "contact.eyebrow")} title={t(language, "contact.title")}>
            {t(language, "contact.body")}
          </SectionHeading>
          <div className="paper-panel mt-10 rounded-[2rem] p-5 text-sm leading-7 text-[#516253] sm:p-6">
            <p className="font-display text-xl font-semibold leading-tight text-[#1b3b2b] sm:text-2xl">
              {getLocalizedLegalName(language)}
            </p>
            <p className="mt-3">{institute.address}</p>
            <p className="mt-3 break-words">
              {t(language, "contact.phone")}: {institute.phone.join(" / ")}
            </p>
            <p className="break-all">
              {t(language, "contact.email")}: {institute.email}
            </p>
          </div>
        </div>
        <ContactForm language={language} />
      </div>
    </section>
  );
}
