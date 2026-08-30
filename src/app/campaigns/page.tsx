import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CampaignsView } from "@/components/views/CampaignsView";

export default function CampaignsPage() {
  return (
    <DashboardLayout title="Campaigns">
      <CampaignsView />
    </DashboardLayout>
  );
}
