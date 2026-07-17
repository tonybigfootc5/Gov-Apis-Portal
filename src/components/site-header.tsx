"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
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
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomeRoute = pathname === "/";
  const isPublicRoute = !isAdminRoute;
  const homeItem = navItems.find((item) => item.href === "/");
  const aboutItem = navItems.find((item) => item.href === "/about");
  const contactItem = navItems.find((item) => item.href === "/contact");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const frameClass = isHomeRoute
    ? "border-transparent bg-transparent"
    : isAdminRoute
    ? "border-[rgba(255,240,214,0.08)] bg-[linear-gradient(180deg,rgba(10,8,8,0.94),rgba(19,14,12,0.9))]"
    : "border-transparent bg-transparent";
  const shellClass = isHomeRoute
    ? "border-transparent bg-transparent shadow-none"
    : isAdminRoute
    ? "border-[rgba(255,240,214,0.09)] bg-[linear-gradient(135deg,rgba(31,31,33,0.96),rgba(20,20,22,0.94)_54%,rgba(34,33,31,0.94))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_56px_rgba(0,0,0,0.3)]"
    : "border-white shadow-[0_18px_46px_rgba(7,20,33,0.18),inset_0_1px_0_rgba(255,255,255,0.98)]";
  const navWrapClass = isHomeRoute
    ? "border-transparent bg-transparent shadow-none"
    : isAdminRoute
    ? "border-[rgba(255,240,214,0.08)] bg-[rgba(12,13,15,0.9)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    : "border-[rgba(7,20,33,0.18)] bg-[rgba(255,255,255,0.94)] shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_10px_28px_rgba(7,20,33,0.1)]";

  return (
    <header
      className={`${
        isHomeRoute
          ? "absolute inset-x-0 top-0 overflow-x-clip px-4 pt-4 sm:px-6 lg:px-8"
          : isAdminRoute
            ? "sticky top-0 border-b backdrop-blur-2xl"
            : "sticky top-0 overflow-x-clip px-4 py-4 sm:px-6 lg:px-8"
      } z-50 ${frameClass}`}
    >
      <div className={`mx-auto max-w-7xl ${isHomeRoute || (!isAdminRoute && isPublicRoute) ? "py-0" : "px-4 py-3 sm:px-6 lg:px-8"}`}>
        {sandboxMode ? (
          <div
            className={`mb-3 rounded-[1.2rem] border px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] ${
              isAdminRoute
                ? "border-[rgba(217,126,94,0.18)] bg-[rgba(70,39,33,0.84)] text-[#f3d7cb]"
                : "border-[#d56d55]/18 bg-[#fff0eb] text-[#a24936]"
            }`}
          >
            Sandbox mode is active. Payment behavior here is not for public use.
          </div>
        ) : null}

        <div
          className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] ${
            isPublicRoute
              ? "px-8 py-4"
              : "rounded-[1.6rem] px-3 py-3"
          } ${shellClass}`}
          style={
            isPublicRoute && !isHomeRoute
              ? { backgroundColor: "rgba(255, 255, 255, 0.96)", borderRadius: "2rem" }
              : undefined
          }
        >
          <Link href="/" className={`flex min-w-0 items-center pr-2 ${isPublicRoute ? "gap-6 pl-1" : "gap-3"}`} aria-label="API CULTURE home">
            <span
              className={`relative shrink-0 overflow-visible ${isPublicRoute ? "h-10 w-14" : "h-12 w-14 sm:h-14 sm:w-16"}`}
            >
              <Image
                src="/api-culture-logo-clean.png"
                alt="API CULTURE honeycomb logo"
                fill
                className={`object-contain ${isPublicRoute ? "drop-shadow-[0_18px_26px_rgba(7,20,33,0.32)]" : "drop-shadow-[0_10px_24px_rgba(242,181,68,0.18)]"}`}
                style={isPublicRoute ? { transform: "translate(0.95rem, 1.45rem) scale(2.12)", transformOrigin: "center" } : undefined}
                sizes="64px"
                priority
              />
            </span>
            <span
              className="min-w-0 leading-tight"
              style={isPublicRoute ? { transform: "translate(1.75rem, 0.18rem)" } : undefined}
            >
              <span
                className={`block sm:whitespace-nowrap ${isPublicRoute ? "font-display uppercase tracking-[0.015em] text-[#071421]" : `text-[clamp(1rem,4.6vw,1.2rem)] font-black uppercase tracking-[0.18em] ${isAdminRoute ? "text-[#f4efe3]" : "text-[#1c382d]"}`}`}
                style={isPublicRoute ? { fontSize: "clamp(1.34rem, 2.2vw, 1.48rem)", fontWeight: 800, lineHeight: 0.9, textShadow: "0 1px 0 rgba(255,255,255,0.72)" } : undefined}
              >
                API CULTURE
              </span>
              <span className={`block max-w-[12rem] text-[10px] leading-4 font-bold tracking-[0.08em] sm:max-w-none sm:whitespace-nowrap sm:text-[10px] ${isHomeRoute ? "hidden" : isAdminRoute ? "text-[#9ca6a1]" : "text-[#64756f]"}`}>
                {techCenterLabel}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center justify-center px-3 md:flex" aria-label="Main navigation">
            <div
              className={`flex items-center gap-5 rounded-full border p-0 ${navWrapClass}`}
              style={isPublicRoute ? { backgroundColor: "transparent" } : undefined}
            >
              {[homeItem, aboutItem].filter(Boolean).map((item) => (
                <NavLink key={item!.href} href={item!.href} active={isActive(item!.href)} dark={isAdminRoute} homeStyle={isHomeRoute}>
                  {item!.label}
                </NavLink>
              ))}

              <DesktopDropdown
                label={trainingLabel}
                href="/programs"
                items={trainingItems}
                active={isActive("/programs")}
                isItemActive={isActive}
                dark={isAdminRoute}
                homeStyle={isHomeRoute}
              />

              <DesktopDropdown
                label={exploreLabel}
                items={exploreItems}
                active={exploreItems.some((item) => isActive(item.href))}
                isItemActive={isActive}
                dark={isAdminRoute}
                homeStyle={isHomeRoute}
              />

              {contactItem ? (
                <NavLink href={contactItem.href} active={isActive(contactItem.href)} dark={isAdminRoute} homeStyle={isHomeRoute}>
                  {contactItem.label}
                </NavLink>
              ) : null}
            </div>
          </nav>

          <div className="hidden items-center justify-end gap-3 md:flex">
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              label={languageLabel}
              options={languageOptions}
              variant="header"
            />
          </div>

          <details className="relative shrink-0 justify-self-end md:hidden">
            <summary
              className={`grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border ${
                isHomeRoute
                  ? "border-[rgba(7,20,33,0.12)] bg-[#071421] text-white shadow-[0_10px_24px_rgba(7,20,33,0.16)]"
                  : isAdminRoute
                  ? "border-[rgba(255,240,214,0.1)] bg-[rgba(255,255,255,0.08)] text-[#fff7eb]"
                  : "border-[rgba(41,56,49,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,239,227,0.84))] text-[#234235]"
              }`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </summary>
            <nav
              className={`absolute right-0 z-10 mt-3 grid w-[min(16rem,calc(100vw-2rem))] gap-1 rounded-[1.4rem] border p-2 shadow-[0_18px_44px_rgba(151,128,88,0.16)] backdrop-blur-2xl ${
                isAdminRoute
                  ? "border-[rgba(255,240,214,0.1)] bg-[linear-gradient(180deg,rgba(23,23,25,0.98),rgba(13,13,15,0.96))]"
                  : "border-[rgba(41,56,49,0.12)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(245,238,227,0.96))]"
              }`}
            >
              <div
                className={`rounded-[1rem] border px-3 py-3 ${
                  isAdminRoute
                    ? "border-[rgba(255,240,214,0.08)] bg-[rgba(255,255,255,0.05)]"
                    : "border-[rgba(41,56,49,0.08)] bg-[rgba(255,255,255,0.76)]"
                }`}
              >
                <LanguageSwitcher
                  currentLanguage={currentLanguage}
                  label={languageLabel}
                  options={languageOptions}
                  variant="header"
                />
              </div>
              {homeItem ? <MobileLink href={homeItem.href} active={isActive(homeItem.href)} dark={isAdminRoute}>{homeItem.label}</MobileLink> : null}
              {aboutItem ? <MobileLink href={aboutItem.href} active={isActive(aboutItem.href)} dark={isAdminRoute}>{aboutItem.label}</MobileLink> : null}
              <MobileDropdown
                key="mobile-training"
                label={trainingLabel}
                href="/programs"
                allLabel={allTrainingLabel}
                items={trainingItems}
                isItemActive={isActive}
                dark={isAdminRoute}
              />
              <MobileDropdown label={exploreLabel} items={exploreItems} isItemActive={isActive} dark={isAdminRoute} />
              {contactItem ? <MobileLink href={contactItem.href} active={isActive(contactItem.href)} dark={isAdminRoute}>{contactItem.label}</MobileLink> : null}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  dark,
  homeStyle = false,
  children,
}: {
  href: string;
  active: boolean;
  dark: boolean;
  homeStyle?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center justify-center rounded-full px-2 py-2 text-sm font-semibold transition ${
        homeStyle
          ? active
            ? "text-[#101417]"
            : "text-[#22282c] hover:text-[#0f1719]"
          : active
          ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
          : dark
            ? "text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
            : "text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

function DesktopDropdown({
  label,
  href,
  items,
  active,
  isItemActive,
  dark = false,
  homeStyle = false,
}: {
  label: string;
  href?: string;
  items: NavItem[];
  active: boolean;
  isItemActive: (href: string) => boolean;
  dark?: boolean;
  homeStyle?: boolean;
}) {
  const buttonClass = homeStyle
    ? active
      ? "text-[#101417]"
      : "text-[#22282c] hover:text-[#0f1719]"
    : active
    ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
    : dark
      ? "text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
      : "text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]";

  return (
    <div className="group relative -my-2 py-2">
      {href ? (
        <Link href={href} className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm font-semibold transition ${buttonClass}`} aria-current={active ? "page" : undefined}>
          {label}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <button type="button" className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm font-semibold transition ${buttonClass}`}>
          {label}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <div className="pointer-events-none absolute left-1/2 top-full z-20 w-72 -translate-x-1/2 pt-2 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="absolute inset-x-0 bottom-full h-4" aria-hidden="true" />
        <div
          className={`rounded-[1.3rem] border p-2 shadow-[0_18px_44px_rgba(151,128,88,0.16)] backdrop-blur-2xl ${
            dark
              ? "border-[rgba(255,240,214,0.1)] bg-[linear-gradient(180deg,rgba(23,23,25,0.98),rgba(13,13,15,0.96))]"
              : "border-[rgba(41,56,49,0.12)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(245,238,227,0.96))]"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex rounded-[1rem] px-4 py-3 text-[13px] leading-snug font-medium transition ${
                isItemActive(item.href)
                  ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                  : dark
                    ? "text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
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

function MobileLink({
  href,
  active,
  dark,
  children,
}: {
  href: string;
  active: boolean;
  dark: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
          : dark
            ? "bg-[rgba(255,255,255,0.05)] text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
            : "bg-[rgba(255,255,255,0.74)] text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

function MobileDropdown({
  label,
  href,
  allLabel,
  items,
  isItemActive,
  dark = false,
}: {
  label: string;
  href?: string;
  allLabel?: string;
  items: NavItem[];
  isItemActive: (href: string) => boolean;
  dark?: boolean;
}) {
  const active = (href ? isItemActive(href) : false) || items.some((item) => isItemActive(item.href));

  if (href) {
    return (
      <div className={`grid gap-1 rounded-[1rem] ${dark ? "bg-[rgba(255,255,255,0.05)]" : "bg-[rgba(255,255,255,0.74)]"}`}>
        <MobileLink href={href} active={isItemActive(href)} dark={dark}>
          {label}
        </MobileLink>
        <div className="grid gap-1 px-2 pb-2">
          {allLabel ? (
            <Link
              href={href}
              className={`flex rounded-[0.9rem] px-4 py-3 text-[13px] leading-snug font-medium transition ${
                isItemActive(href)
                  ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                  : dark
                    ? "bg-[rgba(255,255,255,0.04)] text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
                    : "bg-[rgba(255,255,255,0.7)] text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
              }`}
            >
              {allLabel}
            </Link>
          ) : null}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex rounded-[0.9rem] px-4 py-3 text-[13px] leading-snug font-medium transition ${
                isItemActive(item.href)
                  ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
                  : dark
                    ? "bg-[rgba(255,255,255,0.04)] text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
                    : "bg-[rgba(255,255,255,0.7)] text-[#496056] hover:bg-[#f5efe3] hover:text-[#1f352b]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <details className={`rounded-[1rem] ${dark ? "bg-[rgba(255,255,255,0.05)]" : "bg-[rgba(255,255,255,0.74)]"}`}>
      <summary
        className={`flex min-h-11 cursor-pointer list-none items-center justify-between rounded-[1rem] px-4 py-3 text-sm font-medium transition ${
          active
            ? "bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] text-[#0a0d12]"
            : dark
              ? "text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
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
                : dark
                  ? "bg-[rgba(255,255,255,0.04)] text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
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
                : dark
                  ? "bg-[rgba(255,255,255,0.04)] text-[#d6ddd8] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#fff7eb]"
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
