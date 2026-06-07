import type { Metadata } from "next";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { institute } from "@/lib/fallback-data";
import { t } from "@/lib/i18n";
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
          <div className="glass-panel mt-10 rounded-[2rem] p-5 text-sm leading-7 text-[#d4c4ac] sm:p-6">
            <p className="font-display text-xl font-semibold text-[#ffd485] sm:text-2xl">{institute.legalName}</p>
            <p className="mt-3">{institute.address}</p>
            <p className="mt-3 break-words">{t(language, "contact.phone")}: {institute.phone.join(" / ")}</p>
            <p className="break-all">{t(language, "contact.email")}: {institute.email}</p>
            <p className="break-all">{t(language, "contact.website")}: {institute.website}</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <a href={`tel:${institute.phone[0]}`} className="rounded-2xl border border-[#504533] bg-[#1a141a] p-4 text-sm text-[#d4c4ac] transition hover:border-[#ffd485] hover:text-[#ffd485]">
              <Phone className="h-5 w-5 text-[#ffd485]" aria-hidden="true" />
              <p className="mt-3 font-semibold text-[#f7efe8]">Call</p>
              <p className="mt-2">Speak with the center office directly.</p>
            </a>
            <a href={`mailto:${institute.email}`} className="rounded-2xl border border-[#504533] bg-[#1a141a] p-4 text-sm text-[#d4c4ac] transition hover:border-[#ffd485] hover:text-[#ffd485]">
              <Mail className="h-5 w-5 text-[#ffd485]" aria-hidden="true" />
              <p className="mt-3 font-semibold text-[#f7efe8]">Email</p>
              <p className="mt-2">Send program or partnership questions.</p>
            </a>
            <a href={institute.website} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#504533] bg-[#1a141a] p-4 text-sm text-[#d4c4ac] transition hover:border-[#ffd485] hover:text-[#ffd485]">
              <ExternalLink className="h-5 w-5 text-[#ffd485]" aria-hidden="true" />
              <p className="mt-3 font-semibold text-[#f7efe8]">Website</p>
              <p className="mt-2">Open the official public domain.</p>
            </a>
          </div>
        </div>
        <ContactForm language={language} />
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-[#504533] bg-[#1a141a] p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#feb96d]">Training inquiries</p>
          <p className="mt-4 text-sm leading-7 text-[#d4c4ac]">Use the form when you want details about program availability, eligibility, or batch planning.</p>
        </div>
        <div className="rounded-[2rem] border border-[#504533] bg-[#1a141a] p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#feb96d]">Institutional visits</p>
          <p className="mt-4 text-sm leading-7 text-[#d4c4ac]">Partner organizations can reach out for orientations, collaborations, or field exposure requests.</p>
        </div>
        <div className="rounded-[2rem] border border-[#504533] bg-[#1a141a] p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#feb96d]">Preferred path</p>
          <p className="mt-4 text-sm leading-7 text-[#d4c4ac]">Call for urgent coordination, email for documents, and use the form for structured requests.</p>
        </div>
      </div>
    </section>
  );
}
