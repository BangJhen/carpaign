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
  referralCode?: string;
};

/** Generate a URL-safe referral code like "rian-pratama-a3f7" */
function generateReferralCode(name?: string | null): string {
  const base = (name || "kreator")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join("-");
  const suffix = Math.random().toString(16).slice(2, 6);
  return `${base}-${suffix}`;
}

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

  if (input.referralCode) {
    const isValid = /^[a-z0-9-]+$/.test(input.referralCode);
    if (!isValid) {
      throw new Error("Shortlink hanya boleh berisi huruf kecil, angka, dan tanda strip (-).");
    }

    const RESERVED_SLUGS = [
      "api",
      "login",
      "register",
      "dealer",
      "campaigns",
      "faq",
      "bantuan",
      "leaderboard",
      "analitik",
      "pendapatan",
      "profile",
      "rank-rewards",
      "dashboard",
      "admin",
      "_next",
    ];

    if (RESERVED_SLUGS.includes(input.referralCode.toLowerCase())) {
      throw new Error("Nama link tersebut sudah dicadangkan untuk sistem. Silakan pilih nama lain.");
    }

    const checkDuplicate = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.referralCode, input.referralCode));
    
    if (checkDuplicate.length > 0 && checkDuplicate[0].userId !== session.user.id) {
      throw new Error("Shortlink sudah digunakan oleh kreator lain.");
    }
  }

  if (existingProfile.length > 0) {
    await db
      .update(creatorProfiles)
      .set(input)
      .where(eq(creatorProfiles.userId, session.user.id));
  } else {
    // Auto-generate referral code on first create
    const referralCode = generateReferralCode(
      input.fullName || session.user.name
    );
    await db.insert(creatorProfiles).values({
      userId: session.user.id,
      referralCode,
      ...input,
    });
  }

  // Also ensure referral code is generated if existing profile has none
  if (
    existingProfile.length > 0 &&
    !existingProfile[0].referralCode
  ) {
    const referralCode = generateReferralCode(
      input.fullName || existingProfile[0].fullName || session.user.name
    );
    await db
      .update(creatorProfiles)
      .set({ referralCode })
      .where(eq(creatorProfiles.userId, session.user.id));
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

  revalidatePath("/creator/profile");
  revalidatePath("/creator/dashboard");
  revalidatePath("/");
  if (input.referralCode) {
    revalidatePath(`/${input.referralCode}`);
    revalidatePath(`/c/${input.referralCode}`);
  }
  if (input.username) {
    const cleanU = input.username.replace(/^@/, "");
    revalidatePath(`/${cleanU}`);
    revalidatePath(`/@${cleanU}`);
    revalidatePath(`/c/${cleanU}`);
  }
  return { success: true };
}

/** Fetch the referral code / custom slug for the current logged-in creator */
export async function getMyReferralCode(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const rows = await db
    .select({
      referralCode: creatorProfiles.referralCode,
      username: creatorProfiles.username,
    })
    .from(creatorProfiles)
    .where(eq(creatorProfiles.userId, session.user.id));

  return rows[0]?.referralCode || rows[0]?.username?.replace(/^@/, "") || null;
}
