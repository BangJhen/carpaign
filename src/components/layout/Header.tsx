"use client";

import { useState } from "react";
import { Bell, Gift, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { InviteModal } from "@/components/modals/InviteModal";
import { NotificationDropdown } from "@/components/modals/NotificationDropdown";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  return (
    <>
      {/* Clean Monochromatic Glassmorphic Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 lg:px-8 bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/5 relative overflow-visible">
        <div className="flex items-center gap-4 relative z-10">
          <SidebarTrigger className="-ml-2 md:hidden text-muted-foreground hover:text-foreground" />
          <h1 className="text-[15px] font-medium text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 relative z-20">
          {/* Clean Neutral CTA Button */}
          <Button
            size="sm"
            onClick={() => setInviteOpen(true)}
            className="rounded-xl px-4 sm:px-5 h-9 gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs shadow-sm transition-all"
          >
            <HandCoins className="size-4 text-white/80" />
            <span className="hidden sm:inline">Refer dan Dapatkan</span>
            <span className="sm:hidden">Undang</span>
          </Button>

          <div className="flex items-center gap-1 border-l border-white/10 pl-4 ml-1">
            {/* Gift */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInviteOpen(true)}
              className="size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 hidden sm:flex"
            >
              <Gift className="size-4" />
            </Button>

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

      {/* Modals */}
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
