import { DashboardView } from "@/components/views/DashboardView";
import { db } from "@/db/db";
import { campaigns as campaignsTable, dealerProfiles } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { eq, desc } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Kreator Carpaign",
  description: "Overview performa konten, statistik view, dan estimasi reward kreator.",
};

export default async function CreatorDashboardPage() {
  const dbRows = await db
    .select({
      id: campaignsTable.id,
      title: campaignsTable.title,
      type: campaignsTable.type,
      budget: campaignsTable.budget,
      status: campaignsTable.status,
      views: campaignsTable.views,
      deadline: campaignsTable.deadline,
      applicantsCount: campaignsTable.applicantsCount,
      promotionalFocus: campaignsTable.promotionalFocus,
      dealerName: dealerProfiles.dealerName,
      userDealerName: user.name,
      coverImage: dealerProfiles.coverImage,
    })
    .from(campaignsTable)
    .leftJoin(dealerProfiles, eq(campaignsTable.dealerId, dealerProfiles.userId))
    .leftJoin(user, eq(campaignsTable.dealerId, user.id))
    .where(eq(campaignsTable.status, "active"))
    .orderBy(desc(campaignsTable.createdAt))
    .limit(6);

  const mappedCampaigns = dbRows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.type,
    brand: row.dealerName || row.userDealerName || "Dealer Rekanan",
    reward: `Rp${row.budget.toLocaleString("id-ID")}`,
    image:
      row.coverImage ||
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    type: row.type,
    views: Number(row.views || 0).toLocaleString("id-ID"),
    socials: ["tiktok", "instagram"],
    categoryTag: "OTOMOTIF",
  }));

  return (
    <DashboardView
      initialCampaigns={mappedCampaigns.length > 0 ? mappedCampaigns : undefined}
    />
  );
}
