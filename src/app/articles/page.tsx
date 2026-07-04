import type { Metadata } from "next";
import { HomeArticlesSection } from "@/components/home-articles-section";
import { getArticles } from "@/lib/data";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "Articles",
  description: "Editorial-style articles and media stories from API CULTURE.",
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const language = await getRequestLanguage();
  const articles = await getArticles();
  return <HomeArticlesSection articles={articles} language={language} />;
}
