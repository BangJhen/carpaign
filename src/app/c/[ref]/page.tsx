import { notFound } from "next/navigation";
import { getPublicCreatorByRef } from "@/app/actions/publicCreator";
import { PublicCreatorProfileView } from "@/components/views/PublicCreatorProfileView";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ ref: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref } = await params;
  const profile = await getPublicCreatorByRef(ref);

  if (!profile) {
    return { title: "Kreator tidak ditemukan — Carpaign" };
  }

  const name = profile.fullName ?? profile.username ?? "Kreator";
  return {
    title: `${name} — Profil Kreator Otomotif | Carpaign`,
    description:
      profile.bio ??
      `Lihat profil dan portofolio konten kreator otomotif ${name} di platform Carpaign.`,
    openGraph: {
      title: `${name} — Kreator Otomotif | Carpaign`,
      description: profile.bio ?? `Profil kreator otomotif ${name}.`,
      images: profile.avatarImage ? [{ url: profile.avatarImage }] : [],
    },
  };
}

export default async function PublicCreatorPage({ params }: Props) {
  const { ref } = await params;
  const profile = await getPublicCreatorByRef(ref);

  if (!profile) {
    notFound();
  }

  return <PublicCreatorProfileView profile={profile} ref={ref} />;
}
