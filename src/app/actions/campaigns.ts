"use server";

import { db } from "@/db/db";
import { campaigns } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
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

  if (!session?.user || session.user.role !== "dealership") {
    throw new Error("Unauthorized");
  }

  if (input.budget < 1000000) {
    throw new Error("Budget campaign minimal Rp 1.000.000");
  }

  await db.insert(campaigns).values({
    dealerId: session.user.id,
    title: input.title,
    promotionalFocus: input.promotionalFocus,
    vehicles: input.vehicles,
    type: input.type,
    details: input.details,
    budget: input.budget,
    startDate: new Date(input.startDate),
    deadline: new Date(input.deadline),
    status: input.status,
  });

  revalidatePath("/dealer/campaigns");
  return { success: true };
}
