import { JobDetailView } from "@/components/views/JobDetailView";
import { campaigns as fallbackCampaigns, mapDbRowToCampaign, type Campaign } from "@/lib/campaigns-data";
import { db } from "@/db/db";
import { campaigns as campaignsTable, dealerProfiles } from "@/db/schema";
import { user } from "@/db/auth-schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

async function getCampaignById(id: string): Promise<Campaign | null> {
  const numericId = Number(id);
  if (!isNaN(numericId)) {
    const found = fallbackCampaigns.find((c) => c.id === numericId);
    if (found) return found;
  }

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
      details: campaignsTable.details,
      dealerName: dealerProfiles.dealerName,
      userDealerName: user.name,
      coverImage: dealerProfiles.coverImage,
    })
    .from(campaignsTable)
    .leftJoin(dealerProfiles, eq(campaignsTable.dealerId, dealerProfiles.userId))
    .leftJoin(user, eq(campaignsTable.dealerId, user.id))
    .where(eq(campaignsTable.id, id))
    .limit(1);

  if (dbRows.length === 0) return null;
  return mapDbRowToCampaign(dbRows[0]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) {
    return { title: "Kampanye Tidak Ditemukan" };
  }
  return {
    title: `${campaign.vehicle} (${campaign.brand}) Detail Kampanye Carpaign`,
    description: `Arahan pengerjaan konten dan reward untuk kampanye unit ${campaign.vehicle}.`,
  };
}

export default async function CreatorJobDetailPage({ params }: Props) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();

  return <JobDetailView campaign={campaign} />;
}
