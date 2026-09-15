import { AnalitikView } from "@/components/views/AnalitikView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analitik Performa Kreator Carpaign",
  description: "Statistik penayangan video, engagement rate, dan pertumbuhan audiens.",
};

export default function CreatorAnalitikPage() {
  return <AnalitikView />;
}
