import { JobDetailView } from "@/components/views/JobDetailView";
import { campaigns } from "@/lib/campaigns-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return campaigns.map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campaign = campaigns.find((c) => c.id === Number(id));
  if (!campaign) {
    return { title: "Kampanye Tidak Ditemukan" };
  }
  return {
    title: `${campaign.vehicle} (${campaign.brand}) Detail Kampanye Carpaign`,
    description: `Arahan pengerjaan konten dan reward untuk kampanye unit ${campaign.vehicle}.`,
  };
}

export default async function CreatorJobDetailPage({ params }: Props) {
  const { id } = await params;
  const campaign = campaigns.find((c) => c.id === Number(id));
  if (!campaign) notFound();

  return <JobDetailView campaign={campaign} />;
}
