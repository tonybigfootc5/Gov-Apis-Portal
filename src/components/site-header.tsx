"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, UserCircle } from "lucide-react";
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
  adminLabel: string;
  techCenterLabel: string;
};

export function SiteHeader({
  currentLanguage,
  languageLabel,
  languageOptions,
  navItems,
  adminLabel,
  techCenterLabel,
}: SiteHeaderProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(27,59,43,0.08)] bg-[linear-gradient(180deg,rgba(250,248,242,0.82),rgba(250,248,242,0.68))] shadow-[0_16px_40px_rgba(64,44,8,0.08)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-3 md:rounded-full md:border md:border-white/55 md:bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,253,248,0.34))] md:px-4 md:py-2 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_18px_40px_rgba(64,44,8,0.10)] md:backdrop-blur-2xl">
        <Link href="/" className="flex flex-1 items-center gap-2.5 pr-2 sm:gap-3" aria-label="API CULTURE home">
          <span className="relative h-12 w-14 shrink-0 sm:h-14 sm:w-16">
            <Image
              src="/api-culture-logo-clean.png"
              alt="API CULTURE honeycomb logo"
              fill
              className="object-contain drop-shadow-[0_8px_18px_rgba(179,107,0,0.18)]"
              sizes="64px"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block whitespace-nowrap font-display text-[clamp(1rem,4.7vw,1.25rem)] font-black uppercase tracking-[0.08em] text-[#1b3b2b] sm:text-lg sm:tracking-[0.14em] xl:text-xl xl:tracking-[0.18em]">
              API CULTURE
            </span>
            <span className="block whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.12em] text-[#516253] sm:text-[10px] sm:tracking-[0.2em]">
              {techCenterLabel}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,253,248,0.24))] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-[linear-gradient(180deg,rgba(31,74,53,0.94),rgba(23,57,41,0.92))] text-[#fffaf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_18px_rgba(27,59,43,0.18)]"
                  : "text-[#435648] hover:bg-[rgba(255,255,255,0.44)] hover:text-[#1b3b2b]"
              }`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,rgba(31,74,53,0.94),rgba(23,57,41,0.92))] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#faf8f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_rgba(27,59,43,0.18)] transition hover:brightness-105"
          >
            <UserCircle className="h-4 w-4" aria-hidden="true" />
            {adminLabel}
          </Link>
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            label={languageLabel}
            options={languageOptions}
            variant="header"
          />
        </div>

        <details className="relative shrink-0 md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,253,248,0.42))] text-[#1b3b2b] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_24px_rgba(64,44,8,0.10)] backdrop-blur-xl">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <nav className="absolute right-0 z-10 mt-3 grid w-[min(16rem,calc(100vw-2rem))] gap-1 rounded-[1.8rem] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,253,248,0.48))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_18px_40px_rgba(64,44,8,0.12)] backdrop-blur-2xl">
            <div className="rounded-[1.2rem] bg-[rgba(255,255,255,0.42)] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <LanguageSwitcher
                currentLanguage={currentLanguage}
                label={languageLabel}
                options={languageOptions}
                variant="header"
              />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-[linear-gradient(180deg,rgba(31,74,53,0.94),rgba(23,57,41,0.92))] text-[#fffaf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_18px_rgba(27,59,43,0.18)]"
                    : "bg-[rgba(255,255,255,0.36)] text-[#435648] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.54)] hover:text-[#1b3b2b]"
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,rgba(31,74,53,0.94),rgba(23,57,41,0.92))] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#faf8f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_18px_rgba(27,59,43,0.18)]"
            >
              {adminLabel}
            </Link>
          </nav>
        </details>
        </div>
      </div>
    </header>
  );
}
