import { PageLoader } from "@/components/ui/page-loader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function CampaignsLoading() {
  return (
    <DashboardLayout title="Campaigns">
      <PageLoader label="Memuat daftar campaign..." />
    </DashboardLayout>
  );
}
