"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { SiteLanguage } from "@/lib/i18n";

type NavItem = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  currentLanguage: SiteLanguage;
  languageLabel: string;
  languageOptions: Array<{ value: SiteLanguage; label: string }>;
  navItems: NavItem[];
  trainingItems: NavItem[];
  exploreItems: NavItem[];
  trainingLabel: string;
  exploreLabel: string;
  allTrainingLabel: string;
  techCenterLabel: string;
  sandboxMode: boolean;
};

export function SiteHeader({
  currentLanguage,
  languageLabel,
  languageOptions,
  navItems,
  trainingItems,
  exploreItems,
  trainingLabel,
  exploreLabel,
  allTrainingLabel,
  techCenterLabel,
  sandboxMode,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const homeItem = navItems.find((item) => item.href === "/");
  const aboutItem = navItems.find((item) => item.href === "/about");
  const contactItem = navItems.find((item) => item.href === "/contact");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(41,56,49,0.08)] bg-[linear-gradient(180deg,rgba(255,253,248,0.94),rgba(248,241,230,0.88))] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        {sandboxMode ? (
          <div className="mb-3 rounded-[1.2rem] border border-[#d56d55]/18 bg-[#fff0eb] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-[#a24936]">
            Sandbox mode is active. Payment behavior here is not for public use.
          </div>
        ) : null}

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[1.6rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,242,232,0.88)_54%,rgba(240,235,222,0.9))] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_48px_rgba(151,128,88,0.12)] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <Link href="/" className="flex min-w-0 items-center gap-3 pr-2" aria-label="API CULTURE home">
            <span className="relative h-12 w-14 shrink-0 sm:h-14 sm:w-16">
              <Image
                src="/api-culture-logo-clean.png"
                alt="API CULTURE honeycomb logo"
                fill
                className="object-contain drop-shadow-[0_10px_24px_rgba(242,181,68,0.18)]"
                sizes="64px"
                priority
              />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[clamp(1rem,4.6vw,1.2rem)] font-black uppercase tracking-[0.18em] text-[#1c382d] sm:whitespace-nowrap">
                API CULTURE
              </span>
              <span className="block max-w-[12rem] text-[10px] leading-4 font-bold tracking-[0.08em] text-[#64756f] sm:max-w-none sm:whitespace-nowrap sm:text-[10px]">
                {techCenterLabel}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center justify-center px-3 md:flex" aria-label="Main navigation">
            <div className="flex items-center gap-1 rounded-full border border-[rgba(41,56,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(246,239,227,0.78))] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]">
              {[homeItem, aboutItem].filter(Boolean).map((item) => (
                  <Link
                    key={item!.href}
                    href={item!.href}
                    className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive(item!.href)
                        ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                        : "text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
                    }`}
                    aria-current={isActive(item!.href) ? "page" : undefined}
                  >
                    {item!.label}
                  </Link>
                ))}

              <DesktopDropdown
                label={trainingLabel}
                href="/programs"
                items={trainingItems}
                active={isActive("/programs")}
                isItemActive={isActive}
              />

              <DesktopDropdown
                label={exploreLabel}
                items={exploreItems}
                active={exploreItems.some((item) => isActive(item.href))}
                isItemActive={isActive}
              />

              {contactItem ? (
                <Link
                  href={contactItem.href}
                  className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive(contactItem.href)
                      ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                      : "text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
                  }`}
                  aria-current={isActive(contactItem.href) ? "page" : undefined}
                >
                  {contactItem.label}
                </Link>
              ) : null}
            </div>
          </nav>

          <div className="hidden items-center justify-end md:flex">
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              label={languageLabel}
              options={languageOptions}
              variant="header"
            />
          </div>

          <details className="relative shrink-0 md:hidden">
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-[rgba(41,56,49,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,239,227,0.84))] text-[#234235]">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </summary>
            <nav className="absolute right-0 z-10 mt-3 grid w-[min(16rem,calc(100vw-2rem))] gap-1 rounded-[1.4rem] border border-[rgba(41,56,49,0.12)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(245,238,227,0.96))] p-2 shadow-[0_18px_44px_rgba(151,128,88,0.16)] backdrop-blur-2xl">
              <div className="rounded-[1rem] border border-[rgba(41,56,49,0.08)] bg-[rgba(255,255,255,0.76)] px-3 py-3">
                <LanguageSwitcher
                  currentLanguage={currentLanguage}
                  label={languageLabel}
                  options={languageOptions}
                  variant="header"
                />
              </div>
              {homeItem ? (
                <Link
                  href={homeItem.href}
                  className={`inline-flex min-h-11 items-center justify-center rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
                    isActive(homeItem.href)
                      ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                      : "bg-[rgba(255,255,255,0.74)] text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
                  }`}
                  aria-current={isActive(homeItem.href) ? "page" : undefined}
                >
                  {homeItem.label}
                </Link>
              ) : null}
              {aboutItem ? (
                <Link
                  href={aboutItem.href}
                  className={`inline-flex min-h-11 items-center justify-center rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
                    isActive(aboutItem.href)
                      ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                      : "bg-[rgba(255,255,255,0.74)] text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
                  }`}
                  aria-current={isActive(aboutItem.href) ? "page" : undefined}
                >
                  {aboutItem.label}
                </Link>
              ) : null}
              <MobileDropdown
                key="mobile-training"
                label={trainingLabel}
                href="/programs"
                allLabel={allTrainingLabel}
                items={trainingItems}
                isItemActive={isActive}
              />
              <MobileDropdown label={exploreLabel} items={exploreItems} isItemActive={isActive} />
              {contactItem ? (
                <Link
                  href={contactItem.href}
                  className={`inline-flex min-h-11 items-center justify-center rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
                    isActive(contactItem.href)
                      ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                      : "bg-[rgba(255,255,255,0.74)] text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
                  }`}
                  aria-current={isActive(contactItem.href) ? "page" : undefined}
                >
                  {contactItem.label}
                </Link>
              ) : null}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function DesktopDropdown({
  label,
  href,
  items,
  active,
  isItemActive,
}: {
  label: string;
  href?: string;
  items: NavItem[];
  active: boolean;
  isItemActive: (href: string) => boolean;
}) {
  return (
    <div className="group relative py-2 -my-2">
      {href ? (
        <Link
          href={href}
          className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            active
              ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
              : "text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
          }`}
          aria-current={active ? "page" : undefined}
        >
          {label}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <button
          type="button"
          className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            active
              ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
              : "text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
          }`}
        >
          {label}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <div className="pointer-events-none absolute left-1/2 top-full z-20 w-72 -translate-x-1/2 pt-2 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="absolute inset-x-0 bottom-full h-4" aria-hidden="true" />
        <div className="rounded-[1.3rem] border border-[rgba(41,56,49,0.12)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(245,238,227,0.96))] p-2 shadow-[0_18px_44px_rgba(151,128,88,0.16)] backdrop-blur-2xl">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex rounded-[1rem] px-4 py-3 text-[13px] leading-snug font-medium transition ${
                isItemActive(item.href)
                  ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                  : "text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileDropdown({
  label,
  href,
  allLabel,
  items,
  isItemActive,
}: {
  label: string;
  href?: string;
  allLabel?: string;
  items: NavItem[];
  isItemActive: (href: string) => boolean;
}) {
  const active = (href ? isItemActive(href) : false) || items.some((item) => isItemActive(item.href));

  return (
    <details className="rounded-[1rem] bg-[rgba(255,255,255,0.74)]">
      <summary
        className={`flex min-h-11 cursor-pointer list-none items-center justify-between rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
          active
            ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
            : "text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
        }`}
      >
        <span>{label}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </summary>
      <div className="grid gap-1 p-2 pt-1">
        {href ? (
          <Link
            href={href}
            className={`flex rounded-[0.9rem] px-4 py-3 text-[13px] leading-snug font-medium transition ${
              isItemActive(href)
                ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                : "bg-[rgba(255,255,255,0.7)] text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
            }`}
          >
            {allLabel ?? label}
          </Link>
        ) : null}
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex rounded-[0.9rem] px-4 py-3 text-[13px] leading-snug font-medium transition ${
              isItemActive(item.href)
                ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                : "bg-[rgba(255,255,255,0.7)] text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
