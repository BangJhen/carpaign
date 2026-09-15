import { PendapatanView } from "@/components/views/PendapatanView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendapatan dan Saldo Kreator Carpaign",
  description: "Kelola saldo reward kampanye, riwayat penarikan dana, dan rekening bank.",
};

export default function CreatorPendapatanPage() {
  return <PendapatanView />;
}
