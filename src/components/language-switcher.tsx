"use client";

import { Fragment, startTransition } from "react";
import { useRouter } from "next/navigation";
import type { SiteLanguage } from "@/lib/i18n";

type Props = {
  currentLanguage: SiteLanguage;
  label: string;
  options: Array<{ value: SiteLanguage; label: string }>;
  variant?: "default" | "footer" | "header";
};

const compactLanguageLabels: Record<SiteLanguage, { text: string; ariaLabel: string }> = {
  en: { text: "EN", ariaLabel: "Switch to English" },
  te: { text: "తె", ariaLabel: "Switch to Telugu" },
  hi: { text: "हि", ariaLabel: "Switch to Hindi" },
};

export function LanguageSwitcher({ currentLanguage, label, options, variant = "default" }: Props) {
  const router = useRouter();

  function onChange(nextLanguage: SiteLanguage) {
    // eslint-disable-next-line react-hooks/immutability -- Persist the user's language choice before refreshing server-rendered copy.
    document.cookie = `site-language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  const isFooter = variant === "footer";
  const isHeader = variant === "header";
  const visibleOptions = options.filter((option) => option.value !== currentLanguage);

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs font-bold ${
        isFooter
          ? "rounded-full border border-[rgba(7,20,33,0.12)] bg-[rgba(255,255,255,0.8)] p-1 text-[#1b3b2b] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]"
          : isHeader
            ? "rounded-full border border-[rgba(255,255,255,0.34)] bg-[rgba(7,20,33,0.1)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_10px_24px_rgba(7,20,33,0.08)] backdrop-blur-xl"
            : "rounded-full border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] p-1 text-[#516253]"
      }`}
      aria-label={label}
      role="group"
    >
      {visibleOptions.map((option, index) => {
        const compact = compactLanguageLabels[option.value];

        return (
          <Fragment key={option.value}>
            {index > 0 ? (
              <span
                className={`h-7 w-px rounded-full ${isHeader ? "bg-[rgba(255,255,255,0.28)]" : "bg-[rgba(7,20,33,0.14)]"}`}
                aria-hidden="true"
              />
            ) : null}
            <button
              type="button"
              onClick={() => onChange(option.value)}
              aria-label={compact.ariaLabel}
              title={option.label}
              className={`grid shrink-0 place-items-center rounded-full border font-black leading-none outline-none ring-[#071421]/20 transition hover:-translate-y-0.5 focus:ring-2 ${
                isHeader
                  ? "border-[rgba(7,20,33,0.14)] bg-[rgba(255,255,255,0.72)] text-[#071421] shadow-[0_8px_18px_rgba(7,20,33,0.08),inset_0_1px_0_rgba(255,255,255,0.86)] hover:bg-[rgba(255,255,255,0.9)]"
                  : "border-[#071421] bg-[#071421] text-white shadow-[0_10px_20px_rgba(7,20,33,0.18)] hover:bg-[#14243a]"
              } ${
                isFooter
                  ? "h-9 min-w-9 px-2.5"
                  : isHeader
                    ? "h-9 min-w-10 px-2.5"
                    : "h-9 min-w-9 px-2.5"
              }`}
              style={{
                fontSize: isHeader ? "18px" : "16px",
              }}
            >
              {compact.text}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
