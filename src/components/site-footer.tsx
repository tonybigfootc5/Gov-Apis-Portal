import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { institute } from "@/lib/fallback-data";

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-[#f4b315] bg-[#120c12] text-[#ecdfe8] honeycomb-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#feb96d]">API Culture</p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#ffd485]">{institute.legalName}</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#d4c4ac]">{institute.parent}</p>
        </div>
        <div className="space-y-3 text-sm text-[#d4c4ac]">
          <p className="flex gap-3">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#ffd485]" aria-hidden="true" />
            {institute.address}
          </p>
          <p className="flex gap-3">
            <Phone className="mt-1 h-4 w-4 shrink-0 text-[#ffd485]" aria-hidden="true" />
            {institute.phone.join(" / ")}
          </p>
          <p className="flex gap-3">
            <Mail className="mt-1 h-4 w-4 shrink-0 text-[#ffd485]" aria-hidden="true" />
            {institute.email}
          </p>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <Link href="/programs" className="text-[#d4c4ac] hover:text-[#ffd485]">
            Training programs
          </Link>
          <Link href="/events" className="text-[#d4c4ac] hover:text-[#ffd485]">
            Events and workshops
          </Link>
          <Link href="/contact" className="text-[#d4c4ac] hover:text-[#ffd485]">
            Contact the center
          </Link>
        </div>
      </div>
    </footer>
  );
}
