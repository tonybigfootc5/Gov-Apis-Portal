import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, Tag } from "lucide-react";
import type { ArticleItem } from "@/lib/data";
import { SectionHeading } from "@/components/section-heading";
import type { SiteLanguage } from "@/lib/i18n";
import { getSiteCopy } from "@/lib/site-copy";

export function HomeArticlesSection({ articles, language }: { articles: ArticleItem[]; language: SiteLanguage }) {
  const copy = getSiteCopy(language);

  return (
    <section className="py-20 text-[#1b3b2b]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={copy.articles.eyebrow} title={copy.articles.title}>
          {copy.articles.body}
        </SectionHeading>

        <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="paper-panel rounded-[1.9rem] p-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b36b00]">{copy.articles.sidebarEyebrow}</p>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[#516253]">
              <div className="rounded-[1.3rem] bg-[#fffdf8] p-4">
                <p className="font-semibold text-[#1b3b2b]">{copy.articles.sidebarCards[0].title}</p>
                <p className="mt-2">{copy.articles.sidebarCards[0].text}</p>
              </div>
              <div className="rounded-[1.3rem] bg-[#fffdf8] p-4">
                <p className="font-semibold text-[#1b3b2b]">{copy.articles.sidebarCards[1].title}</p>
                <p className="mt-2">{copy.articles.sidebarCards[1].text}</p>
              </div>
            </div>
          </aside>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group flex h-full flex-col rounded-[1.9rem] border border-[rgba(27,59,43,0.12)] bg-[#fffdf8] p-6 shadow-[0_20px_48px_rgba(64,44,8,0.08)] transition hover:-translate-y-1 hover:border-[#b36b00]/34"
              >
                {article.mediaUrl ? (
                  <div className="relative -mx-6 -mt-6 mb-5 overflow-hidden rounded-t-[1.9rem] bg-[#ece3d3]">
                    {article.mediaType === "VIDEO" ? (
                      <video src={article.mediaUrl} controls preload="metadata" className="aspect-video w-full object-cover" />
                    ) : (
                      <Image src={article.mediaUrl} alt={article.title} width={1200} height={700} unoptimized className="aspect-[16/10] w-full object-cover" />
                    )}
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f6efe4] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#b36b00]">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#607366]">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl font-semibold leading-tight text-[#1b3b2b]">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#516253]">{article.excerpt}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {article.keyPoints
                    .split("\n")
                    .map((point) => point.trim())
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((point) => (
                      <span
                        key={point}
                        className="inline-flex items-center gap-1 rounded-full border border-[rgba(27,59,43,0.1)] bg-[#f8f4ea] px-3 py-1 text-[11px] font-semibold text-[#435648]"
                      >
                        <Tag className="h-3 w-3 text-[#b36b00]" aria-hidden="true" />
                        {point}
                      </span>
                    ))}
                </div>

                <div className="mt-auto pt-6">
                  <p className="text-sm font-semibold text-[#1b3b2b]">{article.authorName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#7a867b]">{article.authorRole}</p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#1b3b2b] transition group-hover:text-[#b36b00]"
                  >
                    {copy.articles.readArticle}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {!articles.length ? (
          <div className="paper-panel rounded-[1.8rem] p-6 text-sm leading-7 text-[#516253]">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff4d1] text-[#b36b00]">
                <BookOpenText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-[#1b3b2b]">{copy.articles.emptyTitle}</p>
                <p className="mt-1">{copy.articles.emptyBody}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
