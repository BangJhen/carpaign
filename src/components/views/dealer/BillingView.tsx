"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Plus, CreditCard, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopUpModal, type TopUpSuccessPayload } from "@/components/modals/TopUpModal";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.45, 
      delay: i * 0.07, 
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
    },
  }),
};

interface TransactionItem {
  id: number | string;
  type: "payment" | "topup";
  description: string;
  detail: string;
  amount: string;
  date: string;
}

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  { 
    id: 1, 
    type: "payment", 
    description: "Pembayaran Budi Setiawan", 
    detail: "Edit Xpander", 
    amount: "-Rp 350.000", 
    date: "13 Sep 2026" 
  },
  { 
    id: 2, 
    type: "topup", 
    description: "Top-Up Saldo BCA Virtual Account", 
    detail: "ID Transaksi TRX-892102", 
    amount: "+Rp 5.000.000", 
    date: "10 Sep 2026" 
  },
  { 
    id: 3, 
    type: "payment", 
    description: "Pembayaran Rifky Andika", 
    detail: "UGC Brio status menunggu", 
    amount: "-Rp 500.000", 
    date: "8 Sep 2026" 
  },
  { 
    id: 4, 
    type: "topup", 
    description: "Top-Up Saldo Mandiri Virtual Account", 
    detail: "ID Transaksi TRX-719302", 
    amount: "+Rp 5.000.000", 
    date: "1 Sep 2026" 
  },
  { 
    id: 5, 
    type: "payment", 
    description: "Pembayaran Zara Putri", 
    detail: "Cinematic Veloz", 
    amount: "-Rp 1.200.000", 
    date: "28 Agu 2026" 
  },
];

export function BillingView() {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [balance, setBalance] = useState(7950000);
  const [totalTopUp, setTotalTopUp] = useState(10000000);
  const [usedAmount] = useState(2050000);
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);

  const usedPercentage = Math.min(100, Math.round((usedAmount / totalTopUp) * 100));

  const handleTopUpSuccess = (payload: TopUpSuccessPayload) => {
    setBalance((prev) => prev + payload.amount);
    setTotalTopUp((prev) => prev + payload.amount);
    
    const newTx: TransactionItem = {
      id: payload.transactionId,
      type: "topup",
      description: `Top-Up Saldo ${payload.methodName}`,
      detail: `ID Transaksi ${payload.transactionId}`,
      amount: `+Rp ${payload.amount.toLocaleString("id-ID")}`,
      date: payload.date,
    };

    setTransactions((prev) => [newTx, ...prev]);

    toast.success("Deposit Berhasil Ditambahkan", {
      description: `Saldo sebesar Rp ${payload.amount.toLocaleString("id-ID")} telah aktif dan siap dialokasikan ke kampanye.`,
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-[840px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Keuangan Dealer
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Billing dan Deposit
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola saldo deposit operasional dan pantau riwayat pembayaran kampanye kreator.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setIsTopUpOpen(true)}
            className="h-9 px-4 rounded-xl gap-2 bg-white text-black hover:bg-white/90 text-xs font-semibold shadow-sm transition-all shrink-0"
          >
            <Plus className="size-4" />
            <span>Top-Up Saldo</span>
          </Button>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <Card className="border-white/10 bg-[#0f1114] overflow-hidden rounded-2xl shadow-lg">
          <div className="p-7 pb-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Saldo Deposit Aktif
              </p>
              <span className="text-[11px] font-mono text-muted-foreground">
                ID Akun DEALER-092
              </span>
            </div>

            <p className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white mt-2">
              Rp {balance.toLocaleString("id-ID")}
            </p>

            <p className="text-[12px] text-muted-foreground mt-2">
              Rp {usedAmount.toLocaleString("id-ID")} terpakai dari total akumulasi deposit Rp {totalTopUp.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Progress bar */}
          <div className="px-7 pb-6">
            <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${usedPercentage}%` }}
              />
            </div>
          </div>

          {/* Balance Metrics Breakdown */}
          <div className="border-t border-white/5 grid grid-cols-3 divide-x divide-white/5 bg-white/[0.01]">
            <div className="px-5 py-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Terpakai
              </p>
              <p className="text-[13px] font-semibold font-mono text-white">
                Rp {usedAmount.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Transaksi Dibayarkan
              </p>
              <p className="text-[13px] font-semibold text-white">
                {transactions.filter((t) => t.type === "payment").length} transaksi
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Menunggu Review
              </p>
              <p className="text-[13px] font-semibold font-mono text-white">
                Rp 500.000
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Transaction History */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
        <Card className="bg-[#0f1114] border-white/10 overflow-hidden rounded-2xl shadow-lg">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-white">Riwayat Transaksi</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Mutasi saldo masuk dan pengeluaran kampanye
              </p>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              {transactions.length} riwayat
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="size-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10"
                >
                  {tx.type === "topup" ? (
                    <ArrowDownLeft className="size-3.5 text-white" />
                  ) : (
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">
                    {tx.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {tx.detail}, {tx.date}
                  </p>
                </div>

                <p
                  className={`text-[13px] font-mono font-semibold flex-shrink-0 ${
                    tx.type === "topup" ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top-Up Payment Modal */}
      <TopUpModal
        open={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={handleTopUpSuccess}
      />
    </div>
  );
}
