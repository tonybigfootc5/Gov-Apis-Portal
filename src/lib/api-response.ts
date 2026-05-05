import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function tooManyRequests(message: string, retryAfterSeconds?: number) {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
    },
  );
}

export function serviceUnavailable(message: string) {
  return NextResponse.json({ error: message }, { status: 503 });
}

export function prismaErrorResponse(error: unknown, entity: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `${entity} already exists. Use a different unique value.` },
        { status: 409 },
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: `${entity} was not found.` }, { status: 404 });
    }
  }

  return NextResponse.json({ error: `${entity} could not be saved right now.` }, { status: 500 });
}
