import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { policyLastUpdated, policyLinks } from "@/lib/policies";
import { getRequestLanguage } from "@/lib/request-language";
import { getSiteCopy } from "@/lib/site-copy";

export const metadata: Metadata = {
  title: "Policies",
  description: "Public policy pages for API CULTURE including terms, privacy, refund, return, and shipping information.",
};

export default async function PoliciesPage() {
  const language = await getRequestLanguage();
  const copy = getSiteCopy(language);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2.2rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(135deg,#fffdf8_0%,#f6efe4_54%,#f1e2c3_100%)] px-6 py-10 shadow-[0_24px_60px_rgba(64,44,8,0.08)] sm:px-10 sm:py-14">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">Policy Center</p>
          <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#1b3b2b] sm:text-5xl">
            {copy.policies.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#516253] sm:text-lg">
            {copy.policies.body}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#516253]">{copy.policies.updatedLabel}: {policyLastUpdated}</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {policyLinks.map((policy) => (
            <Link
              key={policy.href}
              href={policy.href}
              className="rounded-[1.8rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-6 shadow-[0_16px_40px_rgba(64,44,8,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(64,44,8,0.08)]"
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b36b00]">{copy.policies.cardEyebrow}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#1b3b2b]">{policy.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#516253]">{policy.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#b36b00]">
                {copy.policies.openPage}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
