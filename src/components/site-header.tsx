import Link from "next/link";
import { Hexagon, Menu } from "lucide-react";
import { institute } from "@/lib/fallback-data";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Training", "/programs"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["Contact", "/contact"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-950/10 bg-[#fffaf0]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Honey House home">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-amber-400 text-amber-950 shadow-sm">
            <Hexagon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black uppercase tracking-[0.18em] text-emerald-900">
              API Culture
            </span>
            <span className="block text-xs font-semibold text-stone-600">{institute.name}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-amber-100 hover:text-emerald-950"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/admin"
          className="hidden rounded-md bg-emerald-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 md:inline-flex"
        >
          Admin
        </Link>

        <details className="relative md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-md border border-stone-200 bg-white text-stone-800">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <nav className="absolute right-0 mt-3 grid w-56 gap-1 rounded-lg border border-stone-200 bg-white p-2 shadow-xl">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-stone-700">
                {label}
              </Link>
            ))}
            <Link href="/admin" className="rounded-md bg-emerald-950 px-3 py-2 text-sm font-bold text-white">
              Admin
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
