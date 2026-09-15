import { SupportView } from "@/components/views/SupportView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Admin Kreator Carpaign",
  description: "Layanan bantuan dan tiket pengaduan resmi untuk kreator Carpaign.",
};

export default function CreatorBantuanPage() {
  return <SupportView />;
}
