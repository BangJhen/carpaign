import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { InventoryView } from "@/components/views/dealer/InventoryView";

export const metadata: Metadata = {
  title: "Inventory Kendaraan - Dealer Dashboard | Carpaign",
};

export default function InventoryPage() {
  return (
    <DealerLayout title="Inventory Kendaraan">
      <InventoryView />
    </DealerLayout>
  );
}
