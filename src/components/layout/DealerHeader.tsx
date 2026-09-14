"use client";

import { useState } from "react";
import { Bell, Building2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

const DEALER_ACCENT = "#B87333";

interface DealerHeaderProps {
  title: string;
}

export function DealerHeader({ title }: DealerHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 lg:px-8 bg-gradient-to-r from-[#0a0a0c]/80 via-[#0D0B08]/80 to-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/5 shadow-sm relative overflow-hidden">
      {/* Copper ambient glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(to right, transparent, ${DEALER_ACCENT}30, transparent)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[150%] blur-[30px] rounded-[100%] pointer-events-none"
        style={{ background: `${DEALER_ACCENT}05` }}
      />

      {/* Left — sidebar trigger + title */}
      <div className="flex items-center gap-4 relative z-10">
        <SidebarTrigger className="-ml-2 md:hidden text-muted-foreground hover:text-foreground" />
        <div className="flex items-center gap-2">
          <Building2 className="size-4 hidden sm:block" style={{ color: `${DEALER_ACCENT}80` }} />
          <h1 className="text-[15px] font-medium text-foreground">{title}</h1>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 sm:gap-3 relative z-10">
        <Link href="/dealer/campaigns/create">
          <Button
            size="sm"
            className="rounded-lg px-4 h-9 gap-2 text-[11px] font-bold uppercase tracking-widest transition-all"
            style={{
              background: `linear-gradient(135deg, ${DEALER_ACCENT}20, ${DEALER_ACCENT}08)`,
              border: `1px solid ${DEALER_ACCENT}40`,
              color: DEALER_ACCENT,
              boxShadow: `0 0 15px ${DEALER_ACCENT}20`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 25px ${DEALER_ACCENT}35`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 15px ${DEALER_ACCENT}20`;
            }}
          >
            <PlusCircle className="size-4" />
            <span className="hidden sm:inline">Buat Kampanye</span>
          </Button>
        </Link>

        <div className="flex items-center gap-1 border-l border-white/5 pl-3 ml-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotifOpen((v) => !v)}
              className="size-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <Bell className="size-4" />
            </Button>
            <span className="absolute top-1.5 right-1.5 flex size-3.5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white leading-none border-[1.5px] border-[#0a0a0c]">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
