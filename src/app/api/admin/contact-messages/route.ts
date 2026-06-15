import { NextResponse } from "next/server";
import { prismaErrorResponse } from "@/lib/api-response";
import { adminUnauthorized, requireAdmin } from "@/lib/auth";
import {
  getContactMessageCutoffDate,
  mapContactInboxRecord,
} from "@/lib/contact-inbox";
import { prisma } from "@/lib/prisma";
import { TRAINING_APPLICATION_SUBJECT_PREFIX } from "@/lib/training-application";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) return adminUnauthorized();

  try {
    const cutoffDate = getContactMessageCutoffDate();

    await prisma.contactMessage.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        NOT: {
          subject: {
            startsWith: TRAINING_APPLICATION_SUBJECT_PREFIX,
          },
        },
      },
    });

    const messages = await prisma.contactMessage.findMany({
      where: {
        createdAt: { gte: cutoffDate },
        NOT: {
          subject: {
            startsWith: TRAINING_APPLICATION_SUBJECT_PREFIX,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages.map(mapContactInboxRecord));
  } catch (error) {
    return prismaErrorResponse(error, "Contact inbox");
  }
}
