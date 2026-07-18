"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Images,
  FileBadge2,
  FileText,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  ShoppingBag,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { institute } from "@/lib/fallback-data";
import type { SiteLanguage } from "@/lib/i18n";
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
  const legalName = getLocalizedLegalName(language);
  const footerCopy = {
    en: {
      terms: "Terms and Conditions",
      privacy: "Privacy Policy",
      refund: "Refund Policy",
    },
    te: {
      terms: "నిబంధనలు మరియు షరతులు",
      privacy: "గోప్యతా విధానం",
      refund: "రిఫండ్ విధానం",
    },
    hi: {
      terms: "नियम और शर्तें",
      privacy: "गोपनीयता नीति",
      refund: "रिफंड नीति",
    },
  }[language];
  const primaryLinks = [
    { href: "/articles", label: "Articles", icon: Newspaper },
    { href: "/events", label: "Events", icon: CalendarDays },
    { href: "/gallery", label: "Gallery", icon: Images },
    { href: "/equipment", label: "Equipment", icon: Wrench },
    { href: "/products", label: "Products", icon: ShoppingBag },
  ] as const;

  const policyLinks = [
    { href: "/terms-and-conditions", label: footerCopy.terms, icon: FileText },
    { href: "/privacy-policy", label: footerCopy.privacy, icon: FileBadge2 },
    { href: "/refund-policy", label: footerCopy.refund, icon: ShieldCheck },
  ] as const;

  const linkClass = isAdminRoute
    ? "inline-flex items-center gap-2 text-sm text-[#9ba8b6] transition hover:text-[#fff7eb]"
    : "inline-flex items-center gap-2 text-sm font-semibold text-white/82 transition hover:text-[#f6cf74]";

  if (isAdminRoute) {
    return (
      <footer className="border-t border-[rgba(255,240,214,0.08)] bg-[linear-gradient(180deg,#06080e_0%,#0a0e16_100%)] text-[#eef1f5]">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="rounded-[1.75rem] border border-[rgba(255,240,214,0.08)] bg-[linear-gradient(180deg,rgba(9,13,22,0.92),rgba(12,16,24,0.96))] px-5 py-5 shadow-[0_22px_54px_rgba(0,0,0,0.28)] sm:px-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.72fr] lg:items-start">
              <BrandBlock legalName={legalName} mutedClass="text-[#98a4b1]" headingClass="text-[#f5efe3]" linkClass={linkClass} />
              <FooterLinks title={copy.footer.quickLinksLabel} links={primaryLinks} linkClass={linkClass} iconClass="text-[#c77b22]" />
              <FooterLinks title={copy.footer.policyLinksLabel} links={policyLinks} linkClass={linkClass} iconClass="text-[#6b87a3]" />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden bg-[#151615] text-[#f4f2e8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(246,207,116,0.14),rgba(246,207,116,0)_34%),linear-gradient(180deg,#171817_0%,#121312_100%)]" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterLinks title={copy.footer.quickLinksLabel} links={primaryLinks} linkClass={linkClass} iconClass="text-[#f6cf74]" />
          <FooterLinks title={copy.footer.policyLinksLabel} links={policyLinks} linkClass={linkClass} iconClass="text-[#9aa7b7]" />

          <FooterColumn title="Contact">
            <a href={`tel:${institute.phone[0]}`} className={linkClass}>
              <Phone className="h-4 w-4 text-[#f6cf74]" aria-hidden="true" />
              {institute.phone.join(" / ")}
            </a>
            <a href={`mailto:${institute.email}`} className={linkClass}>
              <Mail className="h-4 w-4 text-[#8aa884]" aria-hidden="true" />
              {institute.email}
            </a>
            <p className="inline-flex items-start gap-2 text-sm font-semibold leading-6 text-white/82">
              <MapPin className="h-4 w-4 text-[#8ec5ff]" aria-hidden="true" />
              <span>{institute.address}</span>
            </p>
          </FooterColumn>

          <FooterColumn title={copy.footer.socialLabel}>
            <div className="flex flex-wrap gap-4">
              <SocialCircle href="#" label="Facebook" tone="facebook" icon={<BrandIcon name="facebook" />} />
              <SocialCircle href="https://www.instagram.com/honey2health/" label="Instagram" tone="instagram" icon={<BrandIcon name="instagram" />} />
              <SocialCircle href="https://www.youtube.com/@ApiCultureTechCenter" label="YouTube" tone="youtube" icon={<BrandIcon name="youtube" />} />
            </div>
          </FooterColumn>
        </div>

          <div className="mt-16">
            <div className="flex items-end">
              <div className="flex items-end gap-5">
              <span className="relative hidden h-36 w-36 shrink-0 self-center sm:block lg:h-44 lg:w-44">
                <Image
                  src="/api-culture-logo-clean.png"
                  alt="API CULTURE honeycomb logo"
                  fill
                  sizes="176px"
                  className="object-contain opacity-95 drop-shadow-[0_20px_44px_rgba(246,207,116,0.18)]"
                />
              </span>
                <div>
                  <p className="font-display text-[clamp(4.2rem,14vw,11rem)] font-semibold leading-[0.75] tracking-[-0.06em] text-[#f4f2e8]">
                    <span className="inline-block">
                      <Link href="/admin/login" aria-label="Admin login" className="text-inherit no-underline">
                        A
                      </Link>
                      PI
                    </span>
                    <span className="relative block">
                      <span className="absolute -top-8 right-[0.03em] text-right text-sm font-black uppercase leading-none tracking-[0.24em] text-[#f6cf74] sm:-top-10">
                        Technology Center (Bee Keeping)
                      </span>
                      CULTURE
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        <div className="mt-8 border-t border-white/10 pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#8b8d83]">
            <span className="font-black uppercase tracking-[0.16em] text-[#c77b22]">{copy.footer.designedDevelopedBy}</span>
            <a href="tel:+9199087909008" className="transition hover:text-[#f6cf74]">Rahul: (+91) 99087909008</a>
            <a href="tel:+916309465575" className="transition hover:text-[#f6cf74]">Gowtham: (+91) 630 946 5575</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function BrandBlock({
  legalName,
  mutedClass,
  headingClass,
  linkClass,
}: {
  legalName: string;
  mutedClass: string;
  headingClass: string;
  linkClass: string;
}) {
  return (
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
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f6cf74]">API CULTURE</p>
          <h2 className={`font-display mt-1 max-w-[24rem] text-[clamp(1rem,2vw,1.65rem)] leading-snug ${headingClass}`}>
            {legalName}
          </h2>
        </div>
      </div>
      <div className={`mt-4 grid gap-2.5 text-sm ${mutedClass}`}>
        <a href={`tel:${institute.phone[0]}`} className={linkClass}>
          <Phone className="h-4 w-4 text-[#f2b544]" aria-hidden="true" />
          {institute.phone.join(" / ")}
        </a>
        <a href={`mailto:${institute.email}`} className={linkClass}>
          <Mail className="h-4 w-4 text-[#8aa884]" aria-hidden="true" />
          {institute.email}
        </a>
        <p className={`inline-flex items-start gap-2 text-sm ${mutedClass}`}>
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8ec5ff]" aria-hidden="true" />
          <span>{institute.address}</span>
        </p>
      </div>
    </div>
  );
}

function FooterLinks({
  title,
  links,
  linkClass,
  iconClass,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>;
  linkClass: string;
  iconClass: string;
}) {
  return (
    <FooterColumn title={title}>
      {links.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={linkClass}>
          <Icon className={`h-4 w-4 ${iconClass}`} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </FooterColumn>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8b8d83]">{title}</p>
      <div className="mt-6 grid gap-3">{children}</div>
    </div>
  );
}

function SocialCircle({
  href,
  label,
  tone,
  icon,
}: {
  href: string;
  label: string;
  tone: "facebook" | "instagram" | "youtube";
  icon: ReactNode;
}) {
  const toneClass = {
    facebook: "hover:bg-[#1877f2]",
    instagram: "hover:bg-[linear-gradient(135deg,#f58529_0%,#dd2a7b_48%,#8134af_100%)]",
    youtube: "hover:bg-[#ff0000]",
  }[tone];

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      title={label}
      className={`grid h-14 w-14 place-items-center rounded-full bg-white text-[#111312] shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition hover:-translate-y-1 hover:text-white ${toneClass}`}
    >
      {icon}
    </a>
  );
}

function BrandIcon({ name }: { name: "facebook" | "instagram" | "twitter" | "youtube" }) {
  const common = "h-6 w-6";

  if (name === "facebook") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.2 8.1h2.2V4.4A27 27 0 0 0 13.2 4c-3.2 0-5.4 2-5.4 5.6v3.2H4.3V17h3.5v7h4.4v-7h3.4l.6-4.2h-4V10c0-1.2.3-1.9 2-1.9Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="16" height="16" x="4" y="4" rx="4.5" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="17" cy="7" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (name === "twitter") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.6 6.2c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.2-.8.5-1.7.8-2.6 1A4 4 0 0 0 11.5 9c0 .3 0 .6.1.9A11.5 11.5 0 0 1 3.3 5.7 4 4 0 0 0 4.6 11c-.6 0-1.2-.2-1.8-.5v.1c0 2 1.4 3.6 3.2 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8A8.1 8.1 0 0 1 2.9 19H2a11.4 11.4 0 0 0 6.2 1.8c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.4-1.3 1.8-2.1Z" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 8.1a3 3 0 0 0-2.1-2.2C18 5.4 12 5.4 12 5.4s-6 0-7.9.5A3 3 0 0 0 2 8.1 31.2 31.2 0 0 0 1.5 12c0 1.3.1 2.6.5 3.9a3 3 0 0 0 2.1 2.2c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.2c.3-1.3.5-2.6.5-3.9 0-1.3-.2-2.6-.5-3.9ZM10 15.4V8.6l5.8 3.4L10 15.4Z" />
    </svg>
  );
}
