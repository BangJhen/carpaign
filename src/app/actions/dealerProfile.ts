"use server";

import { db } from "@/db/db";
import { dealerProfiles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type UpdateDealerProfileInput = {
  dealerName?: string;
  picName?: string;
  phone?: string;
  businessEmail?: string;
  address?: string;
};

export async function updateDealerProfile(input: UpdateDealerProfileInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "dealership") {
    throw new Error("Unauthorized");
  }

  // Check if profile exists
  const existingProfile = await db
    .select()
    .from(dealerProfiles)
    .where(eq(dealerProfiles.userId, session.user.id));

  if (existingProfile.length > 0) {
    await db
      .update(dealerProfiles)
      .set(input)
      .where(eq(dealerProfiles.userId, session.user.id));
  } else {
    await db.insert(dealerProfiles).values({
      userId: session.user.id,
      ...input,
    });
  }

  revalidatePath("/dealer/profile");
  revalidatePath("/dealer/dashboard");
  return { success: true };
}
