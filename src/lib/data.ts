import { prisma } from "@/lib/prisma";
import { fallbackArticles, fallbackEvents, fallbackGalleryImages, fallbackPrograms } from "@/lib/fallback-data";

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

function normalizeProgram<T extends { slug: string; title: string }>(program: T): T {
  if (program.slug !== "scientific-beekeeping-foundation") {
    return program;
  }

  return {
    ...program,
    title: "Beekeeping",
  };
}

export async function getPrograms(): Promise<ProgramItem[]> {
  if (!process.env.DATABASE_URL) return fallbackPrograms;
  try {
    const programs = await prisma.program.findMany({
      where: { published: true },
      orderBy: [{ level: "asc" }, { title: "asc" }],
    });
    return programs.map(normalizeProgram);
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

export async function getProgram(slug: string): Promise<ProgramItem | null> {
  if (!process.env.DATABASE_URL) {
    return fallbackPrograms.find((item) => item.slug === slug) ?? null;
  }
  try {
    const program = await prisma.program.findFirst({
      where: { slug, published: true },
    });
    return program ? normalizeProgram(program) : fallbackPrograms.find((item) => item.slug === slug) ?? null;
  } catch {
    return fallbackPrograms.find((item) => item.slug === slug) ?? null;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  if (!process.env.DATABASE_URL) return fallbackEvents;
  try {
    return await prisma.event.findMany({
      where: { published: true },
      orderBy: { startsAt: "asc" },
    });
  } catch {
    return fallbackEvents;
  }
}

export async function getEvent(slug: string): Promise<EventItem | null> {
  if (!process.env.DATABASE_URL) {
    return fallbackEvents.find((item) => item.slug === slug) ?? null;
  }
  try {
    const event = await prisma.event.findFirst({
      where: { slug, published: true },
    });
    return event ?? fallbackEvents.find((item) => item.slug === slug) ?? null;
  } catch {
    return fallbackEvents.find((item) => item.slug === slug) ?? null;
  }
}

export async function getArticles(): Promise<ArticleItem[]> {
  const fallback = fallbackArticles as ArticleItem[];
  if (!process.env.DATABASE_URL) return fallback;
  try {
    return await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
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
    return images.length ? images : fallbackGalleryImages;
  } catch {
    return fallbackGalleryImages;
  }
}
