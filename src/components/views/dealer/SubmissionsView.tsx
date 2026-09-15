"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Search, 
  X, 
  Check, 
  Eye, 
  CornerDownRight,
  Inbox
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SocialIcon } from "@/components/ui/social-icons";

const fadeUp = {
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

export type SubmissionStatus = "pending" | "approved" | "revision" | "rejected";

export interface SubmissionItem {
  id: string;
  creator: string;
  creatorRole: string;
  campaign: string;
  type: "UGC" | "Cinematic" | "Edit" | "Publish";
  platform: "TikTok" | "Instagram Reels" | "YouTube Shorts";
  duration: string;
  compensation: string;
  submittedAt: string;
  thumbnail: string;
  videoUrl?: string;
  status: SubmissionStatus;
  note: string;
  caption?: string;
  guidelinesChecklist?: { label: string; checked: boolean }[];
}

const INITIAL_SUBMISSIONS: SubmissionItem[] = [
  {
    id: "sub-1",
    creator: "Rifky Andika",
    creatorRole: "Kreator V6",
    campaign: "Honda Brio RS UGC Challenge",
    type: "UGC",
    platform: "Instagram Reels",
    duration: "45 detik",
    compensation: "Rp1.200.000",
    submittedAt: "14 Sep pukul 14:30",
    thumbnail: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80",
    status: "pending",
    note: "",
    caption: "Uji performa Honda Brio RS di jalan perkotaan. Suspensi nyaman, bahan bakar efisien, dan interior modern.",
    guidelinesChecklist: [
      { label: "Menampilkan eksterior dan interior kendaraan", checked: true },
      { label: "Menyebutkan promo DP ringan dealer", checked: true },
      { label: "Menyertakan tagar resmi kampanye", checked: true },
    ],
  },
  {
    id: "sub-2",
    creator: "Zara Putri",
    creatorRole: "Kreator V8",
    campaign: "Toyota Veloz Cinematic Shoot",
    type: "Cinematic",
    platform: "TikTok",
    duration: "60 detik",
    compensation: "Rp2.500.000",
    submittedAt: "14 Sep pukul 11:00",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
    status: "pending",
    note: "",
    caption: "Pengambilan gambar sinematik All New Toyota Veloz di malam hari dengan pencahayaan kabin dan teknologi keselamatan.",
    guidelinesChecklist: [
      { label: "Visual resolusi tinggi dengan grading sinematik", checked: true },
      { label: "Fokus pada fitur keselamatan TSS", checked: true },
      { label: "Ajakan untuk jadwal uji kendara", checked: true },
    ],
  },
  {
    id: "sub-3",
    creator: "Budi Setiawan",
    creatorRole: "Kreator V4",
    campaign: "Mitsubishi Xpander Edit Video",
    type: "Edit",
    platform: "Instagram Reels",
    duration: "30 detik",
    compensation: "Rp800.000",
    submittedAt: "13 Sep pukul 16:45",
    thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
    status: "approved",
    note: "Pengerjaan rapi dan transisi audio selaras dengan tempo musik.",
    caption: "Sorotan kenyamanan kabin Mitsubishi Xpander untuk perjalanan keluarga.",
    guidelinesChecklist: [
      { label: "Animasi pembuka dan penutup resmi", checked: true },
      { label: "Musik latar bebas royalti", checked: true },
    ],
  },
  {
    id: "sub-4",
    creator: "Ayu Maharani",
    creatorRole: "Kreator V6",
    campaign: "Suzuki Jimny Publish Konten",
    type: "Publish",
    platform: "TikTok",
    duration: "50 detik",
    compensation: "Rp1.500.000",
    submittedAt: "13 Sep pukul 09:20",
    thumbnail: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
    status: "revision",
    note: "Audio penjelasan fitur penggerak roda kurang jelas pada paruh awal video. Mohon sesuaikan volume musik latar agar suara penjelasan terdengar jelas.",
    caption: "Ulasan berkendara Suzuki Jimny lima pintu dengan karakter tangguh untuk berbagai medan perjalanan.",
    guidelinesChecklist: [
      { label: "Menampilkan manuver kendaraan", checked: true },
      { label: "Kejelasan audio penjelasan", checked: false },
    ],
  },
];

const statusLabel: Record<SubmissionStatus, { text: string; bg: string; textClass: string }> = {
  pending: { 
    text: "Menunggu Review", 
    bg: "bg-white/10 border-white/15", 
    textClass: "text-white font-medium" 
  },
  approved: { 
    text: "Disetujui", 
    bg: "bg-white/10 border-white/20", 
    textClass: "text-white font-semibold" 
  },
  revision: { 
    text: "Perlu Revisi", 
    bg: "bg-white/5 border-white/10", 
    textClass: "text-white/70 font-medium" 
  },
  rejected: { 
    text: "Ditolak", 
    bg: "bg-white/5 border-white/10", 
    textClass: "text-white/40 font-normal" 
  },
};

const filterTabs: { key: SubmissionStatus | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "revision", label: "Revisi" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" },
];

export function SubmissionsView() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [activeTab, setActiveTab] = useState<SubmissionStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [previewItem, setPreviewItem] = useState<SubmissionItem | null>(null);
  const [approveConfirmItem, setApproveConfirmItem] = useState<SubmissionItem | null>(null);
  const [revisionItem, setRevisionItem] = useState<SubmissionItem | null>(null);

  // Revision form state
  const [revisionNote, setRevisionNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtered list
  const filtered = submissions.filter((s) => {
    const matchesTab = activeTab === "all" ? true : s.status === activeTab;
    const matchesSearch = 
      s.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Action Handlers
  const handleOpenApproveModal = (item: SubmissionItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setApproveConfirmItem(item);
  };

  const handleConfirmApproval = () => {
    if (!approveConfirmItem) return;
    setIsProcessing(true);

    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === approveConfirmItem.id
            ? { ...s, status: "approved", note: "Konten telah disetujui oleh dealer." }
            : s
        )
      );
      if (previewItem && previewItem.id === approveConfirmItem.id) {
        setPreviewItem((prev) => prev ? { ...prev, status: "approved" } : null);
      }
      toast.success("Konten berhasil disetujui", {
        description: `Draf konten dari ${approveConfirmItem.creator} telah disetujui. Notifikasi pembayaran telah diteruskan.`,
      });
      setIsProcessing(false);
      setApproveConfirmItem(null);
    }, 400);
  };

  const handleOpenRevisionModal = (item: SubmissionItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRevisionItem(item);
    setRevisionNote(item.note || "");
  };

  const handleConfirmRevision = () => {
    if (!revisionItem) return;
    if (!revisionNote.trim()) {
      toast.error("Catatan revisi wajib diisi", {
        description: "Mohon tuliskan instruksi perbaikan untuk kreator.",
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === revisionItem.id
            ? { ...s, status: "revision", note: revisionNote.trim() }
            : s
        )
      );
      if (previewItem && previewItem.id === revisionItem.id) {
        setPreviewItem((prev) => prev ? { ...prev, status: "revision", note: revisionNote.trim() } : null);
      }
      toast.success("Permintaan revisi dikirim", {
        description: `Catatan revisi telah dikirimkan kepada ${revisionItem.creator}.`,
      });
      setIsProcessing(false);
      setRevisionItem(null);
      setRevisionNote("");
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Review Submisi
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Review Konten
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tinjau draf video kreator, berikan catatan revisi, atau konfirmasi persetujuan konten.
        </p>
      </motion.div>

      {/* Filter and Search Controls */}
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={fadeUp} 
        custom={1}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2"
      >
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 overflow-x-auto">
          {filterTabs.map((tab) => {
            const count =
              tab.key === "all"
                ? submissions.length
                : submissions.filter((s) => s.status === tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-white/10 text-white border border-white/10 shadow-sm"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kreator atau kampanye..."
            className="pl-9 h-9 text-xs bg-white/[0.03] border-white/10 focus:border-white/20 rounded-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground hover:text-white"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Submissions List Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={2}
          className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/5 p-8"
        >
          <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground mx-auto mb-2">
            <Inbox className="size-4" />
          </div>
          <p className="text-sm font-medium text-white/80">Tidak ada konten ditemukan</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery 
              ? "Tidak ada submisi yang cocok dengan kata kunci pencarian Anda." 
              : "Belum ada submisi konten pada kategori ini."}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-4 h-8 text-xs border-white/10 hover:bg-white/5"
            >
              Reset Pencarian
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((sub, i) => {
            const cfg = statusLabel[sub.status];
            return (
              <motion.div
                key={sub.id}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={i + 2}
              >
                <Card className="bg-[#0f1114] border-white/10 overflow-hidden group hover:border-white/20 transition-all h-full flex flex-col p-0 rounded-2xl shadow-lg">
                  {/* Thumbnail & Video Banner */}
                  <div 
                    onClick={() => setPreviewItem(sub)}
                    className="relative h-44 w-full flex-shrink-0 overflow-hidden bg-black/40 cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.thumbnail}
                      alt={sub.campaign}
                      className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1114] via-[#0f1114]/20 to-transparent" />

                    {/* Play Hover Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                      <div className="size-11 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                        <Play className="size-4 ml-0.5" />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white flex items-center gap-1.5">
                        <SocialIcon platform={sub.platform} className="size-3 text-white" />
                        <span>{sub.platform}</span>
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white/70">
                        {sub.duration}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10">
                      <span className={`text-[11px] ${cfg.textClass}`}>{cfg.text}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Creator Profile */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[11px] font-bold bg-white/10 text-white border border-white/10">
                            {sub.creator
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-white leading-none">
                              {sub.creator}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              {sub.creatorRole}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono text-muted-foreground/80 block">
                            {sub.submittedAt}
                          </span>
                          <span className="text-[11px] font-mono font-medium text-white/90 block mt-0.5">
                            {sub.compensation}
                          </span>
                        </div>
                      </div>

                      {/* Campaign Title & Caption */}
                      <div>
                        <p className="text-[12px] font-medium text-white/90 leading-snug">
                          {sub.campaign}
                        </p>
                        {sub.caption && (
                          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2 italic bg-white/[0.02] p-2 rounded-lg border border-white/5">
                            {sub.caption}
                          </p>
                        )}
                      </div>

                      {/* Revision Note Warning Box if present */}
                      {sub.note && sub.status === "revision" && (
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            <CornerDownRight className="size-3 text-muted-foreground" />
                            <span>Catatan Revisi Terkirim</span>
                          </div>
                          <p className="text-[11px] text-white/80 leading-relaxed pl-4">
                            {sub.note}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewItem(sub)}
                        className="h-8.5 px-3 text-[11px] font-medium border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white gap-1.5 rounded-lg"
                      >
                        <Eye className="size-3.5" />
                        <span>Pratinjau</span>
                      </Button>

                      {sub.status === "pending" && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => handleOpenRevisionModal(sub, e)}
                            className="h-8.5 px-3 text-[11px] font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg flex-1 transition-colors"
                          >
                            Minta Revisi
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => handleOpenApproveModal(sub, e)}
                            className="h-8.5 px-3.5 text-[11px] font-semibold bg-white text-black hover:bg-white/90 rounded-lg flex-1 shadow-sm transition-all"
                          >
                            Setujui
                          </Button>
                        </>
                      )}

                      {sub.status === "revision" && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => handleOpenRevisionModal(sub, e)}
                            className="h-8.5 px-3 text-[11px] font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg flex-1 transition-colors"
                          >
                            Edit Catatan
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => handleOpenApproveModal(sub, e)}
                            className="h-8.5 px-3.5 text-[11px] font-semibold bg-white text-black hover:bg-white/90 rounded-lg shadow-sm transition-all"
                          >
                            Setujui
                          </Button>
                        </>
                      )}

                      {sub.status === "approved" && (
                        <div className="flex-1 text-right">
                          <span className="text-[11px] font-medium text-white/70 inline-flex items-center gap-1">
                            <Check className="size-3 text-white" />
                            Konten disetujui
                          </span>
                        </div>
                      )}

                      {sub.status === "rejected" && (
                        <div className="flex-1 text-right">
                          <span className="text-[11px] text-muted-foreground">
                            Pengajuan ditolak
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 1. APPROVAL CONFIRMATION MODAL */}
      <AnimatePresence>
        {approveConfirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md bg-[#111317] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-5 relative"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    Konfirmasi Persetujuan Konten
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pastikan materi video telah sesuai dengan arahan kampanye Anda.
                  </p>
                </div>
                <button
                  onClick={() => setApproveConfirmItem(null)}
                  disabled={isProcessing}
                  className="size-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Detail Card */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Kreator</span>
                  <span className="font-semibold text-white">{approveConfirmItem.creator}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Kampanye</span>
                  <span className="font-medium text-white text-right truncate max-w-[200px]">
                    {approveConfirmItem.campaign}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Kompensasi</span>
                  <span className="font-mono font-medium text-white">
                    {approveConfirmItem.compensation}
                  </span>
                </div>
              </div>

              {/* Warning Note */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dengan menyetujui draf ini, tugas kreator akan ditandai selesai dan dana pembayaran kampanye akan diproses sesuai ketentuan.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => setApproveConfirmItem(null)}
                  className="h-9 px-4 text-xs font-medium border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isProcessing}
                  onClick={handleConfirmApproval}
                  className="h-9 px-4 text-xs font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-sm transition-all"
                >
                  {isProcessing ? "Memproses..." : "Ya, Setujui Konten"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. REVISION REQUEST MODAL */}
      <AnimatePresence>
        {revisionItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg bg-[#111317] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-4 relative"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    Permintaan Revisi Konten
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kirimkan catatan detail kepada {revisionItem.creator} untuk perbaikan draf video.
                  </p>
                </div>
                <button
                  onClick={() => setRevisionItem(null)}
                  disabled={isProcessing}
                  className="size-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Quick Preset Tags */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Fokus Perbaikan
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Koreksi Audio Suara", "Penyesuaian Caption", "Pencahayaan Visual", "Tambahkan Logo Dealer", "Durasi Video"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!revisionNote.includes(tag)) {
                          setRevisionNote((prev) => (prev ? `${prev}\n${tag}: ` : `${tag}: `));
                        }
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white">
                  Catatan Revisi <span className="text-muted-foreground">(Wajib)</span>
                </label>
                <textarea
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  rows={4}
                  placeholder="Jelaskan bagian durasi atau detail visual yang perlu diperbaiki oleh kreator..."
                  className="w-full text-xs bg-white/[0.03] border border-white/10 focus:border-white/25 rounded-xl p-3 text-white placeholder:text-muted-foreground outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => setRevisionItem(null)}
                  className="h-9 px-4 text-xs font-medium border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isProcessing}
                  onClick={handleConfirmRevision}
                  className="h-9 px-4 text-xs font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-sm transition-all"
                >
                  {isProcessing ? "Mengirim..." : "Kirim Catatan Revisi"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. FULL CONTENT PREVIEW MODAL */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl bg-[#0f1114] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Top Bar */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Pratinjau Draf Konten
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {previewItem.campaign}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="size-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-5 space-y-5">
                {/* Simulated Video Player */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewItem.thumbnail}
                    alt={previewItem.campaign}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="size-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                      <Play className="size-6 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white flex items-center gap-2">
                    <SocialIcon platform={previewItem.platform} className="size-3.5 text-white" />
                    <span>{previewItem.platform}</span>
                    <span className="text-white/60">{previewItem.duration}</span>
                  </div>
                </div>

                {/* Creator Details */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                        {previewItem.creator
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {previewItem.creator}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {previewItem.creatorRole}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-muted-foreground block">
                        Diupload {previewItem.submittedAt}
                      </span>
                      <span className="text-xs font-mono font-semibold text-white block mt-0.5">
                        Kompensasi {previewItem.compensation}
                      </span>
                    </div>
                  </div>

                  {previewItem.caption && (
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                        Caption dan Deskripsi
                      </p>
                      <p className="text-xs text-white/80 leading-relaxed italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                        {previewItem.caption}
                      </p>
                    </div>
                  )}
                </div>

                {/* Guidelines Checklist */}
                {previewItem.guidelinesChecklist && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Kesesuaian Panduan Kampanye
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {previewItem.guidelinesChecklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div
                            className={`size-4 rounded flex items-center justify-center border ${
                              item.checked
                                ? "bg-white/15 border-white/30 text-white"
                                : "bg-white/5 border-white/10 text-muted-foreground"
                            }`}
                          >
                            {item.checked ? <Check className="size-2.5" /> : null}
                          </div>
                          <span
                            className={
                              item.checked
                                ? "text-white/90 font-medium"
                                : "text-muted-foreground line-through"
                            }
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Revision Note display in preview if exists */}
                {previewItem.note && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      Catatan Evaluasi
                    </p>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {previewItem.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewItem(null)}
                  className="h-9 px-4 text-xs font-medium border-white/10 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white"
                >
                  Tutup
                </Button>

                {previewItem.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleOpenRevisionModal(previewItem)}
                      className="h-9 px-4 text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-colors"
                    >
                      Minta Revisi
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleOpenApproveModal(previewItem)}
                      className="h-9 px-4 text-xs font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-sm transition-all"
                    >
                      Setujui Konten
                    </Button>
                  </div>
                )}

                {previewItem.status === "revision" && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleOpenRevisionModal(previewItem)}
                      className="h-9 px-4 text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-colors"
                    >
                      Ubah Catatan Revisi
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleOpenApproveModal(previewItem)}
                      className="h-9 px-4 text-xs font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-sm transition-all"
                    >
                      Setujui Konten
                    </Button>
                  </div>
                )}

                {previewItem.status === "approved" && (
                  <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                    <Check className="size-3.5" />
                    <span>Konten telah disetujui</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
