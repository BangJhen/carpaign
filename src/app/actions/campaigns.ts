"use server";

import { db } from "@/db/db";
import { campaigns } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import type { CampaignType, CampaignStatus } from "@/db/schema";

export type CreateCampaignInput = {
  title: string;
  promotionalFocus: "dealer" | "single_unit" | "multiple_units";
  vehicles: string[];
  type: CampaignType;
  budget: number;
  startDate: string;
  deadline: string;
  status: CampaignStatus;
  details: any;
};

function safeParseDate(val: any, fallbackDaysFromNow: number = 14): Date {
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val;
  }
  if (typeof val === "string" && val.trim()) {
    const trimmed = val.trim();
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const d = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
      if (!isNaN(d.getTime())) return d;
    }
    const monthMap: Record<string, number> = {
      jan: 0, januari: 0,
      feb: 1, februari: 1,
      mar: 2, maret: 2,
      apr: 3, april: 3,
      mei: 4, may: 4,
      jun: 5, juni: 5,
      jul: 6, juli: 6,
      agu: 7, agustus: 7, aug: 7, august: 7,
      sep: 8, september: 8,
      okt: 9, oktober: 9, oct: 9, october: 9,
      nov: 10, november: 10,
      des: 11, desember: 11, dec: 11, december: 11,
    };
    const idMatch = trimmed.match(/(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
    if (idMatch) {
      const day = parseInt(idMatch[1], 10);
      const monthKey = idMatch[2].toLowerCase();
      const year = parseInt(idMatch[3], 10);
      if (monthMap[monthKey] !== undefined) {
        const d = new Date(year, monthMap[monthKey], day);
        if (!isNaN(d.getTime())) return d;
      }
    }
  }
  return new Date(Date.now() + fallbackDaysFromNow * 24 * 60 * 60 * 1000);
}

export async function createCampaign(input: CreateCampaignInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "dealership" && role !== "dealer")) {
    throw new Error("Unauthorized");
  }

  if (!input.title || input.title.trim().length < 3) {
    throw new Error("Judul campaign minimal 3 karakter.");
  }

  if (!input.budget || input.budget < 100000) {
    throw new Error("Minimal budget campaign adalah Rp 100.000.");
  }

  if (input.type === "Clipping") {
    if (input.details?.cpm && input.details.cpm < 500) {
      throw new Error("Tarif CPM minimal Rp 500 per 1.000 views.");
    }
    if (input.details?.maxViewsPerClipper && input.details.maxViewsPerClipper < 10000) {
      throw new Error("Batas maksimal views minimal 10.000 views per clipper.");
    }
  }

  const newId = crypto.randomUUID();

  await db.insert(campaigns).values({
    id: newId,
    dealerId: session.user.id,
    title: input.title,
    promotionalFocus: input.promotionalFocus,
    vehicles: input.vehicles,
    type: input.type,
    details: input.details,
    budget: input.budget,
    startDate: safeParseDate(input.startDate, 0),
    deadline: safeParseDate(input.deadline, 14),
    status: "draft", // Kampanye wajib berstatus draft hingga pembayaran diselesaikan
  });

  revalidatePath("/dealer/campaigns");
  revalidatePath("/dealer/dashboard");
  return { success: true, campaignId: newId };
}

export async function payCampaign(campaignId: string, paymentMethod: string = "deposit") {
  const session = await auth.api.getSession({ headers: await headers() });

  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "dealership" && role !== "dealer")) {
    throw new Error("Unauthorized");
  }

  const [existing] = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.dealerId, session.user.id)))
    .limit(1);

  if (!existing) {
    throw new Error("Kampanye tidak ditemukan atau Anda tidak memiliki akses.");
  }

  if (existing.status === "active") {
    return { success: true, message: "Kampanye sudah aktif." };
  }

  // Update status to active
  await db
    .update(campaigns)
    .set({ status: "active" })
    .where(eq(campaigns.id, campaignId));

  revalidatePath("/dealer/campaigns");
  revalidatePath("/dealer/dashboard");
  revalidatePath("/campaigns");
  return { success: true };
}

export async function cancelCampaign(campaignId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "dealership" && role !== "dealer")) {
    throw new Error("Unauthorized");
  }

  const [existing] = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.dealerId, session.user.id)))
    .limit(1);

  if (!existing) {
    throw new Error("Kampanye tidak ditemukan atau Anda tidak memiliki akses.");
  }

  await db
    .update(campaigns)
    .set({ status: "cancelled" })
    .where(eq(campaigns.id, campaignId));

  revalidatePath("/dealer/campaigns");
  revalidatePath("/dealer/dashboard");
  return { success: true };
}
