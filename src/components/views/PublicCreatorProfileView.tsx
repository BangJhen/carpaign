"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Eye,
  TrendingUp,
  Film,
  User,
  CheckCircle2,
  Video,
  Car,
  Tag,
  Clock,
  ShieldCheck,
  MessageCircle,
  X,
  Share2,
  Sparkles,
} from "lucide-react";
import { TikTokIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/social-icons";
import type { PublicCreatorProfile, PublicPromotedCampaign } from "@/app/actions/publicCreator";
import { toast } from "sonner";
import Link from "next/link";
import dynamic from "next/dynamic";

const PerformanceChart = dynamic(() => import("./PerformanceChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[240px] bg-white/[0.02] rounded-xl flex items-center justify-center text-xs text-white/30">
      Memuat grafik performa...
    </div>
  ),
});

type CampaignCategoryFilter = "all" | "UGC & Review" | "Clip & Publish" | "Shoot & Edit";

interface PortfolioVideo {
  id: string;
  title: string;
  platform: "tiktok" | "instagram" | "youtube";
  platformLabel: string;
  campaignType: "UGC & Review" | "Clip & Publish" | "Shoot & Edit";
  views: string;
  duration: string;
  carModel: string;
  getUrl: (profile: PublicCreatorProfile) => string;
}

const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  {
    id: "vid-1",
    title: "Review Lengkap Honda HR-V RS Turbo — First Drive & Sound Test",
    platform: "tiktok",
    platformLabel: "TikTok",
    campaignType: "UGC & Review",
    views: "142.500 tayangan",
    duration: "01:15",
    carModel: "Honda HR-V RS",
    getUrl: (p) =>
      p.tiktokUsername
        ? `https://www.tiktok.com/@${p.tiktokUsername.replace(/^@/, "")}`
        : `https://www.tiktok.com/@${(p.username || "kreator").replace(/^@/, "")}`,
  },
  {
    id: "vid-2",
    title: "Cinematic Reel Porsche 911 GT3 RS di Sirkuit",
    platform: "instagram",
    platformLabel: "Instagram",
    campaignType: "Shoot & Edit",
    views: "98.200 tayangan",
    duration: "00:45",
    carModel: "Porsche 911 GT3 RS",
    getUrl: (p) =>
      p.instagramUsername
        ? `https://www.instagram.com/${p.instagramUsername.replace(/^@/, "")}`
        : `https://www.instagram.com/${(p.username || "kreator").replace(/^@/, "")}`,
  },
  {
    id: "vid-3",
    title: "Showroom Walkthrough Unit Terbaru BMW 330i M Sport",
    platform: "youtube",
    platformLabel: "YouTube",
    campaignType: "Shoot & Edit",
    views: "83.600 tayangan",
    duration: "04:20",
    carModel: "BMW 330i M Sport",
    getUrl: (p) =>
      p.youtubeUsername
        ? p.youtubeUsername.startsWith("http")
          ? p.youtubeUsername
          : `https://www.youtube.com/@${p.youtubeUsername.replace(/^@/, "")}`
        : `https://www.youtube.com/@${(p.username || "kreator").replace(/^@/, "")}`,
  },
  {
    id: "vid-4",
    title: "Shorts Toyota Avanza Veloz — Kenyamanan Kabin Keluarga",
    platform: "tiktok",
    platformLabel: "TikTok",
    campaignType: "Clip & Publish",
    views: "115.000 tayangan",
    duration: "00:30",
    carModel: "Toyota Veloz TSS",
    getUrl: (p) =>
      p.tiktokUsername
        ? `https://www.tiktok.com/@${p.tiktokUsername.replace(/^@/, "")}`
        : `https://www.tiktok.com/@${(p.username || "kreator").replace(/^@/, "")}`,
  },
  {
    id: "vid-5",
    title: "First Impression Hyundai Ioniq 5 N — Electric Drift Experience",
    platform: "instagram",
    platformLabel: "Instagram",
    campaignType: "UGC & Review",
    views: "72.400 tayangan",
    duration: "01:00",
    carModel: "Hyundai Ioniq 5 N",
    getUrl: (p) =>
      p.instagramUsername
        ? `https://www.instagram.com/${p.instagramUsername.replace(/^@/, "")}`
        : `https://www.instagram.com/${(p.username || "kreator").replace(/^@/, "")}`,
  },
  {
    id: "vid-6",
    title: "UGC Test Drive & Kupas Fitur Mitsubishi Pajero Sport",
    platform: "youtube",
    platformLabel: "YouTube",
    campaignType: "UGC & Review",
    views: "64.800 tayangan",
    duration: "08:12",
    carModel: "Pajero Sport Dakar",
    getUrl: (p) =>
      p.youtubeUsername
        ? p.youtubeUsername.startsWith("http")
          ? p.youtubeUsername
          : `https://www.youtube.com/@${p.youtubeUsername.replace(/^@/, "")}`
        : `https://www.youtube.com/@${(p.username || "kreator").replace(/^@/, "")}`,
  },
];

const CAMPAIGN_SPECIALIZATIONS = [
  {
    title: "Clip & Publish",
    description:
      "Memotong video rekaman dealer menjadi format vertikal 9:16 untuk TikTok dan Instagram Reels.",
  },
  {
    title: "UGC & Review",
    description:
      "Ulasan unit mobil secara otentik, pengalaman berkendara, dan pemaparan fitur kendaraan.",
  },
  {
    title: "Shoot & Edit",
    description:
      "Pengambilan video di showroom atau lintasan dengan teknik sinematografi dan penataan warna profesional.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

function getInitials(name?: string | null) {
  if (!name) return "K";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatJoinDate(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

function cleanPhoneForWhatsApp(phone?: string | null) {
  if (!phone) return null;
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

interface Props {
  profile: PublicCreatorProfile;
}

export function PublicCreatorProfileView({ profile }: Props) {
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CampaignCategoryFilter>("all");
  const [activeCampaignModal, setActiveCampaignModal] = useState<PublicPromotedCampaign | null>(null);

  const referralCode = profile.referralCode || "kreator";
  const creatorName = profile.fullName ?? profile.username ?? "Kreator Otomotif";

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${referralCode}`
      : `https://carpaign.id/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl).catch(() => {});
    setCopied(true);
    toast.success("Link bio kreator berhasil disalin");
    setTimeout(() => setCopied(false), 2000);
  };

  const campaigns = profile.promotedCampaigns || [];
  const filteredCampaigns =
    selectedCategory === "all"
      ? campaigns
      : campaigns.filter((c) => c.type === selectedCategory);

  const cleanPhone = cleanPhoneForWhatsApp(profile.phone);
  const creatorWaUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Halo ${creatorName}, saya melihat halaman katalog mobil Carpaign Anda dan ingin mendiskusikan peluang kolaborasi.`
      )}`
    : null;

  // Social accounts configuration
  const socialAccounts = [
    {
      key: "tiktok",
      name: "TikTok",
      icon: TikTokIcon,
      username: profile.tiktokUsername,
      fallbackUrl: `https://www.tiktok.com/@${(profile.username || "kreator").replace(/^@/, "")}`,
      buildUrl: (u: string) => `https://www.tiktok.com/@${u.replace(/^@/, "")}`,
    },
    {
      key: "instagram",
      name: "Instagram",
      icon: InstagramIcon,
      username: profile.instagramUsername,
      fallbackUrl: `https://www.instagram.com/${(profile.username || "kreator").replace(/^@/, "")}`,
      buildUrl: (u: string) => `https://www.instagram.com/${u.replace(/^@/, "")}`,
    },
    {
      key: "youtube",
      name: "YouTube",
      icon: YouTubeIcon,
      username: profile.youtubeUsername,
      fallbackUrl: `https://www.youtube.com/@${(profile.username || "kreator").replace(/^@/, "")}`,
      buildUrl: (u: string) => {
        if (u.startsWith("http")) return u;
        if (u.includes("youtube.com")) return `https://${u}`;
        return `https://www.youtube.com/@${u.replace(/^@/, "")}`;
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-white/20 font-sans antialiased">
      {/* Topbar Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold tracking-wider uppercase text-white/90 hover:text-white transition-colors"
            >
              Carpaign
            </Link>
            <span className="text-white/20 text-xs">/</span>
            <span className="text-xs text-white/50">Katalog Promosi Kreator</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
            >
              {copied ? (
                <Check className="size-3.5 text-white" />
              ) : (
                <Share2 className="size-3.5 text-white/60" />
              )}
              <span>{copied ? "Tersalin" : "Bagikan Link"}</span>
            </button>

            <Link
              href="/creator/dashboard"
              className="inline-flex items-center gap-1 h-8 px-3.5 rounded-lg text-xs font-semibold text-black bg-white hover:bg-white/90 transition-colors"
            >
              <span>Dashboard Kreator</span>
              <ChevronRight className="size-3 text-black/60" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section 1: Hero Header Kreator */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-2xl bg-[#0F1114] border border-white/[0.08] overflow-hidden"
        >
          {/* Cover Banner */}
          <div className="h-36 sm:h-48 w-full bg-[#14161A] relative overflow-hidden">
            {profile.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.coverImage}
                alt="Foto sampul profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1114] via-[#0F1114]/50 to-transparent" />
          </div>

          {/* Profile Identity Body */}
          <div className="px-5 sm:px-8 pb-7 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 -mt-14 sm:-mt-16">
              {/* Avatar & Main Identity */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="size-24 sm:size-28 rounded-2xl flex-shrink-0 border-2 border-white/10 bg-[#121418] overflow-hidden shadow-none">
                  {profile.avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarImage}
                      alt={creatorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white/60">
                      {getInitials(creatorName)}
                    </div>
                  )}
                </div>

                <div className="space-y-1 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-white/80 bg-white/[0.06] border border-white/[0.1] px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                      <ShieldCheck className="size-3 text-primary" />
                      Kreator Otomotif Resmi
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {creatorName}
                  </h1>

                  {profile.username && (
                    <p className="text-xs font-mono text-white/40">
                      {profile.username.startsWith("@")
                        ? profile.username
                        : `@${profile.username}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Verified Social Media Pills */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-end pb-1">
                {socialAccounts.map((account) => {
                  const isConnected = !!account.username && account.username.trim() !== "";
                  const targetUrl = isConnected
                    ? account.buildUrl(account.username!)
                    : account.fallbackUrl;
                  const displayHandle = isConnected
                    ? account.username!.startsWith("@")
                      ? account.username
                      : `@${account.username}`
                    : profile.username || "@kreator";

                  return (
                    <a
                      key={account.key}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white/80 hover:text-white transition-all group"
                    >
                      <account.icon className="size-3.5 text-white/60 group-hover:text-white transition-colors" />
                      <span>{account.name}</span>
                      <span className="text-[10px] text-white/40 font-mono hidden sm:inline">
                        {displayHandle}
                      </span>
                      <ExternalLink className="size-2.5 text-white/30 group-hover:text-white/60" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bio Description & Location */}
            <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-white/70 max-w-3xl leading-relaxed">
                {profile.bio ||
                  "Kreator otomotif aktif yang menyajikan ulasan kendaraan terbaru, promo dealer terverifikasi, dan konten sinematografi otomotif."}
              </p>
              <div className="flex items-center gap-4 text-xs text-white/40 shrink-0">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-white/40" />
                  <span>{profile.city || "Jakarta, Indonesia"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-white/40" />
                  <span>Sejak {formatJoinDate(profile.joinedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 2: CENTERPIECE — Katalog Mobil & Kampanye yang Sedang Dipromosikan */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="space-y-5"
        >
          {/* Header Section & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Car className="size-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Mobil & Kampanye yang Sedang Dipromosikan
                </h2>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Katalog unit mobil dan penawaran promo dealer resmi yang direkomendasikan langsung oleh {creatorName}.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.06] shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
              {(
                [
                  { key: "all", label: "Semua Unit" },
                  { key: "UGC & Review", label: "UGC & Review" },
                  { key: "Clip & Publish", label: "Clip & Publish" },
                  { key: "Shoot & Edit", label: "Shoot & Edit" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === tab.key
                      ? "bg-white text-black font-semibold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Promoted Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="group rounded-2xl bg-[#0F1114] border border-white/[0.08] hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Vehicle Thumbnail */}
                  <div className="h-48 w-full bg-[#14161A] relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={camp.image}
                      alt={camp.vehicle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1114] via-transparent to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-white bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md">
                        {camp.type}
                      </span>
                      <span className="text-[10px] font-semibold text-primary bg-[#0A0A0C]/90 border border-primary/30 px-2 py-0.5 rounded-md">
                        Promo Dealer Resmi
                      </span>
                    </div>

                    {/* Bottom Promo Highlight Ribbon */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.1] backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white">
                        <Tag className="size-3 text-primary" />
                        <span>{camp.promoHighlight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[11px] font-medium text-white/40 block">
                        {camp.brand} • {camp.location.split(",")[0]}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight mt-0.5 group-hover:text-primary transition-colors">
                        {camp.vehicle}
                      </h3>
                    </div>

                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {camp.description}
                    </p>

                    {/* Key Specs Pills */}
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {camp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-white/50 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveCampaignModal(camp)}
                      className="inline-flex items-center justify-center gap-1.5 flex-1 h-9 px-3 rounded-xl text-xs font-semibold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-all"
                    >
                      <span>Lihat Promo & Spek</span>
                    </button>

                    <Link
                      href={`/${referralCode}/campaign/${camp.id}`}
                      className="inline-flex items-center justify-center gap-1 h-9 px-3 rounded-xl text-xs font-semibold text-black bg-white hover:bg-white/90 transition-all shrink-0"
                    >
                      <span>Detail Promo</span>
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 3: Karya Video & Bukti Konten Media Sosial */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-5 sm:p-6 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Video className="size-4 text-white/70" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Karya Video & Review Otomotif
                </h2>
              </div>
              <p className="text-xs text-white/40 mt-0.5">
                Portofolio video yang telah dipublikasikan di akun TikTok, Instagram Reels, dan YouTube resmi {creatorName}.
              </p>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PORTFOLIO_VIDEOS.map((video) => {
              const videoUrl = video.getUrl(profile);
              const PlatformIcon =
                video.platform === "tiktok"
                  ? TikTokIcon
                  : video.platform === "instagram"
                  ? InstagramIcon
                  : YouTubeIcon;

              return (
                <div
                  key={video.id}
                  className="rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] p-4 flex flex-col justify-between gap-4 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium text-white/80 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                        <PlatformIcon className="size-3.5 text-white/80" />
                        <span>{video.platformLabel}</span>
                      </div>
                      <span className="text-white/40 text-[10px] bg-white/[0.02] px-1.5 py-0.5 rounded">
                        {video.campaignType}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-white/90 line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-[11px] text-white/40">
                      {video.views}
                    </span>
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors"
                    >
                      <PlatformIcon className="size-3 text-white/60" />
                      <span>Buka di {video.platformLabel}</span>
                      <ExternalLink className="size-3 text-white/40" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Section 4: Ringkasan Metrik & Statistik Jangkauan */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-white/70" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Performa & Jangkauan Audiens
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0F1114] border border-white/[0.08] flex items-start justify-between">
              <div>
                <span className="text-xs text-white/40">Total Tayangan (6 Bulan)</span>
                <p className="text-2xl font-bold text-white tracking-tight mt-1.5">
                  446.200
                </p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  Akumulasi seluruh platform video
                </p>
              </div>
              <div className="size-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/60">
                <Eye className="size-4" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1114] border border-white/[0.08] flex items-start justify-between">
              <div>
                <span className="text-xs text-white/40">Rata-rata Engagement</span>
                <p className="text-2xl font-bold text-white tracking-tight mt-1.5">
                  6.8%
                </p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  Tingkat interaksi audiens aktif
                </p>
              </div>
              <div className="size-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/60">
                <TrendingUp className="size-4" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1114] border border-white/[0.08] flex items-start justify-between">
              <div>
                <span className="text-xs text-white/40">Kampanye Selesai</span>
                <p className="text-2xl font-bold text-white tracking-tight mt-1.5">
                  24 Proyek
                </p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  100% tepat waktu sesuai brief
                </p>
              </div>
              <div className="size-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/60">
                <Video className="size-4" />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1114] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/60">
                Tren Tayangan Bulanan Konten Otomotif
              </span>
              <span className="text-[11px] text-white/40 font-mono">
                Januari — Juni
              </span>
            </div>
            <div className="h-[240px] w-full">
              <PerformanceChart dataKey="views" />
            </div>
          </div>
        </motion.section>

        {/* Section 5: Informasi Hubungi Dealer & Kerja Sama */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-5 sm:p-7 space-y-6"
        >
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Layanan Kampanye & Promosi Dealer
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Jenis materi promosi kendaraan yang dikerjakan oleh {creatorName}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {CAMPAIGN_SPECIALIZATIONS.map((spec) => (
              <div
                key={spec.title}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{spec.title}</h3>
                  <CheckCircle2 className="size-3.5 text-white/40" />
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  {spec.description}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-white">
                Bekerja sama atau diskusikan kampanye dengan {creatorName}
              </p>
              <p className="text-xs text-white/40">
                Semua pemesanan dan kontrak promosi diproses secara transparan melalui sistem Carpaign.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {creatorWaUrl && (
                <a
                  href={creatorWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-xs font-medium text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-colors"
                >
                  WhatsApp Kreator
                </a>
              )}
              <Link
                href="/dealer/campaigns/create"
                className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-xs font-semibold text-black bg-white hover:bg-white/90 transition-colors"
              >
                Ajak Kolaborasi Dealer
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Interactive Quick Modal Detail Mobil & Promo */}
      <AnimatePresence>
        {activeCampaignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0F1114] border border-white/[0.1] rounded-2xl overflow-hidden shadow-none flex flex-col max-h-[90vh]"
            >
              {/* Modal Header Image */}
              <div className="relative h-56 sm:h-64 w-full bg-[#14161A] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeCampaignModal.image}
                  alt={activeCampaignModal.vehicle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1114] via-[#0F1114]/40 to-transparent" />
                
                <button
                  onClick={() => setActiveCampaignModal(null)}
                  className="absolute top-4 right-4 size-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <X className="size-4" />
                </button>

                <div className="absolute bottom-4 left-5 right-5">
                  <span className="text-[10px] font-bold text-white bg-black/70 border border-white/10 px-2.5 py-1 rounded-md">
                    {activeCampaignModal.brand}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                    {activeCampaignModal.vehicle}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
                {/* Promo Highlight Box */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-start gap-3">
                  <Tag className="size-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">
                      Program Promo: {activeCampaignModal.promoHighlight}
                    </p>
                    <p className="text-xs text-white/70">
                      Penawaran resmi dealer rekanan melalui rekomendasi {creatorName}.
                    </p>
                  </div>
                </div>

                {/* Description & Overview */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Ringkasan Kendaraan
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {activeCampaignModal.description}
                  </p>
                </div>

                {/* Vehicle Specs Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Spesifikasi & Detail Utama
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {activeCampaignModal.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
                      >
                        <span className="text-white/40">{spec.label}</span>
                        <span className="font-semibold text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Showroom Location */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="size-4 text-white/40" />
                    <span>Lokasi Dealer: {activeCampaignModal.location}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${activeCampaignModal.brand} ${activeCampaignModal.location}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0A0A0C] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="text-[11px] text-white/40 hidden sm:block">
                  Konsultasi dan test drive gratis tanpa dipungut biaya.
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {activeCampaignModal.dealerPhone && (
                    <a
                      href={`https://wa.me/${activeCampaignModal.dealerPhone}?text=${encodeURIComponent(
                        `Halo ${activeCampaignModal.brand}, saya tertarik dengan penawaran ${activeCampaignModal.vehicle} (${activeCampaignModal.promoHighlight}) yang direkomendasikan oleh ${creatorName} di Carpaign.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>Hubungi Dealer</span>
                    </a>
                  )}

                  <Link
                    href={`/${referralCode}/campaign/${activeCampaignModal.id}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-semibold text-black bg-white hover:bg-white/90 transition-colors"
                  >
                    <span>Halaman Lengkap</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-6 mt-12 bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>Carpaign — Platform Kreator & Kampanye Otomotif Resmi</span>
          <span>Hak Cipta Dilindungi</span>
        </div>
      </footer>
    </div>
  );
}
