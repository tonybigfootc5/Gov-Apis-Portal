import Link from "next/link";
import { Hexagon, Menu, Search, UserCircle } from "lucide-react";

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
    <header className="sticky top-0 z-50 border-b border-[#504533]/70 bg-[#171117]/90 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="API CULTURE home">
          <span className="hex-clip grid h-11 w-12 place-items-center bg-[#f4b315] text-[#271900] shadow-lg shadow-amber-950/30">
            <Hexagon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-black uppercase tracking-[0.2em] text-[#ffd485]">
              API CULTURE
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4c4ac]">Technology Center</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#d4c4ac] transition hover:bg-[#2f282e] hover:text-[#ffd485]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Search className="h-5 w-5 text-[#ffd485]" aria-hidden="true" />
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded bg-[#f4b315] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#271900] shadow-lg shadow-black/20 transition hover:brightness-110"
          >
            <UserCircle className="h-4 w-4" aria-hidden="true" />
            Admin
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded border border-[#504533] bg-[#241e24] text-[#ffd485]">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <nav className="absolute right-0 mt-3 grid w-60 gap-1 rounded border border-[#504533] bg-[#241e24] p-2 shadow-xl">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="rounded px-3 py-2 text-sm font-semibold text-[#d4c4ac]">
                {label}
              </Link>
            ))}
            <Link href="/admin" className="rounded bg-[#f4b315] px-3 py-2 text-sm font-bold text-[#271900]">
              Admin
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
