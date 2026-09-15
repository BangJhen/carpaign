import { PageLoader } from "@/components/ui/page-loader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AnalitikLoading() {
  return (
    <DashboardLayout title="Analitik">
      <PageLoader label="Memuat data analitik..." />
    </DashboardLayout>
  );
}
