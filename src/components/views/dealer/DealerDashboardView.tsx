"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Play, 
  Eye, 
  Megaphone, 
  PlusCircle, 
  ChevronRight,
  Car,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { SocialIcon } from "@/components/ui/social-icons";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.06,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

type TopCampaign = {
  id: string;
  title: string;
  applicants: number;
  views: string;
  status: string;
};

type Props = {
  topCampaigns: TopCampaign[];
  totalCampaigns: number;
  activeCampaigns: number;
  profileCompleteness: number;
  totalVehicles: number;
  availableVehicles: number;
};

const WEEKLY_PERFORMANCE_DATA = [
  { day: "Sen", views: 12400, submissions: 4, budget: 1500000 },
  { day: "Sel", views: 18200, submissions: 6, budget: 2200000 },
  { day: "Rab", views: 24600, submissions: 9, budget: 3100000 },
  { day: "Kam", views: 31800, submissions: 12, budget: 4400000 },
  { day: "Jum", views: 42500, submissions: 16, budget: 5800000 },
  { day: "Sab", views: 68900, submissions: 24, budget: 8200000 },
  { day: "Min", views: 89400, submissions: 31, budget: 10500000 },
];

const MONTHLY_PERFORMANCE_DATA = [
  { day: "Minggu 1", views: 48000, submissions: 18, budget: 6500000 },
  { day: "Minggu 2", views: 76000, submissions: 29, budget: 11200000 },
  { day: "Minggu 3", views: 115000, submissions: 42, budget: 16800000 },
  { day: "Minggu 4", views: 156200, submissions: 58, budget: 22400000 },
];

const CAMPAIGN_DISTRIBUTION_DATA = [
  { type: "Clip & Publish", count: 4, creators: 16, views: 36000, color: "#D4AF37" },
  { type: "UGC & Review", count: 6, creators: 24, views: 78000, color: "#F3C64F" },
  { type: "Shoot & Edit", count: 5, creators: 18, views: 62000, color: "#E0B738" },
];

const RECENT_SUBMISSIONS_PREVIEW = [
  {
    id: "sub-1",
    creator: "Rifky Andika",
    campaign: "Honda Brio RS UGC Challenge",
    platform: "Instagram Reels",
    time: "15 menit lalu",
    status: "Menunggu Review",
  },
  {
    id: "sub-2",
    creator: "Zara Putri",
    campaign: "Toyota Veloz Cinematic Shoot",
    platform: "TikTok",
    time: "2 jam lalu",
    status: "Menunggu Review",
  },
  {
    id: "sub-3",
    creator: "Budi Setiawan",
    campaign: "Mitsubishi Xpander Edit Video",
    platform: "Instagram Reels",
    time: "1 hari lalu",
    status: "Disetujui",
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
  metricType: "views" | "submissions";
}

function CustomChartTooltip({ active, payload, label, metricType }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-[#14161a] border border-primary/30 p-3 rounded-xl shadow-2xl space-y-1 backdrop-blur-md">
        <p className="text-[11px] font-mono text-white/50 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-primary">
          {metricType === "views"
            ? `${val.toLocaleString("id-ID")} Tayangan`
            : `${val} Submisi Video`}
        </p>
      </div>
    );
  }
  return null;
}

export function DealerDashboardView({
  topCampaigns,
  totalCampaigns,
  activeCampaigns,
  totalVehicles,
}: Props) {
  const { data: session } = useSession();
  const dealerName = session?.user?.name?.split(" ")[0] || "Dealer";

  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");
  const [metricTab, setMetricTab] = useState<"views" | "submissions">("views");

  const activeChartData =
    timeframe === "7d" ? WEEKLY_PERFORMANCE_DATA : MONTHLY_PERFORMANCE_DATA;

  const statCards = [
    {
      label: "Total Tayangan",
      value: "156.2K",
      sub: "Kenaikan 24% dari periode lalu",
      trend: "up",
      icon: Eye,
    },
    {
      label: "Kampanye Aktif",
      value: String(activeCampaigns),
      sub: `${totalCampaigns} total kampanye dibuat`,
      trend: "neutral",
      icon: Megaphone,
    },
    {
      label: "Submisi Konten",
      value: "58",
      sub: "3 submisi menunggu review",
      trend: "alert",
      icon: Play,
    },
    {
      label: "Unit Showroom",
      value: String(totalVehicles),
      sub: `${totalVehicles} unit terdaftar aktif`,
      trend: "neutral",
      icon: Car,
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        custom={0}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-primary/80 mb-1">
            Dealer Portal
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Selamat datang, <span className="text-primary">{dealerName}</span>
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Ringkasan performa jangkauan video, submisi kreator, dan kesiapan armada showroom.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dealer/campaigns/create">
            <Button
              size="sm"
              className="h-10 px-5 rounded-xl gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
            >
              <PlusCircle className="size-4" />
              <span>Buat Kampanye</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* 4 Primary Metric Stat Cards */}
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
              <Card className="bg-[#111316] border-white/[0.08] hover:border-primary/40 hover:bg-white/[0.02] p-5 transition-all h-full flex flex-col justify-between rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                    {stat.label}
                  </p>
                  <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="size-4" />
                  </div>
                </div>
                
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                  {stat.value}
                </p>

                <div className="text-[11px] text-white/40 mt-2.5 flex items-center gap-1.5 leading-none">
                  {stat.trend === "up" && (
                    <TrendingUp className="size-3.5 text-primary shrink-0" />
                  )}
                  {stat.trend === "alert" && (
                    <Clock className="size-3.5 text-primary shrink-0" />
                  )}
                  <span className={stat.trend === "alert" ? "text-primary/90 font-medium truncate" : "truncate"}>
                    {stat.sub}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Main Reach / Submissions Performance (2 Cols) */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={5}
          className="lg:col-span-2"
        >
          <Card className="bg-[#111316] border-white/[0.08] rounded-2xl p-6 h-full flex flex-col justify-between shadow-lg">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.06]">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Pertumbuhan Jangkauan Kampanye
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Statistik tayangan video dan submisi kreator secara berkala
                </p>
              </div>

              {/* Chart Controls */}
              <div className="flex items-center gap-2">
                {/* Metric Tab Selector */}
                <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setMetricTab("views")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      metricTab === "views"
                        ? "bg-primary/20 text-primary border border-primary/30 shadow-xs font-semibold"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    Tayangan
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricTab("submissions")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      metricTab === "submissions"
                        ? "bg-primary/20 text-primary border border-primary/30 shadow-xs font-semibold"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    Submisi
                  </button>
                </div>

                {/* Timeframe Toggle */}
                <div className="flex items-center p-1 bg-white/[0.03] border border-white/10 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTimeframe("7d")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                      timeframe === "7d"
                        ? "bg-primary/20 text-primary border border-primary/30 shadow-xs font-semibold"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    7H
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeframe("30d")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                      timeframe === "30d"
                        ? "bg-primary/20 text-primary border border-primary/30 shadow-xs font-semibold"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    30H
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[260px] w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="goldAreaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.35} />
                      <stop offset="60%" stopColor="#D4AF37" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="rgba(255,255,255,0.15)"
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.15)"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) =>
                      metricTab === "views"
                        ? val >= 1000
                          ? `${val / 1000}k`
                          : val
                        : val
                    }
                  />
                  <Tooltip
                    content={<CustomChartTooltip metricType={metricTab} />}
                  />
                  <Area
                    type="monotone"
                    dataKey={metricTab === "views" ? "views" : "submissions"}
                    stroke="#D4AF37"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#goldAreaGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key Performance Indicators Footer */}
            <div className="grid grid-cols-3 gap-3 pt-5 mt-4 border-t border-white/[0.06] text-center">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/20 transition-colors">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                  Rata Rata Harian
                </p>
                <p className="text-sm font-bold text-white mt-1">
                  22.3K <span className="text-[11px] font-normal text-primary/80">Views</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/20 transition-colors">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                  Rasio Interaksi
                </p>
                <p className="text-sm font-bold text-primary mt-1">4.8%</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/20 transition-colors">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                  Efisiensi Biaya
                </p>
                <p className="text-sm font-bold text-white mt-1">
                  Rp 142 <span className="text-[11px] font-normal text-primary/80">/ View</span>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Chart 2: Campaign Type Breakdown Bar Chart (1 Col) */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={6}
          className="lg:col-span-1"
        >
          <Card className="bg-[#111316] border-white/[0.08] rounded-2xl p-6 h-full flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Distribusi Tipe Kampanye
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                Alokasi format konten yang sedang berjalan
              </p>
            </div>

            {/* Bar Chart Representation */}
            <div className="h-[210px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CAMPAIGN_DISTRIBUTION_DATA}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="rgba(255,255,255,0.15)"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="type"
                    type="category"
                    stroke="rgba(255,255,255,0.15)"
                    tick={{ fill: "rgba(255,255,255,0.85)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#14161a] border border-primary/30 p-3 rounded-xl shadow-xl space-y-1 text-xs backdrop-blur-md">
                            <p className="font-bold text-primary">{d.type}</p>
                            <p className="text-white/60">{d.count} Kampanye Aktif</p>
                            <p className="text-white/90 font-medium">{d.creators} Kreator Terdaftar</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="creators" radius={[0, 8, 8, 0]}>
                    {CAMPAIGN_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Mini summary list */}
            <div className="space-y-2 pt-4 border-t border-white/[0.06]">
              {CAMPAIGN_DISTRIBUTION_DATA.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/90 font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-white/40 font-mono text-[11px]">
                      {item.count} kampanye
                    </span>
                    <span className="text-primary font-mono text-[11px] font-semibold">
                      {item.creators} kreator
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section: Recent Submissions & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Submissions Feed (3 Cols) */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={7}
          className="lg:col-span-3"
        >
          <Card className="bg-[#111316] border-white/[0.08] rounded-2xl overflow-hidden shadow-lg h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-sm font-semibold text-white">Submisi Konten Terbaru</h2>
                  <p className="text-xs text-white/40 mt-0.5">
                    Draf video kreator yang siap ditinjau
                  </p>
                </div>
                <Link
                  href="/dealer/submissions"
                  className="text-xs font-semibold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Buka Review Konten</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {RECENT_SUBMISSIONS_PREVIEW.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 px-6 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white shrink-0">
                        <SocialIcon platform={item.platform} className="size-4.5 text-white/80" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {item.creator}
                        </p>
                        <p className="text-[11px] text-white/40 truncate mt-0.5">
                          {item.campaign}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-white/40 block mb-1">
                        {item.time}
                      </span>
                      {item.status === "Menunggu Review" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 inline-block">
                          {item.status}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/90 border border-white/15 inline-block">
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 px-6 border-t border-white/[0.06] bg-white/[0.01]">
              <Link
                href="/dealer/submissions"
                className="w-full py-2.5 rounded-xl bg-white/[0.03] hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-white/10 text-xs font-medium text-white/80 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Periksa Semua Submisi</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Top Active Campaigns & Quick Links (2 Cols) */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={8}
          className="lg:col-span-2"
        >
          <Card className="bg-[#111316] border-white/[0.08] rounded-2xl overflow-hidden shadow-lg h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-sm font-semibold text-white">Kampanye Utama</h2>
                  <p className="text-xs text-white/40 mt-0.5">
                    Aktivitas kampanye yang sedang aktif
                  </p>
                </div>
                <Link
                  href="/dealer/campaigns"
                  className="text-xs font-semibold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Semua</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {topCampaigns.length === 0 ? (
                  <div className="p-6 text-center text-xs text-white/40">
                    Belum ada data kampanye aktif.
                  </div>
                ) : (
                  topCampaigns.slice(0, 3).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-4 px-6 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white leading-snug truncate">
                            {campaign.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/40">
                            <span>{campaign.applicants} kreator</span>
                            <span>{campaign.views} tayangan</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                          {campaign.status === "active" ? "Aktif" : "Selesai"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Inventory Summary Link */}
            <div className="p-4 px-6 border-t border-white/[0.06] bg-white/[0.01]">
              <Link
                href="/dealer/inventory"
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/30 hover:bg-primary/[0.03] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Car className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-primary transition-colors">
                      Inventory Kendaraan
                    </p>
                    <p className="text-[10px] text-white/40">
                      {totalVehicles} unit terdaftar
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-white/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
