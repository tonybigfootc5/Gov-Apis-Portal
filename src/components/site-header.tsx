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
  sandboxMode: boolean;
};

export function SiteHeader({
  currentLanguage,
  languageLabel,
  languageOptions,
  navItems,
  adminLabel,
  techCenterLabel,
  sandboxMode,
}: SiteHeaderProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(7,10,15,0.72)] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        {sandboxMode ? (
          <div className="mb-3 rounded-[1.2rem] border border-[#ff8d7a]/18 bg-[#ff8d7a]/10 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-[#ffc3b8]">
            Sandbox mode is active. Payment behavior here is not for public use.
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Link href="/" className="flex flex-1 items-center gap-3 pr-2" aria-label="API CULTURE home">
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
            <span className="leading-tight">
              <span className="block whitespace-nowrap text-[clamp(1rem,4.6vw,1.2rem)] font-black uppercase tracking-[0.18em] text-[#f4efe4]">
                API CULTURE
              </span>
              <span className="block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.22em] text-[#8d9ab0] sm:text-[10px]">
                {techCenterLabel}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-black/20 p-1 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                    : "text-[#d6deea] hover:bg-white/7 hover:text-white"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#f4efe4] transition hover:bg-white/10"
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
            <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-white/12 bg-white/6 text-[#f4efe4]">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </summary>
            <nav className="absolute right-0 z-10 mt-3 grid w-[min(16rem,calc(100vw-2rem))] gap-1 rounded-[1.4rem] border border-white/12 bg-[#0b0f17]/95 p-2 shadow-[0_18px_44px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
              <div className="rounded-[1rem] border border-white/8 bg-white/4 px-3 py-3">
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
                  className={`inline-flex min-h-11 items-center justify-center rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                      : "bg-white/4 text-[#d6deea] hover:bg-white/8 hover:text-white"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#faf8f2]"
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
