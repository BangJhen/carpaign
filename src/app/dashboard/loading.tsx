import { PageLoader } from "@/components/ui/page-loader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardLoading() {
  return (
    <DashboardLayout title="Dashboard">
      <PageLoader label="Memuat dashboard..." />
    </DashboardLayout>
  );
}
