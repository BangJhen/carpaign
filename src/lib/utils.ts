import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCampaignType(type?: string | null): string {
  if (!type) return "";
  const t = type.toLowerCase().trim();
  if (t.includes("clip")) {
    return "Clip & Publish";
  }
  if (t.includes("ugc")) {
    return "UGC & Review";
  }
  if (t.includes("video") || t.includes("shoot") || t.includes("edit")) {
    return "Shoot & Edit";
  }
  return type;
}

