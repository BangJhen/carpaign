"use server";

import { db } from "@/db/db";
import { creatorProfiles } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { eq } from "drizzle-orm";

export type PublicCreatorProfile = {
  fullName: string | null;
  username: string | null;
  city: string | null;
  bio: string | null;
  tiktokUsername: string | null;
  instagramUsername: string | null;
  youtubeUsername: string | null;
  avatarImage: string | null;
  coverImage: string | null;
  referralCode: string | null;
  tier: number | null;
  joinedAt: Date;
};

/** Fetch the public (non-sensitive) profile of a creator by their referral code. */
export async function getPublicCreatorByRef(
  ref: string
): Promise<PublicCreatorProfile | null> {
  const rows = await db
    .select({
      fullName: creatorProfiles.fullName,
      username: creatorProfiles.username,
      city: creatorProfiles.city,
      bio: creatorProfiles.bio,
      tiktokUsername: creatorProfiles.tiktokUsername,
      instagramUsername: creatorProfiles.instagramUsername,
      youtubeUsername: creatorProfiles.youtubeUsername,
      avatarImage: creatorProfiles.avatarImage,
      coverImage: creatorProfiles.coverImage,
      referralCode: creatorProfiles.referralCode,
      tier: user.tier,
      joinedAt: user.createdAt,
    })
    .from(creatorProfiles)
    .innerJoin(user, eq(creatorProfiles.userId, user.id))
    .where(eq(creatorProfiles.referralCode, ref))
    .limit(1);

  if (rows.length === 0) return null;
  return rows[0] as PublicCreatorProfile;
}
