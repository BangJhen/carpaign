import { redirect } from "next/navigation";
import { campaigns } from "@/lib/campaigns-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return campaigns.map((c) => ({ id: String(c.id) }));
}

export default async function CampaignDetailRedirectPage({ params }: Props) {
  const { id } = await params;
  redirect(`/creator/campaigns/${id}`);
}
