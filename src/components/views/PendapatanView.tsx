"use client";

import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Car, ChevronRight, Power, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from "react";
import { WithdrawModal } from "@/components/modals/WithdrawModal";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const transactions = [
  {
    id: "TRX-8273",
    vehicle: "Toyota Alphard Executive Lounge",
    type: "Review UGC",
    dealer: "Auto2000 Sudirman",
    amount: "+ Rp2.500.000",
    status: "Selesai",
    date: "28 Aug 2026",
    isPositive: true,
  },
  {
    id: "TRX-8272",
    vehicle: "Hyundai Ioniq 5 Signature",
    type: "Test Drive Footage",
    dealer: "Hyundai Motors ID",
    amount: "+ Rp1.200.000",
    status: "Selesai",
    date: "24 Aug 2026",
    isPositive: true,
  },
  {
    id: "TRX-8271",
    vehicle: "Penarikan Dana (Withdrawal)",
    type: "Transfer ke BCA",
    dealer: "Admin Carpaign",
    amount: "- Rp3.500.000",
    status: "Berhasil",
    date: "20 Aug 2026",
    isPositive: false,
  },
  {
    id: "TRX-8270",
    vehicle: "BMW 330i M Sport",
    type: "Short Hooks (10 Video)",
    dealer: "BMW Tunas",
    amount: "+ Rp500.000",
    status: "Selesai",
    date: "15 Aug 2026",
    isPositive: true,
  },
];

const earningsData = [
  { month: 'Jan', amount: 3200000 },
  { month: 'Feb', amount: 4100000 },
  { month: 'Mar', amount: 2800000 },
  { month: 'Apr', amount: 5600000 },
  { month: 'Mei', amount: 4900000 },
  { month: 'Jun', amount: 7200000 },
  { month: 'Jul', amount: 6500000 },
  { month: 'Ags', amount: 8450000 },
];

export function PendapatanView() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <>
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20 relative">
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Balance Card (Gold Bank / Engine Start Theme) */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="w-full lg:w-2/3">
          <Card className="relative overflow-hidden rounded-[24px] border-none bg-[#111316] h-full shadow-2xl">
            {/* Background Texture & Glow */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent rotate-[-15deg] pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
            
            <CardContent className="relative z-10 p-8 sm:p-10 h-full flex flex-col justify-between min-h-[320px]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="size-5 text-[#D4AF37]" />
                    <span className="text-[15px] font-semibold text-muted-foreground uppercase tracking-widest">Saldo Tersedia</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-medium text-[#D4AF37]">Rp</span>
                    <h1 className="text-5xl sm:text-[64px] font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 tracking-tight leading-none drop-shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                      8.450.000
                    </h1>
                  </div>
                </div>

                {/* Engine Start / Withdraw Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setWithdrawOpen(true)}
                    className="relative group w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                  >                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#2a2d34] to-[#111316] border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.5)]" />
                    <div className="absolute inset-1.5 rounded-full bg-gradient-to-b from-[#111316] to-[#0a0a0c] border border-black/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center group-hover:border-[#D4AF37]/30 transition-colors">
                      <Power className="size-6 text-[#D4AF37] mb-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] group-hover:text-white transition-colors" />
                      <span className="text-[8px] font-black tracking-widest text-[#D4AF37] group-hover:text-white uppercase">Tarik</span>
                    </div>
                  </button>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tarik Dana</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-8 pt-8 border-t border-white/5">
                <div>
                  <p className="text-[12px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Estimasi Bulan Ini</p>
                  <p className="text-xl font-bold text-white flex items-center gap-2">
                    Rp12.000.000
                    <ArrowUpRight className="size-4 text-emerald-400" />
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Total Pendapatan (All Time)</p>
                  <p className="text-xl font-bold text-white">
                    Rp45.750.000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Secondary Metrics */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1} className="w-full lg:w-1/3 flex flex-col gap-6">
          <Card className="bg-[#111316] border-white/5 rounded-[20px] overflow-hidden relative group">
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex flex-col h-full justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <ArrowUpRight className="size-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Pemasukan Tertunda</h3>
                  <p className="text-[11px] text-muted-foreground">Menunggu konfirmasi dealer</p>
                </div>
              </div>
              <p className="text-3xl font-black text-white">Rp2.150.000</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111316] border-white/5 rounded-[20px] overflow-hidden relative group grow">
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex flex-col h-full justify-center">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Target Tier Berikutnya (Pro)</h3>
              <div className="mb-2 flex justify-between items-center text-[12px] font-bold">
                <span className="text-[#D4AF37]">Rp45.750.000</span>
                <span className="text-muted-foreground">Rp50.000.000</span>
              </div>
              <div className="w-full bg-[#1A1C20] rounded-full h-2 overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37] h-full rounded-full w-[91%] shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                Rp4.250.000 lagi menuju Tier Pro (Potongan platform turun menjadi 5%).
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analitik Pendapatan & Aktivitas Section (Split Layout on Desktop) */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Analitik Chart */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2} className="w-full lg:w-3/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Activity className="size-5 text-[#D4AF37]" /> Analitik Pendapatan
            </h2>
          </div>
          <Card className="bg-[#111316] border-white/5 rounded-[24px] p-6 sm:p-8 grow">
            <h3 className="text-sm font-semibold text-muted-foreground mb-6">Tren Cuan 8 Bulan Terakhir</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                    tickFormatter={(value) => `Rp${value >= 1000000 ? (value / 1000000) + 'Jt' : value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(212,175,55,0.1)' }}
                    contentStyle={{ 
                      backgroundColor: '#1A1C20', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                    formatter={(value: any) => {
                      const num = Number(value);
                      return [`Rp${num.toLocaleString('id-ID')}`, 'Pendapatan'];
                    }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {earningsData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === earningsData.length - 1 ? '#D4AF37' : 'rgba(212,175,55,0.3)'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Right: Automotive Earnings Breakdown (Aktivitas) */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3} className="w-full lg:w-2/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Aktivitas & Transaksi</h2>
            <Button variant="link" className="text-muted-foreground hover:text-white text-sm gap-1 px-0">
              Lihat Semua <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {transactions.map((trx, i) => (
              <motion.div key={trx.id} initial="hidden" animate="show" variants={fadeUp} custom={4 + i}>
                <Card className="bg-[#111316] hover:bg-[#15171A] border-white/5 transition-colors overflow-hidden group">
                  <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                    
                    {/* Icon based on type */}
                    <div className={`shrink-0 size-10 sm:size-12 rounded-full flex items-center justify-center ${trx.isPositive ? 'bg-[#D4AF37]/10' : 'bg-red-500/10'}`}>
                      {trx.isPositive ? (
                        <Car className="size-4 sm:size-5 text-[#D4AF37]" />
                      ) : (
                        <Wallet className="size-4 sm:size-5 text-red-400" />
                      )}
                    </div>

                    {/* Details & Amount in compact layout */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-[14px] sm:text-[15px] font-bold text-foreground truncate">{trx.vehicle}</h4>
                        <span className={`shrink-0 text-[14px] sm:text-[15px] font-bold tracking-tight ${trx.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trx.amount}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-muted-foreground">
                          {trx.isPositive && <span className="font-semibold text-white/80">{trx.dealer}</span>}
                          <span className="flex items-center gap-1"><Clock className="size-3" /> {trx.date}</span>
                        </div>
                        <span className={`text-[10px] sm:text-[11px] font-medium ${trx.status === 'Berhasil' || trx.status === 'Selesai' ? 'text-muted-foreground' : 'text-orange-400'}`}>
                          {trx.status}
                        </span>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </>
  );
}
