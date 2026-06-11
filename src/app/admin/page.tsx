import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { requireAdmin } from "@/lib/auth";
import { fallbackApplications, fallbackArticles, fallbackEvents, fallbackGalleryImages, fallbackPrograms } from "@/lib/fallback-data";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { mapTrainingApplicationRecord, TRAINING_APPLICATION_SUBJECT_PREFIX } from "@/lib/training-application";

export const dynamic = "force-dynamic";

type AdminProgram = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  duration: string;
  level: "FOUNDATION" | "ADVANCED" | "PROFESSIONAL";
  fee: string | null;
  capacity: number;
  batchStartsAt: Date | null;
  enrollmentClosed: boolean;
  popupEnabled: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AdminEvent = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date | null;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AdminArticle = {
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

type AdminGalleryImage = {
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

export default async function AdminPage() {
  const allowed = await requireAdmin();
  if (!allowed) redirect("/admin/login");

  let programs: AdminProgram[] = fallbackPrograms.map((program) => ({
    ...program,
    level: program.level as AdminProgram["level"],
    fee: program.fee ?? null,
  }));
  let events: AdminEvent[] = fallbackEvents.map((event) => ({
    ...event,
    status: event.status as AdminEvent["status"],
    endsAt: event.endsAt ?? null,
  }));
  let articles: AdminArticle[] = fallbackArticles.map((article) => ({
    ...article,
    mediaUrl: article.mediaUrl ?? null,
    mediaObjectKey: article.mediaObjectKey ?? null,
    mediaType: article.mediaType as AdminArticle["mediaType"],
    externalLink: article.externalLink || null,
  }));
  let galleryImages: AdminGalleryImage[] = fallbackGalleryImages.map((image) => ({
    ...image,
    place: image.place ?? null,
  }));
  let applications: NonNullable<ReturnType<typeof mapTrainingApplicationRecord>>[] = fallbackApplications;

  if (hasDatabaseUrl) {
    try {
      const [dbPrograms, dbEvents, dbArticles, dbGalleryImages, applicationMessages] = await Promise.all([
        prisma.program.findMany({ orderBy: { updatedAt: "desc" } }),
        prisma.event.findMany({ orderBy: { startsAt: "desc" } }),
        prisma.article.findMany({ orderBy: { publishedAt: "desc" } }),
        prisma.galleryImage.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }] }),
        prisma.contactMessage.findMany({
          where: {
            subject: {
              startsWith: TRAINING_APPLICATION_SUBJECT_PREFIX,
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      programs = dbPrograms.map((program) => ({
        ...program,
        level: program.level,
        fee: program.fee ?? null,
      }));
      events = dbEvents.map((event) => ({
        ...event,
        status: event.status,
        endsAt: event.endsAt ?? null,
      }));
      articles = dbArticles.map((article) => ({
        ...article,
        mediaUrl: article.mediaUrl ?? null,
        mediaObjectKey: article.mediaObjectKey ?? null,
        mediaType: article.mediaType ?? null,
        externalLink: article.externalLink ?? null,
      }));
      galleryImages = dbGalleryImages.length
        ? dbGalleryImages.map((image) => ({
            ...image,
            place: image.place ?? null,
          }))
        : galleryImages;
      applications = applicationMessages
        .map(mapTrainingApplicationRecord)
        .filter((value): value is NonNullable<typeof value> => Boolean(value));
    } catch {
      applications = [];
    }
  }

  return (
    <AdminConsole
      databaseConfigured={hasDatabaseUrl}
      initialApplications={applications}
      initialPrograms={programs.map((program: (typeof programs)[number]) => ({
        ...program,
        batchStartsAt: program.batchStartsAt?.toISOString() ?? null,
        updatedAt: program.updatedAt.toISOString(),
      }))}
      initialArticles={articles.map((article: (typeof articles)[number]) => ({
        ...article,
        mediaUrl: article.mediaUrl ?? "",
        mediaObjectKey: article.mediaObjectKey ?? "",
        mediaType: article.mediaType ?? null,
        externalLink: article.externalLink ?? "",
        publishedAt: article.publishedAt.toISOString().slice(0, 16),
        updatedAt: article.updatedAt.toISOString(),
      }))}
      initialEvents={events.map((event: (typeof events)[number]) => ({
        ...event,
        startsAt: event.startsAt.toISOString(),
        endsAt: event.endsAt?.toISOString() ?? null,
        updatedAt: event.updatedAt.toISOString(),
      }))}
      initialGalleryImages={galleryImages.map((image: (typeof galleryImages)[number]) => ({
        ...image,
        date: image.date.toISOString(),
        place: image.place ?? "",
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString(),
      }))}
    />
  );
}
