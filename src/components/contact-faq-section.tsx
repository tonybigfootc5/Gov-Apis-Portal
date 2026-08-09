"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Link2, Search, X } from "lucide-react";
import { contactFaqCategories } from "@/lib/contact-faq";
import { cn } from "@/lib/utils";

function getFaqId(category: string) {
  return `faq-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function ContactFaqSection() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return contactFaqCategories;

    return contactFaqCategories
      .map((category) => ({
        ...category,
        questions: category.questions.filter((item) => {
          const searchable = `${category.category} ${item.question} ${item.answer}`.toLowerCase();
          return searchable.includes(normalizedQuery);
        }),
      }))
      .filter((category) => category.questions.length > 0);
  }, [normalizedQuery]);

  const resultCount = filteredCategories.reduce((total, category) => total + category.questions.length, 0);

  return (
    <section className="mx-auto mt-10 max-w-[94rem]">
      <h2 className="mb-6 text-center text-[clamp(2.25rem,5vw,4.8rem)] font-black leading-[0.9] tracking-[-0.04em] text-[#121512]">
        Got Questions?
      </h2>

      <div className="mx-auto mb-6 max-w-3xl">
        <label htmlFor="faq-search" className="sr-only">
          Search frequently asked questions
        </label>
        <div className="flex min-h-14 items-center gap-3 rounded-xl border border-[#e4e1d8] bg-white px-4 shadow-[0_12px_28px_rgba(20,28,22,0.055)] focus-within:border-[#173f33] focus-within:ring-2 focus-within:ring-[#173f33]/15">
          <Search className="h-5 w-5 shrink-0 text-[#9aa39d]" aria-hidden="true" />
          <input
            id="faq-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by payment, certificate, accommodation, batch, location..."
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#17231f] outline-none placeholder:text-[#9aa39d]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#68736d] transition hover:bg-[#f4f3ee] hover:text-[#17231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f33]"
              aria-label="Clear FAQ search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-center text-xs font-bold text-[#7d887f]">
          {normalizedQuery ? `${resultCount} answer${resultCount === 1 ? "" : "s"} found` : "Type a keyword to quickly find the right answer."}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-b border-[#e4e1d8] pb-5">
        {contactFaqCategories.map((category, index) => {
          const filteredCount = filteredCategories.find((item) => item.category === category.category)?.questions.length ?? 0;

          return (
            <a
              key={category.category}
              href={`#${getFaqId(category.category)}`}
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.22em] transition hover:text-[#173f33]",
                index === 0 ? "text-[#173f33]" : "text-[#a8ada5]",
                normalizedQuery && filteredCount === 0 ? "pointer-events-none opacity-35" : "",
              )}
            >
              {category.category} ({normalizedQuery ? filteredCount : category.questions.length})
            </a>
          );
        })}
      </div>

      {filteredCategories.length ? (
        <div className="max-h-[42rem] overflow-y-auto pr-1">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={category.category} id={getFaqId(category.category)} className="scroll-mt-32 pt-2 first:pt-0">
              {categoryIndex > 0 ? (
                <h3 className="mb-3 mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#9c6a18]">
                  {category.category}
                </h3>
              ) : null}
              <div className="grid gap-3">
                {category.questions.map((item, questionIndex) => {
                  const isFirstQuestion = categoryIndex === 0 && questionIndex === 0;

                  return (
                    <details
                      key={item.question}
                      open={isFirstQuestion}
                      className="group rounded-[0.35rem] bg-[#f5f6f7] px-4 shadow-[0_8px_22px_rgba(20,28,22,0.035)] open:bg-[#f7f8f8]"
                    >
                      <summary className="flex min-h-[4.15rem] cursor-pointer list-none items-center gap-4 py-3 text-left [&::-webkit-details-marker]:hidden">
                        <Link2 className="h-4 w-4 shrink-0 text-[#aab1af]" aria-hidden="true" />
                        <span className="min-w-0 flex-1 text-sm font-black leading-5 text-[#5f6b70]">
                          {item.question}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-[#b5bbb9] transition group-open:rotate-180 group-open:text-[#4b91d1]" aria-hidden="true" />
                      </summary>
                      <p className="border-t border-[#e8ecec] pb-5 pl-8 pr-8 pt-1 text-sm font-semibold leading-6 text-[#6f7b80]">
                        {item.answer}
                      </p>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#e4e1d8] bg-white px-5 py-8 text-center shadow-[0_12px_28px_rgba(20,28,22,0.055)]">
          <p className="text-base font-black text-[#17231f]">No FAQ matched that search.</p>
          <p className="mt-2 text-sm font-semibold text-[#6f7b80]">Try words like payment, batch, certificate, accommodation, food, location, or enrollment.</p>
        </div>
      )}
    </section>
  );
}
