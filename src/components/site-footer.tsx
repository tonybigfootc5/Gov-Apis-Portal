import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { institute } from "@/lib/fallback-data";
import type { SiteLanguage } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type SiteFooterProps = {
  language: SiteLanguage;
  languageLabel: string;
  languageOptions: Array<{ value: SiteLanguage; label: string }>;
};

export function SiteFooter({ language, languageLabel, languageOptions }: SiteFooterProps) {
  return (
    <footer className="border-t-4 border-[#ebb428] forest-band text-[#faf8f2]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ebb428]">API Culture</p>
          <h2 className="font-display mt-3 text-2xl font-semibold text-[#faf8f2] sm:text-3xl">{institute.legalName}</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#e5e7e3]">{institute.parent}</p>
        </div>
        <div className="space-y-3 text-sm text-[#e5e7e3]">
          <p className="flex gap-3 break-words">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#ebb428]" aria-hidden="true" />
            {institute.address}
          </p>
          <p className="flex flex-wrap gap-3">
            <Phone className="mt-1 h-4 w-4 shrink-0 text-[#ebb428]" aria-hidden="true" />
            {institute.phone.join(" / ")}
          </p>
          <p className="flex break-all gap-3">
            <Mail className="mt-1 h-4 w-4 shrink-0 text-[#ebb428]" aria-hidden="true" />
            {institute.email}
          </p>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <Link href="/programs" className="text-[#e5e7e3] hover:text-[#ebb428]">
            {t(language, "footer.programs")}
          </Link>
          <Link href="/events" className="text-[#e5e7e3] hover:text-[#ebb428]">
            {t(language, "footer.events")}
          </Link>
          <Link href="/contact" className="text-[#e5e7e3] hover:text-[#ebb428]">
            {t(language, "footer.contact")}
          </Link>
        </div>
        <div className="grid content-start gap-3 text-sm text-[#e5e7e3]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ebb428]">Quick actions</p>
          <a href={`tel:${institute.phone[0]}`} className="inline-flex items-center gap-2 hover:text-[#ebb428]">
            <Phone className="h-4 w-4 text-[#ebb428]" aria-hidden="true" />
            Call the center
          </a>
          <a href={`mailto:${institute.email}`} className="inline-flex items-center gap-2 hover:text-[#ebb428]">
            <Mail className="h-4 w-4 text-[#ebb428]" aria-hidden="true" />
            Email the team
          </a>
          <a
            href={institute.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-[#ebb428]"
          >
            <ExternalLink className="h-4 w-4 text-[#ebb428]" aria-hidden="true" />
            Visit official website
          </a>
          <div className="pt-2">
            <LanguageSwitcher
              currentLanguage={language}
              label={languageLabel}
              options={languageOptions}
              variant="footer"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(250,248,242,0.14)] px-4 py-4 text-center text-xs text-[#e5e7e3] sm:px-6 sm:text-sm lg:px-8">
        API CULTURE Technology Center public information portal for training, events, and institutional contact.
      </div>
    </footer>
  );
}
