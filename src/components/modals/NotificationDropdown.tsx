"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  X, 
  CheckCheck, 
  Check, 
  CircleDot,
  ArrowRight,
  Inbox
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  categoryLabel: string;
  link?: string;
}

const DEFAULT_DEALER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "dealer-1",
    categoryLabel: "Review Submisi",
    title: "Draf Konten Baru Masuk",
    message: "Rian Pratama mengunggah draf video UGC untuk kampanye Hyundai Ioniq 5.",
    time: "5 menit lalu",
    unread: true,
    link: "/dealer/submissions",
  },
  {
    id: "dealer-2",
    categoryLabel: "Status Kampanye",
    title: "Kuota Kampanye Hampir Penuh",
    message: "Kampanye BMW 330i M Sport telah terisi 8 dari 10 slot kreator yang dialokasikan.",
    time: "45 menit lalu",
    unread: true,
    link: "/dealer/campaigns",
  },
  {
    id: "dealer-3",
    categoryLabel: "Inventori",
    title: "Unit Kendaraan Siap Kampanye",
    message: "Toyota Alphard 2025 telah terdaftar dan siap dipublikasikan ke daftar kampanye.",
    time: "3 jam lalu",
    unread: false,
    link: "/dealer/inventory",
  },
  {
    id: "dealer-4",
    categoryLabel: "Laporan Keuangan",
    title: "Ringkasan Tagihan Bulanan",
    message: "Laporan payout kreator dan invoice periode bulan ini siap diunduh.",
    time: "Kemarin",
    unread: false,
    link: "/dealer/billing",
  },
];

const DEFAULT_CREATOR_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "creator-1",
    categoryLabel: "Persetujuan",
    title: "Draf Konten Disetujui",
    message: "BMW 330i M Sport: Review video UGC Anda telah disetujui oleh BMW Tunas.",
    time: "2 menit lalu",
    unread: true,
    link: "/creator/campaigns",
  },
  {
    id: "creator-2",
    categoryLabel: "Pembayaran",
    title: "Pencairan Dana Berhasil",
    message: "Pembayaran Rp3.500.000 berhasil ditransfer ke rekening BCA Anda.",
    time: "1 jam lalu",
    unread: true,
    link: "/creator/pendapatan",
  },
  {
    id: "creator-3",
    categoryLabel: "Peluang Baru",
    title: "Kampanye Baru Tersedia",
    message: "Auto2000 Sudirman membuka slot video untuk Toyota Alphard 2025.",
    time: "3 jam lalu",
    unread: false,
    link: "/creator/campaigns",
  },
  {
    id: "creator-4",
    categoryLabel: "Peringkat",
    title: "Kenaikan Peringkat Kreator",
    message: "Selamat, performa Anda meningkat ke tier V6 Engine dengan penyesuaian rate.",
    time: "Kemarin",
    unread: false,
    link: "/creator/rank-rewards",
  },
];

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  role?: "dealer" | "creator";
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationDropdown({
  open,
  onClose,
  role = "creator",
  onUnreadCountChange,
}: NotificationDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<NotificationItem[]>(() => 
    role === "dealer" ? DEFAULT_DEALER_NOTIFICATIONS : DEFAULT_CREATOR_NOTIFICATIONS
  );
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const unreadCount = items.filter((n) => n.unread).length;

  useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const handleMarkAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: !item.unread } : item
      )
    );
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClickItem = (item: NotificationItem) => {
    if (item.unread) {
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
      );
    }
    onClose();
    if (item.link) {
      router.push(item.link);
    }
  };

  const filteredItems = items.filter((n) => {
    if (activeTab === "unread") return n.unread;
    return true;
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 md:bg-transparent"
            onClick={onClose}
          />

          {/* Clean Dropdown */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[calc(100vw-32px)] sm:w-[380px] max-w-[400px] bg-[#0e1013] border border-white/10 rounded-xl shadow-2xl shadow-black/80 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    Notifikasi
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-white/10 text-white text-[11px] font-medium px-2 py-0.5 rounded-md border border-white/10">
                      {unreadCount} baru
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-medium text-muted-foreground hover:text-white px-2 py-1 rounded hover:bg-white/5 flex items-center gap-1 transition-colors"
                    >
                      <CheckCheck className="size-3.5" />
                      <span>Tandai dibaca</span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="size-6 rounded hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                    aria-label="Tutup notifikasi"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "all"
                      ? "bg-white/10 text-white shadow-sm border border-white/10"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>Semua</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ({items.length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "unread"
                      ? "bg-white/10 text-white shadow-sm border border-white/10"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>Belum Dibaca</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/15 text-white font-mono">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5">
              {filteredItems.length === 0 ? (
                <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground">
                    <Inbox className="size-4" />
                  </div>
                  <p className="text-xs font-medium text-white/80">
                    {activeTab === "unread"
                      ? "Tidak ada notifikasi belum dibaca"
                      : "Belum ada notifikasi"}
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-[240px]">
                    {activeTab === "unread"
                      ? "Semua pemberitahuan sudah Anda periksa."
                      : "Aktivitas terbaru mengenai akun dan kampanye akan tampil di sini."}
                  </p>
                </div>
              ) : (
                filteredItems.map((notif) => {
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleClickItem(notif)}
                      className={`group relative flex items-start gap-3 p-4 hover:bg-white/[0.03] transition-all cursor-pointer ${
                        notif.unread ? "bg-white/[0.015]" : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* Unread Indicator Bar */}
                      <div className="pt-1 shrink-0">
                        <div
                          className={`w-1 h-3.5 rounded-full transition-colors ${
                            notif.unread
                              ? "bg-[#D4AF37]"
                              : "bg-transparent"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
                            {notif.categoryLabel}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
                            {notif.time}
                          </span>
                        </div>

                        <h4
                          className={`text-[13px] leading-snug ${
                            notif.unread
                              ? "font-semibold text-white"
                              : "font-normal text-white/85"
                          }`}
                        >
                          {notif.title}
                        </h4>

                        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>

                        {notif.link && (
                          <div className="pt-1">
                            <span className="text-[11px] font-medium text-white/70 group-hover:text-white inline-flex items-center gap-1 transition-colors">
                              Lihat detail
                              <ArrowRight className="size-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons (hover) */}
                      <div className="absolute right-3 top-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleToggleRead(notif.id, e)}
                          title={notif.unread ? "Tandai sudah dibaca" : "Tandai belum dibaca"}
                          className="size-6 rounded hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                        >
                          {notif.unread ? (
                            <Check className="size-3 text-white" />
                          ) : (
                            <CircleDot className="size-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDismiss(notif.id, e)}
                          title="Hapus"
                          className="size-6 rounded hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-[11px]">
                  {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua sudah diperiksa"}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-medium text-white hover:underline"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
