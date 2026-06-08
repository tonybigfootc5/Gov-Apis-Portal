import { NextResponse } from "next/server";
import { prismaErrorResponse } from "@/lib/api-response";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  mapTrainingApplicationRecord,
  TRAINING_APPLICATION_SUBJECT_PREFIX,
} from "@/lib/training-application";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();

  try {
    const messages = await prisma.contactMessage.findMany({
      where: {
        subject: {
          startsWith: TRAINING_APPLICATION_SUBJECT_PREFIX,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const applications = messages
      .map(mapTrainingApplicationRecord)
      .filter((value): value is NonNullable<typeof value> => Boolean(value));

    return NextResponse.json(applications);
  } catch (error) {
    return prismaErrorResponse(error, "Application list");
  }
}
