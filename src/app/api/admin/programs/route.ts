import { NextResponse } from "next/server";
import { prismaErrorResponse } from "@/lib/api-response";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { programSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();
  try {
    const programs = await prisma.program.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json(programs);
  } catch (error) {
    return prismaErrorResponse(error, "Program list");
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return adminUnauthorized();
  const parsed = programSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid program" }, { status: 400 });
  }
  try {
    const program = await prisma.program.create({ data: { ...parsed.data, fee: parsed.data.fee || null } });
    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error, "Program");
  }
}
