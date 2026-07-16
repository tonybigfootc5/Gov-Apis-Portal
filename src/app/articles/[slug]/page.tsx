import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Tag } from "lucide-react";
import { getArticle } from "@/lib/data";
import { getLocalizedArticle } from "@/lib/public-content";
import { getRequestLanguage } from "@/lib/request-language";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  const language = await getRequestLanguage();

  if (!article) notFound();
  const localizedArticle = getLocalizedArticle(article, language);
  const articleCopy = {
    en: {
      back: "Back to articles",
      keyPoints: "Key points",
      source: "Open source link",
    },
    te: {
      back: "వ్యాసాలకు తిరిగి వెళ్ళండి",
      keyPoints: "ముఖ్యాంశాలు",
      source: "మూల లింక్ తెరవండి",
    },
    hi: {
      back: "लेखों पर वापस जाएँ",
      keyPoints: "मुख्य बिंदु",
      source: "स्रोत लिंक खोलें",
    },
  }[language];

  const keyPoints = localizedArticle.keyPoints
    .split("\n")
    .map((point) => point.trim())
    .filter(Boolean);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#516253] transition hover:text-[#1b3b2b]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {articleCopy.back}
      </Link>

      <article className="mt-8 overflow-hidden rounded-[2.2rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] shadow-[0_28px_70px_rgba(64,44,8,0.08)]">
        <div className="border-b border-[rgba(27,59,43,0.08)] bg-[#f3ecdf] px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">
            <span className="rounded-full bg-[#fff8ea] px-3 py-1">{localizedArticle.category}</span>
            <span>{new Date(localizedArticle.publishedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-tight text-[#1b3b2b] sm:text-5xl">
            {localizedArticle.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#516253]">{localizedArticle.excerpt}</p>
          <div className="mt-6">
            <p className="text-sm font-semibold text-[#1b3b2b]">{localizedArticle.authorName}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#7a867b]">{localizedArticle.authorRole}</p>
          </div>
        </div>

        {localizedArticle.mediaUrl ? (
          <div className="border-b border-[rgba(27,59,43,0.08)] bg-[#ece3d3]">
            {localizedArticle.mediaType === "VIDEO" ? (
              <video src={localizedArticle.mediaUrl} controls preload="metadata" className="aspect-video w-full bg-[#1b3b2b]" />
            ) : (
              <Image
                src={localizedArticle.mediaUrl}
                alt={localizedArticle.title}
                width={1400}
                height={900}
                unoptimized
                className="aspect-[16/9] w-full object-cover"
              />
            )}
          </div>
        ) : null}

        <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <div className="prose prose-stone max-w-none">
              {localizedArticle.body.split("\n\n").map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-[#435648]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <aside className="grid content-start gap-4">
            <div className="paper-panel rounded-[1.7rem] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b36b00]">{articleCopy.keyPoints}</p>
              <div className="mt-4 grid gap-3">
                {keyPoints.map((point) => (
                  <div key={point} className="inline-flex items-start gap-2 rounded-[1.2rem] bg-[#fffdf8] p-3 text-sm text-[#435648]">
                    <Tag className="mt-0.5 h-4 w-4 shrink-0 text-[#b36b00]" aria-hidden="true" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            {localizedArticle.externalLink ? (
              <a
                href={localizedArticle.externalLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b3b2b] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#faf8f2] transition hover:bg-[#2d312e]"
              >
                {articleCopy.source}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </aside>
        </div>
      </article>
    </section>
  );
}
