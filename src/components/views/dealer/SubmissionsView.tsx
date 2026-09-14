"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

type SubmissionStatus = "pending" | "approved" | "revision" | "rejected";

const submissions = [
  { id: 1, creator: "Rifky Andika", campaign: "Honda Brio RS — UGC Challenge", type: "UGC", submittedAt: "14 Sep, 14:30", thumbnail: "https://picsum.photos/seed/ugc-brio/320/180", status: "pending" as SubmissionStatus, note: "" },
  { id: 2, creator: "Zara Putri", campaign: "Toyota Veloz — Cinematic Shoot", type: "Cinematic", submittedAt: "14 Sep, 11:00", thumbnail: "https://picsum.photos/seed/cinematic-veloz/320/180", status: "pending" as SubmissionStatus, note: "" },
  { id: 3, creator: "Budi Setiawan", campaign: "Mitsubishi Xpander — Edit Only", type: "Edit", submittedAt: "13 Sep, 16:45", thumbnail: "https://picsum.photos/seed/edit-xpander/320/180", status: "approved" as SubmissionStatus, note: "" },
  { id: 4, creator: "Ayu Maharani", campaign: "Suzuki Jimny — Publish & Post", type: "Publish", submittedAt: "13 Sep, 09:20", thumbnail: "https://picsum.photos/seed/publish-jimny/320/180", status: "revision" as SubmissionStatus, note: "Audio kurang jelas di detik ke-12. Mohon diperbaiki." },
];

const statusLabel: Record<SubmissionStatus, { text: string; dot: string }> = {
  pending: { text: "Menunggu Review", dot: "bg-yellow-500/60" },
  approved: { text: "Disetujui", dot: "bg-white/30" },
  revision: { text: "Perlu Revisi", dot: "bg-red-500/60" },
  rejected: { text: "Ditolak", dot: "bg-white/10" },
};

const filterTabs: { key: SubmissionStatus | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "revision", label: "Revisi" },
  { key: "approved", label: "Disetujui" },
];

export function SubmissionsView() {
  const [activeTab, setActiveTab] = useState<SubmissionStatus | "all">("all");

  const filtered = activeTab === "all" ? submissions : submissions.filter((s) => s.status === activeTab);

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">Review</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Konten Masuk</h1>
        <p className="text-sm text-white/40 mt-1">Tinjau dan setujui konten dari kreator.</p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <div className="flex gap-1 p-1 rounded-lg w-fit bg-white/[0.04] border border-white/[0.06]">
          {filterTabs.map((tab) => {
            const count = tab.key === "all" ? submissions.length : submissions.filter((s) => s.status === tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-4 py-1.5 rounded-md text-[12px] font-medium transition-all flex items-center gap-1.5"
                style={
                  isActive
                    ? { background: "rgba(255,255,255,0.1)", color: "white" }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                    style={
                      isActive
                        ? { background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }
                        : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }
                    }
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((sub, i) => {
          const cfg = statusLabel[sub.status];
          return (
            <motion.div key={sub.id} initial="hidden" animate="show" variants={fadeUp} custom={i + 2}>
              <Card className="bg-[#111316] border-white/[0.06] overflow-hidden group hover:border-white/10 transition-colors h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative h-40 flex-shrink-0 overflow-hidden bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sub.thumbnail}
                    alt={sub.campaign}
                    className="w-full h-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-[#111316]/10 to-transparent" />

                  {/* Play */}
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="size-11 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center">
                      <Play className="size-4 text-white ml-0.5" />
                    </div>
                  </button>

                  {/* Status */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                    <div className={`size-1.5 rounded-full ${cfg.dot}`} />
                    <span className="text-[10px] font-medium text-white/70">{cfg.text}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="px-5 pt-3.5 pb-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-md flex-shrink-0 flex items-center justify-center text-[10px] font-semibold bg-white/[0.06] text-white/40 mt-0.5">
                      {sub.creator.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white">{sub.creator}</p>
                      <p className="text-[11px] text-white/40 truncate">{sub.campaign}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">{sub.submittedAt}</p>
                    </div>
                  </div>

                  {/* Revision note */}
                  {sub.note && (
                    <div className="mt-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-[10px] text-white/30 font-medium uppercase tracking-wide mb-1">Catatan Revisi</p>
                      <p className="text-[11px] text-white/50 leading-relaxed">{sub.note}</p>
                    </div>
                  )}

                  {/* Actions — only for pending */}
                  <div className="mt-auto">
                    {sub.status === "pending" && (
                      <div className="flex gap-2 mt-4 pt-1">
                        <Button
                          size="sm"
                          className="flex-1 h-8 rounded-lg text-[11px] font-semibold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 transition-colors"
                        >
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 h-8 rounded-lg text-[11px] font-semibold text-white/40 hover:text-white/70 hover:bg-white/5 border border-white/[0.06]"
                        >
                          Minta Revisi
                        </Button>
                      </div>
                    )}

                    {sub.status === "approved" && (
                      <p className="text-[11px] text-white/25 mt-4 pt-1">Konten disetujui · pembayaran diproses</p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
