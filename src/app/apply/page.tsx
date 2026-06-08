import { CalendarDays, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { TrainingApplicationForm } from "@/components/training-application-form";

export const dynamic = "force-dynamic";

const steps = [
  {
    title: "Simple personal details",
    body: "Big touch-friendly fields for applicant name, guardian name, gender, and date of birth.",
    icon: FileText,
  },
  {
    title: "Easy contact section",
    body: "Address, mobile number, mandal, district, and state are grouped together so nobody has to hunt around.",
    icon: ShieldCheck,
  },
  {
    title: "Quick final upload",
    body: "The photo is compressed automatically before submission so the form remains lightweight on mobile data.",
    icon: CheckCircle2,
  },
];

export default function ApplyPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-[rgba(27,59,43,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(235,180,40,0.2),transparent_22rem),linear-gradient(180deg,#fbf7ee_0%,#f3ecdf_100%)]">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_0.82fr] lg:items-end">
            <div className="max-w-4xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(27,59,43,0.12)] bg-[#fffdf8]/90 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#b36b00]">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Training application
              </p>
              <h1 className="font-display mt-6 text-[clamp(2.8rem,8vw,5.2rem)] font-semibold leading-[0.95] tracking-tight text-[#1b3b2b]">
                Online application that feels easy, guided, and human
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#516253] sm:text-lg">
                This form is designed so a first-time applicant, helper, volunteer, or family member can complete the beekeeping training application without confusion. Each section uses short labels, clear hints, and a step-by-step flow.
              </p>
            </div>

            <div className="grid gap-3">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="paper-panel rounded-[1.75rem] p-4">
                    <div className="flex items-start gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff4d1] text-[#b36b00]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#1b3b2b]">{step.title}</p>
                        <p className="mt-2 text-sm leading-7 text-[#516253]">{step.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TrainingApplicationForm />
      </section>
    </div>
  );
}
