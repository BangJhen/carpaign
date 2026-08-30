import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LeaderboardView } from "@/components/views/LeaderboardView";

export default function LeaderboardPage() {
  return (
    <DashboardLayout title="Leaderboard">
      <LeaderboardView />
    </DashboardLayout>
  );
}
