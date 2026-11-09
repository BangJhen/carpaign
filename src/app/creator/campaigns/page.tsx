import { CampaignsView } from "@/components/views/CampaignsView";
import { db } from "@/db/db";
import { campaigns as campaignsTable, dealerProfiles } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { eq, desc } from "drizzle-orm";
import { campaigns as fallbackCampaigns, mapDbRowToCampaign, type Campaign } from "@/lib/campaigns-data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eksplorasi Kampanye Carpaign",
  description: "Daftar job dan kampanye promosi mobil yang tersedia untuk kreator.",
};

export default async function CreatorCampaignsPage() {
  let mappedDbCampaigns: Campaign[] = [];

  try {
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
        thumbnail: campaignsTable.thumbnail,
        details: campaignsTable.details,
        dealerName: dealerProfiles.dealerName,
        userDealerName: user.name,
        coverImage: dealerProfiles.coverImage,
      })
      .from(campaignsTable)
      .leftJoin(dealerProfiles, eq(campaignsTable.dealerId, dealerProfiles.userId))
      .leftJoin(user, eq(campaignsTable.dealerId, user.id))
      .where(eq(campaignsTable.status, "active"))
      .orderBy(desc(campaignsTable.createdAt));

    mappedDbCampaigns = dbRows.map((row, index) =>
      mapDbRowToCampaign(row, index)
    );
  } catch (error) {
    console.error("Failed to query campaigns from DB, using fallback data:", error);
  }

  // Filter fallback campaigns so they don't duplicate IDs or titles already in DB
  const existingIds = new Set(mappedDbCampaigns.map((c) => String(c.id)));
  const existingTitles = new Set(mappedDbCampaigns.map((c) => c.vehicle.toLowerCase()));
  const filteredFallbacks = fallbackCampaigns.filter(
    (fb) => !existingIds.has(String(fb.id)) && !existingTitles.has(fb.vehicle.toLowerCase())
  );

  const allCampaigns = [...mappedDbCampaigns, ...filteredFallbacks];

  return <CampaignsView initialCampaigns={allCampaigns} />;
}
