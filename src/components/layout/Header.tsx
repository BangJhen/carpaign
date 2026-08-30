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

  return (
    <>
      {/* Added z-40 and border-b for sleek separation */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 lg:px-8 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2 md:hidden text-muted-foreground hover:text-foreground" />
          <h1 className="text-[15px] font-medium text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* CTA Button Redesigned to be less identical to konten.com */}
          <Button
            size="sm"
            onClick={() => setInviteOpen(true)}
            className="rounded-lg px-4 sm:px-5 h-9 gap-2 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/30 text-[#D4AF37] hover:from-[#D4AF37]/20 hover:to-[#D4AF37]/10 font-bold text-[11px] uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]"
          >
            <HandCoins className="size-4" />
            <span className="hidden sm:inline">Refer & Earn</span>
            <span className="sm:hidden">Undang</span>
          </Button>

          <div className="flex items-center gap-1 border-l border-white/5 pl-4 ml-1">
            {/* Gift */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInviteOpen(true)}
              className="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 hidden sm:flex"
            >
              <Gift className="size-4" />
            </Button>

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
                2
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

      {/* Modals */}
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
