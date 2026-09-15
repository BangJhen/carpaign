import { FaqView } from "@/components/views/FaqView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ dan Peraturan Kreator Carpaign",
  description: "Pertanyaan umum dan aturan main kemitraan kreator di Carpaign.",
};

export default function CreatorFaqPage() {
  return <FaqView />;
}
