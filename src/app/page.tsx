import type { Metadata } from "next";
import { LandingView } from "@/components/landing/LandingView";

export const metadata: Metadata = {
  title: "Carpaign — Platform Creator Konten Otomotif Indonesia",
  description:
    "Ubah passion otomotifmu jadi penghasilan nyata. Hubungkan diri dengan dealership terkemuka, buat konten berkualitas, dan raih bayaran dari setiap view yang terakumulasi.",
  openGraph: {
    title: "Carpaign — Platform Creator Konten Otomotif Indonesia",
    description:
      "Marketplace campaign konten otomotif yang menghubungkan creator dengan dealership terkemuka di Indonesia.",
    type: "website",
  },
};

export default function Home() {
  return <LandingView />;
}
