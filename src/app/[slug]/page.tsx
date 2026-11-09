import { notFound } from "next/navigation";
import { getPublicCreatorByRef } from "@/app/actions/publicCreator";
import { PublicCreatorProfileView } from "@/components/views/PublicCreatorProfileView";
import type { Metadata } from "next";

const RESERVED_SLUGS = [
  "api",
  "login",
  "register",
  "dealer",
  "campaigns",
  "faq",
  "bantuan",
  "leaderboard",
  "analitik",
  "pendapatan",
  "profile",
  "rank-rewards",
  "dashboard",
  "_next",
  "icon.png",
  "favicon.ico",
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
    return { title: "Carpaign" };
  }

  const profile = await getPublicCreatorByRef(slug);

  if (!profile) {
    return { title: "Kreator tidak ditemukan — Carpaign" };
  }

  const name = profile.fullName ?? profile.username ?? "Kreator";
  return {
    title: `${name} — Profil Kreator Otomotif | Carpaign`,
    description:
      profile.bio ??
      `Lihat profil dan katalog promosi unit mobil dari ${name} di Carpaign.`,
    openGraph: {
      title: `${name} — Kreator Otomotif | Carpaign`,
      description: profile.bio ?? `Katalog promosi unit mobil dari ${name}.`,
      images: profile.avatarImage ? [{ url: profile.avatarImage }] : [],
    },
  };
}

export default async function DirectCreatorPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
    notFound();
  }

  const profile = await getPublicCreatorByRef(slug);

  if (!profile) {
    notFound();
  }

  return <PublicCreatorProfileView profile={profile} />;
}
