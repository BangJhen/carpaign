import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardView } from "@/components/views/DashboardView";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <DashboardView />
    </DashboardLayout>
  );
}
