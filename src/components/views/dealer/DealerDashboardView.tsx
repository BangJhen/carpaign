"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};


type TopCampaign = { id: string; title: string; applicants: number; views: string; status: string };

type Props = {
  topCampaigns: TopCampaign[];
  totalCampaigns: number;
  activeCampaigns: number;
};

export function DealerDashboardView({ topCampaigns, totalCampaigns, activeCampaigns }: Props) {
  const { data: session } = useSession();
  const dealerName = session?.user?.name?.split(" ")[0] || "Dealer";

  const statCards = [
    {
      label: "Kampanye Aktif",
      value: String(activeCampaigns),
      sub: `dari ${totalCampaigns} total kampanye`,
      trend: "neutral",
    },
    {
      label: "Menunggu Review",
      value: "0",
      sub: "Belum ada kiriman",
      trend: "neutral",
    },
    {
      label: "Total Views",
      value: "0",
      sub: "Dari semua kampanye",
      trend: "neutral",
    },
    {
      label: "Budget Terpakai",
      value: "Rp 0",
      sub: "Total pengeluaran",
      trend: "neutral",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">
          Dealer Portal
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Selamat datang, <span className="text-primary">{dealerName}</span>
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Pantau performa kampanye dan inventory kendaraan Anda.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial="hidden" animate="show" variants={fadeUp} custom={i + 1}>
            <Card className="bg-[#111316] border-white/[0.06] p-5 hover:border-white/10 transition-colors h-full flex flex-col justify-between">
              <p className="text-[11px] text-white/35 mb-3">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight text-white">{stat.value}</p>
              <p className="text-[11px] text-white/30 mt-1.5 flex items-center gap-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="size-3 text-primary/60" />
                ) : (
                  <TrendingUp className="size-3 text-white/20" />
                )}
                {stat.sub}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Submissions - 3 col */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5} className="lg:col-span-3">
          <Card className="bg-[#111316] border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-[13px] font-semibold text-white">Konten Masuk</h2>
                <p className="text-[11px] text-white/30 mt-0.5">Kiriman kreator yang perlu direviu</p>
              </div>
              <Link
                href="/dealer/submissions"
                className="text-[11px] font-medium flex items-center gap-0.5 text-primary/60 hover:text-primary transition-colors"
              >
                Lihat semua <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-[13px] text-white/30">Belum ada kiriman konten</p>
              <p className="text-[11px] text-white/20 mt-1">Kiriman kreator akan muncul di sini</p>
            </div>
          </Card>
        </motion.div>

        {/* Top Campaigns - 2 col */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={6} className="lg:col-span-2">
          <Card className="bg-[#111316] border-white/[0.06] overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-[13px] font-semibold text-white">Kampanye Aktif</h2>
                <p className="text-[11px] text-white/30 mt-0.5">Performa terbaik saat ini</p>
              </div>
              <Link
                href="/dealer/campaigns"
                className="text-[11px] font-medium flex items-center gap-0.5 text-primary/60 hover:text-primary transition-colors"
              >
                Semua <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {topCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-[13px] text-white/30">Belum ada kampanye</p>
                  <p className="text-[11px] text-white/20 mt-1">Buat kampanye pertama Anda</p>
                </div>
              ) : (
                topCampaigns.map((campaign) => (
                  <div key={campaign.id} className="px-6 py-4 hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-white leading-snug">{campaign.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] text-white/30">{campaign.applicants} kreator</span>
                          <span className="text-[11px] text-white/30">{campaign.views} views</span>
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-medium flex-shrink-0 mt-0.5"
                        style={
                          campaign.status === "active"
                            ? { color: "var(--primary)" }
                            : { color: "rgba(255,255,255,0.3)" }
                        }
                      >
                        {campaign.status === "active" ? "Aktif" : "Selesai"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-4 border-t border-white/[0.05]">
              <Link href="/dealer/inventory" className="flex items-center justify-between group">
                <div>
                  <p className="text-[12px] font-medium text-white">Inventory Kendaraan</p>
                  <p className="text-[10px] text-white/30 mt-0.5">6 unit tersedia</p>
                </div>
                <ArrowUpRight className="size-4 text-white/15 group-hover:text-white/40 transition-colors" />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
