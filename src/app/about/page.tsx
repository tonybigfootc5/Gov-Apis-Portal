import type { Metadata } from "next";
import AboutUsSection from "@/components/ui/about-us-section";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "About",
  description: "About API CULTURE Technology Center for beekeeping and apiculture technology.",
};

export default async function AboutPage() {
  const language = await getRequestLanguage();
  return <AboutUsSection language={language} />;
}
