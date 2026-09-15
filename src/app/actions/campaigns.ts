"use server";

import { db } from "@/db/db";
import { campaigns } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { CampaignType } from "@/db/schema";

export type CreateCampaignInput = {
  vehicle: string;
  type: CampaignType;
  title: string;
  brief: string;
  budget: number;
  deadline: string;
};

export async function createCampaign(input: CreateCampaignInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "dealership") {
    throw new Error("Unauthorized");
  }

  await db.insert(campaigns).values({
    dealerId: session.user.id,
    title: input.title,
    vehicle: input.vehicle,
    type: input.type,
    brief: input.brief,
    budget: input.budget,
    deadline: new Date(input.deadline),
    status: "active",
  });

  redirect("/dealer/campaigns");
}
