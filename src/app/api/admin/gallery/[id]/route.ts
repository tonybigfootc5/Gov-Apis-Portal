import { NextResponse } from "next/server";
import { prismaErrorResponse, serviceUnavailable } from "@/lib/api-response";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { galleryImageSchema } from "@/lib/validators";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  const parsed = galleryImageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid gallery image" }, { status: 400 });
  }

  try {
    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...parsed.data,
        place: parsed.data.place || null,
      },
    });
    return NextResponse.json(image);
  } catch (error) {
    if (error instanceof Error) {
      return serviceUnavailable("Gallery storage is not ready yet. Apply the Prisma migration before editing gallery images.");
    }
    return prismaErrorResponse(error, "Gallery image");
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  try {
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return serviceUnavailable("Gallery storage is not ready yet. Apply the Prisma migration before deleting gallery images.");
    }
    return prismaErrorResponse(error, "Gallery image");
  }
}
