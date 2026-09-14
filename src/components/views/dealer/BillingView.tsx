"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const transactions = [
  { id: 1, type: "payment", description: "Pembayaran - Budi Setiawan", detail: "Edit Xpander", amount: "-Rp 350.000", date: "13 Sep 2026" },
  { id: 2, type: "topup", description: "Top-Up Saldo", detail: "Transfer bank", amount: "+Rp 5.000.000", date: "10 Sep 2026" },
  { id: 3, type: "payment", description: "Pembayaran - Rifky Andika", detail: "UGC Brio | Menunggu", amount: "-Rp 500.000", date: "8 Sep 2026" },
  { id: 4, type: "topup", description: "Top-Up Saldo", detail: "Transfer bank", amount: "+Rp 5.000.000", date: "1 Sep 2026" },
  { id: 5, type: "payment", description: "Pembayaran - Zara Putri", detail: "Cinematic Veloz", amount: "-Rp 1.200.000", date: "28 Agu 2026" },
];

export function BillingView() {
  return (
    <div className="flex flex-col gap-8 max-w-[800px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">Keuangan</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Billing & Deposit</h1>
        <p className="text-sm text-white/40 mt-1">Kelola saldo dan riwayat pembayaran ke kreator.</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <Card className="border-white/[0.06] bg-[#111316] overflow-hidden">
          <div className="p-7 pb-6">
            <p className="text-[11px] text-white/30 mb-2">Saldo Deposit</p>
            <p className="text-4xl font-bold tracking-tight text-white">Rp 7.950.000</p>
            <p className="text-[12px] text-white/25 mt-2">
              Rp 2.050.000 terpakai dari Rp 10.000.000 total top-up
            </p>
          </div>

          {/* Progress bar */}
          <div className="px-7 pb-6">
            <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-primary/50 w-[79.5%]" />
            </div>
          </div>

          <div className="border-t border-white/[0.06] grid grid-cols-3 divide-x divide-white/[0.06]">
            {[
              { label: "Terpakai", value: "Rp 2,05jt" },
              { label: "Dibayarkan", value: "3 transaksi" },
              { label: "Pending", value: "Rp 500K" },
            ].map((item) => (
              <div key={item.label} className="px-5 py-4">
                <p className="text-[10px] text-white/25 mb-1">{item.label}</p>
                <p className="text-[14px] font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top-Up Button */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
        <Button className="h-10 px-6 gap-2 rounded-lg bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-colors text-[12px] font-semibold">
          <PlusCircle className="size-4" />
          Top-Up Saldo
        </Button>
      </motion.div>

      {/* Transaction History */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
        <Card className="bg-[#111316] border-white/[0.06] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <h2 className="text-[13px] font-semibold text-white">Riwayat Transaksi</h2>
            <p className="text-[11px] text-white/30 mt-0.5">5 transaksi terakhir</p>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors">
                <div
                  className="size-8 rounded-md flex items-center justify-center flex-shrink-0 bg-white/[0.05]"
                >
                  {tx.type === "topup" ? (
                    <ArrowDownLeft className="size-3.5 text-white/50" />
                  ) : (
                    <ArrowUpRight className="size-3.5 text-white/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{tx.description}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{tx.detail} | {tx.date}</p>
                </div>
                <p
                  className="text-[14px] font-semibold flex-shrink-0"
                  style={tx.type === "topup" ? { color: "var(--primary)" } : { color: "rgba(255,255,255,0.6)" }}
                >
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
