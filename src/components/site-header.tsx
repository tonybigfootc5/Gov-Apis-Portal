import Image from "next/image";
import Link from "next/link";
import { Menu, UserCircle } from "lucide-react";
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
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(27,59,43,0.08)] bg-[rgba(250,248,242,0.92)] shadow-[0_10px_40px_rgba(64,44,8,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="API CULTURE home">
          <span className="relative h-12 w-14 shrink-0 sm:h-14 sm:w-16">
            <Image
              src="/api-culture-logo.png"
              alt="API CULTURE honeycomb logo"
              fill
              className="object-contain"
              sizes="64px"
              priority
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-base font-black uppercase tracking-[0.1em] text-[#1b3b2b] sm:text-lg sm:tracking-[0.14em] xl:text-xl xl:tracking-[0.18em]">
              API CULTURE
            </span>
            <span className="block truncate text-[9px] font-bold uppercase tracking-[0.16em] text-[#516253] sm:text-[10px] sm:tracking-[0.2em]">
              {techCenterLabel}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-[#1b3b2b] shadow-[0_10px_24px_rgba(64,44,8,0.08)] transition hover:-translate-y-0.5 hover:border-[#b36b00]/40 hover:bg-[#f6efe4] hover:text-[#b36b00]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-[#1b3b2b] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#faf8f2] shadow-lg shadow-emerald-950/15 transition hover:bg-[#2d312e]"
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
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-[rgba(27,59,43,0.16)] bg-[#fffdf8] text-[#1b3b2b]">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <nav className="absolute right-0 z-10 mt-3 grid w-[min(16rem,calc(100vw-2rem))] gap-1 rounded-3xl border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] p-2 shadow-xl">
            <div className="rounded-[1.4rem] border border-[rgba(27,59,43,0.08)] bg-[#f6efe4] px-3 py-3">
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
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#1b3b2b] shadow-[0_10px_24px_rgba(64,44,8,0.06)] transition hover:border-[#b36b00]/40 hover:bg-[#f6efe4] hover:text-[#b36b00]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1b3b2b] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#faf8f2]"
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
