import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { institute } from "@/lib/fallback-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-amber-950/10 bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">API Culture</p>
          <h2 className="mt-2 text-2xl font-black">{institute.legalName}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100">{institute.parent}</p>
        </div>
        <div className="space-y-3 text-sm text-emerald-100">
          <p className="flex gap-3">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            {institute.address}
          </p>
          <p className="flex gap-3">
            <Phone className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            {institute.phone.join(" / ")}
          </p>
          <p className="flex gap-3">
            <Mail className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            {institute.email}
          </p>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <Link href="/programs" className="text-emerald-100 hover:text-amber-200">
            Training programs
          </Link>
          <Link href="/events" className="text-emerald-100 hover:text-amber-200">
            Events and workshops
          </Link>
          <Link href="/contact" className="text-emerald-100 hover:text-amber-200">
            Contact the center
          </Link>
        </div>
      </div>
    </footer>
  );
}
