import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  const parts = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).formatToParts(value);
  return parts
    .map((p) => (p.type === "group" ? " " : p.value))
    .join("");
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
