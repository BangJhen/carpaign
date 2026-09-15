import type { Metadata } from "next";
import { DealerSupportView } from "@/components/views/dealer/DealerSupportView";

export const metadata: Metadata = {
  title: "Hubungi Admin Dealer Carpaign",
  description: "Layanan bantuan dan operasional prioritas untuk dealer dan showroom Carpaign.",
};

export default function DealerBantuanPage() {
  return <DealerSupportView />;
}
