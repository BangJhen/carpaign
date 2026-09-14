"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Play,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEALER_ACCENT = "#B87333";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

type SubmissionStatus = "pending" | "approved" | "revision" | "rejected";

const submissions = [
  {
    id: 1,
    creator: "Rifky Andika",
    campaign: "Honda Brio RS — UGC Challenge",
    type: "UGC",
    submittedAt: "14 Sep 2026, 14:30",
    thumbnail: "https://picsum.photos/seed/ugc-brio/320/180",
    status: "pending" as SubmissionStatus,
    note: "",
  },
  {
    id: 2,
    creator: "Zara Putri",
    campaign: "Toyota Veloz — Cinematic Shoot",
    type: "Cinematic",
    submittedAt: "14 Sep 2026, 11:00",
    thumbnail: "https://picsum.photos/seed/cinematic-veloz/320/180",
    status: "pending" as SubmissionStatus,
    note: "",
  },
  {
    id: 3,
    creator: "Budi Setiawan",
    campaign: "Mitsubishi Xpander — Edit Only",
    type: "Edit",
    submittedAt: "13 Sep 2026, 16:45",
    thumbnail: "https://picsum.photos/seed/edit-xpander/320/180",
    status: "approved" as SubmissionStatus,
    note: "",
  },
  {
    id: 4,
    creator: "Ayu Maharani",
    campaign: "Suzuki Jimny — Publish & Post",
    type: "Publish",
    submittedAt: "13 Sep 2026, 09:20",
    thumbnail: "https://picsum.photos/seed/publish-jimny/320/180",
    status: "revision" as SubmissionStatus,
    note: "Audio kurang jelas di detik ke-12. Mohon diperbaiki.",
  },
];

const statusConfig = {
  pending: { label: "Menunggu Review", color: "#E8A838", bg: "#E8A83815", icon: Clock },
  approved: { label: "Disetujui", color: "#6BCB77", bg: "#6BCB7715", icon: CheckCircle2 },
  revision: { label: "Perlu Revisi", color: "#E05C5C", bg: "#E05C5C15", icon: AlertCircle },
  rejected: { label: "Ditolak", color: "#ffffff40", bg: "#ffffff08", icon: XCircle },
};

const tabs: { key: SubmissionStatus | "all"; label: string }[] = [
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
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
          Review
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Konten Masuk
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Tinjau dan setujui konten dari kreator.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <div className="flex gap-1 p-1 rounded-xl w-fit bg-white/5 border border-white/5">
          {tabs.map((tab) => {
            const count = tab.key === "all" ? submissions.length : submissions.filter((s) => s.status === tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={
                  isActive
                    ? { background: `${DEALER_ACCENT}20`, color: DEALER_ACCENT, border: `1px solid ${DEALER_ACCENT}30` }
                    : { color: "#ffffff50" }
                }
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: isActive ? `${DEALER_ACCENT}20` : "#ffffff10", color: isActive ? DEALER_ACCENT : "#ffffff50" }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Submission Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((sub, i) => {
          const cfg = statusConfig[sub.status];
          return (
            <motion.div key={sub.id} initial="hidden" animate="show" variants={fadeUp} custom={i + 2}>
              <Card className="bg-[#111316] border-white/5 overflow-hidden group hover:border-white/10 transition-all">
                {/* Video thumbnail */}
                <div className="relative h-44 overflow-hidden bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sub.thumbnail}
                    alt={sub.campaign}
                    className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-[#111316]/20 to-transparent" />

                  {/* Play button */}
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="size-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <Play className="size-5 text-white ml-0.5" />
                    </div>
                  </button>

                  {/* Status */}
                  <div className="absolute top-3 right-3">
                    <div
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm"
                      style={{ background: `${cfg.bg}dd`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
                    >
                      <cfg.icon className="size-3" />
                      {cfg.label}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="px-5 pt-3 pb-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                          style={{ background: `${DEALER_ACCENT}15`, color: DEALER_ACCENT }}
                        >
                          {sub.creator.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                        </div>
                        <p className="text-[13px] font-semibold text-white">{sub.creator}</p>
                      </div>
                      <p className="text-[11px] text-white/40 mt-1 truncate">{sub.campaign}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{sub.submittedAt}</p>
                    </div>
                  </div>

                  {/* Revision note */}
                  {sub.note && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="size-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-red-300 leading-relaxed">{sub.note}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {sub.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1 h-8 rounded-lg text-[11px] font-bold uppercase tracking-wide gap-1.5"
                        style={{
                          background: "#6BCB7720",
                          border: "1px solid #6BCB7740",
                          color: "#6BCB77",
                        }}
                      >
                        <CheckCircle2 className="size-3.5" />
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-8 rounded-lg text-[11px] font-bold uppercase tracking-wide gap-1.5"
                        style={{
                          background: "#E8A83815",
                          border: "1px solid #E8A83830",
                          color: "#E8A838",
                        }}
                      >
                        <AlertCircle className="size-3.5" />
                        Minta Revisi
                      </Button>
                    </div>
                  )}

                  {sub.status === "approved" && (
                    <div className="flex items-center gap-2 mt-4 text-[11px] text-white/30">
                      <CheckCircle2 className="size-3.5 text-green-400" />
                      Konten disetujui & pembayaran diproses
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
