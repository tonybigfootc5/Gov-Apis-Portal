import { NextResponse } from "next/server";
import { prismaErrorResponse } from "@/lib/api-response";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { articleSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();
  try {
    const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });
    return NextResponse.json(articles);
  } catch (error) {
    return prismaErrorResponse(error, "Article list");
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const parsed = articleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid article" }, { status: 400 });
  }
  try {
    const article = await prisma.article.create({
      data: {
        ...parsed.data,
        mediaUrl: parsed.data.mediaUrl || null,
        mediaObjectKey: parsed.data.mediaObjectKey || null,
        mediaType: parsed.data.mediaType || null,
        externalLink: parsed.data.externalLink || null,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Article");
  }
}
