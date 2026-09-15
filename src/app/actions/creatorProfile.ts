"use server";

import { db } from "@/db/db";
import { creatorProfiles } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type UpdateCreatorProfileInput = {
  fullName?: string;
  username?: string;
  phone?: string;
  city?: string;
  bio?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  tiktokUsername?: string;
  instagramUsername?: string;
  youtubeUsername?: string;
  avatarImage?: string;
  coverImage?: string;
};

export async function updateCreatorProfile(input: UpdateCreatorProfileInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if creator profile exists
  const existingProfile = await db
    .select()
    .from(creatorProfiles)
    .where(eq(creatorProfiles.userId, session.user.id));

  if (existingProfile.length > 0) {
    await db
      .update(creatorProfiles)
      .set(input)
      .where(eq(creatorProfiles.userId, session.user.id));
  } else {
    await db.insert(creatorProfiles).values({
      userId: session.user.id,
      ...input,
    });
  }

  // Sync user name, avatar, and coverImage if provided
  const userUpdates: Record<string, any> = {};
  if (input.fullName) userUpdates.name = input.fullName;
  if (input.avatarImage) userUpdates.image = input.avatarImage;
  if (input.coverImage) userUpdates.coverImage = input.coverImage;

  if (Object.keys(userUpdates).length > 0) {
    await db
      .update(user)
      .set(userUpdates)
      .where(eq(user.id, session.user.id));
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
