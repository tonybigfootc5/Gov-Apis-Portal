import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  FileBadge2,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { institute } from "@/lib/fallback-data";
import type { SiteLanguage } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getLocalizedLegalName } from "@/lib/public-content";
import { getSiteCopy } from "@/lib/site-copy";

type SiteFooterProps = {
  language: SiteLanguage;
  languageLabel: string;
  languageOptions: Array<{ value: SiteLanguage; label: string }>;
};

export function SiteFooter({ language }: SiteFooterProps) {
  const copy = getSiteCopy(language);
  const footerCopy = {
    en: {
      terms: "Terms and Conditions",
      privacy: "Privacy Policy",
      refund: "Refund Policy",
      legalName: "API Culture Technology Center (Bee Keeping)",
    },
    te: {
      terms: "నిబంధనలు మరియు షరతులు",
      privacy: "గోప్యతా విధానం",
      refund: "రిఫండ్ విధానం",
      legalName: "API Culture Technology Center (Bee Keeping)",
    },
    hi: {
      terms: "नियम और शर्तें",
      privacy: "गोपनीयता नीति",
      refund: "रिफंड नीति",
      legalName: "API Culture Technology Center (Bee Keeping)",
    },
  }[language];

  const primaryLinks = [
    { href: "/programs", label: t(language, "footer.programs"), icon: GraduationCap },
    { href: "/events", label: t(language, "footer.events"), icon: CalendarDays },
    { href: "/contact", label: t(language, "footer.contact"), icon: Mail },
    { href: "/policies", label: copy.footer.policies, icon: ShieldCheck },
  ] as const;

  const policyLinks = [
    { href: "/terms-and-conditions", label: footerCopy.terms, icon: FileText },
    { href: "/privacy-policy", label: footerCopy.privacy, icon: FileBadge2 },
    { href: "/refund-policy", label: footerCopy.refund, icon: ShieldCheck },
  ] as const;

  const compactLinkClass =
    "inline-flex items-center gap-2 text-sm text-[#55685f] transition hover:text-[#1f352b]";

  return (
    <footer className="border-t border-[rgba(41,56,49,0.08)] bg-[linear-gradient(180deg,rgba(255,252,246,0.94)_0%,rgba(246,238,225,0.98)_100%)] text-[#1f342b]">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,242,232,0.84))] px-5 py-5 shadow-[0_14px_36px_rgba(137,114,75,0.08)] sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.72fr] lg:items-start">
            <div>
              <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
              <span className="relative h-12 w-14 shrink-0 sm:h-14 sm:w-16">
                <Image
                  src="/api-culture-logo-clean.png"
                  alt="API CULTURE honeycomb logo"
                  fill
                  sizes="64px"
                  className="object-contain drop-shadow-[0_10px_24px_rgba(242,181,68,0.16)]"
                />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c77b22]">API CULTURE</p>
                <h2 className="font-display mt-1 max-w-[24rem] text-[clamp(1rem,2vw,1.65rem)] leading-snug text-[#1b3329]">
                  {getLocalizedLegalName(language)}
                </h2>
              </div>
              </div>
              <div className="mt-4 grid gap-2.5 text-sm text-[#5d6d66]">
                <a href={`tel:${institute.phone[0]}`} className={compactLinkClass}>
                  <Phone className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
                  {institute.phone[0]}
                </a>
                <a href={`mailto:${institute.email}`} className={compactLinkClass}>
                  <Mail className="h-4 w-4 text-[#8aa884]" aria-hidden="true" />
                  {institute.email}
                </a>
                <p className="inline-flex items-start gap-2 text-sm text-[#5d6d66]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8ec5ff]" aria-hidden="true" />
                  <span>{institute.address}</span>
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 lg:gap-4">
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#b8842a]">
                  {copy.footer.quickLinksLabel}
                </p>
                <div className="grid gap-2">
              {primaryLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={compactLinkClass}>
                  <Icon className="h-4 w-4 text-[#c77b22]" aria-hidden="true" />
                  {label}
                </Link>
              ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#b8842a]">
                  {copy.footer.policyLinksLabel}
                </p>
                <div className="grid gap-2">
              {policyLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={compactLinkClass}>
                  <Icon className="h-4 w-4 text-[#6b87a3]" aria-hidden="true" />
                  {label}
                </Link>
              ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] bg-[rgba(255,255,255,0.48)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b8842a]">
                  {copy.footer.socialLabel}
                </p>
                <Link
                  href="/admin"
                  aria-label={t(language, "nav.admin")}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.86)] text-[#244236] shadow-[0_8px_18px_rgba(137,114,75,0.08)] transition hover:bg-white"
                >
                  <UserCircle className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-4 grid gap-3">
                <a
                  href="https://www.instagram.com/honey2health/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[rgba(255,255,255,0.68)] px-3 py-2 text-sm font-medium text-[#55685f] transition hover:bg-white hover:text-[#1f352b]"
                >
                  <span className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image src="/instagram-icon.png" alt="Instagram" fill sizes="32px" className="object-cover" />
                  </span>
                  <span>{copy.footer.instagramHandle}</span>
                </a>
                <a
                  href="https://www.youtube.com/@ApiCultureTechCenter"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[rgba(255,255,255,0.68)] px-3 py-2 text-sm font-medium text-[#55685f] transition hover:bg-white hover:text-[#1f352b]"
                >
                  <span className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
                    <Image src="/youtube-icon.png" alt="YouTube" fill sizes="32px" className="object-cover" />
                  </span>
                  <span>{copy.footer.youtubeHandle}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-center text-xs text-[#687870] sm:flex-row sm:items-center sm:justify-end sm:gap-6 sm:text-right">
          <p className="font-semibold uppercase tracking-[0.14em] text-[#c77b22]">{copy.footer.designedDevelopedBy}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-end">
            <a href="tel:+9199087909008" className="transition hover:text-[#1f352b]">
              Rahul: (+91) 99087909008
            </a>
            <a href="tel:+916309465575" className="transition hover:text-[#1f352b]">
              Gowtham: (+91) 630 946 5575
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
