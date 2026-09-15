import { LeaderboardView } from "@/components/views/LeaderboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard Kreator Carpaign",
  description: "Peringkat kreator teratas berdasarkan akumulasi views dan total reward.",
};

export default function CreatorLeaderboardPage() {
  return <LeaderboardView />;
}
