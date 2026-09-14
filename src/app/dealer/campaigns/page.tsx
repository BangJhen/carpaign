import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { DealerCampaignsView } from "@/components/views/dealer/DealerCampaignsView";

export const metadata: Metadata = {
  title: "Manajemen Kampanye — Dealer Dashboard | Carpaign",
};

export default function DealerCampaignsPage() {
  return (
    <DealerLayout title="Manajemen Kampanye">
      <DealerCampaignsView />
    </DealerLayout>
  );
}
