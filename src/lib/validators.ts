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
  batchStartsAt: z.preprocess((value) => (value === "" ? null : value), z.coerce.date().optional().nullable()),
  enrollmentClosed: z.coerce.boolean().default(false),
  popupEnabled: z.coerce.boolean().default(true),
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
}).refine((data) => !data.endsAt || data.endsAt >= data.startsAt, {
  message: "Event end time must be after the start time.",
  path: ["endsAt"],
});

export const articleSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug,
  excerpt: z.string().trim().min(20).max(320),
  body: z.string().trim().min(40).max(12000),
  category: z.string().trim().min(2).max(120),
  publishedAt: z.coerce.date(),
  authorName: z.string().trim().min(2).max(160),
  authorRole: z.string().trim().min(2).max(160),
  mediaUrl: z.string().trim().url().max(2000).optional().or(z.literal("")),
  mediaObjectKey: z.string().trim().max(1000).optional().or(z.literal("")),
  mediaType: z.enum(["IMAGE", "VIDEO", "ARTICLE_ASSET"]).optional().nullable(),
  externalLink: z.string().trim().url().max(400).optional().or(z.literal("")),
  keyPoints: z.string().trim().max(2000),
  seoTitle: z.string().trim().min(3).max(180),
  metaDescription: z.string().trim().min(20).max(320),
  published: z.coerce.boolean().default(true),
});

export const galleryImageSchema = z.object({
  url: z.string().trim().min(1).max(2000),
  caption: z.string().trim().min(3).max(240),
  date: z.coerce.date(),
  place: z.string().trim().max(240).optional().or(z.literal("")),
  category: z.string().trim().min(2).max(120),
  year: z.coerce.number().int().min(2000).max(2100),
  published: z.coerce.boolean().default(true),
});

export const trainingApplicationSchema = z.object({
  serviceName: z.string().trim().min(3).max(160),
  applicationDate: z.string().trim().min(8).max(30),
  candidateName: z.string().trim().min(2).max(160),
  guardianName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(180).optional().or(z.literal("")),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().trim().min(8).max(30),
  addressLine: z.string().trim().min(6).max(320),
  mandal: z.string().trim().min(2).max(120),
  district: z.string().trim().min(2).max(120),
  state: z.string().trim().min(2).max(120),
  pinCode: z.string().trim().regex(/^\d{6}$/, "Use a 6-digit pin code."),
  phone: z.string().trim().regex(/^\d{10}$/, "Use a 10-digit mobile number."),
  residencePhone: z.string().trim().max(40).optional().or(z.literal("")),
  educationQualification: z.string().trim().max(160).optional().or(z.literal("")),
  occupation: z.string().trim().max(160).optional().or(z.literal("")),
  sponsoringOrganization: z.string().trim().max(200).optional().or(z.literal("")),
  photoName: z.string().trim().min(1).max(160),
  photoType: z.string().trim().min(3).max(80),
  photoUrl: z.string().trim().url("Upload a valid image URL."),
  photoObjectKey: z.string().trim().min(3).max(1000),
});

export const trainingApplicationAdminSchema = z.object({
  attemptStatus: z.enum(["ATTEMPTED", "SUBMITTED", "PAYMENT_INITIATED", "PAYMENT_FAILED", "PAYMENT_COMPLETED"]),
  paymentStatus: z.enum(["NOT_STARTED", "PENDING", "PAID", "FAILED"]),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  crossCheckStatus: z.enum(["PENDING", "VERIFIED"]),
  adminNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  paymentReference: z.string().trim().max(160).optional().or(z.literal("")),
});

export const refundRequestSchema = z.object({
  reason: z.string().trim().min(3).max(240),
});
