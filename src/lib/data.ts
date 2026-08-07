import { prisma } from "@/lib/prisma";
import { fallbackArticles, fallbackGalleryImages, fallbackPrograms } from "@/lib/fallback-data";
import { deprecatedTrainingProgramSlugs, trainingProgramCatalog, trainingProgramCatalogBySlug } from "@/lib/training-programs";

export type ProgramItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  duration: string;
  level: string;
  fee: string | null;
  capacity: number;
  batchStartsAt: Date | null;
  enrollmentClosed: boolean;
  popupEnabled: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date | null;
  status: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  publishedAt: Date;
  authorName: string;
  authorRole: string;
  mediaUrl: string | null;
  mediaObjectKey: string | null;
  mediaType: "IMAGE" | "VIDEO" | "ARTICLE_ASSET" | null;
  externalLink: string | null;
  keyPoints: string;
  seoTitle: string;
  metaDescription: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GalleryImageItem = {
  id: string;
  url: string;
  caption: string;
  date: Date;
  place: string | null;
  category: string;
  year: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const legacyArticleSlugs = new Set([
  "managing-bee-colonies-in-high-temperature-without-losing-strength",
  "how-to-select-a-bee-honey-production-during-monsoon-season-in-beekeeping",
  "poor-pollination-in-crop-fields-how-better-bee-placement-can-improve-results",
  "smoker-handling-mistakes-that-make-hive-inspections-harder",
  "honey-hygiene-checklist-before-extraction-day",
  "queen-cell-selection-what-trainees-should-observe-first",
  "how-rural-youth-can-start-a-small-training-apiary",
  "monsoon-feeding-when-support-helps-and-when-it-creates-risk",
  "a-practical-day-plan-for-beekeeping-training-batches",
  "royal-jelly-room-setup-small-details-that-matter",
  "campus-field-note-what-visitors-notice-first-at-the-center",
  "starter-equipment-kit-what-new-learners-actually-need",
  "apiary-records-that-help-trainers-spot-problems-early",
  "market-ready-honey-labels-confidence-and-buyer-trust",
  "flowering-calendar-notes-every-beekeeper-should-maintain",
]);

function buildCatalogProgram(program: (typeof trainingProgramCatalog)[number]): ProgramItem {
  return {
    id: program.id,
    title: program.title,
    slug: program.slug,
    summary: program.summary,
    description: program.description,
    duration: program.duration,
    level: program.level,
    fee: program.fee,
    capacity: program.capacity,
    batchStartsAt: new Date(program.batchStartsAt),
    enrollmentClosed: program.enrollmentClosed,
    popupEnabled: program.popupEnabled,
    published: program.published,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
}

function mergeProgramWithCatalog(program: ProgramItem): ProgramItem {
  const catalog = trainingProgramCatalogBySlug[program.slug];

  if (!catalog) {
    return program;
  }

  return {
    ...program,
    title: catalog.title,
    summary: catalog.summary,
    description: catalog.description,
    duration: catalog.duration,
    level: catalog.level,
    fee: catalog.fee || program.fee,
    capacity: catalog.capacity,
    batchStartsAt: new Date(catalog.batchStartsAt),
    slug: catalog.slug,
  };
}

function orderPrograms(programs: ProgramItem[]) {
  const order = new Map(trainingProgramCatalog.map((program, index) => [program.slug, index]));

  return [...programs].sort((left, right) => {
    const leftOrder = order.get(left.slug);
    const rightOrder = order.get(right.slug);

    if (leftOrder != null && rightOrder != null) {
      return leftOrder - rightOrder;
    }

    if (leftOrder != null) return -1;
    if (rightOrder != null) return 1;

    return left.title.localeCompare(right.title);
  });
}

function isActiveTrainingProgram(program: { slug: string }) {
  return !deprecatedTrainingProgramSlugs.has(program.slug);
}

export async function getPrograms(): Promise<ProgramItem[]> {
  if (!process.env.DATABASE_URL) return fallbackPrograms;
  try {
    const programs = await prisma.program.findMany({
      where: { published: true },
      orderBy: [{ level: "asc" }, { title: "asc" }],
    });

    const mergedPrograms = new Map<string, ProgramItem>();

    for (const catalogProgram of trainingProgramCatalog) {
      mergedPrograms.set(catalogProgram.slug, buildCatalogProgram(catalogProgram));
    }

    for (const program of programs.filter(isActiveTrainingProgram)) {
      const normalizedProgram = mergeProgramWithCatalog(program);
      mergedPrograms.set(normalizedProgram.slug, normalizedProgram);
    }

    return orderPrograms(Array.from(mergedPrograms.values()));
  } catch {
    return fallbackPrograms;
  }
}

export function getAnnouncementPrograms(programs: ProgramItem[], now = new Date()) {
  return programs
    .filter(
      (program) =>
        program.published &&
        program.popupEnabled &&
        !program.enrollmentClosed &&
        (!program.batchStartsAt || program.batchStartsAt > now),
    )
    .sort((left, right) => {
      if (left.batchStartsAt && right.batchStartsAt) {
        return left.batchStartsAt.getTime() - right.batchStartsAt.getTime();
      }
      if (left.batchStartsAt) return -1;
      if (right.batchStartsAt) return 1;
      return left.title.localeCompare(right.title);
    });
}

export async function getPopupAnnouncementPrograms(now = new Date()): Promise<ProgramItem[]> {
  if (!process.env.DATABASE_URL) {
    return getAnnouncementPrograms(fallbackPrograms, now);
  }

  try {
    const programs = await prisma.program.findMany({
      where: {
        published: true,
        popupEnabled: true,
        enrollmentClosed: false,
        OR: [{ batchStartsAt: null }, { batchStartsAt: { gt: now } }],
      },
      orderBy: [{ batchStartsAt: "asc" }, { title: "asc" }],
    });

    return programs.filter(isActiveTrainingProgram).map(mergeProgramWithCatalog);
  } catch {
    return getAnnouncementPrograms(fallbackPrograms, now);
  }
}

export async function getProgram(slug: string): Promise<ProgramItem | null> {
  if (!process.env.DATABASE_URL) {
    return fallbackPrograms.find((item) => item.slug === slug) ?? null;
  }
  try {
    const program = await prisma.program.findFirst({
      where: { slug, published: true },
    });
    if (program && isActiveTrainingProgram(program)) {
      return mergeProgramWithCatalog(program);
    }

    const catalogProgram = trainingProgramCatalogBySlug[slug];
    return catalogProgram ? buildCatalogProgram(catalogProgram) : fallbackPrograms.find((item) => item.slug === slug) ?? null;
  } catch {
    return fallbackPrograms.find((item) => item.slug === slug) ?? null;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await prisma.event.findMany({
      where: { published: true },
      orderBy: { startsAt: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getEvent(slug: string): Promise<EventItem | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  try {
    const event = await prisma.event.findFirst({
      where: { slug, published: true },
    });
    return event ?? null;
  } catch {
    return null;
  }
}

export async function getArticles(): Promise<ArticleItem[]> {
  const fallback = fallbackArticles as ArticleItem[];
  if (!process.env.DATABASE_URL) return fallback;
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });

    const articlesBySlug = new Map<string, ArticleItem>();
    for (const article of [...articles.filter((item) => !legacyArticleSlugs.has(item.slug)), ...fallback]) {
      articlesBySlug.set(article.slug, article);
    }

    return Array.from(articlesBySlug.values()).sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime());
  } catch {
    return fallback;
  }
}

export async function getArticle(slug: string): Promise<ArticleItem | null> {
  const fallback = (fallbackArticles as ArticleItem[]).find((item) => item.slug === slug) ?? null;
  if (!process.env.DATABASE_URL) {
    return fallback;
  }
  try {
    if (legacyArticleSlugs.has(slug)) {
      return fallback;
    }
    const article = await prisma.article.findFirst({
      where: { slug, published: true },
    });
    return article ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getGalleryImages(): Promise<GalleryImageItem[]> {
  if (!process.env.DATABASE_URL) return fallbackGalleryImages;
  try {
    const images = await prisma.galleryImage.findMany({
      where: { published: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
    const legacyGalleryUrls = new Set([
      "/honey-house-signboard.jpg",
      "/field-beekeeping.jpg",
      "/scientific-foundation-bg.jpg",
      "/queen-rearing-bg.jpg",
      "/kavuri-extract-0.png",
      "/kavuri-extract-1.png",
      "/kavuri-extract-2.png",
      "/kavuri-extract-3.png",
    ]);
    const currentGalleryUrls = new Set(fallbackGalleryImages.map((image) => image.url));
    const manualImages = images.filter((image) => !legacyGalleryUrls.has(image.url) && !currentGalleryUrls.has(image.url));

    return [...fallbackGalleryImages, ...manualImages].sort((left, right) => right.date.getTime() - left.date.getTime());
  } catch {
    return fallbackGalleryImages;
  }
}
