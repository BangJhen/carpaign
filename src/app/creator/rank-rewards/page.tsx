import { RankRewardView } from "@/components/views/RankRewardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rank dan Rewards Kreator Carpaign",
  description: "Tingkat level kreator, benefit eksklusif, dan pencapaian target views.",
};

export default function CreatorRankRewardsPage() {
  return <RankRewardView />;
}
