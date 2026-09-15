import { PageLoader } from "@/components/ui/page-loader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ProfileLoading() {
  return (
    <DashboardLayout title="Profil">
      <PageLoader label="Memuat profil..." />
    </DashboardLayout>
  );
}
