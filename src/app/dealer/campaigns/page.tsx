import { db } from "@/db/db";
import { campaigns } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { DealerCampaignsView } from "@/components/views/dealer/DealerCampaignsView";
import type { Campaign } from "@/components/views/dealer/DealerCampaignsView";

export const metadata = {
  title: "Manajemen Kampanye - Dealer Dashboard | Carpaign",
};

export default async function DealerCampaignsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  let data: Campaign[] = [];
  if (session?.user?.id) {
    const rows = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.dealerId, session.user.id))
      .orderBy(campaigns.createdAt);

    data = rows.map((r) => ({
      id: r.id,
      title: r.title,
      thumbnail: r.thumbnail || (r.details as any)?.thumbnail || null,
      focus: r.promotionalFocus === "dealer" ? "Dealer Keseluruhan" : r.promotionalFocus === "single_unit" ? "1 Unit Kendaraan" : "Beberapa Unit",
      type: r.type,
      budget: `Rp ${r.budget.toLocaleString("id-ID")}`,
      deadline: r.deadline.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      applicants: r.applicantsCount,
      views: r.views,
      status: r.status,
    }));
  }

  return <DealerCampaignsView campaigns={data} />;
}
