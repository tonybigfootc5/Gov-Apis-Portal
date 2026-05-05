import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "About",
  description: "About API CULTURE Technology Center for beekeeping and apiculture technology.",
};

export default async function AboutPage() {
  const language = await getRequestLanguage();

  return (
    <section className="honeycomb-bg mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div>
        <SectionHeading eyebrow={t(language, "about.eyebrow")} title={t(language, "about.title")}>
          {t(language, "about.body")}
        </SectionHeading>
        <div className="mt-8 grid gap-5 border-l-4 border-[#f4b315] pl-4 text-base leading-8 text-[#d4c4ac] sm:mt-10 sm:pl-6">
          <p>{t(language, "about.copy1")}</p>
          <p>{t(language, "about.copy2")}</p>
          <p>{t(language, "about.copy3")}</p>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-hidden rounded-xl border-4 border-[#504533] bg-[#241e24] shadow-2xl shadow-black/40">
          <Image src="/honey-house-signboard.jpg" alt="API CULTURE center signboard" width={1000} height={563} className="h-full w-full object-cover" priority />
        </div>
        <div className="hex-clip absolute -bottom-10 -left-4 hidden h-32 w-36 place-items-center bg-[#f4b315] p-5 text-center text-[#271900] shadow-xl lg:grid">
          <p className="text-xs font-black uppercase tracking-[0.18em]">API CULTURE</p>
        </div>
      </div>
    </section>
  );
}
