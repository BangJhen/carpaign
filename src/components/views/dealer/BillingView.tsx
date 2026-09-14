"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  TrendingDown,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEALER_ACCENT = "#B87333";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const transactions = [
  {
    id: 1,
    type: "payment",
    description: "Pembayaran — Budi Setiawan (Edit Xpander)",
    amount: "-Rp 350.000",
    date: "13 Sep 2026",
    status: "completed",
  },
  {
    id: 2,
    type: "topup",
    description: "Top-Up Saldo",
    amount: "+Rp 5.000.000",
    date: "10 Sep 2026",
    status: "completed",
  },
  {
    id: 3,
    type: "payment",
    description: "Pembayaran — Rifky Andika (UGC Brio)",
    amount: "-Rp 500.000",
    date: "8 Sep 2026",
    status: "pending",
  },
  {
    id: 4,
    type: "topup",
    description: "Top-Up Saldo",
    amount: "+Rp 5.000.000",
    date: "1 Sep 2026",
    status: "completed",
  },
  {
    id: 5,
    type: "payment",
    description: "Pembayaran — Zara Putri (Cinematic Veloz)",
    amount: "-Rp 1.200.000",
    date: "28 Agu 2026",
    status: "completed",
  },
];

export function BillingView() {
  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
          Keuangan
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Billing & Deposit
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Kelola saldo dan riwayat pembayaran ke kreator.
        </p>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <Card
          className="relative overflow-hidden p-8 border-white/5"
          style={{
            background: `linear-gradient(135deg, #111316 0%, #0D0B08 100%)`,
            borderColor: `${DEALER_ACCENT}20`,
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[80px] opacity-15 pointer-events-none"
            style={{ background: DEALER_ACCENT }}
          />

          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="size-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${DEALER_ACCENT}20`, border: `1px solid ${DEALER_ACCENT}30` }}
                >
                  <Wallet className="size-4" style={{ color: DEALER_ACCENT }} />
                </div>
                <span className="text-[12px] text-white/40 font-medium">Saldo Deposit</span>
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">
                Rp 7.950.000
              </p>
              <p className="text-[12px] text-white/30 mt-2">
                Terpakai Rp 2.050.000 dari Rp 10.000.000 total top-up
              </p>
            </div>

            <Button
              className="h-10 px-6 rounded-lg gap-2 text-[12px] font-bold uppercase tracking-widest flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${DEALER_ACCENT}30, ${DEALER_ACCENT}15)`,
                border: `1px solid ${DEALER_ACCENT}50`,
                color: DEALER_ACCENT,
              }}
            >
              <PlusCircle className="size-4" />
              Top-Up Saldo
            </Button>
          </div>

          {/* Quick stats */}
          <div className="relative mt-6 pt-6 border-t border-white/5 grid grid-cols-3 gap-4">
            {[
              { label: "Total Terpakai", value: "Rp 2,05jt", icon: TrendingDown, color: "#E05C5C" },
              { label: "Kampanye Dibayar", value: "3", icon: CheckCircle2, color: "#6BCB77" },
              { label: "Menunggu Bayar", value: "Rp 500K", icon: Clock, color: "#E8A838" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center gap-1.5 mb-1">
                  <item.icon className="size-3" style={{ color: item.color }} />
                  <p className="text-[10px] text-white/30">{item.label}</p>
                </div>
                <p className="text-[15px] font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Transaction History */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
        <Card className="bg-[#111316] border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-[14px] font-semibold text-white">Riwayat Transaksi</h2>
            <p className="text-[11px] text-white/30 mt-0.5">5 transaksi terakhir</p>
          </div>
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div
                  className="size-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={
                    tx.type === "topup"
                      ? { background: "#6BCB7715", border: "1px solid #6BCB7725" }
                      : { background: `${DEALER_ACCENT}15`, border: `1px solid ${DEALER_ACCENT}25` }
                  }
                >
                  {tx.type === "topup" ? (
                    <ArrowDownLeft className="size-4 text-[#6BCB77]" />
                  ) : (
                    <ArrowUpRight className="size-4" style={{ color: DEALER_ACCENT }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{tx.description}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{tx.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p
                    className="text-[14px] font-bold"
                    style={tx.type === "topup" ? { color: "#6BCB77" } : { color: DEALER_ACCENT }}
                  >
                    {tx.amount}
                  </p>
                  {tx.status === "pending" && (
                    <span className="text-[10px] text-[#E8A838]">Menunggu</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
