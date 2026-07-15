import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, IndianRupee, Users2 } from "lucide-react";
import { getPrograms } from "@/lib/data";
import type { ProgramItem } from "@/lib/data";
import { getTranslatedProgramContent, t, type SiteLanguage } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { trainingProgramCatalogBySlug, trainingProgramGallery } from "@/lib/training-programs";
import type { TrainingProgramCatalogItem } from "@/lib/training-programs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Training Programs",
  description: "Apiculture training programs at API CULTURE.",
};

const duplicatedGallery = [...trainingProgramGallery, ...trainingProgramGallery];

export default async function ProgramsPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      title: "Training that feels practical before the first hive is even opened.",
      body: "Choose a program, review the outcomes, and apply directly from the detail page. No filler, no dead-end steps.",
      chip1: "Live batch flow",
      chip2: "Field-first curriculum",
      chip3: "Direct application + payment",
      snapshot: "Snapshot",
      activePrograms: "Active programs",
      duration: "Typical duration",
      mode: "Delivery mode",
      modeValue: "Field + lab",
      visuals: "Field visuals",
      visualsNote: "Scroll-free visual context while you compare options.",
      durationLabel: "Duration",
      capacityLabel: "Capacity",
      levelLabel: "Level",
      focusLabel: "Focus",
      focusFallback: "Field learning",
      outcomes: "Key outcomes",
      bestFor: "Best suited for",
      targetFallback: "Eligible applicants interested in beekeeping training.",
      viewProgram: "View program",
    },
    te: {
      title: "మొదటి హైవ్ తెరవకముందే ప్రాక్టికల్‌గా అనిపించే శిక్షణ.",
      body: "ఒక కార్యక్రమాన్ని ఎంచుకోండి, ఫలితాలను చూడండి, తరువాత వివరాల పేజీ నుంచే నేరుగా దరఖాస్తు చేయండి. అవసరం లేని దశలు లేవు.",
      chip1: "ప్రస్తుత బ్యాచ్ ప్రవాహం",
      chip2: "ఫీల్డ్-ఫస్ట్ పాఠ్యక్రమం",
      chip3: "నేరుగా దరఖాస్తు + చెల్లింపు",
      snapshot: "స్నాప్‌షాట్",
      activePrograms: "క్రియాశీల కార్యక్రమాలు",
      duration: "సాధారణ వ్యవధి",
      mode: "బోధనా విధానం",
      modeValue: "ఫీల్డ్ + ల్యాబ్",
      visuals: "ఫీల్డ్ దృశ్యాలు",
      visualsNote: "ఎంపికలను పోల్చేటప్పుడు మధ్యలో స్క్రోల్ అవసరం లేకుండా విజువల్ సందర్భం.",
      durationLabel: "వ్యవధి",
      capacityLabel: "సామర్థ్యం",
      levelLabel: "స్థాయి",
      focusLabel: "కేంద్రబిందువు",
      focusFallback: "ఫీల్డ్ అభ్యాసం",
      outcomes: "ప్రధాన ఫలితాలు",
      bestFor: "ఎవరికి అనుకూలం",
      targetFallback: "తేనెటీగల పెంపకం శిక్షణలో ఆసక్తి ఉన్న అర్హులైన అభ్యర్థులు.",
      viewProgram: "కార్యక్రమం చూడండి",
    },
    hi: {
      title: "ऐसा प्रशिक्षण जो पहली हाइव खुलने से पहले ही व्यावहारिक लगे।",
      body: "कार्यक्रम चुनें, परिणाम देखें, और विवरण पेज से सीधे आवेदन करें। कोई अनावश्यक चरण नहीं।",
      chip1: "लाइव बैच फ्लो",
      chip2: "फील्ड-फर्स्ट पाठ्यक्रम",
      chip3: "सीधा आवेदन + भुगतान",
      snapshot: "स्नैपशॉट",
      activePrograms: "सक्रिय कार्यक्रम",
      duration: "सामान्य अवधि",
      mode: "डिलीवरी मोड",
      modeValue: "फील्ड + लैब",
      visuals: "फील्ड विजुअल्स",
      visualsNote: "विकल्पों की तुलना करते समय बिना अतिरिक्त स्क्रॉल के दृश्य संदर्भ।",
      durationLabel: "अवधि",
      capacityLabel: "क्षमता",
      levelLabel: "स्तर",
      focusLabel: "फोकस",
      focusFallback: "फील्ड लर्निंग",
      outcomes: "मुख्य परिणाम",
      bestFor: "सबसे उपयुक्त",
      targetFallback: "मधुमक्खी पालन प्रशिक्षण में रुचि रखने वाले पात्र आवेदक।",
      viewProgram: "कार्यक्रम देखें",
    },
  } satisfies Record<SiteLanguage, Record<string, string>>;
  const pageCopy = copy[language];
  const programs = await getPrograms();
  const translatedPrograms = programs.map((program) => ({
    ...getTranslatedProgramContent(program, language),
    presentation: trainingProgramCatalogBySlug[program.slug],
  }));

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-[rgba(41,56,49,0.1)] bg-[#fffdf8] px-5 py-6 shadow-[0_28px_80px_rgba(143,116,67,0.16)] sm:px-7 lg:px-10 lg:py-9">
          <div className="pointer-events-none absolute -right-28 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#f2b544]/18" />
          <div className="pointer-events-none absolute left-[42%] top-0 h-[28rem] w-[28rem] rounded-full bg-[#173f33]/6" />
          <div className="relative z-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#b97816]">{t(language, "programs.eyebrow")}</p>
                <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.55rem,5.5vw,5.9rem)] font-black leading-[0.88] tracking-[-0.05em] text-[#141b17]">
                  {pageCopy.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#5c6d63] sm:text-lg">
                  {pageCopy.body}
                </p>
              </div>

              <div className="grid min-w-[16rem] gap-3 rounded-[1.7rem] border border-[#e7d9bd] bg-[#f8f1e6]/74 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b97816]">{pageCopy.snapshot}</p>
                <QuickStat value={`${translatedPrograms.length}`} label={pageCopy.activePrograms} />
                <QuickStat value="2-10 days" label={pageCopy.duration} />
                <QuickStat value={pageCopy.modeValue} label={pageCopy.mode} />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Chip>{pageCopy.chip1}</Chip>
              <Chip>{pageCopy.chip2}</Chip>
              <Chip>{pageCopy.chip3}</Chip>
            </div>

            <div className="mt-8 flex gap-5 overflow-x-auto pb-5 [scrollbar-width:thin] [scrollbar-color:#d9aa43_transparent]">
              {translatedPrograms.map((program, index) => (
                <ProgramFeatureCard
                  key={program.id}
                  program={program}
                  index={index}
                  pageCopy={pageCopy}
                  language={language}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)]">
          <div className="overflow-hidden rounded-[2rem] border border-[rgba(41,56,49,0.1)] bg-[linear-gradient(180deg,#fffdf8_0%,#f3eadc_100%)] p-4 shadow-[0_22px_60px_rgba(171,141,92,0.14)]">
            <div className="flex flex-col justify-between gap-2 px-2 pb-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b97816]">{pageCopy.visuals}</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#173f33]">Field-linked learning atmosphere</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#5c6d63]">{pageCopy.visualsNote}</p>
            </div>
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(90deg,#fffdf8_0%,rgba(255,253,248,0)_100%)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(270deg,#fffdf8_0%,rgba(255,253,248,0)_100%)]" />
              <div className="marquee-track flex gap-4 py-1">
                {duplicatedGallery.map((image, index) => (
                  <div
                    key={`${image.label}-${index}`}
                    className="relative h-52 w-[20rem] shrink-0 overflow-hidden rounded-[1.35rem] border border-[rgba(41,56,49,0.1)] bg-[#f3ecdf] sm:h-64 sm:w-[30rem]"
                  >
                    <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 30rem, 20rem" className="object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,27,22,0)_30%,rgba(17,27,22,0.68)_100%)]" />
                    <p className="absolute bottom-4 left-4 rounded-full border border-[rgba(255,255,255,0.3)] bg-[rgba(17,28,24,0.58)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#fff9ef] backdrop-blur-sm">
                      {image.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[rgba(41,56,49,0.1)] bg-[#173f33] p-5 text-[#fff8ea] shadow-[0_22px_60px_rgba(23,63,51,0.18)]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f2b544]">Choose your path</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.05em]">Start simple. Specialize next.</h2>
            <div className="mt-7 grid gap-3">
              {translatedPrograms.map((program, index) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-[1.15rem] border border-white/10 bg-white/8 px-4 py-3 transition hover:bg-white/14"
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f2b544]">0{index + 1}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{program.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {translatedPrograms.map((program) => (
            <Link
              key={program.id}
              href={`/programs/${program.slug}`}
              className="group rounded-[1.6rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,253,248,0.86)] p-5 shadow-[0_16px_42px_rgba(143,116,67,0.1)] transition hover:-translate-y-1 hover:border-[#d9aa43]/45"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#b97816]">{program.presentation?.focusLabel ?? program.level}</p>
              <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-[#173f33]">{program.title}</h2>
              <div className="mt-5 grid gap-3">
                <MiniInfo icon={Clock3} label={pageCopy.durationLabel} value={program.duration} />
                <MiniInfo icon={Users2} label={pageCopy.capacityLabel} value={`${program.capacity} ${t(language, "programs.seats")}`} />
                <MiniInfo icon={IndianRupee} label={t(language, "programs.detail.fee")} value={program.fee ?? t(language, "programs.detail.fallbackFee")} />
              </div>
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#b97816]">
                {pageCopy.viewProgram}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramFeatureCard({
  program,
  index,
  pageCopy,
  language,
}: {
  program: ProgramItem & {
    presentation?: TrainingProgramCatalogItem;
  };
  index: number;
  pageCopy: Record<string, string>;
  language: SiteLanguage;
}) {
  const presentation = program.presentation;
  const isLead = index === 0;

  return (
    <Link
      href={`/programs/${program.slug}`}
      className={`group relative flex h-[31rem] w-[18.5rem] shrink-0 flex-col overflow-hidden rounded-[1.65rem] border transition duration-300 hover:-translate-y-1 sm:w-[20rem] ${
        isLead
          ? "border-[#d9aa43]/44 bg-[#f2b544] text-[#10150f] shadow-[0_24px_60px_rgba(184,120,22,0.22)]"
          : "border-[#e5d8bd] bg-[#f3eee5] text-[#173f33] shadow-[0_18px_44px_rgba(143,116,67,0.12)]"
      }`}
    >
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${isLead ? "bg-[#fff8ea]/74" : "bg-[#fffdf8]"}`}>
            {program.duration}
          </span>
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${isLead ? "bg-[#173f33] text-[#fff8ea]" : "bg-[#173f33]/8 text-[#173f33]"}`}>
            {program.level}
          </span>
        </div>
        <h2 className="mt-5 text-[1.9rem] font-black leading-[0.94] tracking-[-0.055em] sm:text-[2.08rem]">{program.title}</h2>
        <p className={`mt-3 line-clamp-3 text-sm leading-6 ${isLead ? "text-[#263629]" : "text-[#5c6d63]"}`}>{program.summary}</p>
      </div>

      <div className="relative mt-auto h-[17.5rem] overflow-hidden">
        {presentation ? (
          <Image src={presentation.imageSrc} alt={presentation.imageAlt} fill sizes="20rem" className="object-cover transition duration-700 group-hover:scale-105" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,27,22,0)_20%,rgba(17,27,22,0.55)_100%)]" />
        <div className="absolute inset-x-4 bottom-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fffdf8] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#173f33] shadow-[0_10px_28px_rgba(0,0,0,0.18)]">
            {pageCopy.viewProgram}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="absolute left-5 top-[13.6rem] z-20 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#fffdf8]/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#173f33] backdrop-blur">
          {program.capacity} {t(language, "programs.seats")}
        </span>
        <span className="rounded-full bg-[#fffdf8]/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#173f33] backdrop-blur">
          {program.fee ?? t(language, "programs.detail.fallbackFee")}
        </span>
      </div>
    </Link>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#e2d2b2] bg-[#fff8ea] px-4 py-2 text-sm font-semibold text-[#1f352b] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      {children}
    </span>
  );
}

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.15rem] border border-[#e7d9bd] bg-[#fffdf8]/78 p-4">
      <p className="text-lg font-black tracking-[-0.03em] text-[#173f33]">{value}</p>
      <p className="mt-1 text-sm text-[#5c6d63]">{label}</p>
    </div>
  );
}

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1rem] border border-[#e7d9bd] bg-[#fffdf8]/78 p-3">
      <div className="flex items-center gap-2 text-[#b97816]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6f8177]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-[#173f33]">{value}</p>
    </div>
  );
}
