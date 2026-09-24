import { db } from "@/db/db";
import { campaigns } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { DealerCampaignsView } from "@/components/views/dealer/DealerCampaignsView";
import type { Campaign } from "@/components/views/dealer/DealerCampaignsView";

import { formatCampaignType } from "@/lib/utils";

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

    const formatDateStr = (dateVal: any) => {
      if (!dateVal) return "-";
      try {
        const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
        if (isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      } catch {
        return "-";
      }
    };

    data = rows.map((r) => ({
      id: r.id,
      title: r.title,
      focus: r.promotionalFocus === "dealer" ? "Dealer Keseluruhan" : r.promotionalFocus === "single_unit" ? "1 Unit Kendaraan" : "Beberapa Unit",
      type: formatCampaignType(r.type),
      budget: `Rp ${r.budget.toLocaleString("id-ID")}`,
      rawBudget: r.budget,
      deadline: formatDateStr(r.deadline),
      startDate: formatDateStr(r.startDate),
      applicants: r.applicantsCount,
      views: r.views,
      status: r.status,
      details: r.details as any,
      createdAt: formatDateStr(r.createdAt),
    }));
  }

  return <DealerCampaignsView campaigns={data} />;
}
