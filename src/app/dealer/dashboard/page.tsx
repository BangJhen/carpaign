import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { DealerDashboardView } from "@/components/views/dealer/DealerDashboardView";
import { db } from "@/db/db";
import { campaigns, dealerProfiles, vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Overview - Dealer Dashboard | Carpaign",
};

export default async function DealerDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  let topCampaigns: { id: string; title: string; thumbnail?: string | null; applicants: number; views: string; status: string }[] = [];
  let totalCampaigns = 0;
  let activeCampaigns = 0;
  let profileCompleteness = 0;
  let totalVehicles = 0;
  let availableVehicles = 0;

  if (session?.user?.id) {
    // 1. Fetch campaigns
    const campaignRows = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.dealerId, session.user.id))
      .orderBy(desc(campaigns.applicantsCount))
      .limit(5);

    totalCampaigns = campaignRows.length;
    activeCampaigns = campaignRows.filter((r) => r.status === "active").length;

    topCampaigns = campaignRows.map((r) => ({
      id: r.id,
      title: r.title,
      thumbnail: r.thumbnail || (r.details as any)?.thumbnail || null,
      applicants: r.applicantsCount,
      views: r.views,
      status: r.status,
    }));

    // 2. Fetch Profile Completeness
    const profileRows = await db
      .select()
      .from(dealerProfiles)
      .where(eq(dealerProfiles.userId, session.user.id));
    
    if (profileRows.length > 0) {
      const p = profileRows[0];
      let fieldsFilled = 0;
      const totalFields = 5; // dealerName, picName, phone, businessEmail, address
      if (p.dealerName) fieldsFilled++;
      if (p.picName) fieldsFilled++;
      if (p.phone) fieldsFilled++;
      if (p.businessEmail) fieldsFilled++;
      if (p.address) fieldsFilled++;
      profileCompleteness = Math.round((fieldsFilled / totalFields) * 100);
    }

    // 3. Fetch Vehicles Stats
    const vehicleRows = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.dealerId, session.user.id));
    
    totalVehicles = vehicleRows.length;
    availableVehicles = vehicleRows.filter(v => v.status === "available").length;
  }

  return (
    <DealerDashboardView
      topCampaigns={topCampaigns}
      totalCampaigns={totalCampaigns}
      activeCampaigns={activeCampaigns}
      profileCompleteness={profileCompleteness}
      totalVehicles={totalVehicles}
      availableVehicles={availableVehicles}
    />
  );
}
