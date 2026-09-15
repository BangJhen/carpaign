"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MoreHorizontal, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export type CampaignStatus = "active" | "draft" | "completed" | "cancelled";

export type Campaign = {
  id: string;
  title: string;
  focus: string;
  type: string;
  budget: string;
  deadline: string;
  applicants: number;
  views: string;
  status: CampaignStatus;
};

const statusStyle: Record<string, { color: string; text: string }> = {
  active: { color: "text-primary/90", text: "Aktif" },
  completed: { color: "text-white/60", text: "Selesai" },
  draft: { color: "text-white/40", text: "Draft" },
  cancelled: { color: "text-red-500/80", text: "Dibatalkan" },
};

const filterTabs = ["Semua", "Aktif", "Selesai", "Draft"];

export function DealerCampaignsView({ campaigns }: { campaigns: Campaign[] }) {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered = campaigns.filter((c) => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "Aktif") return c.status === "active";
    if (activeFilter === "Selesai") return c.status === "completed";
    if (activeFilter === "Draft") return c.status === "draft";
    return true;
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div
        initial="hidden" animate="show" variants={fadeUp} custom={0}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">Manajemen</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Kampanye</h1>
          <p className="text-sm text-white/40 mt-1">
            {campaigns.filter((c) => c.status === "active").length} aktif dari {campaigns.length} total
          </p>
        </div>
        <Link href="/dealer/campaigns/create">
          <Button
            size="sm"
            className="h-9 px-5 rounded-lg text-[12px] font-semibold gap-2 bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-colors"
          >
            <Plus className="size-3.5" /> Buat Kampanye
          </Button>
        </Link>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <div className="flex gap-1 p-1 rounded-lg w-fit bg-white/[0.04] border border-white/[0.06]">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="px-4 py-1.5 rounded-md text-[12px] font-medium transition-all"
              style={
                activeFilter === tab
                  ? { background: "rgba(255,255,255,0.1)", color: "white" }
                  : { color: "rgba(255,255,255,0.35)" }
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Campaign List */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
        <Card className="bg-[#111316] border-white/[0.06] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[13px] text-white/30">Belum ada kampanye</p>
              <p className="text-[11px] text-white/20 mt-1">Buat kampanye pertama Anda untuk mulai menarik kreator</p>
              <Link href="/dealer/campaigns/create" className="mt-4">
                <Button size="sm" className="h-8 px-4 rounded-lg text-[12px] gap-2 bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15">
                  <Plus className="size-3.5" /> Buat Sekarang
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {filtered.map((campaign) => {
                const s = statusStyle[campaign.status] ?? statusStyle.draft;
                return (
                  <div
                    key={campaign.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group"
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white truncate">{campaign.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-white/35 truncate">{campaign.focus}</p>
                        <span className="text-white/15 text-[10px]">|</span>
                        <span className="text-[10px] text-white/25 font-medium">{campaign.type}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6 text-center flex-shrink-0">
                      <div>
                        <p className="text-[13px] font-semibold text-white">{campaign.applicants}</p>
                        <p className="text-[10px] text-white/25 mt-0.5">kreator</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{campaign.views}</p>
                        <p className="text-[10px] text-white/25 mt-0.5">views</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{campaign.budget}</p>
                        <p className="text-[10px] text-white/25 mt-0.5">budget</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{campaign.deadline}</p>
                        <p className="text-[10px] text-white/25 mt-0.5">deadline</p>
                      </div>
                    </div>

                    {/* Status + Action */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-[11px] font-medium ${s.color}`}>{s.text}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div
                            className="flex items-center justify-center size-7 rounded-md text-white/20 hover:text-white/60 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <MoreHorizontal className="size-3.5" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1c20] border-white/10 text-white">
                          <DropdownMenuItem className="gap-2 text-[13px] hover:bg-white/5">
                            <ArrowUpRight className="size-3.5" /> Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-[13px] text-white/40 hover:bg-white/5 hover:text-white/70">
                            Batalkan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
