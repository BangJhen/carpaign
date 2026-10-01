"use client";

import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Wallet,
  ArrowUpRight,
  Clock,
  Car,
  ChevronRight,
  Activity,
  Landmark,
  Search,
  ArrowDownLeft,
  CheckCircle2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { WithdrawModal } from "@/components/modals/WithdrawModal";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
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
  { month: "Jan", amount: 3200000 },
  { month: "Feb", amount: 4100000 },
  { month: "Mar", amount: 2800000 },
  { month: "Apr", amount: 5600000 },
  { month: "Mei", amount: 4900000 },
  { month: "Jun", amount: 7200000 },
  { month: "Jul", amount: 6500000 },
  { month: "Ags", amount: 8450000 },
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
      <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full pb-20 relative">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Saldo Tersedia (Span 2) */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="lg:col-span-2">
            <Card className="relative overflow-hidden rounded-2xl border-white/10 bg-[#111316] h-full shadow-none">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="size-4 text-primary" />
                      <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
                        Saldo Tersedia
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg sm:text-xl font-bold text-primary">Rp</span>
                      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                        {balance.toLocaleString("id-ID")}
                      </h1>
                    </div>
                  </div>

                  <Button
                    onClick={() => setWithdrawOpen(true)}
                    className="bg-primary text-black hover:bg-primary/90 font-bold rounded-xl h-11 px-5 text-xs sm:text-sm gap-2 shrink-0 cursor-pointer shadow-none"
                  >
                    <ArrowDownLeft className="size-4" />
                    Tarik Saldo
                  </Button>
                </div>

                {/* Sub Metrics Row */}
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/5">
                  <div>
                    <p className="text-[11px] text-white/40 uppercase font-semibold mb-0.5">Estimasi Bulan Ini</p>
                    <p className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                      Rp12.000.000
                      <ArrowUpRight className="size-4 text-primary" />
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40 uppercase font-semibold mb-0.5">Total Pendapatan</p>
                    <p className="text-base sm:text-lg font-bold text-white">Rp45.750.000</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Pemasukan Tertunda (Span 1) */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1} className="lg:col-span-1">
            <Card className="bg-[#111316] border-white/10 rounded-2xl h-full shadow-none">
              <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-primary" />
                    <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
                      Pemasukan Tertunda
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Rp2.150.000
                  </p>
                </div>

                <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5 flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-white/70 leading-relaxed">
                    Dana akan masuk ke saldo setelah video lolos review dealer (estimasi 1x24 jam).
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts & Transaction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Analitik Chart (Col Span 7) */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2} className="lg:col-span-7 flex flex-col">
            <Card className="bg-[#111316] border-white/10 rounded-2xl p-5 sm:p-7 h-full flex flex-col shadow-none">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-primary" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Analitik Pendapatan
                  </h2>
                </div>
                <span className="text-xs text-white/40 font-medium">8 Bulan Terakhir</span>
              </div>

              <div className="w-full h-[260px] sm:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                      dy={8}
                    />
                    <YAxis
                      width={55}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                      tickFormatter={(val) => `Rp${val >= 1000000 ? val / 1000000 + "Jt" : val}`}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      contentStyle={{
                        backgroundColor: "#14161a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "var(--primary)", fontWeight: "bold" }}
                      formatter={(value: any) => {
                        const num = Number(value);
                        return [`Rp${num.toLocaleString("id-ID")}`, "Pendapatan"];
                      }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {earningsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === earningsData.length - 1 ? "#eab308" : "rgba(234, 179, 8, 0.25)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Right: Aktivitas & Transaksi (Col Span 5) */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3} className="lg:col-span-5 flex flex-col">
            <Card className="bg-[#111316] border-white/10 rounded-2xl p-5 sm:p-6 h-full flex flex-col shadow-none">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Aktivitas Transaksi
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllModal(true)}
                  className="text-white/60 hover:text-white text-xs gap-1 px-2 h-7 cursor-pointer"
                >
                  Lihat Semua <ChevronRight className="size-3.5" />
                </Button>
              </div>

              {/* Minimal Filter Pills */}
              <div className="flex items-center gap-1.5 mb-3 bg-[#14161a] p-1 rounded-xl border border-white/5 w-fit">
                <button
                  onClick={() => setTrxFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    trxFilter === "all" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setTrxFilter("in")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    trxFilter === "in" ? "bg-primary/20 text-primary" : "text-white/40 hover:text-white"
                  }`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => setTrxFilter("out")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    trxFilter === "out" ? "bg-white/15 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  Tarik
                </button>
              </div>

              {/* Transactions List */}
              <div className="flex flex-col gap-2.5 flex-1">
                {filteredTransactions.slice(0, 4).map((trx) => (
                  <div
                    key={trx.id}
                    className="p-3 rounded-xl bg-[#14161a] border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                          trx.isPositive ? "bg-primary/10 text-primary" : "bg-white/5 text-white/70"
                        }`}
                      >
                        {trx.isPositive ? <Car className="size-4" /> : <Landmark className="size-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-white leading-snug break-words">
                          {trx.vehicle}
                        </p>
                        <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1.5">
                          <span>{trx.dealer}</span>
                          <span>•</span>
                          <span>{trx.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-xs sm:text-sm font-bold ${trx.isPositive ? "text-primary" : "text-white/90"}`}>
                        {trx.amount}
                      </p>
                      <span className="text-[10px] text-white/40 font-medium block mt-0.5">{trx.status}</span>
                    </div>
                  </div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/5 p-6 text-center text-xs text-white/40 my-auto">
                    Tidak ada transaksi pada filter ini.
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Modal Lihat Semua Transaksi */}
        <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
          <DialogContent className="bg-[#111316] border border-white/10 text-foreground max-w-2xl rounded-2xl p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-base font-bold text-white">Riwayat Transaksi</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Cari transaksi atau dealer..."
                  value={searchTrx}
                  onChange={(e) => setSearchTrx(e.target.value)}
                  className="pl-8 bg-[#14161a] border-white/10 text-xs text-white rounded-xl h-9 w-full focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center gap-1 bg-[#14161a] p-1 rounded-xl border border-white/5 shrink-0">
                <button
                  onClick={() => setTrxFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    trxFilter === "all" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setTrxFilter("in")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    trxFilter === "in" ? "bg-primary/20 text-primary" : "text-white/40 hover:text-white"
                  }`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => setTrxFilter("out")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    trxFilter === "out" ? "bg-white/15 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  Tarik
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
              {filteredTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#14161a] border border-white/5 hover:border-white/10 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                        trx.isPositive ? "bg-primary/10 text-primary" : "bg-white/5 text-white/70"
                      }`}
                    >
                      {trx.isPositive ? <Car className="size-3.5" /> : <Landmark className="size-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-white leading-snug break-words">{trx.vehicle}</p>
                      <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1.5">
                        <span>{trx.dealer}</span>
                        <span>•</span>
                        <span>{trx.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-xs sm:text-sm font-bold ${trx.isPositive ? "text-primary" : "text-white"}`}>
                      {trx.amount}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">{trx.status}</p>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-10 text-white/40 text-xs">
                  Tidak ada transaksi yang sesuai.
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
