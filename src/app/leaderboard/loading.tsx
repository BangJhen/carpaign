import { PageLoader } from "@/components/ui/page-loader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function LeaderboardLoading() {
  return (
    <DashboardLayout title="Leaderboard">
      <PageLoader label="Memuat leaderboard..." />
    </DashboardLayout>
  );
}
