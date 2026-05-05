import { cookies } from "next/headers";
import { defaultLanguage, languageCookieName, supportedLanguages, type SiteLanguage } from "@/lib/i18n";

function isSupportedLanguage(value: string | undefined): value is SiteLanguage {
  return supportedLanguages.includes(value as SiteLanguage);
}

export async function getRequestLanguage(): Promise<SiteLanguage> {
  const cookieStore = await cookies();
  const value = cookieStore.get(languageCookieName)?.value;
  return isSupportedLanguage(value) ? value : defaultLanguage;
}
