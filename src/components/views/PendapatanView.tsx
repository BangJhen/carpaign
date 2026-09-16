"use client";

import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, Car, ChevronRight, Power, Activity, Landmark, Search, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState, useMemo } from "react";
import { WithdrawModal } from "@/components/modals/WithdrawModal";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const initialTransactions = [
  {
    id: "TRX-8273",
    vehicle: "Toyota Alphard Executive Lounge",
    type: "Review UGC",
    dealer: "Auto2000 Sudirman",
    amount: "+ Rp2.500.000",
    rawAmount: 2500000,
    status: "Selesai",
    date: "28 Agu 2026",
    isPositive: true,
  },
  {
    id: "TRX-8272",
    vehicle: "Hyundai Ioniq 5 Signature",
    type: "Test Drive Footage",
    dealer: "Hyundai Motors ID",
    amount: "+ Rp1.200.000",
    rawAmount: 1200000,
    status: "Selesai",
    date: "24 Agu 2026",
    isPositive: true,
  },
  {
    id: "TRX-8271",
    vehicle: "Penarikan Dana ke Rekening Bank",
    type: "Transfer ke BCA",
    dealer: "Admin Carpaign",
    amount: "- Rp3.500.000",
    rawAmount: -3500000,
    status: "Berhasil",
    date: "20 Agu 2026",
    isPositive: false,
  },
  {
    id: "TRX-8270",
    vehicle: "BMW 330i M Sport",
    type: "Short Hooks (10 Video)",
    dealer: "BMW Tunas",
    amount: "+ Rp500.000",
    rawAmount: 500000,
    status: "Selesai",
    date: "15 Agu 2026",
    isPositive: true,
  },
  {
    id: "TRX-8269",
    vehicle: "Honda CR-V e:HEV Cinematic",
    type: "Review UGC",
    dealer: "Honda Megatama",
    amount: "+ Rp1.800.000",
    rawAmount: 1800000,
    status: "Selesai",
    date: "10 Agu 2026",
    isPositive: true,
  },
  {
    id: "TRX-8268",
    vehicle: "Penarikan Dana ke Rekening Bank",
    type: "Transfer ke BCA",
    dealer: "Admin Carpaign",
    amount: "- Rp2.000.000",
    rawAmount: -2000000,
    status: "Berhasil",
    date: "05 Agu 2026",
    isPositive: false,
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
  const [balance, setBalance] = useState(8450000);
  const [trxFilter, setTrxFilter] = useState<"all" | "in" | "out">("all");
  const [showAllModal, setShowAllModal] = useState(false);
  const [searchTrx, setSearchTrx] = useState("");
  const [transactionsList, setTransactionsList] = useState(initialTransactions);

  const handleWithdrawSuccess = (amount: number, bankName: string) => {
    setBalance((prev) => Math.max(0, prev - amount));
    const newTrx = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicle: `Penarikan Dana ke ${bankName}`,
      type: `Transfer ke ${bankName}`,
      dealer: "Admin Carpaign",
      amount: `- Rp${amount.toLocaleString("id-ID")}`,
      rawAmount: -amount,
      status: "Diproses",
      date: "Hari ini",
      isPositive: false,
    };
    setTransactionsList((prev) => [newTrx, ...prev]);
  };

  const filteredTransactions = useMemo(() => {
    return transactionsList.filter((trx) => {
      if (trxFilter === "in" && !trx.isPositive) return false;
      if (trxFilter === "out" && trx.isPositive) return false;
      if (searchTrx.trim()) {
        const q = searchTrx.toLowerCase();
        return (
          trx.vehicle.toLowerCase().includes(q) ||
          trx.dealer.toLowerCase().includes(q) ||
          trx.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactionsList, trxFilter, searchTrx]);

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
                      {balance.toLocaleString("id-ID")}
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
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 flex flex-col h-full justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ArrowUpRight className="size-5 text-primary" />
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
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Aktivitas & Transaksi</h2>
            <Button
              variant="link"
              onClick={() => setShowAllModal(true)}
              className="text-muted-foreground hover:text-white text-sm gap-1 px-0"
            >
              Lihat Semua <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 mb-4 bg-[#111316] p-1 rounded-xl border border-white/5 w-fit">
            <button
              onClick={() => setTrxFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                trxFilter === "all"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setTrxFilter("in")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                trxFilter === "in"
                  ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Reward Masuk
            </button>
            <button
              onClick={() => setTrxFilter("out")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                trxFilter === "out"
                  ? "bg-rose-500/20 text-rose-400 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Penarikan
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {filteredTransactions.slice(0, 4).map((trx, i) => (
              <motion.div key={trx.id} initial="hidden" animate="show" variants={fadeUp} custom={4 + i}>
                <Card className="bg-[#111316] hover:bg-[#15171A] border-white/5 transition-colors overflow-hidden group">
                  <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                    
                    {/* Icon based on type */}
                    <div className={`shrink-0 size-10 sm:size-12 rounded-full flex items-center justify-center ${trx.isPositive ? 'bg-[#D4AF37]/10' : 'bg-white/5 border border-white/10'}`}>
                      {trx.isPositive ? (
                        <Car className="size-4 sm:size-5 text-[#D4AF37]" />
                      ) : (
                        <Landmark className="size-4 sm:size-5 text-white/80" />
                      )}
                    </div>

                    {/* Details & Amount in compact layout */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-[14px] sm:text-[15px] font-bold text-foreground truncate">{trx.vehicle}</h4>
                        <span className={`shrink-0 text-[14px] sm:text-[15px] font-bold tracking-tight ${trx.isPositive ? 'text-[#D4AF37]' : 'text-muted-foreground'}`}>
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

            {filteredTransactions.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-xs text-muted-foreground">Tidak ada transaksi pada filter ini.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal Lihat Semua Transaksi */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="bg-[#111316] border border-white/10 text-foreground max-w-2xl rounded-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-white">Riwayat Seluruh Transaksi</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi, mobil, atau dealer..."
                value={searchTrx}
                onChange={(e) => setSearchTrx(e.target.value)}
                className="pl-9 bg-[#1A1C20] border-white/10 text-xs text-white rounded-xl h-10 w-full"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1C20] p-1 rounded-xl border border-white/5 shrink-0">
              <button
                onClick={() => setTrxFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${trxFilter === "all" ? "bg-white/10 text-white" : "text-muted-foreground"}`}
              >
                Semua
              </button>
              <button
                onClick={() => setTrxFilter("in")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${trxFilter === "in" ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground"}`}
              >
                Masuk
              </button>
              <button
                onClick={() => setTrxFilter("out")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${trxFilter === "out" ? "bg-rose-500/20 text-rose-400" : "text-muted-foreground"}`}
              >
                Penarikan
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredTransactions.map((trx) => (
              <div
                key={trx.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1C20] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${trx.isPositive ? 'bg-[#D4AF37]/10' : 'bg-white/5'}`}>
                    {trx.isPositive ? <Car className="size-4 text-[#D4AF37]" /> : <Landmark className="size-4 text-white/80" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{trx.vehicle}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{trx.dealer}</span>
                      <span>•</span>
                      <span>{trx.date}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${trx.isPositive ? 'text-[#D4AF37]' : 'text-white'}`}>
                    {trx.amount}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{trx.status}</p>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-xs">
                Tidak ada riwayat transaksi yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
      <WithdrawModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        currentBalance={balance}
        onSuccess={handleWithdrawSuccess}
      />
    </>
  );
}
