import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "dd MMM yyyy, h:mm a");
}
