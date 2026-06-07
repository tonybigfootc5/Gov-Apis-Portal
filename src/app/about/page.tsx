import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Microscope, ShieldCheck, Sprout } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "About",
  description: "About API CULTURE Technology Center for beekeeping and apiculture technology.",
};

export default async function AboutPage() {
  const language = await getRequestLanguage();
  const principles = [
    {
      icon: Sprout,
      title: "Field-first learning",
      body: "Training is tied to practice, observation, and rural enterprise relevance.",
    },
    {
      icon: Microscope,
      title: "Scientific beekeeping",
      body: "The center supports structured instruction rather than informal guesswork.",
    },
    {
      icon: ShieldCheck,
      title: "Institutional continuity",
      body: "The site and the center both need to feel dependable, official, and maintained.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <SectionHeading eyebrow={t(language, "about.eyebrow")} title={t(language, "about.title")}>
            {t(language, "about.body")}
          </SectionHeading>
          <div className="mt-8 grid gap-5 border-l-4 border-[#ebb428] pl-4 text-base leading-8 text-[#516253] sm:mt-10 sm:pl-6">
            <p>{t(language, "about.copy1")}</p>
            <p>{t(language, "about.copy2")}</p>
            <p>{t(language, "about.copy3")}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://www.apiculture.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.16)] bg-[#fffdf8] px-5 py-3 text-sm font-semibold text-[#1b3b2b] transition hover:border-[#1b3b2b]"
            >
              Visit official website
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] shadow-[0_28px_70px_rgba(64,44,8,0.08)]">
            <Image src="/honey-house-signboard.jpg" alt="API CULTURE center signboard" width={1000} height={563} className="h-full w-full object-cover" priority />
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(27,59,43,0)_0%,rgba(27,59,43,0.9)_100%)] px-6 pb-6 pt-16">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ebb428]">Institutional campus</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#faf8f2]">A public-facing technology center needs clarity, permanence, and trust in both its physical and digital presence.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, body }) => (
              <div key={title} className="paper-panel rounded-[2rem] p-5">
                <Icon className="h-6 w-6 text-[#b36b00]" aria-hidden="true" />
                <h3 className="font-display mt-4 text-2xl text-[#1b3b2b]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#516253]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <div className="paper-panel rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">What the portal does</p>
          <p className="mt-4 text-sm leading-7 text-[#516253]">It gives the center a cleaner public face for program discovery, event visibility, and direct inquiries.</p>
        </div>
        <div className="paper-panel rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">What visitors need</p>
          <p className="mt-4 text-sm leading-7 text-[#516253]">Clear location, practical training information, and confidence that the institution behind the page is real and reachable.</p>
        </div>
        <div className="paper-panel rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">Why the redesign matters</p>
          <p className="mt-4 text-sm leading-7 text-[#516253]">The site now leans into trust, structure, and usability instead of decorative effects that diluted the message.</p>
        </div>
      </div>
    </section>
  );
}
