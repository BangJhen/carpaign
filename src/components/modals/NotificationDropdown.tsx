"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Megaphone, Wallet, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: 1,
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    title: "Job disetujui!",
    message: "BMW 330i M Sport — Review UGC Anda telah disetujui oleh BMW Tunas.",
    time: "2 menit lalu",
    unread: true,
  },
  {
    id: 2,
    icon: Wallet,
    iconColor: "text-[#D4AF37]",
    iconBg: "bg-[#D4AF37]/10",
    title: "Dana berhasil ditarik",
    message: "Rp3.500.000 berhasil dikirim ke rekening BCA Anda.",
    time: "1 jam lalu",
    unread: true,
  },
  {
    id: 3,
    icon: Megaphone,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    title: "Campaign baru tersedia",
    message: "Toyota Alphard 2025 — Dealer Auto2000 Sudirman membuka job baru untukmu.",
    time: "3 jam lalu",
    unread: false,
  },
  {
    id: 4,
    icon: Trophy,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/10",
    title: "Naik Rank!",
    message: "Selamat! Anda naik ke V6 Class Engine. Benefit baru telah diaktifkan.",
    time: "Kemarin",
    unread: false,
  },
];

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ open, onClose }: NotificationDropdownProps) {
  const [dismissed, setDismissed] = useState<number[]>([]);

  if (!open) return null;

  const visible = notifications.filter((n) => !dismissed.includes(n.id));

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-[360px] bg-[#111316] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-[#D4AF37]" />
            <span className="text-sm font-black text-white">Notifikasi</span>
            {visible.filter(n => n.unread).length > 0 && (
              <span className="bg-[#D4AF37] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                {visible.filter(n => n.unread).length} baru
              </span>
            )}
          </div>
          <button onClick={onClose} className="size-7 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
            <X className="size-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Notification list */}
        <div className="flex flex-col max-h-[360px] overflow-y-auto divide-y divide-white/5">
          {visible.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Semua notifikasi sudah dibaca
            </div>
          ) : (
            visible.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 px-5 py-4 hover:bg-white/3 transition-colors relative group ${notif.unread ? "bg-white/[0.02]" : ""}`}
              >
                {notif.unread && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-[#D4AF37]" />
                )}
                <div className={`size-9 rounded-xl ${notif.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <notif.icon className={`size-4 ${notif.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-white leading-tight">{notif.title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-medium">{notif.time}</p>
                </div>
                <button
                  onClick={() => setDismissed((d) => [...d, notif.id])}
                  className="opacity-0 group-hover:opacity-100 size-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-all shrink-0 mt-0.5"
                >
                  <X className="size-3 text-muted-foreground" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {visible.length > 0 && (
          <div className="px-5 py-3 border-t border-white/5">
            <button
              onClick={() => setDismissed(notifications.map(n => n.id))}
              className="text-xs font-bold text-muted-foreground hover:text-white transition-colors w-full text-center"
            >
              Tandai semua sudah dibaca
            </button>
          </div>
        )}
      </div>
    </>
  );
}
