import Link from "next/link";
import { ChevronRight, FileText, Mail, Phone, ShieldCheck } from "lucide-react";
import { institute } from "@/lib/fallback-data";
import { policyLastUpdated, policyLinks, type PolicyDocument } from "@/lib/policies";

type PolicyPageProps = {
  document: PolicyDocument;
};

export function PolicyPage({ document }: PolicyPageProps) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.2rem] border border-[rgba(27,59,43,0.12)] bg-[linear-gradient(135deg,#fffdf8_0%,#f6efe4_54%,#f1e2c3_100%)] shadow-[0_24px_60px_rgba(64,44,8,0.08)]">
          <div className="grid gap-6 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">{document.eyebrow}</p>
              <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#1b3b2b] sm:text-5xl">
                {document.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#516253] sm:text-lg">{document.summary}</p>
            </div>

            <div className="rounded-[1.6rem] border border-[rgba(27,59,43,0.12)] bg-[#fffaf1] p-5 shadow-[0_12px_30px_rgba(64,44,8,0.06)]">
              <div className="flex items-center gap-3 text-[#1b3b2b]">
                <ShieldCheck className="h-5 w-5 text-[#b36b00]" aria-hidden="true" />
                <p className="text-sm font-semibold">Public policy page</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#516253]">Last updated: {policyLastUpdated}</p>
              <p className="mt-2 text-sm leading-7 text-[#516253]">Website: {institute.website}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            {document.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[1.8rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-6 shadow-[0_16px_40px_rgba(64,44,8,0.06)] sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1cd] text-[#b36b00]">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#1b3b2b]">{section.title}</h2>
                </div>

                <div className="mt-5 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-8 text-[#516253] sm:text-[15px]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {section.bullets?.length ? (
                  <ul className="mt-5 grid gap-3">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="rounded-[1.2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffaf1] px-4 py-3 text-sm leading-7 text-[#1b3b2b]"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[1.8rem] border border-[rgba(27,59,43,0.1)] bg-[#173f33] p-6 text-white shadow-[0_16px_40px_rgba(23,63,51,0.18)]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f6cf74]">Center contact</p>
              <h2 className="font-display mt-3 text-3xl text-[#fff8ea]">Contact the center</h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-[#d9dfd8]">
                <p className="flex gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-[#f6cf74]" aria-hidden="true" />
                  {institute.email}
                </p>
                <p className="flex gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-[#f6cf74]" aria-hidden="true" />
                  {institute.phone.join(" / ")}
                </p>
                <p>{institute.address}</p>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-[rgba(27,59,43,0.1)] bg-[#fffdf8] p-6 shadow-[0_16px_40px_rgba(64,44,8,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b36b00]">All policy pages</p>
              <div className="mt-4 grid gap-3">
                {policyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group rounded-[1.2rem] border border-[rgba(27,59,43,0.08)] bg-[#fffaf1] px-4 py-4 transition hover:border-[rgba(27,59,43,0.18)] hover:bg-[#fff7e5]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#1b3b2b]">{link.title}</p>
                        <p className="mt-1 text-xs leading-6 text-[#516253]">{link.description}</p>
                      </div>
                      <ChevronRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#b36b00] transition group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
