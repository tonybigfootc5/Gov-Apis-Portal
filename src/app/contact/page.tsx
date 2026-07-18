import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
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
  const legalName = getLocalizedLegalName(language);
  const phoneLabel = institute.phone.join(" / ");

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#ece8de] bg-[#f4f3ee] shadow-[0_28px_80px_rgba(30,34,28,0.12)]">
        <div className="grid gap-10 px-8 pb-16 pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-20 lg:pt-14">
          <div className="flex min-h-[29rem] flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ecebe6] px-3 py-2 text-sm font-semibold text-[#171a16]">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {t(language, "contact.eyebrow")}
              </span>
              <h1 className="mt-6 text-[clamp(3rem,6vw,5.6rem)] font-black leading-[0.86] tracking-[-0.06em] text-[#121512]">
                {t(language, "contact.title")}
              </h1>
            </div>

            <div className="grid gap-5 text-[#171a16]">
              <ContactLine icon={<MapPin className="h-5 w-5" aria-hidden="true" />} title="Center location">
                {institute.address}
              </ContactLine>
              <ContactLine icon={<Phone className="h-5 w-5" aria-hidden="true" />} title={t(language, "contact.phone")}>
                {phoneLabel}
              </ContactLine>
              <ContactLine icon={<Mail className="h-5 w-5" aria-hidden="true" />} title={t(language, "contact.email")}>
                {institute.email}
              </ContactLine>
            </div>
          </div>

          <div className="self-start">
            <ContactForm language={language} variant="contactPage" />
          </div>
        </div>

        <div className="px-8 pb-20 lg:px-10">
          <div className="relative min-h-[34rem] overflow-hidden rounded-[1.4rem] bg-[#172319]">
            <Image
              src="/contact-center-visual.jpg"
              alt="API CULTURE contact center visual"
              fill
              sizes="(min-width: 1024px) 76rem, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,16,0.04),rgba(10,22,16,0.32))]" />
            <div className="absolute bottom-6 left-6 max-w-md rounded-[1.2rem] border border-white/25 bg-white/18 p-5 text-white shadow-[0_20px_44px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f6cf74]">{legalName}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLine({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ecebe6] text-[#171a16]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-base font-black">{title}</span>
        <span className="mt-1 block break-words text-base leading-6 text-[#464942]">{children}</span>
      </span>
    </div>
  );
}
