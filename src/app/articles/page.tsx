import type { Metadata } from "next";
import { ArticlesEditorialExperience, type ArticleCardData } from "@/components/articles-editorial-experience";
import { getArticles } from "@/lib/data";
import { getLocalizedArticle } from "@/lib/public-content";
import { getRequestLanguage } from "@/lib/request-language";

export const metadata: Metadata = {
  title: "Articles",
  description: "Editorial-style articles and media stories from API CULTURE.",
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const language = await getRequestLanguage();
  const articles: ArticleCardData[] = (await getArticles()).map((entry) => {
    const article = getLocalizedArticle(entry, language);

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      body: article.body,
      category: article.category,
      publishedAt: new Date(article.publishedAt).toISOString(),
      mediaUrl: article.mediaUrl,
      mediaType: article.mediaType,
      keyPoints: article.keyPoints,
    };
  });

  return <ArticlesEditorialExperience articles={articles} />;
}
