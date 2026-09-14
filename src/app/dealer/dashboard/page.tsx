import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { DealerDashboardView } from "@/components/views/dealer/DealerDashboardView";

export const metadata: Metadata = {
  title: "Overview — Dealer Dashboard | Carpaign",
};

export default function DealerDashboardPage() {
  return (
    <DealerLayout title="Overview">
      <DealerDashboardView />
    </DealerLayout>
  );
}
