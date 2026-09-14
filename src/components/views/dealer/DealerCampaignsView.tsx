"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
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

const campaigns = [
  { id: 1, title: "Honda Brio RS — UGC Challenge", vehicle: "Honda Brio RS 2024", type: "UGC", budget: "Rp 500.000", deadline: "20 Sep 2026", applicants: 12, views: "45K", status: "active" },
  { id: 2, title: "Toyota Veloz — Cinematic Shoot", vehicle: "Toyota Veloz 2023", type: "Cinematic", budget: "Rp 1.200.000", deadline: "25 Sep 2026", applicants: 8, views: "38K", status: "active" },
  { id: 3, title: "Mitsubishi Xpander — Edit Only", vehicle: "Mitsubishi Xpander 2024", type: "Edit", budget: "Rp 350.000", deadline: "15 Sep 2026", applicants: 5, views: "22K", status: "completed" },
  { id: 4, title: "Suzuki Jimny — Publish & Post", vehicle: "Suzuki Jimny 2023", type: "Publish", budget: "Rp 800.000", deadline: "30 Sep 2026", applicants: 3, views: "—", status: "active" },
  { id: 5, title: "Daihatsu Terios — UGC Lifestyle", vehicle: "Daihatsu Terios 2024", type: "UGC", budget: "Rp 450.000", deadline: "10 Oct 2026", applicants: 0, views: "—", status: "draft" },
];

const statusStyle: Record<string, { dot: string; text: string }> = {
  active: { dot: "bg-primary/70", text: "Aktif" },
  completed: { dot: "bg-white/25", text: "Selesai" },
  draft: { dot: "bg-white/15", text: "Draft" },
  cancelled: { dot: "bg-red-500/60", text: "Dibatalkan" },
};

const filterTabs = ["Semua", "Aktif", "Selesai", "Draft"];

export function DealerCampaignsView() {
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
            {campaigns.filter((c) => c.status === "active").length} aktif · {campaigns.length} total
          </p>
        </div>
        <Link href="/dealer/campaigns/create">
          <Button
            size="sm"
            className="h-9 px-5 rounded-lg text-[12px] font-semibold gap-2 bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-colors"
          >
            Buat Kampanye
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
          <div className="divide-y divide-white/[0.05]">
            {filtered.map((campaign) => {
              const s = statusStyle[campaign.status];
              return (
                <div
                  key={campaign.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{campaign.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-white/35 truncate">{campaign.vehicle}</p>
                      <span className="text-white/15 text-[10px]">·</span>
                      <span className="text-[10px] text-white/25 font-medium uppercase tracking-wide">{campaign.type}</span>
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
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className={`size-1.5 rounded-full ${s.dot}`} />
                      <span className="text-[11px] text-white/40">{s.text}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-md text-white/20 hover:text-white/60 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MoreHorizontal className="size-3.5" />
                        </Button>
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
        </Card>
      </motion.div>
    </div>
  );
}
