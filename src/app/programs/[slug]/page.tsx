import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, GraduationCap, Users2 } from "lucide-react";
import { TrainingApplicationForm } from "@/components/training-application-form";
import { getProgram } from "@/lib/data";
import { getTranslatedProgramContent, t } from "@/lib/i18n";
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
              <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8ec5ff]">
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
                  <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[#dce5f2]">
                    {skill}
                  </span>
                ))}
              </div>

              <a
                href="#training-application-form"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,#f2b544,#ff8a2a)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#0a0d12]"
              >
                Apply now
              </a>
            </div>

            <div className="relative min-h-[22rem] border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
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
              <div className="grid gap-4 sm:grid-cols-3">
                <MiniInfo icon={Clock3} label="Duration" value={translatedProgram.duration} />
                <MiniInfo icon={GraduationCap} label="Level" value={translatedProgram.level} />
                <MiniInfo icon={Users2} label="Capacity" value={`${translatedProgram.capacity} participants`} />
              </div>
            </section>

            <section className="section-frame rounded-[1.8rem] p-5 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">Program overview</p>
              <h2 className="font-display mt-4 text-4xl text-bright">What this training covers</h2>
              <p className="mt-5 text-base leading-8 text-dim">{translatedProgram.description}</p>
            </section>

            <section className="section-frame rounded-[1.8rem] p-5 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8ec5ff]">Outcomes</p>
              <h2 className="font-display mt-4 text-4xl text-bright">What participants walk away with</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {(presentation?.outcomes ?? []).map((outcome) => (
                  <p key={outcome} className="inline-flex gap-3 rounded-[1.2rem] border border-white/10 bg-white/4 p-4 text-sm leading-7 text-dim">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#f2b544]" aria-hidden="true" />
                    {outcome}
                  </p>
                ))}
              </div>
            </section>

            <section id="training-application-form" className="section-frame rounded-[1.8rem] p-5 sm:p-6">
              <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/4 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">Application</p>
                <h2 className="font-display mt-3 text-4xl text-bright">Apply for {translatedProgram.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-dim">
                  Finish the enrollment details here and you will be taken directly to the payment gateway after submission.
                </p>
              </div>

              <TrainingApplicationForm serviceOptions={[selectedService]} selectedServiceTitle={selectedService.title} />
            </section>
          </div>

          <aside className="section-frame h-fit rounded-[1.8rem] p-5 sm:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2b544]">Best suited for</p>
            <p className="mt-4 text-sm leading-7 text-dim">
              {presentation?.targetAudience ?? "Eligible applicants interested in beekeeping training."}
            </p>

            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/4 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8ec5ff]">Skills covered</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(presentation?.skills ?? []).map((skill) => (
                  <span key={skill} className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-[#dce5f2]">
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
    <div className="rounded-[1.2rem] border border-white/10 bg-white/4 p-4">
      <div className="flex items-center gap-2 text-[#8ec5ff]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#9ca8bc]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-bright">{value}</p>
    </div>
  );
}
