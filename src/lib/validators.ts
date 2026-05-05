import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(3)
  .max(90)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(2000),
});

export const programSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug,
  summary: z.string().trim().min(20).max(320),
  description: z.string().trim().min(40).max(4000),
  duration: z.string().trim().min(2).max(80),
  level: z.enum(["FOUNDATION", "ADVANCED", "PROFESSIONAL"]),
  fee: z.string().trim().max(120).optional().or(z.literal("")),
  capacity: z.coerce.number().int().min(1).max(500),
  published: z.coerce.boolean().default(true),
});

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug,
  summary: z.string().trim().min(20).max(340),
  description: z.string().trim().min(40).max(4000),
  location: z.string().trim().min(3).max(220),
  startsAt: z.coerce.date(),
  endsAt: z.preprocess((value) => (value === "" ? null : value), z.coerce.date().optional().nullable()),
  status: z.enum(["UPCOMING", "COMPLETED", "CANCELLED"]),
  published: z.coerce.boolean().default(true),
});
