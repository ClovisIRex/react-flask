import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

// src/utils/formatDate.ts
export function formatDateToLocal(utcString: string, offsetHours = 3) {
  const date = new Date(utcString);

  // add offset (in ms)
  const adjusted = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);

  return adjusted.toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

