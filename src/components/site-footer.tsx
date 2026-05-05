import Link from "next/link";
import { Camera, CirclePlay, Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import { institute } from "@/lib/fallback-data";

export function SiteFooter() {
  const whatsappUrl = "https://wa.me/919700284045";

  return (
    <footer className="border-t-4 border-[#f4b315] bg-[#120c12] text-[#ecdfe8] honeycomb-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#feb96d]">API Culture</p>
          <h2 className="font-display mt-3 text-2xl font-semibold text-[#ffd485] sm:text-3xl">{institute.legalName}</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#d4c4ac]">{institute.parent}</p>
        </div>
        <div className="space-y-3 text-sm text-[#d4c4ac]">
          <p className="flex gap-3 break-words">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#ffd485]" aria-hidden="true" />
            {institute.address}
          </p>
          <p className="flex flex-wrap gap-3">
            <Phone className="mt-1 h-4 w-4 shrink-0 text-[#ffd485]" aria-hidden="true" />
            {institute.phone.join(" / ")}
          </p>
          <p className="flex break-all gap-3">
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
          <div className="mt-4 flex items-center gap-4 text-[#d4c4ac]">
            <span className="inline-flex items-center gap-2" aria-label="YouTube">
              <CirclePlay className="h-4 w-4 text-[#ffd485]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.12em]">YouTube</span>
            </span>
            <span className="inline-flex items-center gap-2" aria-label="Instagram">
              <Camera className="h-4 w-4 text-[#ffd485]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.12em]">Insta</span>
            </span>
            <span className="inline-flex items-center gap-2" aria-label="Facebook">
              <Users className="h-4 w-4 text-[#ffd485]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.12em]">Facebook</span>
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#3a2f24] px-4 py-4 text-center text-xs text-[#d4c4ac] sm:px-6 sm:text-sm lg:px-8">
        <span>Designed by Solution Architect:</span>{" "}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[#ffd485] transition hover:text-[#feb96d]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>9700284045</span>
        </a>
      </div>
    </footer>
  );
}
