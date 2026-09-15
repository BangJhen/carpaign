import type { Metadata } from "next";
import { DealerLayout } from "@/components/layout/DealerLayout";
import { SubmissionsView } from "@/components/views/dealer/SubmissionsView";

export const metadata: Metadata = {
  title: "Review Konten - Dealer Dashboard | Carpaign",
};

export default function SubmissionsPage() {
  return <SubmissionsView />;
}
