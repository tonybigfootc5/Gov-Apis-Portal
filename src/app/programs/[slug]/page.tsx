import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, GraduationCap, IndianRupee, Users2 } from "lucide-react";
import { TrainingApplicationForm } from "@/components/training-application-form";
import { getProgram } from "@/lib/data";
import { getTranslatedProgramContent, t, type SiteLanguage } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
import { trainingProgramCatalogBySlug } from "@/lib/training-programs";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  return {
    title: program?.title ?? "Program",
    description: program?.summary ?? "API CULTURE training program.",
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      applyNow: "Apply now",
      duration: "Duration",
      level: "Level",
      capacity: "Capacity",
      participants: "participants",
      overviewEyebrow: "Program overview",
      overviewTitle: "What this training covers",
      outcomesEyebrow: "Outcomes",
      outcomesTitle: "What participants walk away with",
      applicationEyebrow: "Application",
      applicationLead: "Finish the enrollment details here and you will be taken directly to the payment gateway after submission.",
      bestFor: "Best suited for",
      bestForFallback: "Eligible applicants interested in beekeeping training.",
      skillsCovered: "Skills covered",
      applyFor: "Apply for",
    },
    te: {
      applyNow: "ఇప్పుడే దరఖాస్తు చేయండి",
      duration: "వ్యవధి",
      level: "స్థాయి",
      capacity: "సామర్థ్యం",
      participants: "పాల్గొనేవారు",
      overviewEyebrow: "కార్యక్రమ అవలోకనం",
      overviewTitle: "ఈ శిక్షణలో ఏమి ఉంటుంది",
      outcomesEyebrow: "ఫలితాలు",
      outcomesTitle: "పాల్గొనేవారు పొందే ప్రయోజనాలు",
      applicationEyebrow: "దరఖాస్తు",
      applicationLead: "ఇక్కడ నమోదు వివరాలు పూర్తి చేయండి. సమర్పించిన వెంటనే నేరుగా చెల్లింపు గేట్‌వేకు తీసుకెళ్తాము.",
      bestFor: "ఎవరికి అనుకూలం",
      bestForFallback: "తేనెటీగల పెంపకం శిక్షణలో ఆసక్తి ఉన్న అర్హులైన అభ్యర్థులు.",
      skillsCovered: "కవర్ అయ్యే నైపుణ్యాలు",
      applyFor: "దరఖాస్తు చేయండి:",
    },
    hi: {
      applyNow: "अभी आवेदन करें",
      duration: "अवधि",
      level: "स्तर",
      capacity: "क्षमता",
      participants: "प्रतिभागी",
      overviewEyebrow: "कार्यक्रम अवलोकन",
      overviewTitle: "इस प्रशिक्षण में क्या शामिल है",
      outcomesEyebrow: "परिणाम",
      outcomesTitle: "प्रतिभागी क्या लेकर जाएंगे",
      applicationEyebrow: "आवेदन",
      applicationLead: "यहां नामांकन विवरण पूरा करें। सबमिट करने के बाद आपको सीधे भुगतान गेटवे पर ले जाया जाएगा।",
      bestFor: "सबसे उपयुक्त",
      bestForFallback: "मधुमक्खी पालन प्रशिक्षण में रुचि रखने वाले पात्र आवेदक।",
      skillsCovered: "शामिल कौशल",
      applyFor: "आवेदन करें:",
    },
  } satisfies Record<SiteLanguage, Record<string, string>>;
  const pageCopy = copy[language];
  const { slug } = await params;
  const program = await getProgram(slug);

  if (!program) notFound();

  const translatedProgram = getTranslatedProgramContent(program, language);
  const presentation = trainingProgramCatalogBySlug[program.slug];
  const selectedService = {
    title: translatedProgram.title,
    duration: translatedProgram.duration,
    level: translatedProgram.level,
  };

  return (
    <article className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="neo-shell rounded-[2.4rem] overflow-hidden">
          <div className="relative z-10 grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_26rem]">
            <div className="p-6 sm:p-8 lg:p-10">
              <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#547ba1]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t(language, "programs.back")}
              </Link>

              <p className="mt-6 text-[11px] font-black uppercase tracking-[0.24em] text-[#f2b544]">
                {presentation?.detailBadge ?? translatedProgram.level}
              </p>
              <h1 className="font-display mt-4 max-w-4xl text-5xl leading-[0.94] text-bright sm:text-6xl">
                {translatedProgram.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-dim sm:text-lg">
                {translatedProgram.summary}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {(presentation?.skills ?? []).map((skill) => (
                  <span key={skill} className="rounded-full border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] px-3 py-2 text-xs font-semibold text-[#1f352b]">
                    {skill}
                  </span>
                ))}
              </div>

              <a
                href="#training-application-form"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
              >
                {pageCopy.applyNow}
              </a>
            </div>

            <div className="relative min-h-[22rem] border-t border-[rgba(41,56,49,0.1)] lg:min-h-full lg:border-l lg:border-t-0">
              {presentation ? (
                <Image
                  src={presentation.imageSrc}
                  alt={presentation.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 26rem, 100vw"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,13,20,0.06)_0%,rgba(10,13,20,0.56)_100%)]" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <section className="section-frame rounded-[1.8rem] p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MiniInfo icon={Clock3} label={pageCopy.duration} value={translatedProgram.duration} />
                <MiniInfo icon={GraduationCap} label={pageCopy.level} value={translatedProgram.level} />
                <MiniInfo icon={Users2} label={pageCopy.capacity} value={`${translatedProgram.capacity} ${pageCopy.participants}`} />
                <MiniInfo icon={IndianRupee} label={t(language, "programs.detail.fee")} value={translatedProgram.fee ?? t(language, "programs.detail.fallbackFee")} />
              </div>
            </section>

            <section className="section-frame rounded-[1.8rem] p-5 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">{pageCopy.overviewEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl text-bright">{pageCopy.overviewTitle}</h2>
              <p className="mt-5 text-base leading-8 text-dim">{translatedProgram.description}</p>
            </section>

            <section className="section-frame rounded-[1.8rem] p-5 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">{pageCopy.outcomesEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl text-bright">{pageCopy.outcomesTitle}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {(presentation?.outcomes ?? []).map((outcome) => (
                  <p key={outcome} className="inline-flex gap-3 rounded-[1.2rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-4 text-sm leading-7 text-dim">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#f2b544]" aria-hidden="true" />
                    {outcome}
                  </p>
                ))}
              </div>
            </section>

            <section id="training-application-form" className="section-frame rounded-[1.8rem] p-5 sm:p-6">
              <div className="mb-6 rounded-[1.5rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{pageCopy.applicationEyebrow}</p>
                <h2 className="font-display mt-3 text-4xl text-bright">{pageCopy.applyFor} {translatedProgram.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-dim">
                  {pageCopy.applicationLead}
                </p>
              </div>

              <TrainingApplicationForm language={language} serviceOptions={[selectedService]} selectedServiceTitle={selectedService.title} />
            </section>
          </div>

          <aside className="section-frame h-fit rounded-[1.8rem] p-5 sm:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">{pageCopy.bestFor}</p>
            <p className="mt-4 text-sm leading-7 text-dim">
              {presentation?.targetAudience ?? pageCopy.bestForFallback}
            </p>

            <div className="mt-6 rounded-[1.4rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">{pageCopy.skillsCovered}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(presentation?.skills ?? []).map((skill) => (
                  <span key={skill} className="rounded-full border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.76)] px-3 py-2 text-xs font-semibold text-[#1f352b]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
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
    <div className="rounded-[1.2rem] border border-[rgba(41,56,49,0.1)] bg-[rgba(255,255,255,0.74)] p-4">
      <div className="flex items-center gap-2 text-[#8ec5ff]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6f8177]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-bright">{value}</p>
    </div>
  );
}
