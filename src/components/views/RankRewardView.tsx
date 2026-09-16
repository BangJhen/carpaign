"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Lock, CheckCircle2, Star, Clock, Settings, Gauge, Timer, Layers } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

type Role = "creator" | "clipper";

const getTiers = (role: Role) => [
  {
    id: "v4",
    name: "V4 Class",
    badgeClass: "from-zinc-700 via-zinc-500 to-zinc-800",
    shadowClass: "shadow-[0_0_30px_rgba(113,113,122,0.3)]",
    textClass: "text-zinc-300",
    requirements: "0 sampai 10 Job Selesai",
    benefits: role === "creator" ? [
      "Potongan platform 15%",
      "Akses job dasar (Review statis)",
      "Pencairan dana reguler (3 sampai 5 hari kerja)"
    ] : [
      "Potongan platform 15%",
      "Akses raw footage publik",
      "Pencairan dana reguler (3 sampai 5 hari kerja)"
    ],
    unlocked: true,
    isCurrent: false,
  },
  {
    id: "v6",
    name: "V6 Class",
    badgeClass: "from-slate-400 via-slate-200 to-slate-500",
    shadowClass: "shadow-[0_0_40px_rgba(148,163,184,0.6)]",
    textClass: "text-slate-300",
    requirements: "11 sampai 50 Job Selesai",
    benefits: role === "creator" ? [
      "Potongan platform turun menjadi 10%",
      "Akses job UGC Premium",
      "Pencairan dana ekspres (1 hari kerja)"
    ] : [
      "Potongan platform turun menjadi 10%",
      "Akses raw footage eksklusif prioritas tinggi",
      "Pencairan dana ekspres (1 hari kerja)"
    ],
    unlocked: true,
    isCurrent: true,
    currentJobs: 35,
    nextRequirement: 51,
  },
  {
    id: "v8",
    name: "V8 Class",
    badgeClass: "from-[#F3D578] via-[#D4AF37] to-[#8C6D1F]",
    shadowClass: "shadow-[0_0_50px_rgba(212,175,55,0.7)]",
    textClass: "text-[#D4AF37]",
    requirements: "51 sampai 200 Job Selesai",
    benefits: role === "creator" ? [
      "Potongan platform turun menjadi 5%",
      "Undangan eksklusif Test Drive dari Dealer",
      "Dedicated Account Manager",
      "Bonus 5% tiap job di atas Rp2.000.000"
    ] : [
      "Potongan platform turun menjadi 5%",
      "Akses gratis ke Tools AI Auto-Caption dan Hook",
      "Dedicated Account Manager",
      "Bonus 5% tiap job di atas Rp2.000.000"
    ],
    unlocked: false,
    isCurrent: false,
  },
  {
    id: "v10",
    name: "V10 Class",
    badgeClass: "from-blue-400 via-blue-500 to-indigo-900",
    shadowClass: "shadow-[0_0_40px_rgba(59,130,246,0.5)]",
    textClass: "text-blue-400",
    requirements: "201 sampai 500 Job Selesai",
    benefits: role === "creator" ? [
      "Potongan platform hanya 2%",
      "Fasilitas peminjaman unit mobil 24 jam untuk konten",
      "Pinjaman dana produksi (0% bunga)",
      "Free tiket GIIAS dan IIMS VIP pass"
    ] : [
      "Potongan platform hanya 2%",
      "Pencairan dana instan tanpa batas (1 jam)",
      "Akses API dan Plugin distribusi massal",
      "Free tiket GIIAS dan IIMS VIP pass"
    ],
    unlocked: false,
    isCurrent: false,
  },
  {
    id: "v12",
    name: "V12 Class",
    badgeClass: "from-red-600 via-red-500 to-black",
    shadowClass: "shadow-[0_0_50px_rgba(239,68,68,0.6)]",
    textClass: "text-red-500",
    requirements: "Lebih dari 500 Job Selesai dan Rating 4.9+",
    benefits: role === "creator" ? [
      "0% Potongan platform selamanya",
      "Kontrak Eksklusif Brand Ambassador Dealer",
      "Prioritas akses mobil baru sebelum peluncuran resmi",
      "Sponsorship peralatan kamera dan drone"
    ] : [
      "0% Potongan platform selamanya",
      "Retainer eksklusif untuk clipping campaign brand nasional",
      "Mendapat bagian dari profit penjualan unit (Revenue Share)",
      "Sponsorship peralatan MacBook Pro dan software produksi"
    ],
    unlocked: false,
    isCurrent: false,
  },
];

export function RankRewardView() {
  const [role, setRole] = useState<Role>("creator");
  const currentTiers = getTiers(role);
  const currentIndex = currentTiers.findIndex((t) => t.isCurrent);
  const currentTier = currentTiers[currentIndex] || currentTiers[0];
  const nextTier = currentTiers[currentIndex + 1];
  
  // Progress calculations
  const jobsDone = currentTier.currentJobs || 0;
  const jobsNeeded = currentTier.nextRequirement || 0;
  const progressPercent = jobsNeeded > 0 ? (jobsDone / jobsNeeded) * 100 : 100;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      
      {/* Header & Role Switcher */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-foreground tracking-tight">
            Engine Class: Peringkat dan Reward
          </h2>
          <p className="text-muted-foreground text-[14px] mt-1">
            Pacu performa Anda. Tingkatkan kelas mesin untuk membuka limit fitur tersembunyi.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-[#111316] p-1.5 rounded-full border border-white/10 shrink-0 w-fit shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
          <button 
            onClick={() => setRole("creator")}
            className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${
              role === "creator" 
              ? "bg-gradient-to-r from-[#D4AF37] to-[#b39023] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
              : "text-muted-foreground hover:text-white"
            }`}
          >
            Sebagai Creator
          </button>
          <button 
            onClick={() => setRole("clipper")}
            className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${
              role === "clipper" 
              ? "bg-gradient-to-r from-[#D4AF37] to-[#b39023] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
              : "text-muted-foreground hover:text-white"
            }`}
          >
            Sebagai Clipper
          </button>
        </div>
      </motion.div>

      {/* Hero Badge Display (Tachometer Concept) */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1} className="w-full">
        <Card className="relative overflow-hidden rounded-[32px] border-none bg-[#0a0a0c] min-h-[400px] flex items-center justify-center py-12 shadow-2xl">
          {/* Engine/Carbon Fiber Background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-black" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-[600px] px-6">
            
            {/* Speedometer/Engine Block Emblem */}
            <div className={`relative size-40 sm:size-52 rounded-full flex items-center justify-center bg-gradient-to-br ${currentTier.badgeClass} p-1 mb-8 ${currentTier.shadowClass}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-full" />
              <div className="w-full h-full rounded-full bg-[#111316] flex flex-col items-center justify-center overflow-hidden border-[4px] border-black/60 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
                
                {/* Needle / Gauge Visual */}
                <Gauge className={`absolute top-4 size-10 ${currentTier.textClass} opacity-20`} />
                <div className={`text-[48px] sm:text-[64px] font-black italic tracking-tighter ${currentTier.textClass} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mt-2`}>
                  {currentTier.name.split(" ")[0]}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 mt-0">Class</span>
              </div>
            </div>

            <Badge variant="outline" className="border-white/10 bg-black/40 text-muted-foreground px-4 py-1 mb-4 font-bold uppercase tracking-[0.2em] text-[10px]">
              Engine Status: {currentTier.name}
            </Badge>
            <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4 text-white drop-shadow-lg`}>
              {role === 'creator' ? 'Performa Kreator' : 'Kapasitas Distribusi'}
            </h1>
            <p className="text-[14px] text-muted-foreground/80 leading-relaxed mb-6">
              Mesin Anda berjalan di kelas <strong className={currentTier.textClass}>{currentTier.name}</strong>. Terus pacu RPM Anda untuk mendominasi *campaign* eksklusif.
            </p>
          </div>

          {/* Bottom RPM / Review Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-12 pb-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-[80%] sm:max-w-[400px] bg-black/50 border border-white/5 backdrop-blur-md p-3 rounded-xl flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Timer className="size-3.5" /> Maintenance In:
              </span>
              <div className="flex items-center gap-1">
                <span className="text-white font-mono font-bold text-[14px]">14</span>
                <span className="text-[9px] text-[#D4AF37] font-black">HARI</span>
                <span className="text-white font-mono font-bold text-[14px] ml-1">08</span>
                <span className="text-[9px] text-[#D4AF37] font-black">JAM</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Progress to Next Tier Section */}
      {nextTier && (
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
          <Card className="bg-[#111316] border-white/5 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${nextTier.badgeClass} opacity-5 mix-blend-overlay`} />
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-12 relative z-10">
              
              <div className="w-full sm:w-1/3 shrink-0 text-center sm:text-left">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Target Mesin Berikutnya</h3>
                <div className={`text-2xl sm:text-3xl font-black italic tracking-tighter uppercase ${nextTier.textClass} drop-shadow-lg mb-2`}>
                  {nextTier.name}
                </div>
                <p className="text-[12px] text-muted-foreground">
                  Dapatkan <strong className="text-white">{nextTier.benefits[1]}</strong> dan benefit lainnya.
                </p>
              </div>

              <div className="w-full sm:w-2/3 flex flex-col">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Job Diselesaikan</span>
                    <span className="text-2xl font-black text-white">{jobsDone} <span className="text-sm text-muted-foreground font-medium">dari {jobsNeeded}</span></span>
                  </div>
                  <span className={`text-[13px] font-bold ${nextTier.textClass}`}>
                    {jobsNeeded - jobsDone} Job lagi menuju {nextTier.name.split(" ")[0]}
                  </span>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full h-3 bg-[#1A1C20] rounded-full overflow-hidden border border-white/10 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${nextTier.badgeClass} shadow-[0_0_15px_rgba(255,255,255,0.3)] relative`}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50" />
                  </motion.div>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Engine Tier List */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
        <div className="mb-6 flex items-center gap-2">
          <Layers className="size-5 text-[#D4AF37]" />
          <h3 className="text-xl font-bold text-foreground tracking-tight">Spesifikasi Seluruh Kelas Mesin</h3>
        </div>

        <div className="flex flex-col gap-4">
          {currentTiers.map((tier, i) => (
            <motion.div key={tier.id} initial="hidden" animate="show" variants={fadeUp} custom={4 + i}>
              <Card className={`relative overflow-hidden transition-all duration-300 ${tier.isCurrent ? `bg-[#15171A] border-l-4 border-l-[#D4AF37] border-t-white/5 border-r-white/5 border-b-white/5 shadow-[0_0_30px_rgba(255,255,255,0.03)]` : 'bg-[#111316] border-white/5 hover:border-white/10'}`}>
                
                {tier.isCurrent && (
                  <div className={`absolute top-0 right-0 bg-gradient-to-r ${tier.badgeClass} text-black text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-lg`}>
                    Reward Saat Ini
                  </div>
                )}

                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-start md:items-stretch">
                    
                    {/* Left: Engine Emblem & Requirements */}
                    <div className="w-full md:w-[280px] p-6 sm:p-8 flex flex-col items-center text-center justify-center border-b md:border-b-0 md:border-r border-white/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent shrink-0">
                      <div className={`relative size-24 rounded-full flex items-center justify-center bg-gradient-to-br ${tier.badgeClass} p-[3px] mb-4 ${tier.unlocked ? tier.shadowClass : 'opacity-30 grayscale'}`}>
                        <div className="w-full h-full rounded-full bg-[#0a0a0c] flex items-center justify-center border-[2px] border-black shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                           <div className={`text-2xl font-black italic tracking-tighter ${tier.unlocked ? tier.textClass : 'text-zinc-600'}`}>
                             {tier.name.split(" ")[0]}
                           </div>
                        </div>
                      </div>
                      <h4 className={`text-xl font-bold uppercase tracking-widest mb-3 ${tier.unlocked ? 'text-white' : 'text-zinc-500'}`}>
                        {tier.name}
                      </h4>
                      <div className="flex items-center justify-center gap-2 text-[11px] font-bold tracking-wider text-muted-foreground bg-black/40 px-3 py-1.5 rounded-md border border-white/5">
                        {!tier.unlocked && <Lock className="size-3" />}
                        {tier.requirements}
                      </div>
                    </div>

                    {/* Right: Specs / Benefits */}
                    <div className="p-6 sm:p-8 flex-1 w-full flex flex-col justify-center">
                      <h5 className="text-[12px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Gauge className="size-3" /> Output Specs
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-4">
                        {tier.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className={`size-4 mt-0.5 shrink-0 ${tier.unlocked ? tier.textClass : 'text-zinc-700'}`} />
                            <span className={`text-[13px] leading-relaxed ${tier.unlocked ? 'text-white/90 font-medium' : 'text-zinc-500'}`}>
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
