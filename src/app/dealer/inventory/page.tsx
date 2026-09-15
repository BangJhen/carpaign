import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { InventoryView } from "@/components/views/dealer/InventoryView";
import { db } from "@/db/db";
import { vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Inventory Kendaraan - Dealer Dashboard | Carpaign",
};

export default async function InventoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  let data: any[] = [];

  if (session?.user?.id) {
    const rows = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.dealerId, session.user.id))
      .orderBy(desc(vehicles.createdAt));
      
    data = rows.map(r => ({
      ...r,
      campaigns: r.campaignsCount
    }));
  }

  return (
    <DealerLayout title="Inventory Kendaraan">
      <InventoryView vehicles={data} />
    </DealerLayout>
  );
}
