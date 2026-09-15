import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { CreateCampaignView } from "@/components/views/dealer/CreateCampaignView";
import { db } from "@/db/db";
import { vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Buat Kampanye - Dealer Dashboard | Carpaign",
};

export default async function CreateCampaignPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  let dealerVehicles: { id: string; name: string; location: string }[] = [];

  if (session?.user?.id) {
    const rows = await db
      .select({ id: vehicles.id, name: vehicles.name, location: vehicles.location })
      .from(vehicles)
      .where(eq(vehicles.dealerId, session.user.id));
    dealerVehicles = rows;
  }

  return (
    <DealerLayout title="Buat Kampanye">
      <CreateCampaignView vehicles={dealerVehicles} />
    </DealerLayout>
  );
}
