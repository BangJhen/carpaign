import { CampaignsView } from "@/components/views/CampaignsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eksplorasi Kampanye Carpaign",
  description: "Daftar job dan kampanye promosi mobil yang tersedia untuk kreator.",
};

export default function CreatorCampaignsPage() {
  return <CampaignsView />;
}
