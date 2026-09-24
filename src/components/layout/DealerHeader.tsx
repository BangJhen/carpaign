"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationDropdown } from "@/components/modals/NotificationDropdown";
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
  const [unreadCount, setUnreadCount] = useState(2);
  const pathname = usePathname();
  const displayTitle = title || ROUTE_TITLES[pathname] || "Dealer Portal";

  return (
    <>
      {/* Clean Monochromatic Glassmorphic Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 lg:px-8 bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/5 relative overflow-visible">
        <div className="flex items-center gap-4 relative z-10">
          <SidebarTrigger className="-ml-2 md:hidden text-muted-foreground hover:text-foreground" />
          <h1 className="text-[15px] font-medium text-foreground">{displayTitle}</h1>
        </div>

        <div className="flex items-center gap-2 relative z-20">
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
              role="dealer"
              onUnreadCountChange={setUnreadCount}
            />
          </div>
        </div>
      </header>
    </>
  );
}
