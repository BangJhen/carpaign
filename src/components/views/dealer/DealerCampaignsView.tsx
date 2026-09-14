"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Megaphone,
  Eye,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEALER_ACCENT = "#B87333";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const campaigns = [
  {
    id: 1,
    title: "Honda Brio RS — UGC Challenge",
    vehicle: "Honda Brio RS 2024",
    type: "UGC",
    budget: "Rp 500.000",
    deadline: "20 Sep 2026",
    applicants: 12,
    views: "45K",
    status: "active",
  },
  {
    id: 2,
    title: "Toyota Veloz — Cinematic Shoot",
    vehicle: "Toyota Veloz 2023",
    type: "Cinematic",
    budget: "Rp 1.200.000",
    deadline: "25 Sep 2026",
    applicants: 8,
    views: "38K",
    status: "active",
  },
  {
    id: 3,
    title: "Mitsubishi Xpander — Edit Only",
    vehicle: "Mitsubishi Xpander 2024",
    type: "Edit",
    budget: "Rp 350.000",
    deadline: "15 Sep 2026",
    applicants: 5,
    views: "22K",
    status: "completed",
  },
  {
    id: 4,
    title: "Suzuki Jimny — Publish & Post",
    vehicle: "Suzuki Jimny 2023",
    type: "Publish",
    budget: "Rp 800.000",
    deadline: "30 Sep 2026",
    applicants: 3,
    views: "—",
    status: "active",
  },
  {
    id: 5,
    title: "Daihatsu Terios — UGC Lifestyle",
    vehicle: "Daihatsu Terios 2024",
    type: "UGC",
    budget: "Rp 450.000",
    deadline: "10 Oct 2026",
    applicants: 0,
    views: "—",
    status: "draft",
  },
];

const statusConfig = {
  active: { label: "Aktif", color: DEALER_ACCENT, bg: `${DEALER_ACCENT}15`, icon: CheckCircle2 },
  completed: { label: "Selesai", color: "#6BCB77", bg: "#6BCB7715", icon: CheckCircle2 },
  draft: { label: "Draft", color: "#ffffff60", bg: "#ffffff08", icon: Clock },
  cancelled: { label: "Dibatalkan", color: "#E05C5C", bg: "#E05C5C15", icon: XCircle },
};

const typeColors = {
  UGC: { bg: "#5B8AF015", color: "#5B8AF0" },
  Cinematic: { bg: "#B87AFF15", color: "#B87AFF" },
  Edit: { bg: "#E8A83815", color: "#E8A838" },
  Publish: { bg: "#6BCB7715", color: "#6BCB77" },
};

export function DealerCampaignsView() {
  const active = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        custom={0}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
            Manajemen
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Kampanye
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {active} kampanye aktif · {campaigns.length} total
          </p>
        </div>
        <Link href="/dealer/campaigns/create">
          <Button
            size="sm"
            className="h-9 px-5 rounded-lg gap-2 text-[12px] font-bold uppercase tracking-widest"
            style={{
              background: `linear-gradient(135deg, ${DEALER_ACCENT}25, ${DEALER_ACCENT}10)`,
              border: `1px solid ${DEALER_ACCENT}50`,
              color: DEALER_ACCENT,
            }}
          >
            <Plus className="size-4" />
            Buat Kampanye
          </Button>
        </Link>
      </motion.div>

      {/* Campaign Table-style Cards */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <Card className="bg-[#111316] border-white/5 overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <p className="text-[12px] font-medium text-white/40">
              {campaigns.length} kampanye
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-[12px] text-white/40 hover:text-white hover:bg-white/5"
            >
              <Filter className="size-3.5" />
              Filter
            </Button>
          </div>

          {/* Campaign rows */}
          <div className="divide-y divide-white/5">
            {campaigns.map((campaign, i) => {
              const statusCfg = statusConfig[campaign.status as keyof typeof statusConfig];
              const typeCfg = typeColors[campaign.type as keyof typeof typeColors];
              return (
                <div
                  key={campaign.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Icon */}
                  <div
                    className="size-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${DEALER_ACCENT}15`, border: `1px solid ${DEALER_ACCENT}20` }}
                  >
                    <Megaphone className="size-4" style={{ color: DEALER_ACCENT }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold text-white truncate">
                        {campaign.title}
                      </p>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{ background: typeCfg.bg, color: typeCfg.color }}
                      >
                        {campaign.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 mt-0.5">{campaign.vehicle}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-5">
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-white flex items-center gap-1">
                        <Users className="size-3 text-white/30" /> {campaign.applicants}
                      </p>
                      <p className="text-[10px] text-white/30">kreator</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-white flex items-center gap-1">
                        <Eye className="size-3 text-white/30" /> {campaign.views}
                      </p>
                      <p className="text-[10px] text-white/30">views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-white">{campaign.budget}</p>
                      <p className="text-[10px] text-white/30">budget</p>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      <statusCfg.icon className="size-3" />
                      {statusCfg.label}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-lg text-white/20 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1c20] border-white/10 text-white">
                        <DropdownMenuItem className="gap-2 text-[13px] hover:bg-white/5">
                          <ArrowUpRight className="size-3.5" /> Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-400">
                          <XCircle className="size-3.5" /> Batalkan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
