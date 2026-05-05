import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { institute } from "@/lib/fallback-data";

export const metadata: Metadata = {
  title: "About",
  description: "About API CULTURE Technology Center for beekeeping and apiculture technology.",
};

export default function AboutPage() {
  return (
    <section className="honeycomb-bg mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div>
        <SectionHeading eyebrow="About" title="An institutional center for apiculture capability">
          {institute.legalName} operates as API CULTURE in Rajendranagar, Hyderabad, supporting scientific beekeeping training, field demonstration, rural livelihood enablement, and technology awareness.
        </SectionHeading>
        <div className="mt-10 grid gap-5 border-l-4 border-[#f4b315] pl-6 text-base leading-8 text-[#d4c4ac]">
          <p>{institute.parent}</p>
          <p>
            The website is designed for long-term institutional use: structured pages, dynamic training and event publishing, secure environment variables, validated backend handling, and deployment-ready documentation for GitHub, Vercel, PostgreSQL, and GoDaddy DNS.
          </p>
          <p>
            API CULTURE focuses on empowering beekeepers through training, technology transfer, and sustainable apiculture practices.
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-hidden rounded-xl border-4 border-[#504533] bg-[#241e24] shadow-2xl shadow-black/40">
          <Image src="/beekeeping-illustration.svg" alt="API CULTURE beekeeping illustration" width={1000} height={563} className="h-full w-full object-cover p-8" priority />
        </div>
        <div className="hex-clip absolute -bottom-10 -left-4 hidden h-32 w-36 place-items-center bg-[#f4b315] p-5 text-center text-[#271900] shadow-xl lg:grid">
          <p className="text-xs font-black uppercase tracking-[0.18em]">API CULTURE</p>
        </div>
      </div>
    </section>
  );
}
