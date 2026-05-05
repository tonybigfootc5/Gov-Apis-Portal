"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import type { SiteLanguage } from "@/lib/i18n";

type Props = {
  currentLanguage: SiteLanguage;
  label: string;
  options: Array<{ value: SiteLanguage; label: string }>;
};

export function LanguageSwitcher({ currentLanguage, label, options }: Props) {
  const router = useRouter();

  function onChange(nextLanguage: SiteLanguage) {
    document.cookie = `site-language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#d4c4ac]">
      <span>{label}</span>
      <select
        value={currentLanguage}
        onChange={(event) => onChange(event.target.value as SiteLanguage)}
        className="rounded border border-[#504533] bg-[#241e24] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffd485] outline-none ring-[#ffd485] focus:ring-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
