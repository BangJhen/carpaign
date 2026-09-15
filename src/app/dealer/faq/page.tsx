import type { Metadata } from "next";
import { DealerFaqView } from "@/components/views/dealer/DealerFaqView";

export const metadata: Metadata = {
  title: "FAQ dan Peraturan Dealer Carpaign",
  description: "Pertanyaan umum dan aturan main kemitraan showroom di Carpaign.",
};

export default function DealerFaqPage() {
  return <DealerFaqView />;
}
