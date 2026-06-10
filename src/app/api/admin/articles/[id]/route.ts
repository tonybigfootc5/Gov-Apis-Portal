import { NextResponse } from "next/server";
import { prismaErrorResponse } from "@/lib/api-response";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { articleSchema } from "@/lib/validators";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  const parsed = articleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid article" }, { status: 400 });
  }
  try {
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...parsed.data,
        mediaUrl: parsed.data.mediaUrl || null,
        mediaObjectKey: parsed.data.mediaObjectKey || null,
        mediaType: parsed.data.mediaType || null,
        externalLink: parsed.data.externalLink || null,
      },
    });
    return NextResponse.json(article);
  } catch (error) {
    return prismaErrorResponse(error, "Article");
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const { id } = await params;
  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error, "Article");
  }
}
