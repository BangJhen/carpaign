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

export async function createCampaign(input: CreateCampaignInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "dealership" && role !== "dealer")) {
    throw new Error("Unauthorized");
  }

  if (!input.title || input.title.trim().length < 3) {
    throw new Error("Judul campaign minimal 3 karakter.");
  }

  if (!input.budget || input.budget < 1000000) {
    throw new Error("Minimal budget campaign adalah Rp 1.000.000.");
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
    startDate: new Date(input.startDate),
    deadline: new Date(input.deadline),
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
