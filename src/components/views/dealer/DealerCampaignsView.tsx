"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  MoreHorizontal, 
  Plus, 
  ExternalLink, 
  AlertTriangle, 
  Clock, 
  CircleDollarSign, 
  Users, 
  Eye, 
  XCircle,
  Loader2,
  CreditCard,
  Wallet,
  Building2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cancelCampaign, payCampaign } from "@/app/actions/campaigns";
import { toast } from "sonner";

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
  rawBudget?: number;
  deadline: string;
  startDate?: string;
  applicants: number;
  views: string;
  status: CampaignStatus;
  details?: any;
  createdAt?: string;
};

const statusConfig: Record<
  CampaignStatus,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  active: {
    label: "Aktif",
    bg: "bg-primary/[0.08]",
    text: "text-primary",
    dot: "bg-primary",
    border: "border-primary/25",
  },
  draft: {
    label: "Menunggu Bayar",
    bg: "bg-amber-500/[0.08]",
    text: "text-amber-400",
    dot: "bg-amber-400 animate-pulse",
    border: "border-amber-500/20",
  },
  completed: {
    label: "Selesai",
    bg: "bg-white/[0.04]",
    text: "text-white/60",
    dot: "bg-white/40",
    border: "border-white/10",
  },
  cancelled: {
    label: "Dibatalkan",
    bg: "bg-rose-500/[0.08]",
    text: "text-rose-400",
    dot: "bg-rose-400",
    border: "border-rose-500/20",
  },
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const config = statusConfig[status] ?? statusConfig.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${config.bg} ${config.text} border ${config.border} whitespace-nowrap shadow-xs`}
    >
      <span className={`size-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}

const filterTabs = ["Semua", "Aktif", "Draft (Menunggu Bayar)", "Selesai", "Dibatalkan"];

export function DealerCampaignsView({ campaigns }: { campaigns: Campaign[] }) {
  const searchParams = useSearchParams();
  const payCampaignId = searchParams.get("payCampaignId");

  const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedDetail, setSelectedDetail] = useState<Campaign | null>(null);
  const [selectedCancel, setSelectedCancel] = useState<Campaign | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Campaign | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"deposit" | "va" | "qris">("deposit");
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false);

  // Auto-open payment dialog if redirected with payCampaignId
  useEffect(() => {
    if (payCampaignId) {
      const target = campaignList.find((c) => c.id === payCampaignId && c.status === "draft");
      if (target) {
        setSelectedPayment(target);
      }
    }
  }, [payCampaignId, campaignList]);

  const draftCampaigns = campaignList.filter((c) => c.status === "draft");

  const filtered = campaignList.filter((c) => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "Aktif") return c.status === "active";
    if (activeFilter === "Draft (Menunggu Bayar)") return c.status === "draft";
    if (activeFilter === "Selesai") return c.status === "completed";
    if (activeFilter === "Dibatalkan") return c.status === "cancelled";
    return true;
  });

  const handleCancelCampaign = async () => {
    if (!selectedCancel) return;
    setCancelling(true);
    try {
      const res = await cancelCampaign(selectedCancel.id);
      if (res?.success) {
        setCampaignList((prev) =>
          prev.map((c) =>
            c.id === selectedCancel.id ? { ...c, status: "cancelled" } : c
          )
        );
        if (selectedDetail?.id === selectedCancel.id) {
          setSelectedDetail((prev) => (prev ? { ...prev, status: "cancelled" } : null));
        }
        toast.success("Kampanye berhasil dibatalkan.");
        setSelectedCancel(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal membatalkan kampanye.");
    } finally {
      setCancelling(false);
    }
  };

  const handlePayCampaign = async () => {
    if (!selectedPayment) return;
    setPaying(true);
    try {
      const res = await payCampaign(selectedPayment.id, paymentMethod);
      if (res?.success) {
        setCampaignList((prev) =>
          prev.map((c) =>
            c.id === selectedPayment.id ? { ...c, status: "active" } : c
          )
        );
        if (selectedDetail?.id === selectedPayment.id) {
          setSelectedDetail((prev) => (prev ? { ...prev, status: "active" } : null));
        }
        toast.success("Pembayaran berhasil! Kampanye kini aktif dan telah didistribusikan ke kreator.");
        setSelectedPayment(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses pembayaran kampanye.");
    } finally {
      setPaying(false);
    }
  };

  const getSourceUrl = (details: any): string | null => {
    if (!details) return null;
    return details.sourceMaterial || details.sourceMaterialUrl || details.references || details.visualReferences || null;
  };

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
            {campaignList.filter((c) => c.status === "active").length} aktif dari {campaignList.length} total
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

      {/* PENGINGAT PEMBAYARAN NOTIFIKASI */}
      {draftCampaigns.length > 0 && (
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.5}>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#121417] border border-white/10 border-l-2 border-l-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5 sm:mt-0">
                <CreditCard className="size-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-[13px] font-semibold text-white">
                    {draftCampaigns.length} Kampanye Menunggu Pembayaran
                  </p>
                  <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-md">
                    Belum Aktif
                  </span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
                  Kampanye baru akan aktif dan otomatis didistribusikan ke dashboard kreator setelah pembayaran alokasi budget diselesaikan.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setSelectedPayment(draftCampaigns[0])}
              className="bg-primary text-black hover:bg-primary/90 font-bold text-xs h-9 px-5 rounded-xl shadow-md transition-all shrink-0 w-full sm:w-auto"
            >
              Bayar Sekarang
            </Button>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <div className="flex gap-1.5 p-1 rounded-xl w-fit bg-white/[0.03] border border-white/[0.06] flex-wrap">
          {[
            { key: "Semua", label: "Semua", count: campaignList.length },
            { key: "Aktif", label: "Aktif", count: campaignList.filter((c) => c.status === "active").length },
            { key: "Draft (Menunggu Bayar)", label: "Menunggu Bayar", count: draftCampaigns.length },
            { key: "Selesai", label: "Selesai", count: campaignList.filter((c) => c.status === "completed").length },
            { key: "Dibatalkan", label: "Dibatalkan", count: campaignList.filter((c) => c.status === "cancelled").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all flex items-center gap-2 ${
                activeFilter === tab.key
                  ? "bg-white/10 text-white font-semibold shadow-sm border border-white/10"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md tabular-nums ${
                  activeFilter === tab.key
                    ? "bg-primary/20 text-primary font-bold"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Campaign List Table / Card View */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
        <Card className="bg-[#111316] border-white/[0.07] overflow-hidden rounded-2xl shadow-xl">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <p className="text-[13px] text-white/30">Belum ada kampanye pada kategori ini</p>
              <p className="text-[11px] text-white/20 mt-1">Buat kampanye pertama Anda untuk mulai menarik kreator</p>
              <Link href="/dealer/campaigns/create" className="mt-4">
                <Button size="sm" className="h-8 px-4 rounded-lg text-[12px] gap-2 bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15">
                  <Plus className="size-3.5" /> Buat Sekarang
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {/* DESKTOP & TABLET VIEW: Strictly Aligned HTML Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-white/35">
                      <th className="pl-6 py-3.5 min-w-[240px]">Kampanye</th>
                      <th className="text-center py-3.5 w-[90px]">Kreator</th>
                      <th className="text-center py-3.5 w-[90px]">Views</th>
                      <th className="text-right py-3.5 w-[140px]">Alokasi Budget</th>
                      <th className="text-center py-3.5 w-[120px]">Deadline</th>
                      <th className="text-center py-3.5 w-[150px]">Status</th>
                      <th className="text-right pr-6 py-3.5 w-[110px]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filtered.map((campaign) => {
                      return (
                        <tr
                          key={campaign.id}
                          onClick={() => setSelectedDetail(campaign)}
                          className="hover:bg-white/[0.025] transition-colors cursor-pointer group"
                        >
                          {/* 1. Kampanye */}
                          <td className="pl-6 py-4">
                            <p className="text-[13px] font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
                              {campaign.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] text-white/40 truncate max-w-[200px]">{campaign.focus}</span>
                              <span className="text-white/20 text-[10px]">•</span>
                              <span className="text-[10px] font-semibold text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                                {campaign.type}
                              </span>
                            </div>
                          </td>

                          {/* 2. Kreator */}
                          <td className="text-center py-4">
                            <span className="text-[13px] font-semibold text-white tracking-tight tabular-nums">{campaign.applicants}</span>
                            <span className="block text-[10px] text-white/35 font-normal">kreator</span>
                          </td>

                          {/* 3. Views */}
                          <td className="text-center py-4">
                            <span className="text-[13px] font-semibold text-white tracking-tight tabular-nums">{campaign.views}</span>
                            <span className="block text-[10px] text-white/35 font-normal">views</span>
                          </td>

                          {/* 4. Budget */}
                          <td className="text-right py-4">
                            <span className="text-[13px] font-semibold text-primary tracking-tight tabular-nums whitespace-nowrap">{campaign.budget}</span>
                            <span className="block text-[10px] text-white/35 font-normal">budget</span>
                          </td>

                          {/* 5. Deadline */}
                          <td className="text-center py-4">
                            <span className="text-[12px] font-medium text-white/80 tracking-tight tabular-nums whitespace-nowrap">{campaign.deadline}</span>
                            <span className="block text-[10px] text-white/35 font-normal">deadline</span>
                          </td>

                          {/* 6. Status */}
                          <td className="text-center py-4">
                            <StatusBadge status={campaign.status} />
                          </td>

                          {/* 7. Aksi */}
                          <td className="text-right pr-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="inline-flex items-center justify-end gap-1.5">
                              {campaign.status === "draft" && (
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedPayment(campaign)}
                                  className="h-7 px-3 rounded-lg text-[11px] font-semibold bg-primary text-black hover:bg-primary/90 shadow-sm transition-all whitespace-nowrap"
                                >
                                  Bayar
                                </Button>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <div className="flex items-center justify-center size-7 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                                    <MoreHorizontal className="size-4" />
                                  </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1a1c20] border-white/10 text-white min-w-[160px] shadow-2xl">
                                  <DropdownMenuItem 
                                    onClick={() => setSelectedDetail(campaign)}
                                    className="gap-2 text-[13px] hover:bg-white/5 cursor-pointer text-white/90 hover:text-white"
                                  >
                                    <ArrowUpRight className="size-3.5 text-primary" /> Lihat Detail
                                  </DropdownMenuItem>
                                  {campaign.status === "draft" && (
                                    <DropdownMenuItem 
                                      onClick={() => setSelectedPayment(campaign)}
                                      className="gap-2 text-[13px] text-primary hover:bg-primary/10 cursor-pointer font-semibold"
                                    >
                                      <CreditCard className="size-3.5 text-primary" /> Selesaikan Bayar
                                    </DropdownMenuItem>
                                  )}
                                  {campaign.status !== "cancelled" && campaign.status !== "completed" && (
                                    <DropdownMenuItem 
                                      onClick={() => setSelectedCancel(campaign)}
                                      className="gap-2 text-[13px] text-red-400 hover:bg-red-500/10 cursor-pointer"
                                    >
                                      <XCircle className="size-3.5 text-red-400" /> Batalkan
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE VIEW: High-Taste Cards */}
              <div className="block md:hidden divide-y divide-white/[0.05]">
                {filtered.map((campaign) => {
                  return (
                    <div
                      key={campaign.id}
                      onClick={() => setSelectedDetail(campaign)}
                      className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer space-y-3"
                    >
                      {/* Top Bar: Badges + Action Menu */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                            {campaign.type}
                          </span>
                          <StatusBadge status={campaign.status} />
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className="flex items-center justify-center size-7 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                                <MoreHorizontal className="size-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1c20] border-white/10 text-white min-w-[160px] shadow-2xl">
                              <DropdownMenuItem 
                                onClick={() => setSelectedDetail(campaign)}
                                className="gap-2 text-[13px] hover:bg-white/5 cursor-pointer text-white/90"
                              >
                                <ArrowUpRight className="size-3.5 text-primary" /> Lihat Detail
                              </DropdownMenuItem>
                              {campaign.status === "draft" && (
                                <DropdownMenuItem 
                                  onClick={() => setSelectedPayment(campaign)}
                                  className="gap-2 text-[13px] text-primary hover:bg-primary/10 cursor-pointer font-semibold"
                                >
                                  <CreditCard className="size-3.5 text-primary" /> Selesaikan Bayar
                                </DropdownMenuItem>
                              )}
                              {campaign.status !== "cancelled" && campaign.status !== "completed" && (
                                <DropdownMenuItem 
                                  onClick={() => setSelectedCancel(campaign)}
                                  className="gap-2 text-[13px] text-red-400 hover:bg-red-500/10 cursor-pointer"
                                >
                                  <XCircle className="size-3.5 text-red-400" /> Batalkan
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Title & Focus */}
                      <div>
                        <h4 className="text-[14px] font-bold text-white leading-snug">
                          {campaign.title}
                        </h4>
                        <p className="text-[11px] text-white/40 mt-0.5 line-clamp-1">{campaign.focus}</p>
                      </div>

                      {/* 4 Stat Pills */}
                      <div className="grid grid-cols-2 gap-2 bg-[#16181c] p-2.5 rounded-xl border border-white/5">
                        <div>
                          <span className="text-[9px] text-white/35 uppercase tracking-wider block">Budget</span>
                          <span className="text-xs font-semibold text-primary tabular-nums">{campaign.budget}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-white/35 uppercase tracking-wider block">Deadline</span>
                          <span className="text-xs font-medium text-white/90 tabular-nums">{campaign.deadline}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-white/35 uppercase tracking-wider block">Kreator</span>
                          <span className="text-xs font-semibold text-white tabular-nums">{campaign.applicants} kreator</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-white/35 uppercase tracking-wider block">Total Views</span>
                          <span className="text-xs font-semibold text-white tabular-nums">{campaign.views} views</span>
                        </div>
                      </div>

                      {/* Quick Pay CTA if Draft */}
                      {campaign.status === "draft" && (
                        <div onClick={(e) => e.stopPropagation()} className="pt-1">
                          <Button
                            size="sm"
                            onClick={() => setSelectedPayment(campaign)}
                            className="w-full h-8 rounded-xl text-xs font-bold bg-primary text-black hover:bg-primary/90 shadow-md transition-all"
                          >
                            <CreditCard className="size-3.5 mr-1.5" /> Selesaikan Pembayaran Sekarang
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* DETAIL MODAL */}
      <Dialog open={!!selectedDetail} onOpenChange={(open) => !open && setSelectedDetail(null)}>
        <DialogContent className="sm:max-w-[620px] w-full bg-[#141619] border border-white/10 text-white p-6 sm:p-7 rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {selectedDetail && (
            <div className="space-y-6">
              <DialogHeader className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border border-primary/25 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                    {selectedDetail.type}
                  </Badge>
                  <StatusBadge status={selectedDetail.status} />
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug break-words">
                  {selectedDetail.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-white/45">
                  {selectedDetail.focus} • Dibuat pada {selectedDetail.createdAt || "-"}
                </DialogDescription>
              </DialogHeader>

              {/* Notice if Draft */}
              {selectedDetail.status === "draft" && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
                  <AlertCircle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-400 block mb-0.5">Kampanye Menunggu Pembayaran</span>
                    Kampanye ini belum aktif dan belum dapat dilihat oleh kreator. Selesaikan pembayaran alokasi budget sebesar <strong className="text-white font-bold tabular-nums">{selectedDetail.budget}</strong> agar kampanye segera aktif.
                  </div>
                </div>
              )}

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#1a1c20] border border-white/5 flex flex-col justify-between">
                  <span className="text-[11px] font-medium text-white/40 flex items-center gap-1.5 mb-2">
                    <Eye className="size-3.5 text-white/50" /> Total Views
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white tabular-nums">{selectedDetail.views}</p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#1a1c20] border border-white/5 flex flex-col justify-between">
                  <span className="text-[11px] font-medium text-white/40 flex items-center gap-1.5 mb-2">
                    <Users className="size-3.5 text-white/50" /> Pelamar
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white tabular-nums">{selectedDetail.applicants}</p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#1a1c20] border border-white/5 flex flex-col justify-between min-w-0">
                  <span className="text-[11px] font-medium text-white/40 flex items-center gap-1.5 mb-2">
                    <CircleDollarSign className="size-3.5 text-primary" /> Alokasi Budget
                  </span>
                  <p className="text-sm sm:text-base font-bold text-primary tabular-nums truncate" title={selectedDetail.budget}>
                    {selectedDetail.budget}
                  </p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#1a1c20] border border-white/5 flex flex-col justify-between min-w-0">
                  <span className="text-[11px] font-medium text-white/40 flex items-center gap-1.5 mb-2">
                    <Clock className="size-3.5 text-white/50" /> Deadline
                  </span>
                  <p className="text-xs sm:text-[13px] font-semibold text-white tabular-nums truncate" title={selectedDetail.deadline}>
                    {selectedDetail.deadline}
                  </p>
                </div>
              </div>

              {/* Materi Sumber Link */}
              {getSourceUrl(selectedDetail.details) && (
                <div className="p-3.5 rounded-xl bg-primary/[0.04] border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-white/50 font-medium mb-0.5">Folder Materi Sumber</p>
                    <p className="text-xs text-white/80 truncate">{getSourceUrl(selectedDetail.details)}</p>
                  </div>
                  <a
                    href={
                      getSourceUrl(selectedDetail.details)?.startsWith("http://") || getSourceUrl(selectedDetail.details)?.startsWith("https://")
                        ? getSourceUrl(selectedDetail.details)!
                        : `https://${getSourceUrl(selectedDetail.details)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/20 px-3.5 py-2 rounded-lg border border-primary/30 transition-colors shrink-0"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Buka Link Materi</span>
                  </a>
                </div>
              )}

              {/* Arahan Konten */}
              {selectedDetail.details?.contentGuidelines && (
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-white/50 block">Arahan Konten & Ketentuan Video:</span>
                  <p className="text-xs text-white/80 leading-relaxed bg-[#1a1c20] p-3.5 rounded-xl border border-white/5 whitespace-pre-line">
                    {selectedDetail.details.contentGuidelines}
                  </p>
                </div>
              )}

              {/* Parameter Details List */}
              <div className="rounded-xl bg-[#1a1c20] border border-white/5 divide-y divide-white/[0.04] text-xs">
                <div className="flex items-center justify-between p-3 sm:px-4">
                  <span className="text-white/40 font-medium">Tipe Kampanye</span>
                  <span className="text-white font-semibold">{selectedDetail.type}</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:px-4">
                  <span className="text-white/40 font-medium">Fokus Promosi</span>
                  <span className="text-white font-semibold">{selectedDetail.focus}</span>
                </div>
                {selectedDetail.details?.audienceRegion && (
                  <div className="flex items-center justify-between p-3 sm:px-4">
                    <span className="text-white/40 font-medium">Target Wilayah</span>
                    <span className="text-white font-semibold">{selectedDetail.details.audienceRegion}</span>
                  </div>
                )}
                {selectedDetail.details?.cpm && (
                  <div className="flex items-center justify-between p-3 sm:px-4">
                    <span className="text-white/40 font-medium">Tarif CPM (per 1.000 views)</span>
                    <span className="text-primary font-semibold tabular-nums">Rp {Number(selectedDetail.details.cpm).toLocaleString("id-ID")}</span>
                  </div>
                )}
                {selectedDetail.details?.feePerCreator && (
                  <div className="flex items-center justify-between p-3 sm:px-4">
                    <span className="text-white/40 font-medium">Fee per Kreator</span>
                    <span className="text-primary font-semibold tabular-nums">Rp {Number(selectedDetail.details.feePerCreator).toLocaleString("id-ID")}</span>
                  </div>
                )}
                {selectedDetail.details?.viewsCalculationPeriod && (
                  <div className="flex items-center justify-between p-3 sm:px-4">
                    <span className="text-white/40 font-medium">Periode Hitung Views</span>
                    <span className="text-white font-semibold">{selectedDetail.details.viewsCalculationPeriod} Hari Kalender</span>
                  </div>
                )}
                {selectedDetail.details?.usageRights && (
                  <div className="flex items-center justify-between p-3 sm:px-4">
                    <span className="text-white/40 font-medium">Hak Penggunaan</span>
                    <span className="text-white font-medium text-right max-w-[280px]">{selectedDetail.details.usageRights}</span>
                  </div>
                )}
                {selectedDetail.startDate && selectedDetail.startDate !== "-" && (
                  <div className="flex items-center justify-between p-3 sm:px-4">
                    <span className="text-white/40 font-medium">Tanggal Mulai</span>
                    <span className="text-white font-semibold">{selectedDetail.startDate}</span>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedDetail.status !== "cancelled" && selectedDetail.status !== "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCancel(selectedDetail)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full sm:w-auto text-xs h-9 rounded-xl"
                    >
                      <XCircle className="size-3.5 mr-1.5" /> Batalkan Kampanye
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    size="sm"
                    onClick={() => setSelectedDetail(null)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 w-full sm:w-auto text-xs h-9 rounded-xl"
                  >
                    Tutup
                  </Button>
                  {selectedDetail.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPayment(selectedDetail);
                      }}
                      className="bg-primary text-black hover:bg-primary/90 font-bold text-xs h-9 px-5 rounded-xl shadow-md w-full sm:w-auto"
                    >
                      <CreditCard className="size-3.5 mr-1.5" /> Bayar & Aktifkan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL PEMBAYARAN KAMPANYE */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[520px] w-full bg-[#141619] border border-white/10 text-white p-6 sm:p-7 rounded-2xl shadow-2xl">
          {selectedPayment && (() => {
            const parseMoney = (val: any): number => {
              if (typeof val === "number") return val;
              if (!val) return 0;
              return parseInt(String(val).replace(/[^0-9]/g, ""), 10) || 0;
            };

            const rawBudget = selectedPayment.rawBudget || parseMoney(selectedPayment.budget);
            const platformFee = Math.round(rawBudget * 0.15);
            const totalAmount = rawBudget + platformFee;

            const paymentOptions = [
              {
                id: "deposit" as const,
                label: "Saldo Deposit Showroom",
                desc: "Potong langsung dari saldo deposit (Proses Instan)",
                icon: Wallet,
                badge: "Instan",
              },
              {
                id: "va" as const,
                label: "Virtual Account Bank",
                desc: "BCA, Mandiri, BNI, BRI (Verifikasi Otomatis)",
                icon: Building2,
                badge: "Otomatis",
              },
              {
                id: "qris" as const,
                label: "QRIS / E-Wallet",
                desc: "Scan QRIS via GoPay, OVO, ShopeePay, Dana",
                icon: QrCode,
                badge: "QR Code",
              },
            ];

            const currentPaymentOpt = paymentOptions.find((p) => p.id === paymentMethod) || paymentOptions[0];
            const CurrentIcon = currentPaymentOpt.icon;

            return (
              <div className="space-y-5">
                <DialogHeader className="space-y-2 text-left">
                  <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <CreditCard className="size-5" />
                  </div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    Pembayaran Alokasi Budget
                  </DialogTitle>
                  <DialogDescription className="text-xs text-white/50 leading-relaxed">
                    Selesaikan pembayaran untuk mengaktifkan kampanye <span className="text-white font-semibold">&ldquo;{selectedPayment.title}&rdquo;</span> agar segera didistribusikan ke dashboard kreator.
                  </DialogDescription>
                </DialogHeader>

                {/* Rincian Biaya */}
                <div className="p-4 rounded-xl bg-[#1a1c20] border border-white/5 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-white/60">
                    <span>Alokasi Budget Kampanye</span>
                    <span className="font-semibold text-white tabular-nums">
                      Rp {rawBudget.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white/60">
                    <div className="flex items-center gap-1.5">
                      <span>Biaya Layanan Platform</span>
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/25 px-1.5 py-0.2 rounded">
                        15%
                      </span>
                    </div>
                    <span className="font-semibold text-primary tabular-nums">
                      Rp {platformFee.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[13px] font-bold">
                    <span className="text-white">Total Tagihan</span>
                    <span className="text-primary text-base tabular-nums font-bold">
                      Rp {totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Pilihan Metode Pembayaran - Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 block">Pilih Metode Pembayaran:</label>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      type="button"
                      className="w-full p-3 rounded-xl bg-[#1a1c20] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between text-left group cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                          <CurrentIcon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-white truncate">{currentPaymentOpt.label}</p>
                            <span className="text-[9px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded-full">
                              {currentPaymentOpt.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/40 truncate mt-0.5">{currentPaymentOpt.desc}</p>
                        </div>
                      </div>
                      <ChevronDown className="size-4 text-white/40 group-hover:text-white transition-colors shrink-0 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[calc(100vw-3rem)] sm:w-[470px] bg-[#1a1c20] border-white/10 text-white p-1.5 rounded-xl shadow-2xl space-y-1 z-50"
                    >
                      {paymentOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = paymentMethod === opt.id;
                        return (
                          <DropdownMenuItem
                            key={opt.id}
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected ? "bg-primary/10 text-white border border-primary/25" : "hover:bg-white/5 text-white/80"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-primary/20 text-primary" : "bg-white/5 text-white/50"}`}>
                                <Icon className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{opt.label}</p>
                                <p className="text-[10px] text-white/40 truncate">{opt.desc}</p>
                              </div>
                            </div>
                            {isSelected && <CheckCircle2 className="size-4 text-primary shrink-0 ml-2" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Info Box based on selected method */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/50 flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                    <span>
                      {paymentMethod === "deposit" && `Saldo deposit showroom dipotong otomatis Rp ${totalAmount.toLocaleString("id-ID")} (Proses Instan).`}
                      {paymentMethod === "va" && "Nomor Virtual Account bank akan otomatis diterbitkan setelah konfirmasi pembayaran."}
                      {paymentMethod === "qris" && "Kode QRIS dinamis akan ditampilkan di layar untuk dipindai via aplikasi e-wallet Anda."}
                    </span>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={paying}
                    onClick={() => setSelectedPayment(null)}
                    className="border-white/10 text-white hover:bg-white/5 text-xs h-9 rounded-xl"
                  >
                    Batal
                  </Button>
                  <Button
                    size="sm"
                    disabled={paying}
                    onClick={handlePayCampaign}
                    className="bg-primary text-black hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-xs h-9 px-5 rounded-xl"
                  >
                    {paying ? (
                      <><Loader2 className="size-3.5 mr-2 animate-spin" /> Memproses...</>
                    ) : (
                      `Konfirmasi & Bayar (Rp ${totalAmount.toLocaleString("id-ID")})`
                    )}
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* CANCEL CONFIRMATION MODAL */}
      <Dialog open={!!selectedCancel} onOpenChange={(open) => !open && setSelectedCancel(null)}>
        <DialogContent className="sm:max-w-md w-full bg-[#141619] border border-white/10 text-white p-6 rounded-2xl shadow-2xl">
          {selectedCancel && (
            <div className="space-y-5">
              <DialogHeader className="space-y-3 text-left">
                <div className="size-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <AlertTriangle className="size-5" />
                </div>
                <DialogTitle className="text-lg font-bold text-white tracking-tight">
                  Batalkan Kampanye?
                </DialogTitle>
                <DialogDescription className="text-[13px] text-white/60 leading-relaxed">
                  Apakah Anda yakin ingin membatalkan kampanye <span className="text-white font-semibold">&ldquo;{selectedCancel.title}&rdquo;</span>? 
                  Kreator tidak akan dapat lagi mengajukan submisi baru untuk kampanye ini.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cancelling}
                  onClick={() => setSelectedCancel(null)}
                  className="border-white/10 text-white hover:bg-white/5 text-xs h-9 rounded-xl"
                >
                  Kembali
                </Button>
                <Button
                  size="sm"
                  disabled={cancelling}
                  onClick={handleCancelCampaign}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-950/40 text-xs h-9 rounded-xl"
                >
                  {cancelling ? (
                    <><Loader2 className="size-3.5 mr-2 animate-spin" /> Membatalkan...</>
                  ) : (
                    "Ya, Batalkan Kampanye"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
