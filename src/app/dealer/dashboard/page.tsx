import type { Metadata } from "next";
import { DealerDashboardView } from "@/components/views/dealer/DealerDashboardView";
import { db } from "@/db/db";
import { campaigns, leadClicks, vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { count, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard Dealer | CARPAIGN" };

export default async function DealerDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "dealership") redirect("/login");
  const dealerId = session.user.id;
  const [campaignRows, vehicleCount, clickCount] = await Promise.all([
    db.select({
      id: campaigns.id, title: campaigns.title, status: campaigns.status,
      applicants: campaigns.applicantsCount,
    }).from(campaigns).where(eq(campaigns.dealerId, dealerId))
      .orderBy(desc(campaigns.createdAt)),
    db.select({ total: count() }).from(vehicles).where(eq(vehicles.dealerId, dealerId)),
    db.select({ total: count() }).from(leadClicks).where(eq(leadClicks.dealerId, dealerId)),
  ]);

  return <DealerDashboardView
    dealerName={session.user.name?.split(" ")[0] || "Dealer"}
    campaigns={campaignRows.slice(0, 5)}
    totalCampaigns={campaignRows.length}
    activeCampaigns={campaignRows.filter((row) => row.status === "active").length}
    draftCampaigns={campaignRows.filter((row) => row.status === "draft").length}
    totalVehicles={vehicleCount[0]?.total ?? 0}
    leadClicks={clickCount[0]?.total ?? 0}
  />;
}
