import type { Metadata } from "next";
import AboutUsSection from "@/components/ui/about-us-section";

export const metadata: Metadata = {
  title: "About",
  description: "About API CULTURE Technology Center for beekeeping and apiculture technology.",
};

export default function AboutPage() {
  return <AboutUsSection />;
}
