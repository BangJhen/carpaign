"use client";

import { useState, useEffect } from "react";
import { Bell, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationDropdown } from "@/components/modals/NotificationDropdown";
import { getMyReferralCode } from "@/app/actions/creatorProfile";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const ROUTE_TITLES: Record<string, string> = {
  "/creator/dashboard": "Dashboard Kreator",
  "/creator/campaigns": "Eksplorasi Kampanye",
  "/creator/analitik": "Analitik Performa",
  "/creator/pendapatan": "Pendapatan dan Saldo",
  "/creator/rank-rewards": "Rank dan Rewards",
  "/creator/leaderboard": "Leaderboard Kreator",
  "/creator/profile": "Profil Kreator",
  "/creator/bantuan": "Hubungi Admin",
  "/creator/faq": "FAQ dan Peraturan",
};

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [creatorSlug, setCreatorSlug] = useState<string>("creators");
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const displayTitle = title || ROUTE_TITLES[pathname] || "Kreator Portal";

  useEffect(() => {
    getMyReferralCode()
      .then((code) => {
        if (code) setCreatorSlug(code);
      })
      .catch(() => {});
  }, [pathname]);

  const handleCopyLink = () => {
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${creatorSlug}`
        : `https://carpaign.id/${creatorSlug}`;
    navigator.clipboard.writeText(fullUrl).catch(() => {});
    setCopied(true);
    toast.success("Link bio berhasil disalin", {
      description: fullUrl,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 lg:px-8 bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/5 relative overflow-visible">
      <div className="flex items-center gap-4 relative z-10">
        <SidebarTrigger className="-ml-2 md:hidden text-muted-foreground hover:text-foreground" />
        <h1 className="text-[15px] font-medium text-foreground">{displayTitle}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 relative z-20">
        {/* Creator Bio Link (Clickable & Copyable) */}
        <div className="flex items-center gap-1.5">
          <a
            href={`/${creatorSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka halaman katalog promosi Anda"
            className="group inline-flex items-center gap-1.5 sm:gap-2 h-9 px-3 sm:px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary/40 text-xs font-medium text-white/90 hover:text-white transition-all shadow-none"
          >
            <span className="text-white/40 group-hover:text-white/60 transition-colors hidden sm:inline text-xs">
              carpaign.id/
            </span>
            <span className="font-semibold text-primary">{creatorSlug}</span>
            <ExternalLink className="size-3.5 text-white/40 group-hover:text-white transition-colors ml-0.5 shrink-0" />
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            title="Salin link bio"
            className="size-9 rounded-xl flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all shrink-0 cursor-pointer"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 border-l border-white/10 pl-3 ml-0.5">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotifOpen((v) => !v)}
              className={`size-9 rounded-xl transition-all ${
                notifOpen
                  ? "bg-white/15 text-white border border-white/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
              aria-label="Buka notifikasi"
            >
              <Bell className="size-4" />
            </Button>

            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black leading-none border-[1.5px] border-[#0a0a0c] shadow-sm pointer-events-none">
                {unreadCount}
              </span>
            )}

            {/* Notification Dropdown */}
            <NotificationDropdown
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              role="creator"
              onUnreadCountChange={setUnreadCount}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
