import Image from "next/image";
import { ExternalLink, Mail, Microscope, Phone, ShieldCheck, Sprout } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { institute } from "@/lib/fallback-data";
import type { SiteLanguage } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const gallery = [
  ["Center signboard", "/honey-house-signboard.jpg"],
  ["Field beekeeping", "/field-beekeeping.jpg"],
  ["Scientific beekeeping foundation", "/scientific-foundation-bg.jpg"],
  ["Queen rearing and colony multiplication", "/queen-rearing-bg.jpg"],
] as const;

export function HomeAboutSection({ language }: { language: SiteLanguage }) {
  const principles = [
    {
      icon: Sprout,
      title: "Field-first learning",
      body: "Training is tied to practice, observation, and rural enterprise relevance.",
    },
    {
      icon: Microscope,
      title: "Scientific beekeeping",
      body: "The center supports structured instruction rather than informal guesswork.",
    },
    {
      icon: ShieldCheck,
      title: "Institutional continuity",
      body: "The site and the center both need to feel dependable, official, and maintained.",
    },
  ] as const;

  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <SectionHeading eyebrow={t(language, "about.eyebrow")} title={t(language, "about.title")}>
            {t(language, "about.body")}
          </SectionHeading>
          <div className="mt-8 grid gap-5 border-l-4 border-[#ebb428] pl-4 text-base leading-8 text-[#516253] sm:mt-10 sm:pl-6">
            <p>{t(language, "about.copy1")}</p>
            <p>{t(language, "about.copy2")}</p>
            <p>{t(language, "about.copy3")}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://www.apiculture.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.16)] bg-[#fffdf8] px-5 py-3 text-sm font-semibold text-[#1b3b2b] transition hover:border-[#1b3b2b]"
            >
              Visit official website
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] shadow-[0_28px_70px_rgba(64,44,8,0.08)]">
            <Image src="/honey-house-signboard.jpg" alt="API CULTURE center signboard" width={1000} height={563} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(27,59,43,0)_0%,rgba(27,59,43,0.9)_100%)] px-6 pb-6 pt-16">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ebb428]">Institutional campus</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#faf8f2]">
                A public-facing technology center needs clarity, permanence, and trust in both its physical and digital presence.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, body }) => (
              <div key={title} className="paper-panel rounded-[2rem] p-5">
                <Icon className="h-6 w-6 text-[#b36b00]" aria-hidden="true" />
                <h3 className="font-display mt-4 text-2xl text-[#1b3b2b]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#516253]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeGallerySection({ language }: { language: SiteLanguage }) {
  return (
    <section id="gallery" className="border-y border-[rgba(27,59,43,0.1)] bg-[#f3ecdf] py-20 scroll-mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <SectionHeading eyebrow={t(language, "gallery.eyebrow")} title={t(language, "gallery.title")}>
            {t(language, "gallery.body")}
          </SectionHeading>
          <div className="paper-panel rounded-[2rem] p-6 text-sm leading-7 text-[#516253]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">Visual record</p>
            <p className="mt-4">
              The homepage gallery keeps visitors on one page while still showing the real campus and field imagery that builds trust.
            </p>
          </div>
        </div>
        <div className="mt-10 columns-1 gap-5 sm:gap-6 md:columns-2 lg:columns-4">
          {gallery.map(([title, src], index) => (
            <figure key={title} className="paper-panel mb-5 break-inside-avoid overflow-hidden rounded-[2rem] sm:mb-6">
              <Image src={src} alt={title} width={1000} height={563} className="aspect-[4/3] w-full object-cover opacity-95 transition hover:scale-105 hover:opacity-100" />
              <figcaption className="bg-[#f6efe4] p-4 text-xs font-black uppercase tracking-[0.12em] text-[#1b3b2b] sm:p-5 sm:text-sm sm:tracking-[0.14em]">
                {t(language, `gallery.image${index + 1}`)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeContactSection({ language }: { language: SiteLanguage }) {
  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <SectionHeading eyebrow={t(language, "contact.eyebrow")} title={t(language, "contact.title")}>
            {t(language, "contact.body")}
          </SectionHeading>
          <div className="paper-panel mt-10 rounded-[2rem] p-5 text-sm leading-7 text-[#516253] sm:p-6">
            <p className="font-display text-xl font-semibold text-[#1b3b2b] sm:text-2xl">{institute.legalName}</p>
            <p className="mt-3">{institute.address}</p>
            <p className="mt-3 break-words">
              {t(language, "contact.phone")}: {institute.phone.join(" / ")}
            </p>
            <p className="break-all">
              {t(language, "contact.email")}: {institute.email}
            </p>
            <p className="break-all">
              {t(language, "contact.website")}: {institute.website}
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <a href={`tel:${institute.phone[0]}`} className="paper-panel rounded-[1.5rem] p-4 text-sm text-[#516253] transition hover:border-[#b36b00]/40">
              <Phone className="h-5 w-5 text-[#b36b00]" aria-hidden="true" />
              <p className="mt-3 font-semibold text-[#1b3b2b]">Call</p>
            </a>
            <a href={`mailto:${institute.email}`} className="paper-panel rounded-[1.5rem] p-4 text-sm text-[#516253] transition hover:border-[#b36b00]/40">
              <Mail className="h-5 w-5 text-[#b36b00]" aria-hidden="true" />
              <p className="mt-3 font-semibold text-[#1b3b2b]">Email</p>
            </a>
            <a href={institute.website} target="_blank" rel="noreferrer" className="paper-panel rounded-[1.5rem] p-4 text-sm text-[#516253] transition hover:border-[#b36b00]/40">
              <ExternalLink className="h-5 w-5 text-[#b36b00]" aria-hidden="true" />
              <p className="mt-3 font-semibold text-[#1b3b2b]">Website</p>
            </a>
          </div>
        </div>
        <ContactForm language={language} />
      </div>
    </section>
  );
}
