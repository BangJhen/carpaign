"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Car,
  Megaphone,
  InboxIcon,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  DollarSign,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const DEALER_ACCENT = "#B87333";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const statCards = [
  {
    label: "Kampanye Aktif",
    value: "4",
    sub: "+2 minggu ini",
    icon: Megaphone,
    trend: "up",
    color: DEALER_ACCENT,
  },
  {
    label: "Menunggu Review",
    value: "7",
    sub: "Perlu persetujuan",
    icon: InboxIcon,
    trend: "neutral",
    color: "#E8A838",
  },
  {
    label: "Total Views (ROI)",
    value: "128K",
    sub: "+34% vs bulan lalu",
    icon: Eye,
    trend: "up",
    color: "#5B8AF0",
  },
  {
    label: "Budget Terpakai",
    value: "Rp 4,2jt",
    sub: "dari Rp 10jt deposit",
    icon: DollarSign,
    trend: "neutral",
    color: "#6BCB77",
  },
];

// Mock recent submissions
const recentSubmissions = [
  {
    id: 1,
    creator: "Rifky Andika",
    campaign: "UGC — Honda Brio RS",
    type: "UGC",
    status: "pending",
    time: "2 jam lalu",
  },
  {
    id: 2,
    creator: "Zara Putri",
    campaign: "Cinematic Shoot — Toyota Veloz",
    type: "Cinematic",
    status: "pending",
    time: "5 jam lalu",
  },
  {
    id: 3,
    creator: "Budi Setiawan",
    campaign: "Edit Only — Mitsubishi Xpander",
    type: "Edit",
    status: "approved",
    time: "1 hari lalu",
  },
  {
    id: 4,
    creator: "Ayu Maharani",
    campaign: "UGC — Suzuki Jimny",
    type: "UGC",
    status: "revision",
    time: "1 hari lalu",
  },
];

// Mock top campaigns
const topCampaigns = [
  {
    id: 1,
    title: "Honda Brio RS — UGC Challenge",
    applicants: 12,
    views: "45K",
    budget: "Rp 500K",
    status: "active",
  },
  {
    id: 2,
    title: "Toyota Veloz — Cinematic Shoot",
    applicants: 8,
    views: "38K",
    budget: "Rp 1,2jt",
    status: "active",
  },
  {
    id: 3,
    title: "Mitsubishi Xpander — Edit Only",
    applicants: 5,
    views: "22K",
    budget: "Rp 350K",
    status: "completed",
  },
];

const statusConfig = {
  pending: { label: "Menunggu", color: "#E8A838", bg: "#E8A83815", icon: Clock },
  approved: { label: "Disetujui", color: "#6BCB77", bg: "#6BCB7715", icon: CheckCircle2 },
  revision: { label: "Revisi", color: "#E05C5C", bg: "#E05C5C15", icon: AlertCircle },
};

export function DealerDashboardView() {
  const { data: session } = useSession();
  const dealerName = session?.user?.name?.split(" ")[0] || "Dealer";

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header Greeting */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        custom={0}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
            Dealer Portal
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Selamat datang,{" "}
            <span style={{ color: DEALER_ACCENT }}>{dealerName}</span>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Pantau performa kampanye dan inventory kendaraan Anda.
          </p>
        </div>
        <Link
          href="/dealer/campaigns/create"
          className="inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-bold uppercase tracking-widest transition-all flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${DEALER_ACCENT}25, ${DEALER_ACCENT}10)`,
            border: `1px solid ${DEALER_ACCENT}50`,
            color: DEALER_ACCENT,
          }}
        >
          <Megaphone className="size-3.5" />
          Buat Kampanye
        </Link>
      </motion.div>

      {/* Stat Cards — 4-column grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial="hidden" animate="show" variants={fadeUp} custom={i + 1}>
            <Card className="bg-[#111316] border-white/5 p-5 relative overflow-hidden group hover:border-white/10 transition-all">
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ background: stat.color }}
              />
              <div className="relative">
                <div
                  className="size-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
                >
                  <stat.icon className="size-4" style={{ color: stat.color }} />
                </div>
                <p className="text-[12px] text-white/40 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight text-white">{stat.value}</p>
                <p className="text-[11px] mt-1" style={{ color: `${stat.color}99` }}>
                  {stat.sub}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content — 2 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Submissions — 3/5 width */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={5}
          className="lg:col-span-3"
        >
          <Card className="bg-[#111316] border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-[14px] font-semibold text-white">Konten Masuk</h2>
                <p className="text-[11px] text-white/30 mt-0.5">Kiriman kreator yang perlu direviu</p>
              </div>
              <Link
                href="/dealer/submissions"
                className="text-[11px] font-medium flex items-center gap-1 transition-colors"
                style={{ color: `${DEALER_ACCENT}99` }}
              >
                Lihat semua <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {recentSubmissions.map((sub) => {
                const cfg = statusConfig[sub.status as keyof typeof statusConfig];
                return (
                  <div
                    key={sub.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Avatar placeholder */}
                    <div
                      className="size-9 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold"
                      style={{ background: `${DEALER_ACCENT}15`, color: DEALER_ACCENT }}
                    >
                      {sub.creator.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white truncate">{sub.creator}</p>
                      <p className="text-[11px] text-white/40 truncate">{sub.campaign}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        <cfg.icon className="size-3" />
                        {cfg.label}
                      </div>
                      <p className="text-[10px] text-white/25">{sub.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Top Campaigns — 2/5 width */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={6}
          className="lg:col-span-2"
        >
          <Card className="bg-[#111316] border-white/5 overflow-hidden h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-[14px] font-semibold text-white">Kampanye Teratas</h2>
                <p className="text-[11px] text-white/30 mt-0.5">Performa terbaik saat ini</p>
              </div>
              <Link
                href="/dealer/campaigns"
                className="text-[11px] font-medium flex items-center gap-1"
                style={{ color: `${DEALER_ACCENT}99` }}
              >
                Semua <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {topCampaigns.map((campaign, i) => (
                <div key={campaign.id} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-white leading-snug truncate">
                        {campaign.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-white/40 flex items-center gap-1">
                          <Users className="size-3" /> {campaign.applicants}
                        </span>
                        <span className="text-[11px] text-white/40 flex items-center gap-1">
                          <Eye className="size-3" /> {campaign.views}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className="text-[9px] font-bold uppercase tracking-wide flex-shrink-0 rounded-full px-2"
                      style={
                        campaign.status === "active"
                          ? { background: `${DEALER_ACCENT}20`, color: DEALER_ACCENT, border: `1px solid ${DEALER_ACCENT}30` }
                          : { background: "#ffffff10", color: "#ffffff40", border: "1px solid #ffffff10" }
                      }
                    >
                      {campaign.status === "active" ? "Aktif" : "Selesai"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick link to inventory */}
            <div className="px-6 py-4 border-t border-white/5">
              <Link
                href="/dealer/inventory"
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#5B8AF015", border: "1px solid #5B8AF025" }}
                  >
                    <Car className="size-3.5 text-[#5B8AF0]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-white">Inventory Kendaraan</p>
                    <p className="text-[10px] text-white/30">6 unit tersedia</p>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
