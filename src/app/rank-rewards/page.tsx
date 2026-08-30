import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RankRewardView } from "@/components/views/RankRewardView";

export default function RankRewardsPage() {
  return (
    <DashboardLayout title="Rank & Rewards">
      <RankRewardView />
    </DashboardLayout>
  );
}
