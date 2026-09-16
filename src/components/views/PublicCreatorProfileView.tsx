"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  TrendingUp,
  Eye,
  Heart,
  Video,
  Clock,
  ShieldCheck,
  Film,
  Sparkles,
  Phone,
  MessageCircle,
  Share2,
  CheckCircle2,
  Layers,
  ChevronRight,
  Play,
  Briefcase,
  SlidersHorizontal,
} from "lucide-react";
import { TikTokIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/social-icons";
import type { PublicCreatorProfile } from "@/app/actions/publicCreator";
import { toast } from "sonner";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PerformanceChart = dynamic(() => import("./PerformanceChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[260px] animate-pulse bg-white/5 rounded-xl flex items-center justify-center text-xs text-white/30">
      Memuat grafik performa...
    </div>
  ),
});

const TIER_CONFIG: Record<
  number,
  { label: string; badgeClass: string }
> = {
  1: {
    label: "Kreator",
    badgeClass: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/25",
  },
  2: {
    label: "Kreator Pro",
    badgeClass: "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/25",
  },
  3: {
    label: "Kreator Elite",
    badgeClass: "text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/25",
  },
};

type VideoCategory = "all" | "tiktok" | "instagram" | "youtube";

interface PortfolioVideo {
  id: string;
  title: string;
  platform: "tiktok" | "instagram" | "youtube";
  campaignType: "UGC/Review" | "Clipping" | "Videographer/Edit";
  views: string;
  likes: string;
  duration: string;
  thumbnailBg: string;
  carModel: string;
  getUrl: (profile: PublicCreatorProfile) => string;
}

const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  {
    id: "vid-1",
    title: "Review Lengkap BMW M4 Competition — First Drive & Sound Test",
    platform: "tiktok",
    campaignType: "UGC/Review",
    views: "142.5K",
    likes: "18.4K",
    duration: "01:15",
    thumbnailBg: "from-amber-950/40 via-[#13161B] to-[#0A0A0C]",
    carModel: "BMW M4 Competition",
    getUrl: (p) =>
      p.tiktokUsername
        ? `https://www.tiktok.com/@${p.tiktokUsername.replace(/^@/, "")}`
        : "https://www.tiktok.com",
  },
  {
    id: "vid-2",
    title: "Cinematic Reel Porsche 911 GT3 RS di Sirkuit Mandalika",
    platform: "instagram",
    campaignType: "Videographer/Edit",
    views: "98.2K",
    likes: "14.1K",
    duration: "00:45",
    thumbnailBg: "from-rose-950/40 via-[#13161B] to-[#0A0A0C]",
    carModel: "Porsche 911 GT3 RS",
    getUrl: (p) =>
      p.instagramUsername
        ? `https://www.instagram.com/${p.instagramUsername.replace(/^@/, "")}`
        : "https://www.instagram.com",
  },
  {
    id: "vid-3",
    title: "Showroom Walkthrough Unit Terbaru Mercedes-AMG G63",
    platform: "youtube",
    campaignType: "Videographer/Edit",
    views: "83.6K",
    likes: "9.8K",
    duration: "04:20",
    thumbnailBg: "from-red-950/40 via-[#13161B] to-[#0A0A0C]",
    carModel: "Mercedes-AMG G63",
    getUrl: (p) =>
      p.youtubeUsername
        ? p.youtubeUsername.startsWith("http")
          ? p.youtubeUsername
          : `https://www.youtube.com/@${p.youtubeUsername.replace(/^@/, "")}`
        : "https://www.youtube.com",
  },
  {
    id: "vid-4",
    title: "Shorts Toyota GR Yaris — Akselerasi & Downshift Exhaust Pop",
    platform: "tiktok",
    campaignType: "Clipping",
    views: "115.0K",
    likes: "21.3K",
    duration: "00:30",
    thumbnailBg: "from-slate-900 via-[#13161B] to-[#0A0A0C]",
    carModel: "Toyota GR Yaris",
    getUrl: (p) =>
      p.tiktokUsername
        ? `https://www.tiktok.com/@${p.tiktokUsername.replace(/^@/, "")}`
        : "https://www.tiktok.com",
  },
  {
    id: "vid-5",
    title: "First Impression Hyundai Ioniq 5 N — Suara Mesin Listrik Buatan",
    platform: "instagram",
    campaignType: "UGC/Review",
    views: "72.4K",
    likes: "8.6K",
    duration: "01:00",
    thumbnailBg: "from-sky-950/40 via-[#13161B] to-[#0A0A0C]",
    carModel: "Hyundai Ioniq 5 N",
    getUrl: (p) =>
      p.instagramUsername
        ? `https://www.instagram.com/${p.instagramUsername.replace(/^@/, "")}`
        : "https://www.instagram.com",
  },
  {
    id: "vid-6",
    title: "UGC Test Drive & Kupas Fitur Mitsubishi Pajero Sport Dakar",
    platform: "youtube",
    campaignType: "UGC/Review",
    views: "64.8K",
    likes: "7.2K",
    duration: "08:12",
    thumbnailBg: "from-emerald-950/40 via-[#13161B] to-[#0A0A0C]",
    carModel: "Pajero Sport Dakar",
    getUrl: (p) =>
      p.youtubeUsername
        ? p.youtubeUsername.startsWith("http")
          ? p.youtubeUsername
          : `https://www.youtube.com/@${p.youtubeUsername.replace(/^@/, "")}`
        : "https://www.youtube.com",
  },
];

const CAMPAIGN_SPECIALIZATIONS = [
  {
    title: "Clipping",
    tagline: "Video Vertikal Format 9:16",
    desc: "Memotong rekaman promosi showroom atau video panjang menjadi klip pendek berdaya pikat tinggi di TikTok dan Instagram Reels.",
  },
  {
    title: "UGC / Review",
    tagline: "Ulasan Otentik & Test Drive",
    desc: "Membawakan unit kendaraan dealer dengan gaya ulasan jujur, informatif, dan persuasif yang membangun kepercayaan calon pembeli.",
  },
  {
    title: "Videographer / Edit",
    tagline: "Sinematografi Unit & Showroom",
    desc: "Pengambilan gambar sinematik unit mobil baru maupun bekas dengan pencahayaan showroom optimal dan grading warna elegan.",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
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
  const [chartMetric, setChartMetric] = useState<"views" | "engagement">("views");
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>("all");
  const [collabModalOpen, setCollabModalOpen] = useState(false);

  const referralCode = profile.referralCode || "kreator";
  const tierInfo = TIER_CONFIG[profile.tier ?? 1] ?? TIER_CONFIG[1];
  const creatorName = profile.fullName ?? profile.username ?? "Kreator Otomotif";

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/c/${referralCode}`
      : `https://carpaign.id/c/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl).catch(() => {});
    setCopied(true);
    toast.success("Link portofolio disalin ke clipboard", {
      description: publicUrl,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredVideos =
    selectedCategory === "all"
      ? PORTFOLIO_VIDEOS
      : PORTFOLIO_VIDEOS.filter((v) => v.platform === selectedCategory);

  const cleanPhone = cleanPhoneForWhatsApp(profile.phone);
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Halo ${creatorName}, saya tertarik untuk mengajak Anda berkolaborasi dalam kampanye promosi otomotif melalui platform Carpaign.`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-[#D4AF37]/30 font-sans antialiased">
      {/* Topbar Dashboard Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0A0C]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-80"
            >
              <div className="size-7 rounded-lg bg-white flex items-center justify-center text-black font-bold text-xs tracking-tight">
                CP
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                Carpaign
              </span>
            </Link>

            <span className="hidden sm:inline-block text-white/20 text-xs">/</span>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-white/70">
              <Film className="size-3 text-[#D4AF37]" />
              <span>Dashboard Portofolio Kreator</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tersedia untuk Kolaborasi</span>
            </div>

            {/* Copy Shortlink Button */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all"
              title="Salin tautan portofolio"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5 text-white/60" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Tersalin" : "Salin Link"}
              </span>
            </button>

            {/* Action CTA: Ajak Kolaborasi */}
            <Dialog open={collabModalOpen} onOpenChange={setCollabModalOpen}>
              <DialogTrigger className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#E5C158] transition-all shadow-sm">
                <Briefcase className="size-3.5 text-black" />
                <span>Ajak Kolaborasi</span>
              </DialogTrigger>
              <DialogContent className="bg-[#111316] border border-white/10 text-white max-w-md rounded-2xl p-6">
                <DialogHeader className="space-y-1.5">
                  <DialogTitle className="text-base font-bold flex items-center gap-2 text-white">
                    <Briefcase className="size-4 text-[#D4AF37]" />
                    <span>Kolaborasi dengan {creatorName}</span>
                  </DialogTitle>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Pilih metode untuk mulai bekerja sama dengan kreator ini melalui platform Carpaign.
                  </p>
                </DialogHeader>

                <div className="space-y-3 pt-3">
                  <Link
                    href="/dealer/campaigns/create"
                    onClick={() => setCollabModalOpen(false)}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all group"
                  >
                    <div className="size-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
                      <Briefcase className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        Buat Kampanye Baru untuk Kreator
                      </p>
                      <p className="text-[11px] text-white/50 leading-relaxed mt-0.5">
                        Tugaskan unit mobil dealer Anda ke kampanye Clipping, UGC, atau Video Edit.
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all self-center" />
                  </Link>

                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all group"
                    >
                      <div className="size-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                        <MessageCircle className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          Hubungi via WhatsApp Resmi
                        </p>
                        <p className="text-[11px] text-white/50 leading-relaxed mt-0.5">
                          Kirim pesan langsung ke kreator untuk diskusi teknis dan jadwal produksi.
                        </p>
                      </div>
                      <ExternalLink className="size-4 text-white/30 group-hover:text-white/70 transition-all self-center" />
                    </a>
                  )}

                  <div className="p-3 rounded-xl bg-[#D4AF37]/[0.05] border border-[#D4AF37]/15 flex items-start gap-2.5">
                    <ShieldCheck className="size-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      Seluruh transaksi dilindungi sistem escrow Carpaign. Dana pembayaran hanya diteruskan setelah materi video Anda disetujui.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1. Header Card: Creator Profile & Identity */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-2xl bg-[#0F1114] border border-white/[0.08] overflow-hidden shadow-xl relative"
        >
          {/* Cover Header Banner */}
          <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-[#14161A]">
            {profile.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.coverImage}
                alt="Foto sampul profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#17140E] via-[#101215] to-[#0A0A0C]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1114] via-[#0F1114]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          </div>

          {/* Profile Identity Body */}
          <div className="px-5 sm:px-8 pb-7 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              {/* Avatar + Main Info */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                {/* Avatar */}
                <div className="size-28 sm:size-32 rounded-2xl flex-shrink-0 border-2 border-white/10 bg-[#121418] overflow-hidden shadow-2xl relative">
                  {profile.avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarImage}
                      alt={creatorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#D4AF37]">
                      {getInitials(creatorName)}
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 border-2 border-[#121418]" />
                </div>

                {/* Text Details */}
                <div className="space-y-1.5 pb-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${tierInfo.badgeClass}`}
                    >
                      {tierInfo.label}
                    </span>
                    <span className="text-[10px] font-medium text-white/50 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.08]">
                      Kreator Otomotif
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {creatorName}
                  </h1>

                  {profile.username && (
                    <p className="text-xs font-mono text-white/50">
                      {profile.username.startsWith("@")
                        ? profile.username
                        : `@${profile.username}`}
                    </p>
                  )}

                  {/* Meta badges */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-white/50">
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

              {/* Right Side: Social Media Pills & Quick Action */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 self-start md:self-end">
                {/* Social media direct links */}
                <div className="flex items-center gap-2">
                  {profile.tiktokUsername && (
                    <a
                      href={`https://www.tiktok.com/@${profile.tiktokUsername.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white/80 transition-colors"
                      title="Kunjungi TikTok"
                    >
                      <TikTokIcon className="size-3.5 text-[#69C9D0]" />
                      <span>TikTok</span>
                    </a>
                  )}

                  {profile.instagramUsername && (
                    <a
                      href={`https://www.instagram.com/${profile.instagramUsername.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white/80 transition-colors"
                      title="Kunjungi Instagram"
                    >
                      <InstagramIcon className="size-3.5 text-[#E1306C]" />
                      <span>Instagram</span>
                    </a>
                  )}

                  {profile.youtubeUsername && (
                    <a
                      href={
                        profile.youtubeUsername.startsWith("http")
                          ? profile.youtubeUsername
                          : `https://www.youtube.com/@${profile.youtubeUsername.replace(/^@/, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white/80 transition-colors"
                      title="Kunjungi YouTube"
                    >
                      <YouTubeIcon className="size-3.5 text-[#FF0000]" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>

                {/* Shortlink pill */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 bg-white/[0.02] px-3 py-1 rounded-lg border border-white/[0.06]">
                  <span>carpaign.id/c/{referralCode}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Overview Metrics Row (4 KPI Cards) */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div
            variants={fadeUp}
            className="p-5 rounded-2xl bg-[#0F1114] border border-white/[0.08] relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">
                Total Tayangan Konten
              </span>
              <div className="size-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Eye className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-black text-white tracking-tight">
                842.5K
              </p>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="size-3" />
                <span>+24.8% dalam 30 hari terakhir</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-5 rounded-2xl bg-[#0F1114] border border-white/[0.08] relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">
                Rata-rata Engagement
              </span>
              <div className="size-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                <Heart className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-black text-white tracking-tight">
                6.8%
              </p>
              <p className="text-[11px] text-white/50 font-medium mt-1">
                Di atas rata-rata industri otomotif (3.2%)
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-5 rounded-2xl bg-[#0F1114] border border-white/[0.08] relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">
                Konten Diproduksi
              </span>
              <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Video className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-black text-white tracking-tight">
                24 Video
              </p>
              <p className="text-[11px] text-white/50 font-medium mt-1">
                Review, Clipping & Sinematik
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="p-5 rounded-2xl bg-[#0F1114] border border-white/[0.08] relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">
                Ketepatan Waktu Delivery
              </span>
              <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Clock className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-black text-white tracking-tight">
                99.2%
              </p>
              <p className="text-[11px] text-white/50 font-medium mt-1">
                Diselesaikan sebelum batas deadline
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3. Performance Chart Section */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-[#D4AF37]" />
                <h2 className="text-sm font-bold text-white tracking-tight uppercase">
                  Analisis Performa Tayangan & Jangkauan
                </h2>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Statistik pertumbuhan akumulasi tayangan video otomotif dalam 6 bulan terakhir.
              </p>
            </div>

            {/* Metric Toggle */}
            <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] self-start sm:self-auto">
              <button
                onClick={() => setChartMetric("views")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  chartMetric === "views"
                    ? "bg-[#D4AF37] text-black shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Tayangan (Views)
              </button>
              <button
                onClick={() => setChartMetric("engagement")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  chartMetric === "engagement"
                    ? "bg-[#38BDF8] text-black shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Interaksi (Engagements)
              </button>
            </div>
          </div>

          {/* Chart Component */}
          <div className="h-[280px] sm:h-[320px] w-full relative">
            <PerformanceChart metric={chartMetric} />
          </div>

          {/* Chart summary metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/[0.06]">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] text-white/40 font-medium">
                Puncak Tayangan
              </span>
              <p className="text-sm font-bold text-white mt-0.5">
                118.2K Tayangan
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">
                Tercapai pada bulan Juni
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] text-white/40 font-medium">
                Rata-rata Bulanan
              </span>
              <p className="text-sm font-bold text-white mt-0.5">
                74.3K Tayangan
              </p>
              <span className="text-[10px] text-white/40 font-medium">
                Pertumbuhan stabil per kuartal
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] text-white/40 font-medium">
                Format Paling Diminati
              </span>
              <p className="text-sm font-bold text-white mt-0.5">
                Short Video Vertikal (9:16)
              </p>
              <span className="text-[10px] text-[#D4AF37] font-medium">
                TikTok & Instagram Reels
              </span>
            </div>
          </div>
        </motion.div>

        {/* 4. Portfolio Videos Section ("Link-link Video Sosmed yang Pernah Dibuatnya") */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Video className="size-4 text-[#D4AF37]" />
                <h2 className="text-sm font-bold text-white tracking-tight uppercase">
                  Portofolio Video Sosial Media
                </h2>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Tautan langsung ke video promosi otomotif yang pernah diproduksi dan dipublikasikan di kanal media sosial.
              </p>
            </div>

            {/* Platform Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { key: "all", label: "Semua" },
                  { key: "tiktok", label: "TikTok" },
                  { key: "instagram", label: "Instagram" },
                  { key: "youtube", label: "YouTube" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === tab.key
                      ? "bg-white text-black"
                      : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => {
              const videoUrl = video.getUrl(profile);
              return (
                <div
                  key={video.id}
                  className="group rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37]/30 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Thumbnail Mock / Video Header */}
                  <div
                    className={`relative h-44 w-full bg-gradient-to-br ${video.thumbnailBg} p-4 flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span className="text-[10px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                        {video.platform === "tiktok" && (
                          <TikTokIcon className="size-3 text-[#69C9D0]" />
                        )}
                        {video.platform === "instagram" && (
                          <InstagramIcon className="size-3 text-[#E1306C]" />
                        )}
                        {video.platform === "youtube" && (
                          <YouTubeIcon className="size-3 text-[#FF0000]" />
                        )}
                        <span className="uppercase">{video.platform}</span>
                      </span>

                      <span className="text-[10px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                        {video.campaignType}
                      </span>
                    </div>

                    {/* Center Play Icon & Model Badge */}
                    <div className="flex items-center justify-center my-auto z-10">
                      <div className="size-11 rounded-full bg-black/50 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black text-white transition-all shadow-lg">
                        <Play className="size-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom row: Car model tag & duration */}
                    <div className="flex items-center justify-between text-[10px] text-white/60 z-10">
                      <span className="font-semibold text-white/80">
                        {video.carModel}
                      </span>
                      <span className="font-mono bg-black/70 px-1.5 py-0.5 rounded">
                        {video.duration}
                      </span>
                    </div>

                    {/* Subtle gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {video.title}
                      </h3>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-[11px] text-white/50">
                        <span className="flex items-center gap-1">
                          <Eye className="size-3.5 text-white/40" />
                          <span>{video.views}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="size-3.5 text-white/40" />
                          <span>{video.likes}</span>
                        </span>
                      </div>
                    </div>

                    {/* Direct external link button */}
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full h-8 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-xs font-semibold text-white/90 transition-all mt-auto"
                    >
                      <span className="capitalize">
                        Buka Video di {video.platform}
                      </span>
                      <ExternalLink className="size-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 5. Creator Profile & Specialization ("Profil yang Ditulis di Halaman Profil") */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left 2 Cols: Bio & Campaign Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <div className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="border-b border-white/[0.06] pb-3">
                <h2 className="text-sm font-bold text-white tracking-tight uppercase">
                  Tentang Kreator & Profil Konten
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Informasi profil resmi dan spesialisasi yang ditulis oleh kreator.
                </p>
              </div>

              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                {profile.bio ||
                  "Kreator otomotif berfokus pada ulasan mobil, sinematografi showroom, dan konten promosi digital untuk dealer di Indonesia."}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-[#D4AF37]" />
                  <span>Domisili: {profile.city || "Jakarta, Indonesia"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#D4AF37]" />
                  <span>Terdaftar sejak {formatJoinDate(profile.joinedAt)}</span>
                </div>
              </div>
            </div>

            {/* Campaign Types Offered */}
            <div className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="border-b border-white/[0.06] pb-3">
                <h2 className="text-sm font-bold text-white tracking-tight uppercase">
                  Layanan Kampanye yang Diterima
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Format kolaborasi promosi yang tersedia melalui platform Carpaign.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {CAMPAIGN_SPECIALIZATIONS.map((spec) => (
                  <div
                    key={spec.title}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white">
                        {spec.title}
                      </h3>
                      <CheckCircle2 className="size-3.5 text-[#D4AF37]" />
                    </div>
                    <p className="text-[11px] font-medium text-[#D4AF37]/90">
                      {spec.tagline}
                    </p>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Social Accounts & Dealer Escrow Box */}
          <div className="lg:col-span-1 space-y-6">
            {/* Connected Social Accounts */}
            <div className="rounded-2xl bg-[#0F1114] border border-white/[0.08] p-6 space-y-4 shadow-xl">
              <div className="border-b border-white/[0.06] pb-3">
                <h2 className="text-sm font-bold text-white tracking-tight uppercase">
                  Media Sosial Resmi
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Kanal terhubung yang digunakan untuk mempublikasikan konten.
                </p>
              </div>

              <div className="space-y-3">
                {/* TikTok */}
                <a
                  href={
                    profile.tiktokUsername
                      ? `https://www.tiktok.com/@${profile.tiktokUsername.replace(/^@/, "")}`
                      : "#"
                  }
                  target={profile.tiktokUsername ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-black flex items-center justify-center text-white">
                      <TikTokIcon className="size-4 text-[#69C9D0]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#69C9D0] transition-colors">
                        TikTok
                      </p>
                      <p className="text-[11px] text-white/50 font-mono">
                        {profile.tiktokUsername || "Belum ditautkan"}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="size-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                </a>

                {/* Instagram */}
                <a
                  href={
                    profile.instagramUsername
                      ? `https://www.instagram.com/${profile.instagramUsername.replace(/^@/, "")}`
                      : "#"
                  }
                  target={profile.instagramUsername ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-white">
                      <InstagramIcon className="size-4 text-[#E1306C]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#E1306C] transition-colors">
                        Instagram
                      </p>
                      <p className="text-[11px] text-white/50 font-mono">
                        {profile.instagramUsername || "Belum ditautkan"}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="size-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                </a>

                {/* YouTube */}
                <a
                  href={
                    profile.youtubeUsername
                      ? profile.youtubeUsername.startsWith("http")
                        ? profile.youtubeUsername
                        : `https://www.youtube.com/@${profile.youtubeUsername.replace(/^@/, "")}`
                      : "#"
                  }
                  target={profile.youtubeUsername ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-white">
                      <YouTubeIcon className="size-4 text-[#FF0000]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#FF0000] transition-colors">
                        YouTube
                      </p>
                      <p className="text-[11px] text-white/50 font-mono truncate max-w-[140px]">
                        {profile.youtubeUsername || "Belum ditautkan"}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="size-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                </a>
              </div>
            </div>

            {/* Dealer Hire / Escrow Box */}
            <div className="rounded-2xl bg-[#D4AF37]/[0.04] border border-[#D4AF37]/20 p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#D4AF37]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                    Proteksi Kerjasama Dealer
                  </h3>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Carpaign menjamin keamanan dana kampanye melalui sistem escrow. Pembayaran Anda terlindungi dan hanya dirilis setelah video disetujui.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setCollabModalOpen(true)}
                  className="w-full h-9 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#E5C158] text-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Briefcase className="size-3.5" />
                  <span>Ajak {creatorName} Bekerja Sama</span>
                </button>

                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-9 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="size-3.5 text-emerald-400" />
                    <span>WhatsApp Langsung</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 mt-12 bg-[#0A0A0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Carpaign</span>
            <span>— Platform Kreator Otomotif Indonesia</span>
          </div>
          <div>
            <span>Dilindungi sistem verifikasi dan escrow resmi.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
