"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowUp, ArrowDown, User } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const leaderboardDatasets: Record<string, Array<{
  rank: number;
  name: string;
  handle: string;
  engine: string;
  views: string;
  jobs: number;
  trend: "up" | "down" | "same";
  avatar: string;
}>> = {
  creator_month: [
    { rank: 1, name: "Reza Rahadian", handle: "@rezadrift", engine: "V12", views: "14.2M", jobs: 42, trend: "up", avatar: "R" },
    { rank: 2, name: "Fitra Eri Fans", handle: "@fitrafans", engine: "V10", views: "11.8M", jobs: 35, trend: "up", avatar: "F" },
    { rank: 3, name: "OtoDriver Official", handle: "@otodriver", engine: "V10", views: "9.5M", jobs: 28, trend: "down", avatar: "O" },
    { rank: 4, name: "CarVlog Indo", handle: "@carvlogid", engine: "V8", views: "8.1M", jobs: 24, trend: "up", avatar: "C" },
    { rank: 5, name: "Supercar Spotter", handle: "@spotter.jkt", engine: "V8", views: "6.4M", jobs: 19, trend: "same", avatar: "S" },
    { rank: 6, name: "JDM Enthusiast", handle: "@jdm_boys", engine: "V6", views: "4.2M", jobs: 14, trend: "up", avatar: "J" },
    { rank: 7, name: "Motomobi Wannabe", handle: "@motowannabe", engine: "V6", views: "3.9M", jobs: 12, trend: "down", avatar: "M" },
  ],
  creator_all: [
    { rank: 1, name: "Fitra Eri Fans", handle: "@fitrafans", engine: "V12", views: "88.5M", jobs: 340, trend: "up", avatar: "F" },
    { rank: 2, name: "Reza Rahadian", handle: "@rezadrift", engine: "V12", views: "79.2M", jobs: 295, trend: "up", avatar: "R" },
    { rank: 3, name: "Lugnutz Auto", handle: "@lugnutz_id", engine: "V10", views: "64.1M", jobs: 210, trend: "down", avatar: "L" },
    { rank: 4, name: "OtoDriver Official", handle: "@otodriver", engine: "V10", views: "58.7M", jobs: 195, trend: "same", avatar: "O" },
    { rank: 5, name: "Ridwan Hanif ID", handle: "@ridwanhr", engine: "V8", views: "45.3M", jobs: 160, trend: "up", avatar: "H" },
    { rank: 6, name: "CarVlog Indo", handle: "@carvlogid", engine: "V8", views: "38.0M", jobs: 130, trend: "up", avatar: "C" },
    { rank: 7, name: "Mas Wahid", handle: "@maswahid", engine: "V6", views: "29.4M", jobs: 98, trend: "down", avatar: "W" },
  ],
  clipper_month: [
    { rank: 1, name: "SpeedClip ID", handle: "@speedclip", engine: "V12", views: "22.4M", jobs: 180, trend: "up", avatar: "S" },
    { rank: 2, name: "MotorVibe Cut", handle: "@motorvibe", engine: "V10", views: "18.1M", jobs: 145, trend: "up", avatar: "M" },
    { rank: 3, name: "TurboClips", handle: "@turboclips", engine: "V10", views: "15.6M", jobs: 120, trend: "down", avatar: "T" },
    { rank: 4, name: "DriftShorts", handle: "@driftshorts", engine: "V8", views: "12.3M", jobs: 95, trend: "up", avatar: "D" },
    { rank: 5, name: "JDM Reels Hub", handle: "@jdm_reels", engine: "V8", views: "9.8M", jobs: 82, trend: "same", avatar: "J" },
    { rank: 6, name: "Knalpot Racing", handle: "@knalpot_id", engine: "V6", views: "7.2M", jobs: 64, trend: "up", avatar: "K" },
    { rank: 7, name: "OtoHighlights", handle: "@otohighlights", engine: "V6", views: "5.9M", jobs: 51, trend: "down", avatar: "O" },
  ],
  clipper_all: [
    { rank: 1, name: "TurboClips", handle: "@turboclips", engine: "V12", views: "114.2M", jobs: 820, trend: "up", avatar: "T" },
    { rank: 2, name: "SpeedClip ID", handle: "@speedclip", engine: "V12", views: "98.7M", jobs: 710, trend: "up", avatar: "S" },
    { rank: 3, name: "MotorVibe Cut", handle: "@motorvibe", engine: "V10", views: "84.1M", jobs: 620, trend: "down", avatar: "M" },
    { rank: 4, name: "AutoSnap Indo", handle: "@autosnap", engine: "V10", views: "71.0M", jobs: 540, trend: "same", avatar: "A" },
    { rank: 5, name: "DriftShorts", handle: "@driftshorts", engine: "V8", views: "59.4M", jobs: 430, trend: "up", avatar: "D" },
    { rank: 6, name: "JDM Reels Hub", handle: "@jdm_reels", engine: "V8", views: "46.2M", jobs: 350, trend: "up", avatar: "J" },
    { rank: 7, name: "Knalpot Racing", handle: "@knalpot_id", engine: "V6", views: "33.8M", jobs: 280, trend: "down", avatar: "K" },
  ],
};

export function LeaderboardView() {
  const [role, setRole] = useState<"creator" | "clipper">("creator");
  const [time, setTime] = useState<"month" | "all">("month");

  const currentKey = `${role}_${time}`;
  const currentLeaderboard = leaderboardDatasets[currentKey] || leaderboardDatasets.creator_month;

  // Split top 3 and the rest
  const top3 = currentLeaderboard.slice(0, 3);
  const rest = currentLeaderboard.slice(3);

  // Helper to get styling for podium
  const getPodiumStyles = (rank: number) => {
    switch(rank) {
      case 1: return { border: "border-[#D4AF37]", glow: "shadow-[0_0_50px_rgba(212,175,55,0.4)]", text: "text-[#D4AF37]", bg: "bg-[#D4AF37]", height: "h-[280px]" };
      case 2: return { border: "border-slate-300", glow: "shadow-[0_0_30px_rgba(203,213,225,0.2)]", text: "text-slate-300", bg: "bg-slate-300", height: "h-[240px]" };
      case 3: return { border: "border-[#CD7F32]", glow: "shadow-[0_0_30px_rgba(205,127,50,0.2)]", text: "text-[#CD7F32]", bg: "bg-[#CD7F32]", height: "h-[220px]" };
      default: return { border: "border-white/10", glow: "", text: "text-white", bg: "bg-white", height: "" };
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-28 relative">
      
      {/* Header & Filters */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-foreground tracking-tight">
            Hall of Fame
          </h2>
          <p className="text-muted-foreground text-[14px] mt-1">
            Papan peringkat jawara konten otomotif. Buktikan mesin Anda yang paling buas!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Time Filter */}
          <div className="flex items-center bg-[#1A1C20] rounded-lg p-1 border border-white/5">
            <button 
              onClick={() => setTime("month")}
              className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                time === "month" 
                ? "bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                : "text-muted-foreground hover:text-white"
              }`}
            >
              Bulan Ini
            </button>
            <button 
              onClick={() => setTime("all")}
              className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                time === "all" 
                ? "bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                : "text-muted-foreground hover:text-white"
              }`}
            >
              All Time
            </button>
          </div>

          {/* Role Filter */}
          <div className="flex items-center bg-[#111316] p-1.5 rounded-full border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
            <button 
              onClick={() => setRole("creator")}
              className={`px-6 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                role === "creator" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
              }`}
            >
              Top Creator
            </button>
            <button 
              onClick={() => setRole("clipper")}
              className={`px-6 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                role === "clipper" ? "bg-white text-black" : "text-muted-foreground hover:text-white"
              }`}
            >
              Top Clipper
            </button>
          </div>
        </div>
      </motion.div>

      {/* Podium Top 3 */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1} className="w-full flex items-end justify-center gap-2 sm:gap-6 pt-10 sm:pt-20 px-2 sm:px-0">
        
        {/* Rank 2 (Left) */}
        <div className="w-[30%] sm:w-[240px] flex flex-col items-center">
          <div className="relative size-16 sm:size-24 rounded-full bg-[#111316] border-4 border-slate-300 z-10 flex items-center justify-center -mb-8 sm:-mb-12 shadow-[0_0_30px_rgba(203,213,225,0.3)]">
            <span className="text-xl sm:text-3xl font-black text-slate-300">{top3[1].avatar}</span>
            <div className="absolute -bottom-3 bg-slate-300 text-black text-[10px] sm:text-[12px] font-black px-3 rounded-full border-2 border-[#111316]">2</div>
          </div>
          <Card className={`w-full ${getPodiumStyles(2).height} bg-gradient-to-t from-[#111316] to-[#1a1c22] border-t-2 border-slate-300/50 rounded-t-xl rounded-b-none flex flex-col items-center justify-end pb-6 sm:pb-8 pt-10 sm:pt-14`}>
            <h3 className="text-[12px] sm:text-[16px] font-bold text-white text-center truncate w-full px-2">{top3[1].name}</h3>
            <span className="text-[10px] sm:text-[12px] text-muted-foreground mb-2 sm:mb-3">{top3[1].handle}</span>
            <Badge variant="outline" className="border-slate-300/30 text-slate-300 bg-slate-300/10 text-[9px] sm:text-[10px] uppercase mb-auto font-bold">{top3[1].engine}</Badge>
            <div className="flex flex-col items-center mt-2">
              <span className="text-[18px] sm:text-[24px] font-black text-white leading-none">{top3[1].views}</span>
              <span className="text-[9px] sm:text-[11px] text-muted-foreground uppercase tracking-widest mt-1">Views</span>
            </div>
          </Card>
        </div>

        {/* Rank 1 (Center) */}
        <div className="w-[35%] sm:w-[280px] flex flex-col items-center">
          <div className="relative size-20 sm:size-32 rounded-full bg-[#111316] border-[4px] sm:border-[6px] border-[#D4AF37] z-20 flex items-center justify-center -mb-10 sm:-mb-16 shadow-[0_0_50px_rgba(212,175,55,0.6)]">
            <Trophy className="absolute -top-6 sm:-top-10 size-8 sm:size-12 text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,1)]" />
            <span className="text-2xl sm:text-4xl font-black text-[#D4AF37]">{top3[0].avatar}</span>
            <div className="absolute -bottom-3 sm:-bottom-4 bg-[#D4AF37] text-black text-[12px] sm:text-[14px] font-black px-4 rounded-full border-2 border-[#111316]">1</div>
          </div>
          <Card className={`w-full ${getPodiumStyles(1).height} bg-gradient-to-t from-[#111316] to-[#1e1c15] border-t-2 border-[#D4AF37] rounded-t-xl rounded-b-none flex flex-col items-center justify-end pb-8 sm:pb-12 pt-14 sm:pt-20 shadow-[0_-10px_40px_rgba(212,175,55,0.15)] z-10`}>
            <h3 className="text-[14px] sm:text-[18px] font-black text-white text-center truncate w-full px-2">{top3[0].name}</h3>
            <span className="text-[10px] sm:text-[12px] text-muted-foreground mb-2 sm:mb-4">{top3[0].handle}</span>
            <Badge variant="outline" className="border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/10 text-[10px] sm:text-[11px] uppercase mb-auto font-bold">{top3[0].engine}</Badge>
            <div className="flex flex-col items-center mt-2">
              <span className="text-[24px] sm:text-[36px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{top3[0].views}</span>
              <span className="text-[9px] sm:text-[11px] text-[#D4AF37] uppercase tracking-widest mt-1 font-bold">Total Views</span>
            </div>
          </Card>
        </div>

        {/* Rank 3 (Right) */}
        <div className="w-[30%] sm:w-[240px] flex flex-col items-center">
          <div className="relative size-16 sm:size-24 rounded-full bg-[#111316] border-4 border-[#CD7F32] z-10 flex items-center justify-center -mb-8 sm:-mb-12 shadow-[0_0_30px_rgba(205,127,50,0.3)]">
            <span className="text-xl sm:text-3xl font-black text-[#CD7F32]">{top3[2].avatar}</span>
            <div className="absolute -bottom-3 bg-[#CD7F32] text-black text-[10px] sm:text-[12px] font-black px-3 rounded-full border-2 border-[#111316]">3</div>
          </div>
          <Card className={`w-full ${getPodiumStyles(3).height} bg-gradient-to-t from-[#111316] to-[#1f1915] border-t-2 border-[#CD7F32]/50 rounded-t-xl rounded-b-none flex flex-col items-center justify-end pb-6 sm:pb-8 pt-10 sm:pt-14`}>
            <h3 className="text-[12px] sm:text-[16px] font-bold text-white text-center truncate w-full px-2">{top3[2].name}</h3>
            <span className="text-[10px] sm:text-[12px] text-muted-foreground mb-2 sm:mb-3">{top3[2].handle}</span>
            <Badge variant="outline" className="border-[#CD7F32]/30 text-[#CD7F32] bg-[#CD7F32]/10 text-[9px] sm:text-[10px] uppercase mb-auto font-bold">{top3[2].engine}</Badge>
            <div className="flex flex-col items-center mt-2">
              <span className="text-[18px] sm:text-[24px] font-black text-white leading-none">{top3[2].views}</span>
              <span className="text-[9px] sm:text-[11px] text-muted-foreground uppercase tracking-widest mt-1">Views</span>
            </div>
          </Card>
        </div>

      </motion.div>

      {/* Leaderboard Table / List */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2} className="flex flex-col gap-2 -mt-2">
        {rest.map((user, i) => (
          <Card key={user.rank} className="bg-[#111316] border-white/5 hover:bg-[#15171a] transition-colors overflow-hidden group">
            <CardContent className="p-3 sm:p-5 flex items-center gap-3 sm:gap-6">
              
              {/* Rank Number */}
              <div className="w-8 sm:w-12 text-center shrink-0 font-mono font-bold text-[16px] sm:text-[20px] text-muted-foreground group-hover:text-white transition-colors">
                {user.rank}
              </div>

              {/* Avatar */}
              <div className="size-10 sm:size-12 rounded-full bg-[#1A1C20] border border-white/10 flex items-center justify-center shrink-0 font-black text-white">
                {user.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-[14px] sm:text-[16px] font-bold text-foreground truncate">{user.name}</h4>
                  {user.trend === 'up' && <ArrowUp className="size-3 text-emerald-400" />}
                  {user.trend === 'down' && <ArrowDown className="size-3 text-red-400" />}
                </div>
                <div className="text-[11px] sm:text-[13px] text-muted-foreground flex items-center gap-3">
                  <span>{user.handle}</span>
                  <Badge variant="outline" className="hidden sm:inline-flex border-white/10 bg-white/5 text-[9px] uppercase px-2 py-0">
                    {user.engine}
                  </Badge>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-6 shrink-0 text-right">
                <div className="hidden sm:flex flex-col">
                  <span className="text-[15px] font-bold text-white">{user.jobs}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Jobs</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] sm:text-[18px] font-black text-white">{user.views}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Views</span>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Sticky Bottom Bar (Current User Status) */}
      <div className="fixed bottom-0 left-0 right-0 sm:left-64 bg-black/80 backdrop-blur-xl border-t border-[#D4AF37]/30 p-4 z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="w-8 sm:w-12 text-center shrink-0 font-mono font-bold text-[16px] sm:text-[20px] text-[#D4AF37]">
              42
            </div>
            <div className="size-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-yellow-700 p-0.5 shrink-0">
              <div className="w-full h-full bg-[#111316] rounded-full flex items-center justify-center">
                <User className="size-5 text-[#D4AF37]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#D4AF37] font-bold uppercase tracking-widest">Posisi Anda</span>
              <span className="text-[14px] sm:text-[16px] font-bold text-white">V6 Class Engine</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[16px] sm:text-[20px] font-black text-white">1.2M <span className="text-[12px] font-medium text-muted-foreground uppercase">Views</span></span>
            <span className="text-[11px] text-muted-foreground hidden sm:block">Butuh 2.7M views lagi untuk mengejar Rank 7</span>
          </div>
        </div>
      </div>

    </div>
  );
}
