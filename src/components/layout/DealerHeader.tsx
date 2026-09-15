"use client";

import { useState } from "react";
import { Bell, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationDropdown } from "@/components/modals/NotificationDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTE_TITLES: Record<string, string> = {
  "/dealer/dashboard": "Overview",
  "/dealer/campaigns": "Kampanye",
  "/dealer/campaigns/create": "Buat Kampanye",
  "/dealer/inventory": "Inventory Kendaraan",
  "/dealer/submissions": "Review Konten",
  "/dealer/billing": "Keuangan",
  "/dealer/profile": "Profil Dealer",
};

interface DealerHeaderProps {
  title?: string;
}

export function DealerHeader({ title }: DealerHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const displayTitle = title || ROUTE_TITLES[pathname] || "Dealer Portal";

  return (
    <>
      {/* Premium Glassmorphic Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 lg:px-8 bg-gradient-to-r from-[#0a0a0c]/80 via-[#12100A]/80 to-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/5 shadow-sm relative overflow-hidden">
        {/* Subtle top/bottom ambient glows */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[150%] bg-[#D4AF37]/[0.03] blur-[30px] rounded-[100%] pointer-events-none" />
        
        {/* Animated noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <SidebarTrigger className="-ml-2 md:hidden text-muted-foreground hover:text-foreground" />
          <h1 className="text-[15px] font-medium text-foreground">{displayTitle}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dealer/campaigns/create">
            <Button
              size="sm"
              className="rounded-lg px-4 sm:px-5 h-9 gap-2 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/30 text-[#D4AF37] hover:from-[#D4AF37]/20 hover:to-[#D4AF37]/10 font-bold text-[11px] uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]"
            >
              <PlusCircle className="size-4" />
              <span className="hidden sm:inline">Buat Kampanye</span>
              <span className="sm:hidden">Buat</span>
            </Button>
          </Link>

          <div className="flex items-center gap-1 border-l border-white/5 pl-4 ml-1">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotifOpen((v) => !v)}
                className="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <Bell className="size-4" />
              </Button>
              <span className="absolute top-1.5 right-1.5 flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none border-[1.5px] border-[#0a0a0c]">
                3
              </span>

              {/* Notification Dropdown */}
              <NotificationDropdown
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
