import { PageLoader } from "@/components/ui/page-loader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function CampaignDetailLoading() {
  return (
    <DashboardLayout title="Detail Campaign">
      <PageLoader label="Memuat detail campaign..." />
    </DashboardLayout>
  );
}
