"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Banknote,
  Eye,
  Video,
  Award,
  Zap,
  Check,
  Clock,
  ArrowUpRight,
  Filter,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Copy,
  CheckCheck,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
} from "@/components/ui/social-icons";
import { formatCampaignType } from "@/lib/utils";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.05,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

// Analytics Data for Creators
const WEEKLY_PERFORMANCE_DATA = [
  { day: "Sen", views: 14200, earnings: 71000 },
  { day: "Sel", views: 18500, earnings: 92500 },
  { day: "Rab", views: 22400, earnings: 112000 },
  { day: "Kam", views: 19800, earnings: 99000 },
  { day: "Jum", views: 28600, earnings: 143000 },
  { day: "Sab", views: 34200, earnings: 171000 },
  { day: "Min", views: 42800, earnings: 214000 },
];

const MONTHLY_PERFORMANCE_DATA = [
  { day: "Minggu 1", views: 46000, earnings: 230000 },
  { day: "Minggu 2", views: 68000, earnings: 340000 },
  { day: "Minggu 3", views: 92000, earnings: 460000 },
  { day: "Minggu 4", views: 128400, earnings: 642000 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
  metricType: "views" | "earnings";
}

function CustomChartTooltip({
  active,
  payload,
  label,
  metricType,
}: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-[#14161a] border border-primary/30 p-3 rounded-xl shadow-2xl space-y-1 backdrop-blur-md">
        <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-primary">
          {metricType === "views"
            ? `${val.toLocaleString("id-ID")} Tayangan`
            : `Rp ${val.toLocaleString("id-ID")} Reward`}
        </p>
      </div>
    );
  }
  return null;
}

const initialCreatorVideos = [
  {
    id: "vid-1",
    title: "Review Singkat All New HRV Tipe RS",
    campaignName: "Honda Jakarta Center",
    campaignId: "honda",
    platform: "tiktok",
    views: "18.420",
    rawViews: 18420,
    earnings: "Rp92.100",
    rawEarnings: 92100,
    date: "14 Sep 2026",
    status: "active",
    statusLabel: "Disetujui",
    url: "https://tiktok.com/@kreator/video/73918231",
  },
  {
    id: "vid-2",
    title: "Promo Akhir Tahun Avanza Veloz",
    campaignName: "Toyota Auto2000",
    campaignId: "toyota",
    platform: "instagram",
    views: "12.890",
    rawViews: 12890,
    earnings: "Rp38.670",
    rawEarnings: 38670,
    date: "12 Sep 2026",
    status: "active",
    statusLabel: "Disetujui",
    url: "https://instagram.com/reel/C8_veloz",
  },
  {
    id: "vid-3",
    title: "Test Drive Hyundai Ioniq 5 UGC Contest",
    campaignName: "Hyundai Motors ID",
    campaignId: "hyundai",
    platform: "youtube",
    views: "0",
    rawViews: 0,
    earnings: "Dalam Review",
    rawEarnings: 0,
    date: "15 Sep 2026",
    status: "pending",
    statusLabel: "Menunggu Review",
    url: "https://youtube.com/shorts/ioniq5_rev",
  },
  {
    id: "vid-4",
    title: "Footage B-Roll Pajero Sport Dakar",
    campaignName: "Mitsubishi Dipo",
    campaignId: "mitsubishi",
    platform: "tiktok",
    views: "0",
    rawViews: 0,
    earnings: "Rp0",
    rawEarnings: 0,
    date: "08 Sep 2026",
    status: "rejected",
    statusLabel: "Perlu Revisi",
    rejectReason:
      "Kualitas audio kurang jernih, silakan re-upload dengan mic eksternal atau ganti audio jingle kampanye.",
    url: "https://tiktok.com/@kreator/video/7390192",
  },
];

const activeCampaigns = [
  {
    id: "camp-1",
    title: "Review Singkat All New HRV Tipe RS",
    category: "SUV Promo",
    brand: "Honda Jakarta Center",
    reward: "Rp5.000 per 1.000 Views",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    type: "Clip & Publish",
    views: "24.844",
    socials: ["tiktok", "instagram"],
    categoryTag: "SUV",
  },
  {
    id: "camp-2",
    title: "Promo Akhir Tahun Avanza Veloz",
    category: "Showroom MPV",
    brand: "Toyota Auto2000",
    reward: "Rp3.000 per 1.000 Views",
    image:
      "https://images.unsplash.com/photo-1629897048514-3dd741427cb1?auto=format&fit=crop&q=80&w=600",
    type: "Clip & Publish",
    views: "33.328",
    socials: ["tiktok", "instagram", "youtube"],
    categoryTag: "MPV",
  },
  {
    id: "camp-3",
    title: "Test Drive Hyundai Ioniq 5 UGC Contest",
    category: "EV Experience",
    brand: "Hyundai Motors ID",
    reward: "Rp7.000 per 1.000 Views",
    image:
      "https://images.unsplash.com/photo-1663248386850-8b173ccff5d8?auto=format&fit=crop&q=80&w=600",
    type: "UGC & Review",
    views: "1.712",
    socials: ["tiktok", "youtube"],
    categoryTag: "EV",
  },
];

const STREAK_DAYS = [
  { day: "H1", status: "completed", label: "Hari 1" },
  { day: "H2", status: "completed", label: "Hari 2" },
  { day: "H3", status: "completed", label: "Hari 3" },
  { day: "H4", status: "completed", label: "Hari 4" },
  { day: "H5", status: "active", label: "Hari 5 (Hari Ini)" },
  { day: "H6", status: "upcoming", label: "Hari 6" },
  { day: "H7", status: "reward", label: "Bonus +Rp50.000" },
];

export function DashboardView({
  initialCampaigns,
  userStats,
}: {
  initialCampaigns?: any[];
  userStats?: {
    totalViews?: number | string;
    totalVideos?: number | string;
    availableBalance?: number | string;
    totalEarnings?: number | string;
  };
} = {}) {
  const router = useRouter();
  const { data: session } = useSession();

  const userName = session?.user?.name?.split(" ")[0] || "Kreator";

  // Chart states
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");
  const [metricTab, setMetricTab] = useState<"views" | "earnings">("views");
  const activeChartData =
    timeframe === "7d" ? WEEKLY_PERFORMANCE_DATA : MONTHLY_PERFORMANCE_DATA;

  // Video Submissions state
  const [activeVideoTab, setActiveVideoTab] = useState<string>("all");
  const [videoCampaignFilter, setVideoCampaignFilter] = useState<string>("all");
  const [videoSortFilter, setVideoSortFilter] = useState<string>("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Campaigns Discovery state
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [socialFilter, setSocialFilter] = useState<string | null>(null);

  const campaignsList =
    initialCampaigns && initialCampaigns.length > 0
      ? initialCampaigns
      : activeCampaigns;

  const statCards = [
    {
      label: "Total Pendapatan",
      value: userStats?.totalEarnings ? `Rp${Number(userStats.totalEarnings).toLocaleString("id-ID")}` : "Rp2.450.000",
      sub: "Akumulasi reward terverifikasi",
      icon: Wallet,
      glowColor: "rgba(212, 175, 55, 0.08)",
      waveColor: "from-primary/0 via-primary/30 to-primary/0",
      isGold: true,
    },
    {
      label: "Saldo Siap Tarik",
      value: userStats?.availableBalance ? `Rp${Number(userStats.availableBalance).toLocaleString("id-ID")}` : "Rp850.000",
      sub: "Dapat dicairkan ke rekening",
      icon: Banknote,
      glowColor: "rgba(212, 175, 55, 0.06)",
      waveColor: "from-primary/0 via-primary/20 to-primary/0",
      isGold: true,
    },
    {
      label: "Total Tayangan",
      value: userStats?.totalViews ? Number(userStats.totalViews).toLocaleString("id-ID") : "128.4K",
      sub: "Kenaikan 18.2% minggu ini",
      icon: Eye,
      glowColor: "rgba(255, 255, 255, 0.03)",
      waveColor: "from-white/0 via-white/10 to-white/0",
      isGold: false,
    },
    {
      label: "Konten & Submisi",
      value: userStats?.totalVideos ? `${userStats.totalVideos} Video` : "14 Video",
      sub: "10 Disetujui · 3 Review · 1 Revisi",
      icon: Video,
      glowColor: "rgba(255, 255, 255, 0.03)",
      waveColor: "from-white/0 via-white/10 to-white/0",
      isGold: false,
    },
  ];

  // Filtered Video Submissions
  const filteredVideos = useMemo(() => {
    return initialCreatorVideos
      .filter((v) => {
        if (activeVideoTab !== "all" && v.status !== activeVideoTab) return false;
        if (videoCampaignFilter !== "all" && v.campaignId !== videoCampaignFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (videoSortFilter === "highest_pay") return b.rawEarnings - a.rawEarnings;
        if (videoSortFilter === "views") return b.rawViews - a.rawViews;
        if (videoSortFilter === "oldest") return a.id.localeCompare(b.id);
        return b.id.localeCompare(a.id); // newest
      });
  }, [activeVideoTab, videoCampaignFilter, videoSortFilter]);

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaignsList.filter((c) => {
      if (typeFilter !== "all") {
        const type = (c.type || "").toLowerCase();
        if (typeFilter === "clipping" && !type.includes("clipping") && !type.includes("clip")) return false;
        if (typeFilter === "ugc" && !type.includes("ugc") && !type.includes("review")) return false;
        if (typeFilter === "videographer" && !type.includes("video") && !type.includes("shoot") && !type.includes("edit")) return false;
      }
      if (socialFilter) {
        if (!c.socials || !c.socials.includes(socialFilter)) return false;
      }
      return true;
    });
  }, [campaignsList, typeFilter, socialFilter]);

  const hasActiveCampaignFilters = typeFilter !== "all" || socialFilter !== null;

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Tautan konten disalin ke clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20 relative">
      {/* 1. Header Hero Section */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        custom={0}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6"
      >
        <div>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-primary/80 mb-1">
            Kreator Studio
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Selamat datang, <span className="text-primary">{userName}</span>
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Pantau metrik tayangan konten, verifikasi submisi video, saldo reward, dan jelajahi kampanye terbaru.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/creator/pendapatan">
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 rounded-xl gap-2 text-xs font-semibold border-white/10 bg-[#111316] text-white hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer"
            >
              <Wallet className="size-4 text-primary" />
              <span>Tarik Saldo</span>
            </Button>
          </Link>
          <Link href="/creator/campaigns">
            <Button
              size="sm"
              className="h-10 px-5 rounded-xl gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
            >
              <span>Jelajahi Kampanye</span>
              <ArrowUpRight className="size-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* 2. Four Primary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={i + 1}
            >
              <Card className="relative overflow-hidden border-white/5 bg-[#111316] hover:border-white/10 transition-all h-full p-4 sm:p-5 flex flex-col justify-between group">
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[150%] h-12 rounded-[100%] blur-[16px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-70"
                  style={{ backgroundColor: stat.glowColor }}
                />
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${stat.waveColor} pointer-events-none`}
                />

                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs sm:text-[13px] font-medium text-white/70">
                    {stat.label}
                  </span>
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center ${
                      stat.isGold
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-white/5 text-white/70 border border-white/10"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div
                    className={`text-xl sm:text-2xl font-bold tracking-tight ${
                      stat.isGold ? "text-primary" : "text-white"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <p className="text-[11px] sm:text-xs text-white/40 mt-1 truncate">
                    {stat.sub}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Analytics Chart & Streak Challenge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Creator Performance Chart */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={5}
          className="lg:col-span-8"
        >
          <Card className="border-white/5 bg-[#111316] p-5 sm:p-6 rounded-2xl h-full flex flex-col justify-between">
            {/* Chart Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Performa Konten & Reward
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Pertumbuhan akumulasi tayangan dan estimasi pendapatan harian
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Metric Selector */}
                <div className="flex items-center bg-[#0a0a0c] border border-white/5 rounded-lg p-0.5">
                  <button
                    onClick={() => setMetricTab("views")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      metricTab === "views"
                        ? "bg-primary text-black font-semibold shadow-sm"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Tayangan
                  </button>
                  <button
                    onClick={() => setMetricTab("earnings")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      metricTab === "earnings"
                        ? "bg-primary text-black font-semibold shadow-sm"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Reward (Rp)
                  </button>
                </div>

                {/* Timeframe Selector */}
                <div className="flex items-center bg-[#0a0a0c] border border-white/5 rounded-lg p-0.5">
                  <button
                    onClick={() => setTimeframe("7d")}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      timeframe === "7d"
                        ? "bg-white/10 text-white font-semibold"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    7 Hari
                  </button>
                  <button
                    onClick={() => setTimeframe("30d")}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      timeframe === "30d"
                        ? "bg-white/10 text-white font-semibold"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    30 Hari
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Area */}
            <div className="h-[240px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="creatorChartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff50", fontSize: 11, fontWeight: 500 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#ffffff30", fontSize: 10, fontWeight: 400 }}
                    tickFormatter={(val) => {
                      if (metricTab === "earnings") {
                        return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val;
                      }
                      return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val;
                    }}
                  />
                  <Tooltip
                    content={
                      <CustomChartTooltip metricType={metricTab} />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey={metricTab}
                    stroke="#D4AF37"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#creatorChartGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Stats Footer */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 mt-4 text-center">
              <div>
                <p className="text-[10px] text-white/40 uppercase font-mono">Rata-Rata Views</p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">9.1K / Video</p>
              </div>
              <div className="border-x border-white/5">
                <p className="text-[10px] text-white/40 uppercase font-mono">Rate Rata-Rata</p>
                <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">Rp5.000 / 1K</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-mono">Approval Rate</p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">92% Lolos</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Weekly Streak Challenge */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={6}
          className="lg:col-span-4"
        >
          <Card className="border border-primary/20 bg-gradient-to-b from-[#181611] to-[#111316] p-5 sm:p-6 rounded-2xl h-full flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.04)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Tantangan Mingguan
                    </h3>
                    <p className="text-[11px] text-white/50">Konsistensi Konten Kreator</p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary bg-primary/10 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                >
                  Pro Tier
                </Badge>
              </div>

              <p className="text-xs text-white/70 leading-relaxed mb-5">
                Submit minimal 1 video terverifikasi setiap hari untuk mempertahankan streak dan membuka bonus tier tunai.
              </p>

              {/* Streak Capsules Grid */}
              <div className="grid grid-cols-7 gap-1.5 mb-5">
                {STREAK_DAYS.map((day) => {
                  const isCompleted = day.status === "completed";
                  const isActive = day.status === "active";
                  const isReward = day.status === "reward";

                  return (
                    <div
                      key={day.day}
                      className={`flex flex-col items-center justify-center h-16 rounded-xl border transition-all text-center relative ${
                        isCompleted
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : isActive
                          ? "bg-white/10 border-white/30 text-white shadow-sm ring-1 ring-primary/40"
                          : isReward
                          ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                          : "bg-white/5 border-white/5 text-white/30"
                      }`}
                    >
                      {isCompleted && <Check className="size-3.5 mb-1 stroke-[2.5]" />}
                      {isActive && <Clock className="size-3.5 mb-1 text-primary animate-pulse" />}
                      {isReward && <Award className="size-3.5 mb-1 text-primary" />}
                      {!isCompleted && !isActive && !isReward && (
                        <span className="size-1.5 rounded-full bg-white/20 mb-2" />
                      )}
                      <span className="text-[11px] font-bold">{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Streak Progress Bar */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/60">Progres Minggu Ini</span>
                <span className="font-semibold text-primary">4 dari 7 Hari</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-500"
                  style={{ width: "57%" }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-[11px]">
                <span className="text-white/40">Bonus Tersedia:</span>
                <span className="font-bold text-white">+Rp50.000 Tunai</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 4. Submisi Video Saya (Creator Content Management) */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={7}>
        <Card className="border-white/5 bg-[#111316] rounded-2xl overflow-hidden shadow-none">
          <CardContent className="p-0">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 pb-4 gap-4 border-b border-white/5">
              <div>
                <h3 className="text-lg font-bold text-white">Submisi Video Saya</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Status verifikasi konten, penghitungan views otomatis, dan perolehan reward
                </p>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-white/60 bg-[#0a0a0c] border border-white/5 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
                <RefreshCw className="size-3.5 text-primary" />
                <span>Sinkronisasi Views dalam <strong className="text-white font-mono font-semibold">09:29:32</strong></span>
              </div>
            </div>

            {/* Unified Filter Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-white/5 bg-[#0d0f12]">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: "all", label: "Semua Konten", count: initialCreatorVideos.length },
                  { id: "active", label: "Disetujui", count: initialCreatorVideos.filter((v) => v.status === "active").length },
                  { id: "pending", label: "Menunggu Review", count: initialCreatorVideos.filter((v) => v.status === "pending").length },
                  { id: "rejected", label: "Perlu Revisi", count: initialCreatorVideos.filter((v) => v.status === "rejected").length },
                ].map((tab) => {
                  const isActive = activeVideoTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveVideoTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-white/10 text-white border border-white/15 shadow-sm"
                          : "text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                          isActive
                            ? "bg-primary/20 text-primary font-bold"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dropdown Filters */}
              <div className="flex items-center gap-2.5 shrink-0">
                <Select
                  value={videoCampaignFilter}
                  onValueChange={setVideoCampaignFilter}
                >
                  <SelectTrigger className="w-[180px] h-9 text-xs bg-[#0a0a0c] border-white/10 hover:border-white/20 transition-colors rounded-xl text-white font-medium">
                    <SelectValue placeholder="Semua Kampanye" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111316] border-white/10 text-white">
                    <SelectItem value="all">Semua Kampanye</SelectItem>
                    <SelectItem value="honda">Honda Jakarta Center</SelectItem>
                    <SelectItem value="toyota">Toyota Auto2000</SelectItem>
                    <SelectItem value="hyundai">Hyundai Motors ID</SelectItem>
                    <SelectItem value="mitsubishi">Mitsubishi Dipo</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={videoSortFilter}
                  onValueChange={setVideoSortFilter}
                >
                  <SelectTrigger className="w-[155px] h-9 text-xs bg-[#0a0a0c] border-white/10 hover:border-white/20 transition-colors rounded-xl text-white font-medium">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111316] border-white/10 text-white">
                    <SelectItem value="newest">Submisi Terbaru</SelectItem>
                    <SelectItem value="views">Views Tertinggi</SelectItem>
                    <SelectItem value="highest_pay">Reward Tertinggi</SelectItem>
                    <SelectItem value="oldest">Submisi Terlama</SelectItem>
                  </SelectContent>
                </Select>

                {(videoCampaignFilter !== "all" ||
                  videoSortFilter !== "newest" ||
                  activeVideoTab !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveVideoTab("all");
                      setVideoCampaignFilter("all");
                      setVideoSortFilter("newest");
                    }}
                    className="text-xs text-white/50 hover:text-white h-9 px-2.5 gap-1 rounded-xl"
                  >
                    <RotateCcw className="size-3.5" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Submissions Grid */}
            <div className="p-5 sm:p-6">
              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVideos.map((vid) => (
                    <div
                      key={vid.id}
                      className="rounded-2xl border border-white/5 bg-[#0e1013] p-4 sm:p-5 flex flex-col justify-between gap-3 hover:border-white/15 transition-all"
                    >
                      {/* Top Row: Icon + Title + Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5 border border-white/10 text-white">
                            {vid.platform === "tiktok" && <TikTokIcon className="size-4" />}
                            {vid.platform === "instagram" && <InstagramIcon className="size-4" />}
                            {vid.platform === "youtube" && <YouTubeIcon className="size-4" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate leading-snug">
                              {vid.title}
                            </h4>
                            <p className="text-xs text-white/40 mt-0.5 truncate">
                              {vid.campaignName} · <span className="font-mono text-[11px] text-white/50">{vid.date}</span>
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={`text-[10px] px-2.5 py-0.5 rounded-full shrink-0 font-semibold ${
                            vid.status === "active"
                              ? "border-primary/30 text-primary bg-primary/10"
                              : vid.status === "pending"
                              ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                              : "border-rose-500/30 text-rose-400 bg-rose-500/10"
                          }`}
                        >
                          {vid.statusLabel}
                        </Badge>
                      </div>

                      {/* Middle Row: Structured Context Box */}
                      {vid.status === "rejected" ? (
                        <div className="my-1 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2.5 leading-relaxed">
                          <div className="size-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-rose-200 block mb-0.5">Catatan Reviewer:</span>
                            {vid.rejectReason}
                          </div>
                        </div>
                      ) : vid.status === "pending" ? (
                        <div className="my-1 text-xs text-amber-300/80 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex items-start gap-2.5 leading-relaxed">
                          <Clock className="size-3.5 text-amber-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-amber-300 block mb-0.5">Dalam Proses Validasi:</span>
                            Estimasi waktu review 1x24 jam oleh tim showroom mitra.
                          </div>
                        </div>
                      ) : (
                        <div className="my-1 text-xs text-white/60 bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-start gap-2.5 leading-relaxed">
                          <Zap className="size-3.5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-white/90 block mb-0.5">Konten Terverifikasi:</span>
                            Views disinkronkan otomatis setiap 24 jam untuk perhitungan reward.
                          </div>
                        </div>
                      )}

                      {/* Bottom Row: Metrics & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                        <div className="flex items-center gap-4">
                          <span className="text-white/50">
                            Views: <strong className="text-white font-semibold">{vid.views}</strong>
                          </span>
                          <span className="text-white/50">
                            Reward: <strong className="text-primary font-semibold">{vid.earnings}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(vid.url, vid.id)}
                            className="h-7 text-[11px] text-white/50 hover:text-white hover:bg-white/5 px-2.5 gap-1 rounded-lg"
                          >
                            {copiedId === vid.id ? (
                              <>
                                <CheckCheck className="size-3 text-primary" />
                                <span className="text-primary">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </Button>
                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="size-3" />
                            <span>Lihat</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-transparent py-14 text-center">
                  <p className="text-xs text-white/40 mb-3">
                    Belum ada submisi konten yang sesuai dengan filter ini.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveVideoTab("all");
                      setVideoCampaignFilter("all");
                      setVideoSortFilter("newest");
                    }}
                    className="text-xs border-white/10 text-white hover:bg-white/5 rounded-xl"
                  >
                    Reset Filter
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 5. Eksplorasi Kampanye Aktif (Campaign Discovery for Creators) */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={8}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Eksplorasi Kampanye Aktif</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Pilih brief kampanye dari showroom mitra dan mulai buat konten untuk klaim reward
            </p>
          </div>

          {/* Campaign Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 text-xs bg-[#111316] border-white/10 hover:border-white/20 w-[160px] rounded-xl font-medium text-white">
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent className="bg-[#111316] border-white/10 text-white">
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="clipping">Clip & Publish</SelectItem>
                <SelectItem value="ugc">UGC & Review</SelectItem>
                <SelectItem value="videographer">Shoot & Edit</SelectItem>
              </SelectContent>
            </Select>

            {/* Social Platform Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#111316] border border-white/10 rounded-xl p-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSocialFilter(socialFilter === "tiktok" ? null : "tiktok")}
                className={`size-8 rounded-lg transition-all ${
                  socialFilter === "tiktok"
                    ? "bg-primary text-black"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                title="Filter TikTok"
              >
                <TikTokIcon className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSocialFilter(socialFilter === "instagram" ? null : "instagram")}
                className={`size-8 rounded-lg transition-all ${
                  socialFilter === "instagram"
                    ? "bg-primary text-black"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                title="Filter Instagram"
              >
                <InstagramIcon className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSocialFilter(socialFilter === "youtube" ? null : "youtube")}
                className={`size-8 rounded-lg transition-all ${
                  socialFilter === "youtube"
                    ? "bg-primary text-black"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                title="Filter YouTube"
              >
                <YouTubeIcon className="size-3.5" />
              </Button>
            </div>

            {hasActiveCampaignFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTypeFilter("all");
                  setSocialFilter(null);
                }}
                className="h-9 text-xs text-white/50 hover:text-white px-2.5 gap-1 rounded-xl"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map((campaign, i) => (
              <motion.div
                key={campaign.id}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={9 + i}
              >
                <Card
                  onClick={() => router.push(`/creator/campaigns/${campaign.id}`)}
                  className="group cursor-pointer border-white/5 bg-[#111316] hover:bg-[#14171b] hover:border-white/15 transition-all duration-300 overflow-hidden rounded-2xl flex flex-col h-full"
                >
                  {/* Image Area */}
                  <div className="relative h-[200px] w-full bg-[#0a0a0c] overflow-hidden">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-[#111316]/60 to-transparent" />

                    {/* Top Type Badge */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <Badge className="bg-black/60 backdrop-blur-md text-[10px] font-semibold text-primary border border-primary/30 px-2.5 py-0.5 rounded-lg">
                        {formatCampaignType(campaign.type)}
                      </Badge>
                    </div>

                    {/* Showroom Brand Info */}
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                          <span className="text-[8px] font-bold text-white font-mono">CP</span>
                        </div>
                        <span className="text-xs font-semibold text-white/90 truncate">
                          {campaign.brand}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-white/60 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded">
                        {campaign.categoryTag || "PROMO"}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <CardContent className="p-5 pt-3.5 flex flex-col grow justify-between">
                    <div>
                      <h4 className="font-bold text-sm sm:text-[15px] text-white group-hover:text-primary transition-colors line-clamp-1">
                        {campaign.title}
                      </h4>
                      <div className="mt-2 text-primary font-bold text-sm">
                        {campaign.reward}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-xs text-white/50">
                      <div className="flex items-center gap-2">
                        {campaign.socials?.includes("tiktok") && <TikTokIcon className="size-3.5" />}
                        {campaign.socials?.includes("instagram") && <InstagramIcon className="size-3.5" />}
                        {campaign.socials?.includes("youtube") && <YouTubeIcon className="size-3.5" />}
                      </div>

                      <div className="flex items-center gap-1 font-semibold text-white group-hover:text-primary transition-colors">
                        <span>Lihat Brief</span>
                        <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111316]/50 py-16 text-center">
            <Filter className="size-8 text-white/20 mb-3" />
            <p className="text-sm font-semibold text-white mb-1">
              Tidak ada kampanye yang sesuai dengan filter
            </p>
            <p className="text-xs text-white/40 max-w-sm mb-4">
              Coba ganti tipe kampanye atau reset filter platform sosial media.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTypeFilter("all");
                setSocialFilter(null);
              }}
              className="text-xs border-white/10 text-white hover:bg-white/5 rounded-xl"
            >
              Reset Semua Filter
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
