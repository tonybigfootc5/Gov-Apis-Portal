import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, Newspaper, Share2, Tag } from "lucide-react";
import { getArticle, getArticles } from "@/lib/data";
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
  const [article, allArticles] = await Promise.all([getArticle(slug), getArticles()]);
  const language = await getRequestLanguage();

  if (!article) notFound();
  const localizedArticle = getLocalizedArticle(article, language);
  const relatedArticles = allArticles
    .filter((entry) => entry.slug !== article.slug)
    .map((entry) => getLocalizedArticle(entry, language))
    .slice(0, 5);
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
  const paragraphs = localizedArticle.body
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const publishedLabel = new Date(localizedArticle.publishedAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const readMinutes = Math.max(4, Math.ceil(localizedArticle.body.split(/\s+/).filter(Boolean).length / 180));
  const deskLinks = [
    { href: "/programs", label: "Training programs" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <section className="bg-[#e8e8e5] px-3 py-10 text-[#111513] sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[65rem] bg-[#fffefa] shadow-[0_28px_90px_rgba(27,34,30,0.12)]">
        <header className="border-b border-[#dedbd2] px-5 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-[#5f675f]">
            <span>{publishedLabel}</span>
            <span>{readMinutes} min read</span>
          </div>
          <div className="mt-4 grid items-center gap-3 border-y border-[#dedbd2] py-3 sm:grid-cols-[1fr_auto_1fr]">
            <Link href="/articles" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#516253] transition hover:text-[#1b3b2b]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {articleCopy.back}
            </Link>
            <p className="font-serif text-center text-xl font-black tracking-[0.08em] text-[#111513] sm:text-2xl">API CULTURE TIMES</p>
            <span className="hidden justify-self-end rounded-sm border border-[#cfcac0] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] sm:inline-flex">
              Articles
            </span>
          </div>
          <nav className="mt-3 flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#687168]">
            <span className="text-[#1b6b50]">{localizedArticle.category}</span>
            <span>Training</span>
            <span>Field notes</span>
            <span>Apiculture</span>
          </nav>
        </header>

        <div className="grid gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <article className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#1b6b50]">
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              {localizedArticle.category}
            </div>
            <h1 className="mt-3 font-serif text-[clamp(2rem,4.4vw,4.1rem)] font-black leading-[0.94] text-[#101512]">
              {localizedArticle.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-[#4d5851]">{localizedArticle.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-[#dedbd2] py-3">
              <div>
                <p className="text-sm font-black text-[#14251d]">{localizedArticle.authorName}</p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#7a867b]">{localizedArticle.authorRole}</p>
              </div>
              <div className="flex items-center gap-2 text-[#25332c]">
                <span className="grid h-8 w-8 place-items-center border border-[#d8d4ca]">
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="grid h-8 w-8 place-items-center border border-[#d8d4ca]">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </div>

            <ArticleHeroMedia article={localizedArticle} />

            <div className="mt-7 space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`${index === 0 ? "text-[1.08rem] font-semibold text-[#26352e]" : "text-base text-[#435648]"} leading-8`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {localizedArticle.externalLink ? (
              <a
                href={localizedArticle.externalLink}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 border border-[#1b3b2b] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#1b3b2b] transition hover:bg-[#1b3b2b] hover:text-white"
              >
                {articleCopy.source}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </article>

          <aside className="grid content-start gap-8 border-t border-[#dedbd2] pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {relatedArticles.length ? (
              <section>
                <h2 className="border-b border-[#dedbd2] pb-2 text-sm font-black text-[#173f33]">More from the desk</h2>
                <div className="mt-4 grid gap-4">
                  {relatedArticles.slice(0, 3).map((item) => (
                    <RelatedArticleCard key={item.id} article={item} compact />
                  ))}
                </div>
              </section>
            ) : (
              <section className="border border-[#dedbd2] bg-[#f5f0e6] p-4">
                <h2 className="text-sm font-black text-[#173f33]">Training desk</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#55635b]">
                  Explore practical courses, field events, and center updates from API CULTURE.
                </p>
                <div className="mt-4 grid gap-2">
                  {deskLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="border border-[#d7cbb8] bg-[#fffefa] px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#1b3b2b] transition hover:border-[#b36b00] hover:text-[#b36b00]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {keyPoints.length ? (
              <section>
                <h2 className="border-b border-[#dedbd2] pb-2 text-sm font-black text-[#173f33]">{articleCopy.keyPoints}</h2>
                <div className="mt-4 grid gap-3">
                  {keyPoints.map((point) => (
                    <div key={point} className="flex items-start gap-2 text-sm leading-6 text-[#46564d]">
                      <Tag className="mt-1 h-4 w-4 shrink-0 text-[#b36b00]" aria-hidden="true" />
                      {point}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedArticles.length ? (
              <section>
                <h2 className="border-b border-[#dedbd2] pb-2 text-sm font-black text-[#173f33]">Most read</h2>
                <div className="mt-4 grid gap-4">
                  {relatedArticles.slice(0, 5).map((item, index) => (
                    <Link key={item.id} href={`/articles/${item.slug}`} className="group grid grid-cols-[1.8rem_1fr] gap-3">
                      <span className="text-lg font-black text-[#b36b00]">{index + 1}</span>
                      <span className="text-sm font-bold leading-5 text-[#26352e] transition group-hover:text-[#b36b00]">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

function ArticleHeroMedia({
  article,
}: {
  article: {
    title: string;
    mediaUrl: string | null;
    mediaType: "IMAGE" | "VIDEO" | "ARTICLE_ASSET" | null;
  };
}) {
  if (!article.mediaUrl) {
    return null;
  }

  if (article.mediaType === "VIDEO") {
    return <video src={article.mediaUrl} controls preload="metadata" className="mt-6 aspect-[16/9] w-full bg-[#1b3b2b]" />;
  }

  return (
    <figure className="mt-6">
      <Image
        src={article.mediaUrl}
        alt={article.title}
        width={1100}
        height={700}
        unoptimized
        className="aspect-[16/10] w-full object-cover"
      />
      <figcaption className="mt-2 border-b border-[#dedbd2] pb-3 text-[11px] leading-5 text-[#7a867b]">
        API Culture field file image for this article.
      </figcaption>
    </figure>
  );
}

function RelatedArticleCard({
  article,
  compact = false,
}: {
  article: {
    title: string;
    slug: string;
    mediaUrl: string | null;
    mediaType: "IMAGE" | "VIDEO" | "ARTICLE_ASSET" | null;
    publishedAt: Date;
  };
  compact?: boolean;
}) {
  return (
    <Link href={`/articles/${article.slug}`} className="group grid grid-cols-[4.5rem_1fr] gap-3">
      <div className="relative h-14 overflow-hidden bg-[#e8e3d8]">
        {article.mediaUrl && article.mediaType !== "VIDEO" ? (
          <Image src={article.mediaUrl} alt={article.title} fill unoptimized className="object-cover transition group-hover:scale-105" sizes="5rem" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#e8e3d8,#fff7df)]" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className={`${compact ? "text-xs" : "text-sm"} line-clamp-3 font-black leading-5 text-[#26352e] transition group-hover:text-[#b36b00]`}>
          {article.title}
        </h3>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7a867b]">
          {new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
        </p>
      </div>
    </Link>
  );
}
