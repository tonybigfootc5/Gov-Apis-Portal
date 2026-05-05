import { prisma } from "@/lib/prisma";
import { fallbackEvents, fallbackPrograms } from "@/lib/fallback-data";

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
