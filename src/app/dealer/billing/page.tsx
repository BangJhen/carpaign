import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { BillingView } from "@/components/views/dealer/BillingView";

export const metadata: Metadata = {
  title: "Keuangan - Dealer Dashboard | Carpaign",
};

export default function BillingPage() {
  return (
    <DealerLayout title="Keuangan">
      <BillingView />
    </DealerLayout>
  );
}
