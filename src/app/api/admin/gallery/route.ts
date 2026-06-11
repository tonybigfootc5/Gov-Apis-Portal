import { NextResponse } from "next/server";
import { z } from "zod";
import { fallbackGalleryImages } from "@/lib/fallback-data";
import { prismaErrorResponse, serviceUnavailable } from "@/lib/api-response";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { galleryImageSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

const galleryCreateSchema = z.union([galleryImageSchema, z.array(galleryImageSchema).min(1)]);

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(images.length ? images : fallbackGalleryImages);
  } catch {
    return NextResponse.json(fallbackGalleryImages);
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const parsed = galleryCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid gallery image" }, { status: 400 });
  }

  try {
    const records = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
    const created = await prisma.$transaction(
      records.map((record) =>
        prisma.galleryImage.create({
          data: {
            ...record,
            place: record.place || null,
          },
        }),
      ),
    );
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return serviceUnavailable("Gallery storage is not ready yet. Apply the Prisma migration before saving gallery images.");
    }
    return prismaErrorResponse(error, "Gallery image");
  }
}
