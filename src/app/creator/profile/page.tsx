import { ProfileView } from "@/components/views/ProfileView";
import { db } from "@/db/db";
import { creatorProfiles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Kreator Carpaign",
  description: "Pengaturan identitas kreator, rekening pencairan saldo, dan tautan media sosial.",
};

export default async function CreatorProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  let profile = null;

  if (session?.user?.id) {
    const rows = await db
      .select({
        fullName: creatorProfiles.fullName,
        username: creatorProfiles.username,
        phone: creatorProfiles.phone,
        city: creatorProfiles.city,
        bio: creatorProfiles.bio,
        bankName: creatorProfiles.bankName,
        accountNumber: creatorProfiles.accountNumber,
        accountHolderName: creatorProfiles.accountHolderName,
        tiktokUsername: creatorProfiles.tiktokUsername,
        instagramUsername: creatorProfiles.instagramUsername,
        youtubeUsername: creatorProfiles.youtubeUsername,
        avatarImage: creatorProfiles.avatarImage,
        coverImage: creatorProfiles.coverImage,
        referralCode: creatorProfiles.referralCode,
      })
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, session.user.id));
    if (rows.length > 0) {
      profile = rows[0];
    }
  }

  return <ProfileView initialProfile={profile} />;
}

