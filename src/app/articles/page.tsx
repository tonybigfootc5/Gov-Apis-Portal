import type { Metadata } from "next";
import { HomeArticlesSection } from "@/components/home-articles-section";

export const metadata: Metadata = {
  title: "Articles",
  description: "Editorial-style articles and media stories from API CULTURE.",
};

export default function ArticlesPage() {
  return <HomeArticlesSection />;
}
