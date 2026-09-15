import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileView } from "@/components/views/ProfileView";
import { db } from "@/db/db";
import { creatorProfiles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Kreator Carpaign",
  description: "Pengaturan identitas kreator, rekening pencairan saldo, dan tautan media sosial.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as any)?.role;

  if (role === "dealership" || role === "dealer") {
    redirect("/dealer/profile");
  }

  let profile = null;

  if (session?.user?.id) {
    const rows = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, session.user.id));
    if (rows.length > 0) {
      profile = rows[0];
    }
  }

  return (
    <DashboardLayout title="Profil Kreator">
      <ProfileView initialProfile={profile} />
    </DashboardLayout>
  );
}
