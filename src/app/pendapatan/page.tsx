import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PendapatanView } from "@/components/views/PendapatanView";

export default function PendapatanPage() {
  return (
    <DashboardLayout title="Pendapatan">
      <PendapatanView />
    </DashboardLayout>
  );
}
