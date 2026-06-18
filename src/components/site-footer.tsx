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
    <footer className="border-t border-white/8 bg-[#06090f] text-[#f4efe4]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#f2b544]">API CULTURE</p>
          <h2 className="font-display mt-4 text-3xl text-bright">{institute.legalName}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-dim">{institute.parent}</p>
        </div>

        <div className="space-y-4 text-sm text-dim">
          <p className="flex gap-3">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#8ec5ff]" aria-hidden="true" />
            {institute.address}
          </p>
          <p className="flex flex-wrap gap-3">
            <Phone className="mt-1 h-4 w-4 shrink-0 text-[#8ec5ff]" aria-hidden="true" />
            {institute.phone.join(" / ")}
          </p>
          <p className="flex break-all gap-3">
            <Mail className="mt-1 h-4 w-4 shrink-0 text-[#8ec5ff]" aria-hidden="true" />
            {institute.email}
          </p>
        </div>

        <div className="grid content-start gap-3 text-sm">
          <Link href="/programs" className="text-dim transition hover:text-white">
            {t(language, "footer.programs")}
          </Link>
          <Link href="/events" className="text-dim transition hover:text-white">
            {t(language, "footer.events")}
          </Link>
          <Link href="/contact" className="text-dim transition hover:text-white">
            {t(language, "footer.contact")}
          </Link>
        </div>

        <div className="grid content-start gap-3 text-sm text-dim">
          <a href={`tel:${institute.phone[0]}`} className="inline-flex items-center gap-2 transition hover:text-white">
            <Phone className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
            Call the center
          </a>
          <a href={`mailto:${institute.email}`} className="inline-flex items-center gap-2 transition hover:text-white">
            <Mail className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
            Email the team
          </a>
          <a
            href={institute.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            <ExternalLink className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
            Official website
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

      <div className="border-t border-white/8 px-4 py-4 text-center text-xs text-dim sm:px-6 lg:px-8">
        Public enrollment, program information, and institutional contact portal.
      </div>
    </footer>
  );
}
