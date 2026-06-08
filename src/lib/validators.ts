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
  photoDataUrl: z.string().trim().startsWith("data:image/", "Upload a valid image."),
});

export const trainingApplicationAdminSchema = z.object({
  attemptStatus: z.enum(["ATTEMPTED", "SUBMITTED", "PAYMENT_INITIATED", "PAYMENT_FAILED", "PAYMENT_COMPLETED"]),
  paymentStatus: z.enum(["NOT_STARTED", "PENDING", "PAID", "FAILED"]),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  crossCheckStatus: z.enum(["PENDING", "VERIFIED"]),
  adminNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  paymentReference: z.string().trim().max(160).optional().or(z.literal("")),
});
