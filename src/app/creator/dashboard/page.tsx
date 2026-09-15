import { DashboardView } from "@/components/views/DashboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Kreator Carpaign",
  description: "Overview performa konten, statistik view, dan estimasi reward kreator.",
};

export default function CreatorDashboardPage() {
  return <DashboardView />;
}
