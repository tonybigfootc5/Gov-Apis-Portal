"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";

export type ArticleCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  publishedAt: string;
  mediaUrl: string | null;
  mediaType: "IMAGE" | "VIDEO" | "ARTICLE_ASSET" | null;
  keyPoints: string;
};

type RangeFilter = "all" | "week" | "month" | "year";

const rangeOptions: Array<{ value: RangeFilter; label: string }> = [
  { value: "all", label: "All time" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

export function ArticlesEditorialExperience({ articles }: { articles: ArticleCardData[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [range, setRange] = useState<RangeFilter>("all");

  const categories = useMemo(() => ["All", ...Array.from(new Set(articles.map((article) => article.category))).sort()], [articles]);
  const filteredArticles = useMemo(() => {
    const now = new Date();
    const normalizedQuery = query.trim().toLowerCase();

    return articles.filter((article) => {
      const publishedAt = new Date(article.publishedAt);
      const haystack = [article.title, article.excerpt, article.body, article.category, article.keyPoints].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesCategory = category === "All" || article.category === category;
      const ageMs = now.getTime() - publishedAt.getTime();
      const matchesRange =
        range === "all" ||
        (range === "week" && ageMs <= 7 * 24 * 60 * 60 * 1000) ||
        (range === "month" && publishedAt.getFullYear() === now.getFullYear() && publishedAt.getMonth() === now.getMonth()) ||
        (range === "year" && publishedAt.getFullYear() === now.getFullYear());

      return matchesQuery && matchesCategory && matchesRange;
    });
  }, [articles, category, query, range]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return articles.slice(0, 3);
    return filteredArticles.slice(0, 4);
  }, [articles, filteredArticles, query]);

  const [featured, ...rest] = filteredArticles;
  const latestPosts = filteredArticles.slice(0, 4);
  const cards = rest.length > 0 ? rest : filteredArticles;

  return (
    <section className="bg-[#eee3d5] px-4 py-14 text-[#111312] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2.6rem] bg-[#fffefa] px-8 py-8 shadow-[0_30px_90px_rgba(63,45,24,0.12)] lg:px-12 lg:py-10">
        <header className="pb-12">
          <ArticleFinder
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            range={range}
            setRange={setRange}
            categories={categories}
            suggestions={suggestions}
            total={filteredArticles.length}
          />
        </header>

        {featured ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <Link href={`/articles/${featured.slug}`} className="group relative min-h-[28rem] overflow-hidden rounded-[1rem] bg-[#201a15]">
              <ArticleMedia article={featured} priority />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_30%,rgba(0,0,0,0.62)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 text-[11px] font-semibold text-[#a94d1c]">
                  <span className="h-2 w-2 rounded-full bg-[#a94d1c]" />
                  {featured.category}
                </span>
                <h1 className="mt-5 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] font-black leading-[0.96] tracking-[-0.06em]">
                  {featured.title}
                </h1>
                <p className="mt-4 text-xs font-medium text-white/80">{formatArticleMeta(featured.publishedAt)}</p>
              </div>
            </Link>

            <aside>
              <h2 className="text-3xl font-black tracking-[-0.055em]">Latest post</h2>
              <div className="mt-5 grid gap-5">
                {latestPosts.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} className="group grid grid-cols-[4.4rem_1fr] gap-4">
                    <div className="relative h-20 overflow-hidden rounded-lg bg-[#ece5dc]">
                      <ArticleMedia article={article} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-base font-black leading-[1.05] tracking-[-0.035em] transition group-hover:text-[#a94d1c]">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-[11px] font-medium text-[#6e716a]">{formatArticleMeta(article.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <div className="rounded-[1.4rem] border border-[#ece5dc] bg-[#faf7f1] p-8 text-center">
            <p className="text-2xl font-black tracking-[-0.04em]">No articles match these filters.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setRange("all");
              }}
              className="mt-4 rounded-full bg-[#151615] px-5 py-3 text-sm font-black text-white"
            >
              Reset search
            </button>
          </div>
        )}

        <div className="mt-10 border-t border-[#e8e3dc] pt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-black tracking-[-0.055em]">Founders corner</h2>
            <div className="hidden items-center gap-3 sm:flex">
              <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ddd8d0] text-[#9b9d96]" type="button" aria-label="Previous articles">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-[#ddd8d0] text-[#9b9d96]" type="button" aria-label="Next articles">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-7 md:grid-cols-3">
            {cards.slice(0, 3).map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group rounded-[1rem] bg-[#fffefa] p-2 transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(63,45,24,0.1)]">
                <div className="relative h-36 overflow-hidden rounded-[0.75rem] bg-[#ece5dc]">
                  <ArticleMedia article={article} />
                </div>
                <div className="p-3">
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#9b6a45]">
                    <span className="h-2 w-2 rounded-full bg-[#a94d1c]" />
                    {article.category}
                  </span>
                  <h3 className="mt-4 text-xl font-black leading-[1.06] tracking-[-0.045em] transition group-hover:text-[#a94d1c]">
                    {article.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f736d]">{article.excerpt}</p>
                  <p className="mt-4 text-[11px] font-medium text-[#85877f]">{formatArticleMeta(article.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <footer className="mt-10 flex items-center justify-between border-t border-[#e8e3dc] pt-8 text-sm text-[#585d57]">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          <div className="flex items-center gap-7 text-xs font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#161a1b] text-white">1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </footer>
      </div>
    </section>
  );
}

function ArticleFinder({
  query,
  setQuery,
  category,
  setCategory,
  range,
  setRange,
  categories,
  suggestions,
  total,
}: {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  range: RangeFilter;
  setRange: (value: RangeFilter) => void;
  categories: string[];
  suggestions: ArticleCardData[];
  total: number;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div className="rounded-[1.6rem] border border-[#ece5dc] bg-[#faf7f1] p-4">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-4 shadow-[inset_0_0_0_1px_rgba(17,19,18,0.06)]">
          <Search className="h-5 w-5 shrink-0 text-[#a94d1c]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bee care, honey production, pollination..."
            className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[#151615] outline-none placeholder:text-[#85877f]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="grid h-8 w-8 place-items-center rounded-full bg-[#f0ebe2]" aria-label="Clear search">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
                category === item ? "bg-[#151615] text-white" : "bg-white text-[#5f625c] hover:bg-[#f0ebe2]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <aside className="rounded-[1.6rem] border border-[#ece5dc] bg-[#fffefa] p-4">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#a94d1c]">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Narrow by latest
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {rangeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRange(option.value)}
              className={`rounded-full px-3 py-2 text-xs font-black transition ${
                range === option.value ? "bg-[#a94d1c] text-white" : "bg-[#f4efe7] text-[#60645e] hover:bg-[#eadfd3]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold text-[#85877f]">{total} matching article{total === 1 ? "" : "s"}</p>
      </aside>

      <div className="lg:col-span-2">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#85877f]">Suggestions</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => setQuery(article.title)}
              className="rounded-full bg-[#f4efe7] px-4 py-2 text-xs font-semibold text-[#4e534d] transition hover:bg-[#eadfd3]"
            >
              {article.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticleMedia({ article, priority = false }: { article: { mediaUrl: string | null; mediaType: string | null; title: string }; priority?: boolean }) {
  if (article.mediaUrl && article.mediaType === "VIDEO") {
    return <video src={article.mediaUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" />;
  }

  return (
    <Image
      src={article.mediaUrl || "/card-backgrounds/honey-bee-tech-image.jpg"}
      alt={article.title}
      fill
      priority={priority}
      sizes="(min-width: 1024px) 42rem, 100vw"
      className="object-cover transition duration-500 group-hover:scale-[1.03]"
      unoptimized
    />
  );
}

function formatArticleMeta(date: Date | string) {
  return `${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}  •  10 min read`;
}
