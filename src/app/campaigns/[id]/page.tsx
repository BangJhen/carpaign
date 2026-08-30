import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { JobDetailView } from "@/components/views/JobDetailView";
import { campaigns } from "@/lib/campaigns-data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return campaigns.map((c) => ({ id: String(c.id) }));
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const campaign = campaigns.find((c) => c.id === Number(id));
  if (!campaign) notFound();

  return (
    <DashboardLayout title={`Job Detail — ${campaign.vehicle}`}>
      <JobDetailView campaign={campaign} />
    </DashboardLayout>
  );
}
