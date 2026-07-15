"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const copy = getSiteCopy(language);
  const footerCopy = {
    en: {
      terms: "Terms and Conditions",
      privacy: "Privacy Policy",
      refund: "Refund Policy",
    },
    te: {
      terms: "à°¨à°¿à°¬à°‚à°§à°¨à°²à± à°®à°°à°¿à°¯à± à°·à°°à°¤à±à°²à±",
      privacy: "à°—à±‹à°ªà±à°¯à°¤à°¾ à°µà°¿à°§à°¾à°¨à°‚",
      refund: "à°°à°¿à°«à°‚à°¡à± à°µà°¿à°§à°¾à°¨à°‚",
    },
    hi: {
      terms: "à¤¨à¤¿à¤¯à¤® à¤”à¤° à¤¶à¤°à¥à¤¤à¥‡à¤‚",
      privacy: "à¤—à¥‹à¤ªà¤¨à¥€à¤¯à¤¤à¤¾ à¤¨à¥€à¤¤à¤¿",
      refund: "à¤°à¤¿à¤«à¤‚à¤¡ à¤¨à¥€à¤¤à¤¿",
    },
  }[language];
  const pricingNote =
    "Course fees are determined by the NIRDPR administrative team. We provide flexible pricing options for farmers, students, and individuals in financial need; please call on +91 9395507766.";

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

  const compactLinkClass = isAdminRoute
    ? "inline-flex items-center gap-2 text-sm text-[#9ba8b6] transition hover:text-[#fff7eb]"
    : "inline-flex items-center gap-2 text-sm text-[#55685f] transition hover:text-[#1f352b]";

  return (
    <footer
      className={`border-t ${
        isAdminRoute
          ? "border-[rgba(255,240,214,0.08)] bg-[linear-gradient(180deg,#06080e_0%,#0a0e16_100%)] text-[#eef1f5]"
          : "border-[rgba(41,56,49,0.08)] bg-[linear-gradient(180deg,rgba(255,252,246,0.94)_0%,rgba(246,238,225,0.98)_100%)] text-[#1f342b]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div
          className={`rounded-[1.75rem] px-5 py-5 sm:px-6 ${
            isAdminRoute
              ? "border border-[rgba(255,240,214,0.08)] bg-[linear-gradient(180deg,rgba(9,13,22,0.92),rgba(12,16,24,0.96))] shadow-[0_22px_54px_rgba(0,0,0,0.28)]"
              : "bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,242,232,0.84))] shadow-[0_14px_36px_rgba(137,114,75,0.08)]"
          }`}
        >
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
                  <h2 className={`font-display mt-1 max-w-[24rem] text-[clamp(1rem,2vw,1.65rem)] leading-snug ${isAdminRoute ? "text-[#f5efe3]" : "text-[#1b3329]"}`}>
                    {getLocalizedLegalName(language)}
                  </h2>
                </div>
              </div>
              <div className={`mt-4 grid gap-2.5 text-sm ${isAdminRoute ? "text-[#98a4b1]" : "text-[#5d6d66]"}`}>
                <a href={`tel:${institute.phone[0]}`} className={compactLinkClass}>
                  <Phone className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
                  {institute.phone.join(" / ")}
                </a>
                <a href={`mailto:${institute.email}`} className={compactLinkClass}>
                  <Mail className="h-4 w-4 text-[#8aa884]" aria-hidden="true" />
                  {institute.email}
                </a>
                <p className={`inline-flex items-start gap-2 text-sm ${isAdminRoute ? "text-[#98a4b1]" : "text-[#5d6d66]"}`}>
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

            <div
              className={`rounded-[1.35rem] p-3.5 ${
                isAdminRoute
                  ? "border border-[rgba(255,240,214,0.08)] bg-[rgba(255,255,255,0.03)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  : "bg-[rgba(255,255,255,0.48)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b8842a]">
                  {copy.footer.socialLabel}
                </p>
                <Link
                  href="/admin"
                  aria-label={t(language, "nav.admin")}
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                    isAdminRoute
                      ? "bg-[rgba(255,255,255,0.08)] text-[#fff7eb]"
                      : "bg-[rgba(255,255,255,0.86)] text-[#244236] shadow-[0_8px_18px_rgba(137,114,75,0.08)] hover:bg-white"
                  }`}
                >
                  <UserCircle className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-4 grid gap-3">
                <a
                  href="https://www.instagram.com/honey2health/"
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                    isAdminRoute
                      ? "bg-[rgba(255,255,255,0.05)] text-[#9ba8b6] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
                      : "bg-[rgba(255,255,255,0.68)] text-[#55685f] hover:bg-white hover:text-[#1f352b]"
                  }`}
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
                  className={`inline-flex items-center gap-2.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                    isAdminRoute
                      ? "bg-[rgba(255,255,255,0.05)] text-[#9ba8b6] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
                      : "bg-[rgba(255,255,255,0.68)] text-[#55685f] hover:bg-white hover:text-[#1f352b]"
                  }`}
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

        <div
          className={`mt-4 flex items-center gap-4 overflow-hidden rounded-[1.1rem] px-4 py-3 text-left text-[11px] leading-none ${
            isAdminRoute
              ? "border border-[rgba(255,240,214,0.08)] bg-[rgba(255,255,255,0.03)] text-[#9ba8b6]"
              : "border border-[rgba(41,56,49,0.08)] bg-[rgba(255,255,255,0.62)] text-[#5d6d66] shadow-[0_10px_24px_rgba(137,114,75,0.06)]"
          }`}
        >
          <p className="shrink-0 font-semibold uppercase tracking-[0.16em] text-[#c77b22]">Course pricing</p>
          <p className="min-w-0 flex-1 truncate whitespace-nowrap text-right">{pricingNote}</p>
        </div>

        <div className={`mt-4 flex flex-col gap-2 text-center text-xs sm:flex-row sm:items-center sm:justify-end sm:gap-6 sm:text-right ${isAdminRoute ? "text-[#8491a0]" : "text-[#687870]"}`}>
          <p className="font-semibold uppercase tracking-[0.14em] text-[#c77b22]">{copy.footer.designedDevelopedBy}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-end">
            <a href="tel:+9199087909008" className={`transition ${isAdminRoute ? "hover:text-[#fff7eb]" : "hover:text-[#1f352b]"}`}>
              Rahul: (+91) 99087909008
            </a>
            <a href="tel:+916309465575" className={`transition ${isAdminRoute ? "hover:text-[#fff7eb]" : "hover:text-[#1f352b]"}`}>
              Gowtham: (+91) 630 946 5575
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
