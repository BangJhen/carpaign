import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { DealerDashboardView } from "@/components/views/dealer/DealerDashboardView";
import { db } from "@/db/db";
import { campaigns } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Overview - Dealer Dashboard | Carpaign",
};

export default async function DealerDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  let topCampaigns: { id: string; title: string; applicants: number; views: string; status: string }[] = [];
  let totalCampaigns = 0;
  let activeCampaigns = 0;

  if (session?.user?.id) {
    const rows = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.dealerId, session.user.id))
      .orderBy(desc(campaigns.applicantsCount))
      .limit(5);

    totalCampaigns = rows.length;
    activeCampaigns = rows.filter((r) => r.status === "active").length;

    topCampaigns = rows.map((r) => ({
      id: r.id,
      title: r.title,
      applicants: r.applicantsCount,
      views: r.views,
      status: r.status,
    }));
  }

  return (
    <DealerLayout title="Overview">
      <DealerDashboardView
        topCampaigns={topCampaigns}
        totalCampaigns={totalCampaigns}
        activeCampaigns={activeCampaigns}
      />
    </DealerLayout>
  );
}
