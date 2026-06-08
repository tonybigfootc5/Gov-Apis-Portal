import Image from "next/image";
import Link from "next/link";
import {
  BookOpenText,
  Camera,
  CirclePlay,
  Clapperboard,
  Leaf,
  Newspaper,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const articleHighlights = [
  {
    title: "Field Notes",
    description: "Quick stories from live apiary visits and demonstration batches.",
    icon: Newspaper,
  },
  {
    title: "Training Journal",
    description: "Short lesson recaps, learner moments, and practical takeaways.",
    icon: BookOpenText,
  },
  {
    title: "Media Diaries",
    description: "Cards can carry photos, short motion clips, or blended visual summaries.",
    icon: Clapperboard,
  },
  {
    title: "Visual Reports",
    description: "An editorial-style browse area inspired by product browser layouts.",
    icon: Camera,
  },
] as const;

const articleCategories = [
  "Featured",
  "Training recaps",
  "Field visits",
  "Honey handling",
  "Queen rearing",
  "Equipment demos",
  "Rural enterprise",
  "Video stories",
  "Photo essays",
  "Institution updates",
] as const;

const fakeArticles = [
  {
    title: "Monsoon hive inspections and calm handling routines",
    category: "Featured",
    summary:
      "A UI-only editorial card showing how a long-form update could combine still photography with practical field notes.",
    meta: "Photo article",
    imageSrc: "/field-beekeeping.jpg",
    imageAlt: "Beekeeping field session",
    chips: ["Image led", "Inspection", "Beginner safe"],
    variant: "feature",
  },
  {
    title: "Inside the training atmosphere",
    category: "Video stories",
    summary:
      "Looping motion can sit directly inside article cards when a field clip communicates the setting better than text alone.",
    meta: "Video article",
    videoSrc: "/hero-background.mp4",
    chips: ["Video", "Campus mood", "Ambient"],
    variant: "video",
  },
  {
    title: "Honey house layout and clean workflow checkpoints",
    category: "Institution updates",
    summary:
      "A compact card layout for process-oriented writeups with a supporting still image and short metadata line.",
    meta: "Image + notes",
    imageSrc: "/honey-house-signboard.jpg",
    imageAlt: "Honey house signboard",
    chips: ["Image", "Workflow", "Facility"],
    variant: "standard",
  },
  {
    title: "Scientific foundation sessions in one visual spread",
    category: "Training recaps",
    summary:
      "This hybrid card demonstrates how a recap can pair a lead image, category labels, and quick bullets without needing a real CMS entry yet.",
    meta: "Mixed media",
    imageSrc: "/scientific-foundation-bg.jpg",
    imageAlt: "Scientific beekeeping foundation training",
    chips: ["Hybrid", "Classroom", "Field"],
    variant: "wide",
  },
  {
    title: "Queen rearing moments worth pinning on the homepage",
    category: "Queen rearing",
    summary:
      "A smaller tile variation for specialized topics, ideal when the homepage needs density without losing readability.",
    meta: "Photo brief",
    imageSrc: "/queen-rearing-bg.jpg",
    imageAlt: "Queen rearing training background",
    chips: ["Photo", "Advanced", "Technique"],
    variant: "standard",
  },
  {
    title: "Toolkit, smoker, veil: what learners actually touch",
    category: "Equipment demos",
    summary:
      "A modular article block that works well for checklists, training snippets, and browse-first discovery patterns.",
    meta: "Card article",
    imageSrc: "/scientific-foundation-bg.jpg",
    imageAlt: "Beekeeping tools and learners",
    chips: ["Checklist", "Gear", "Hands-on"],
    variant: "standard",
  },
] as const;

export function HomeArticlesSection() {
  return (
    <section
      id="articles"
      className="scroll-mt-32 border-y border-[rgba(255,255,255,0.08)] bg-[#1f211f] py-20 text-[#f6f1e6]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Articles" title="Browse visual stories from the center">
          Fake editorial content for UI presentation, shaped as a media-rich browser with image cards, video cards, and mixed layouts.
        </SectionHeading>

        <div className="grid gap-4 xl:grid-cols-4">
          {articleHighlights.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[1.75rem] border border-[rgba(119,167,150,0.18)] bg-[#082636] px-5 py-5 shadow-[0_18px_42px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f1c24a,#7a4df3)] text-[#fff8ea] shadow-[0_14px_32px_rgba(0,0,0,0.24)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#88d8ff]">Editorial block</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#f6f1e6]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#c4d5d0]">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-[1.9rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f6cf74]">Browse topics</p>
            <div className="mt-5 grid gap-1.5">
              {articleCategories.map((category, index) => (
                <div
                  key={category}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    index === 0
                      ? "bg-[rgba(255,255,255,0.14)] text-[#fff8ea]"
                      : "text-[#d0ddd8] hover:bg-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  {category}
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {fakeArticles.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.8rem] border border-[rgba(246,207,116,0.16)] bg-[linear-gradient(135deg,rgba(8,38,54,0.92),rgba(13,22,19,0.96))] px-5 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f6cf74]">UI note</p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#d6e1dc]">
              These are placeholder articles for the homepage experience only, so the layout can later be wired to real content without redesigning the section.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#fff8ea] transition hover:border-[#f6cf74]/50 hover:text-[#f6cf74]"
          >
            Explore gallery
            <Leaf className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  article,
}: {
  article: (typeof fakeArticles)[number];
}) {
  const tallMedia = article.variant === "feature" || article.variant === "video";
  const wideCard = article.variant === "wide";

  return (
    <article
      className={`group overflow-hidden rounded-[1.85rem] border border-[rgba(119,167,150,0.16)] bg-[#082636] shadow-[0_22px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#f6cf74]/34 ${
        wideCard ? "md:col-span-2" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${tallMedia ? "h-56" : "h-48"} ${wideCard ? "md:h-60" : ""}`}>
        {"videoSrc" in article ? (
          <>
            <video
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              src={article.videoSrc}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,7,0.08)_0%,rgba(5,8,7,0.62)_100%)]" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/24 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#fff8ea] backdrop-blur-md">
              <CirclePlay className="h-3.5 w-3.5 text-[#f6cf74]" aria-hidden="true" />
              Motion preview
            </div>
          </>
        ) : (
          <>
            <Image
              src={article.imageSrc}
              alt={article.imageAlt}
              fill
              sizes={wideCard ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 1536px) 24vw, (min-width: 768px) 50vw, 100vw"}
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,7,0.12)_0%,rgba(5,8,7,0.68)_100%)]" />
          </>
        )}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          {article.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/10 bg-[rgba(7,12,10,0.46)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#fff4ce] backdrop-blur-sm"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#88d8ff]">{article.category}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c4d5d0]">{article.meta}</p>
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-[#fff8ea]">{article.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#d0ddd8]">{article.summary}</p>
      </div>
    </article>
  );
}
