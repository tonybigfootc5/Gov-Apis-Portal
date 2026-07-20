import Image from "next/image";
import type { SiteLanguage } from "@/lib/i18n";

export default function AboutUsSection({ language }: { language: SiteLanguage }) {
  void language;

  return (
    <section id="about-section" className="scroll-mt-28 bg-white px-3 py-10 text-[#173f33] sm:px-5 sm:py-14 lg:px-8">
      <div className="sr-only">
        <h1>Api Culture Technology Center</h1>
        <p>
          Api Culture Technology Center was established in 2004 at Rural Technology Park in association with NIRDPR,
          with technical support from the Bee Keepers Association and Kavuri.
        </p>
        <p>
          The center presents itself as a practical mission for training, technology transfer, pollination, and livelihood
          support across rural communities.
        </p>
        <p>
          The mission grows through scientific beekeeping, honey processing, queen rearing, hive product awareness,
          equipment access, and public-facing apiculture education for farmers and future beekeeping entrepreneurs.
        </p>
      </div>

      <div className="mx-auto max-w-[1792px] overflow-hidden rounded-[1.65rem] bg-white shadow-[0_28px_90px_rgba(31,54,44,0.08)]">
        <Image
          src="/about-section-reference.png"
          alt="About Api Culture Technology Center, training benefits, crop yield potential, faculty experience, and pan-India reach"
          width={1792}
          height={1024}
          sizes="(min-width: 1800px) 1792px, 100vw"
          className="block h-auto w-full"
          priority
        />
      </div>
    </section>
  );
}
