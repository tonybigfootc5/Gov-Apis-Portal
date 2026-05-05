import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { institute } from "@/lib/fallback-data";

export const metadata: Metadata = {
  title: "About",
  description: "About Honey House, API Culture Technology Center for beekeeping and apiculture technology.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div>
        <SectionHeading eyebrow="About" title="An institutional center for apiculture capability">
          {institute.legalName} operates as Honey House in Rajendranagar, Hyderabad, supporting scientific beekeeping training, field demonstration, rural livelihood enablement, and technology awareness.
        </SectionHeading>
        <div className="mt-8 grid gap-4 text-base leading-7 text-stone-700">
          <p>{institute.parent}</p>
          <p>
            The website is designed for long-term institutional use: structured pages, dynamic training and event publishing, secure environment variables, validated backend handling, and deployment-ready documentation for GitHub, Vercel, PostgreSQL, and GoDaddy DNS.
          </p>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <Image src="/honey-house-signboard.jpg" alt="Honey House API Culture Technology Center signboard" width={1000} height={563} className="h-full w-full object-cover" priority />
      </div>
    </section>
  );
}
