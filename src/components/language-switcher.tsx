"use client";

import { startTransition } from "react";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SiteLanguage } from "@/lib/i18n";

type Props = {
  currentLanguage: SiteLanguage;
  label: string;
  options: Array<{ value: SiteLanguage; label: string }>;
  variant?: "default" | "footer" | "header";
};

export function LanguageSwitcher({ currentLanguage, label, options, variant = "default" }: Props) {
  const router = useRouter();

  function onChange(nextLanguage: SiteLanguage) {
    document.cookie = `site-language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  const isFooter = variant === "footer";
  const isHeader = variant === "header";

  return (
    <label
      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] ${
        isFooter ? "text-[#e5e7e3]" : isHeader ? "rounded-full border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,253,248,0.28))] px-3 py-1.5 text-[#1b3b2b] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_rgba(64,44,8,0.08)] backdrop-blur-xl" : "text-[#516253]"
      }`}
    >
      {isHeader ? <Languages className="h-4 w-4 text-[#b36b00]" aria-hidden="true" /> : null}
      <span className={isHeader ? "text-[10px] tracking-[0.18em] text-[#516253]" : ""}>{label}</span>
      <select
        value={currentLanguage}
        onChange={(event) => onChange(event.target.value as SiteLanguage)}
        className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] outline-none ring-[#ebb428] focus:ring-2 ${
          isFooter
            ? "border border-[rgba(250,248,242,0.22)] bg-[rgba(255,253,248,0.08)] text-[#faf8f2]"
            : isHeader
              ? "min-w-[5.5rem] border border-white/50 bg-[rgba(255,255,255,0.44)] text-[#1b3b2b] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
              : "border border-[rgba(27,59,43,0.14)] bg-[#fffdf8] text-[#1b3b2b]"
        }`}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#fffdf8] text-[#1b3b2b]"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
