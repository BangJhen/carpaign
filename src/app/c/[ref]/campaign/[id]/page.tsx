import { notFound } from "next/navigation";
import { getPublicCampaignDetail } from "@/app/actions/publicCreator";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Tag,
  ShieldCheck,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Share2,
} from "lucide-react";

interface Props {
  params: Promise<{ ref: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref, id } = await params;
  const data = await getPublicCampaignDetail(id, ref);

  if (!data) {
    return { title: "Kampanye Tidak Ditemukan — Carpaign" };
  }

  const creatorName = data.creator?.fullName ?? data.creator?.username ?? "Kreator";
  return {
    title: `${data.campaign.vehicle} — Promo Rekomendasi ${creatorName} | Carpaign`,
    description: `${data.campaign.promoHighlight}. Dapatkan informasi unit, spesifikasi lengkap, dan penawaran dealer resmi ${data.campaign.brand}.`,
  };
}

export default async function PublicCreatorCampaignPage({ params }: Props) {
  const { ref, id } = await params;
  const data = await getPublicCampaignDetail(id, ref);

  if (!data) {
    notFound();
  }

  const { campaign, creator } = data;
  const creatorName = creator?.fullName ?? creator?.username ?? "Kreator Otomotif";

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-white/20 font-sans antialiased">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href={`/c/${ref}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Katalog {creatorName}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 font-mono hidden sm:inline">
              carpaign.id/c/{ref}
            </span>
            <Link
              href={`/c/${ref}`}
              className="inline-flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-medium text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
            >
              <span>Profil Kreator</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Creator Endorsement Ribbon */}
        <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
              {creatorName[0]}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Rekomendasi Resmi oleh {creatorName}
              </p>
              <p className="text-[11px] text-white/60">
                Unit dan program promosi telah diverifikasi melalui Carpaign.
              </p>
            </div>
          </div>

          <Link
            href={`/c/${ref}`}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Lihat Semua Promo dari {creatorName}</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>

        {/* Hero Vehicle Banner */}
        <div className="rounded-2xl bg-[#0F1114] border border-white/[0.08] overflow-hidden">
          <div className="relative h-64 sm:h-96 w-full bg-[#14161A]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.image}
              alt={campaign.vehicle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1114] via-transparent to-transparent" />
            
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="text-xs font-bold text-white bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-md">
                {campaign.type}
              </span>
              <span className="text-xs font-semibold text-primary bg-[#0A0A0C]/90 border border-primary/30 px-3 py-1 rounded-md">
                Promo Dealer Resmi
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-xs font-medium text-white/60">
                {campaign.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                {campaign.vehicle}
              </h1>
            </div>
          </div>

          {/* Promo Highlight Banner */}
          <div className="p-5 sm:p-6 bg-white/[0.02] border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                <Tag className="size-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-primary font-bold">
                  Program Penawaran Spesial
                </p>
                <p className="text-base font-bold text-white mt-0.5">
                  {campaign.promoHighlight}
                </p>
              </div>
            </div>

            {campaign.dealerPhone && (
              <a
                href={`https://wa.me/${campaign.dealerPhone}?text=${encodeURIComponent(
                  `Halo ${campaign.brand}, saya tertarik dengan promo ${campaign.vehicle} (${campaign.promoHighlight}) yang saya lihat dari katalog ${creatorName} di Carpaign.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shrink-0"
              >
                <MessageCircle className="size-4 text-black" />
                <span>Hubungi Dealer via WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Vehicle Description & Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Tentang Kendaraan & Penawaran
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                {campaign.description}
              </p>
              <p className="text-xs text-white/60 leading-relaxed">
                {campaign.brief}
              </p>
            </div>

            <div className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Spesifikasi Teknis
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {campaign.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1"
                  >
                    <span className="text-[11px] text-white/40 block font-medium">
                      {spec.label}
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Location & Direct Contact */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Lokasi Dealer Resmi
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 text-white/80">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{campaign.brand}</p>
                    <p className="text-white/60 mt-0.5">{campaign.location}</p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${campaign.brand} ${campaign.location}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white transition-colors"
                >
                  <MapPin className="size-3.5 text-white/60" />
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="size-3 text-white/40" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
                <ShieldCheck className="size-4 text-primary" />
                <span>Jaminan Transaksi Resmi</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Semua unit dan promo yang tercantum di halaman ini terhubung langsung dengan dealer partner terverifikasi di platform Carpaign.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-6 mt-12 bg-[#0A0A0C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>Carpaign — Rekomendasi Kendaraan Resmi</span>
          <span>Hak Cipta Dilindungi</span>
        </div>
      </footer>
    </div>
  );
}
