import Link from "next/link";
import { Hexagon, Menu, Search, UserCircle } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-[#504533]/70 bg-[#171117]/90 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="API CULTURE home">
          <span className="hex-clip grid h-10 w-11 shrink-0 place-items-center bg-[#f4b315] text-[#271900] shadow-lg shadow-amber-950/30 sm:h-11 sm:w-12">
            <Hexagon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-base font-black uppercase tracking-[0.14em] text-[#ffd485] sm:text-xl sm:tracking-[0.2em]">
              API CULTURE
            </span>
            <span className="block truncate text-[9px] font-bold uppercase tracking-[0.16em] text-[#d4c4ac] sm:text-[10px] sm:tracking-[0.2em]">
              {techCenterLabel}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#d4c4ac] transition hover:bg-[#2f282e] hover:text-[#ffd485]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            label={languageLabel}
            options={languageOptions}
          />
          <Search className="h-5 w-5 text-[#ffd485]" aria-hidden="true" />
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded bg-[#f4b315] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#271900] shadow-lg shadow-black/20 transition hover:brightness-110"
          >
            <UserCircle className="h-4 w-4" aria-hidden="true" />
            {adminLabel}
          </Link>
        </div>

        <details className="relative shrink-0 md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded border border-[#504533] bg-[#241e24] text-[#ffd485]">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <nav className="absolute right-0 z-10 mt-3 grid w-[min(16rem,calc(100vw-2rem))] gap-1 rounded border border-[#504533] bg-[#241e24] p-2 shadow-xl">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded px-3 py-2 text-sm font-semibold text-[#d4c4ac]">
                {item.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LanguageSwitcher
                currentLanguage={currentLanguage}
                label={languageLabel}
                options={languageOptions}
              />
            </div>
            <Link href="/admin" className="rounded bg-[#f4b315] px-3 py-2 text-sm font-bold text-[#271900]">
              {adminLabel}
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
