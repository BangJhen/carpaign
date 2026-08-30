import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FaqView } from "@/components/views/FaqView";

export default function FaqPage() {
  return (
    <DashboardLayout title="FAQ & Peraturan">
      <FaqView />
    </DashboardLayout>
  );
}
