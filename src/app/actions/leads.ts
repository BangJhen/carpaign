"use server";

import { db } from "@/db/db";
import { leadClicks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const allowedStatuses = ["baru", "dihubungi", "test_drive", "terjual"] as const;

export async function updateLeadStatus(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "dealership") throw new Error("Akses dealer diperlukan.");
  const status = formData.get("status");
  if (typeof status !== "string" || !allowedStatuses.includes(status as typeof allowedStatuses[number])) {
    throw new Error("Status prospek tidak valid.");
  }
  await db.update(leadClicks).set({
    status: status as typeof allowedStatuses[number], updatedAt: new Date(),
  }).where(and(eq(leadClicks.id, id), eq(leadClicks.dealerId, session.user.id)));
  revalidatePath("/dealer/prospek");
}
