import { PageLoader } from "@/components/ui/page-loader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function PendapatanLoading() {
  return (
    <DashboardLayout title="Pendapatan">
      <PageLoader label="Memuat data pendapatan..." />
    </DashboardLayout>
  );
}
