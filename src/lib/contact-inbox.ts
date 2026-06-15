import type { ContactMessage } from "@/generated/prisma/client";
import { TRAINING_APPLICATION_SUBJECT_PREFIX } from "@/lib/training-application";

export const CONTACT_MESSAGE_RETENTION_DAYS = 30;
export const CONTACT_MESSAGE_RETENTION_MS = CONTACT_MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000;

export type ContactInboxRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
};

export function getContactMessageCutoffDate(now = new Date()) {
  return new Date(now.getTime() - CONTACT_MESSAGE_RETENTION_MS);
}

export function isContactInboxMessage(message: ContactMessage) {
  return !message.subject.startsWith(TRAINING_APPLICATION_SUBJECT_PREFIX);
}

export function mapContactInboxRecord(message: ContactMessage): ContactInboxRecord {
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    phone: message.phone,
    subject: message.subject,
    message: message.message,
    createdAt: message.createdAt.toISOString(),
  };
}
