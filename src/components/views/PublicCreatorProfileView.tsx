"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { TikTokIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/social-icons";
import type { PublicCreatorProfile } from "@/app/actions/publicCreator";
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

type PlatformFilter = "all" | "tiktok" | "instagram" | "youtube";

interface PortfolioVideo {
  id: string;
  title: string;
  platform: "tiktok" | "instagram" | "youtube";
  platformLabel: string;
  campaignType: "UGC/Review" | "Clipping" | "Videographer/Edit";
  views: string;
  duration: string;
  carModel: string;
  getUrl: (profile: PublicCreatorProfile) => string;
}

const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  {
    id: "vid-1",
    title: "Review Lengkap BMW M4 Competition — First Drive & Sound Test",
    platform: "tiktok",
    platformLabel: "TikTok",
    campaignType: "UGC/Review",
    views: "142.500 tayangan",
    duration: "01:15",
    carModel: "BMW M4 Competition",
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
    campaignType: "Videographer/Edit",
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
    title: "Showroom Walkthrough Unit Terbaru Mercedes-AMG G63",
    platform: "youtube",
    platformLabel: "YouTube",
    campaignType: "Videographer/Edit",
    views: "83.600 tayangan",
    duration: "04:20",
    carModel: "Mercedes-AMG G63",
    getUrl: (p) =>
      p.youtubeUsername
        ? p.youtubeUsername.startsWith("http")
          ? p.youtubeUsername
          : `https://www.youtube.com/@${p.youtubeUsername.replace(/^@/, "")}`
        : `https://www.youtube.com/@${(p.username || "kreator").replace(/^@/, "")}`,
  },
  {
    id: "vid-4",
    title: "Shorts Toyota GR Yaris — Akselerasi & Downshift Exhaust",
    platform: "tiktok",
    platformLabel: "TikTok",
    campaignType: "Clipping",
    views: "115.000 tayangan",
    duration: "00:30",
    carModel: "Toyota GR Yaris",
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
    campaignType: "UGC/Review",
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
    campaignType: "UGC/Review",
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
    title: "Clipping",
    description:
      "Memotong video rekaman dealer menjadi format vertikal 9:16 untuk TikTok dan Instagram Reels.",
  },
  {
    title: "UGC / Review",
    description:
      "Ulasan unit mobil secara otentik, pengalaman berkendara, dan pemaparan fitur kendaraan.",
  },
  {
    title: "Videographer / Edit",
    description:
      "Pengambilan video di showroom atau lintasan dengan teknik sinematografi dan penataan warna profesional.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
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
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>("all");

  const referralCode = profile.referralCode || "kreator";
  const creatorName = profile.fullName ?? profile.username ?? "Kreator Otomotif";

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/c/${referralCode}`
      : `https://carpaign.id/c/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl).catch(() => {});
    setCopied(true);
    toast.success("Link portofolio disalin");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredVideos =
    selectedPlatform === "all"
      ? PORTFOLIO_VIDEOS
      : PORTFOLIO_VIDEOS.filter((v) => v.platform === selectedPlatform);

  const cleanPhone = cleanPhoneForWhatsApp(profile.phone);
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Halo ${creatorName}, saya ingin mendiskusikan peluang kolaborasi kampanye otomotif melalui Carpaign.`
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
      buildUrl: (u: string) =>
        u.startsWith("http") ? u : `https://www.youtube.com/@${u.replace(/^@/, "")}`,
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
            <span className="text-xs text-white/50">Portofolio Kreator</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
            >
              {copied ? (
                <Check className="size-3.5 text-white" />
              ) : (
                <Copy className="size-3.5 text-white/60" />
              )}
              <span>{copied ? "Tersalin" : "Salin Link"}</span>
            </button>

            <Link
              href="/dealer/campaigns/create"
              className="inline-flex items-center gap-1 h-8 px-3.5 rounded-lg text-xs font-semibold text-black bg-white hover:bg-white/90 transition-colors"
            >
              <span>Ajak Kolaborasi</span>
              <ChevronRight className="size-3 text-black/60" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section 1: Hero Header Kreator */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-2xl bg-[#0F1114] border border-white/[0.08] overflow-hidden"
        >
          {/* Cover Banner */}
          <div className="h-36 sm:h-44 w-full bg-[#14161A] relative overflow-hidden">
            {profile.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.coverImage}
                alt="Foto sampul profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-white/[0.04] to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1114] to-transparent" />
          </div>

          {/* Profile Identity Body */}
          <div className="px-5 sm:px-8 pb-7 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 -mt-14 sm:-mt-16">
              {/* Avatar & Main Identity */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="size-24 sm:size-28 rounded-2xl flex-shrink-0 border-2 border-white/10 bg-[#121418] overflow-hidden">
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
                    <span className="text-[11px] font-medium text-white/80 bg-white/[0.06] border border-white/[0.1] px-2.5 py-0.5 rounded-md">
                      Kreator Otomotif
                    </span>
                    {profile.tier && (
                      <span className="text-[11px] font-medium text-white/60 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-md">
                        Tier {profile.tier}
                      </span>
                    )}
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

              {/* Location & Join Date badges */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 self-start sm:self-end pb-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-white/40" />
                  <span>{profile.city || "Jakarta, Indonesia"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-white/40" />
                  <span>Bergabung {formatJoinDate(profile.joinedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Profil & Media Sosial Resmi (Dua Kolom) */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Kolom 1: Biodata & Tentang Kreator (2 Kolom) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <User className="size-4 text-white/70" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Biodata & Profil Kreator
              </h2>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                {profile.bio ||
                  "Kreator otomotif yang berfokus pada ulasan kendaraan baru dan bekas, sinematografi showroom, serta konten promosi digital untuk dealer otomotif."}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] text-white/40">Wilayah Domisili</span>
                  <p className="font-medium text-white/90">
                    {profile.city || "Jakarta Selatan, Indonesia"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[11px] text-white/40">Kategori Kampanye</span>
                  <p className="font-medium text-white/90">
                    UGC Review, Clipping & Sinematik
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 2: Akun Media Sosial Resmi (1 Kolom) */}
          <div className="lg:col-span-1 rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <Film className="size-4 text-white/70" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Media Sosial Resmi
              </h2>
            </div>

            <div className="space-y-2.5">
              {socialAccounts.map((account) => {
                const isConnected = !!account.username && account.username.trim() !== "";
                const displayHandle = isConnected
                  ? account.username!.startsWith("@")
                    ? account.username
                    : `@${account.username}`
                  : profile.username || "@kreator";
                const targetUrl = isConnected
                  ? account.buildUrl(account.username!)
                  : account.fallbackUrl;

                return (
                  <a
                    key={account.key}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white flex-shrink-0">
                        <account.icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                          {account.name}
                        </p>
                        <p className="text-[11px] text-white/40 font-mono truncate max-w-[130px]">
                          {displayHandle}
                        </p>
                      </div>
                    </div>

                    <ExternalLink className="size-3.5 text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Section 3: Ringkasan Metrik & Grafik Performa */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-white/70" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Performa Konten & Jangkauan
            </h2>
          </div>

          {/* 3 Metric Cards */}
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
                  Tingkat like, share, dan komentar
                </p>
              </div>
              <div className="size-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/60">
                <TrendingUp className="size-4" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1114] border border-white/[0.08] flex items-start justify-between">
              <div>
                <span className="text-xs text-white/40">Video Diselesaikan</span>
                <p className="text-2xl font-bold text-white tracking-tight mt-1.5">
                  24 Konten
                </p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  100% tepat waktu sesuai tenggat
                </p>
              </div>
              <div className="size-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/60">
                <Video className="size-4" />
              </div>
            </div>
          </div>

          {/* Performance Chart Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1114] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/60">
                Tren Tayangan Bulanan
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

        {/* Section 4: Portofolio Video Sosial Media (dengan Logo Platform) */}
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
                  Karya Video Sosial Media
                </h2>
              </div>
              <p className="text-xs text-white/40 mt-0.5">
                Daftar video yang telah dipublikasikan beserta logo platform dan tautan langsung.
              </p>
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/[0.06]">
              {(
                [
                  { key: "all", label: "Semua", icon: null },
                  { key: "tiktok", label: "TikTok", icon: TikTokIcon },
                  { key: "instagram", label: "Instagram", icon: InstagramIcon },
                  { key: "youtube", label: "YouTube", icon: YouTubeIcon },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedPlatform(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedPlatform === tab.key
                      ? "bg-white text-black font-semibold"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {tab.icon && <tab.icon className="size-3" />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredVideos.map((video) => {
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
                    {/* Platform Logo Badge & Campaign Category */}
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
                      <span>Buka Video</span>
                      <ExternalLink className="size-3 text-white/40" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Section 5: Layanan Kampanye & Kontak Dealer */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-5 sm:p-7 space-y-6"
        >
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Layanan Kampanye yang Diterima
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Jenis materi promosi otomotif yang dapat dikerjakan oleh kreator ini.
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

          {/* Action Row */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-white">
                Bekerja sama dengan {creatorName}
              </p>
              <p className="text-xs text-white/40">
                Semua proyek kampanye diproses secara aman melalui sistem escrow Carpaign.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-xs font-medium text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-colors"
                >
                  WhatsApp
                </a>
              )}
              <Link
                href="/dealer/campaigns/create"
                className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-xs font-semibold text-black bg-white hover:bg-white/90 transition-colors"
              >
                Mulai Kampanye
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-6 mt-12 bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>Carpaign — Platform Kreator Otomotif</span>
          <span>Hak Cipta Dilindungi</span>
        </div>
      </footer>
    </div>
  );
}
