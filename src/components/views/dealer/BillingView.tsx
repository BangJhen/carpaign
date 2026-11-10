"use client";

import { useState, useTransition } from "react";
import { addDemoCredit } from "@/app/actions/demoFinance";
import { toast } from "sonner";

type Entry = {
  id: string;
  kind: "credit" | "reserve" | "refund";
  amount: number;
  campaignTitle: string | null;
  createdAt: string;
};

type Payment = {
  orderId: string;
  amount: number;
  status: string;
  campaignTitle: string;
  createdAt: string;
};

export function BillingView({ available, reserved, entries, payments, demoEnabled }: {
  available: number;
  reserved: number;
  entries: Entry[];
  payments: Payment[];
  demoEnabled: boolean;
}) {
  const [amount, setAmount] = useState(2_500_000);
  const [pending, startTransition] = useTransition();
  const rupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
  const labels = { credit: "Kredit simulasi", reserve: "Dana dicadangkan", refund: "Dana dikembalikan" };

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-20 text-white">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Keuangan kampanye</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
          Pembayaran melalui Midtrans dan kredit uji dicatat secara terpisah. Kredit uji di bawah ini bukan uang sungguhan.
        </p>
      </header>

      <section aria-labelledby="midtrans-title">
        <h2 id="midtrans-title" className="mb-5 text-lg font-semibold">Pembayaran Midtrans</h2>
        {payments.length === 0 ? <p className="text-sm text-white/50">Belum ada transaksi Midtrans.</p> : (
          <div className="divide-y divide-white/10 border-y border-white/10">
            {payments.map((payment) => (
              <div key={payment.orderId} className="flex items-center justify-between gap-4 py-4 text-sm">
                <div>
                  <p className="font-medium">{payment.campaignTitle}</p>
                  <p className="mt-1 text-xs text-white/45">{payment.orderId} · {payment.createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="tabular-nums">{rupiah(payment.amount)}</p>
                  <p className="mt-1 text-xs text-white/50">{payment.status === "settlement" || payment.status === "capture" ? "Pembayaran terverifikasi" : payment.status === "pending" || payment.status === "initiating" ? "Menunggu pembayaran" : "Status: " + payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <h2 className="text-lg font-semibold">Kredit uji</h2>
      <div className="grid gap-6 border-y border-white/15 py-8 sm:grid-cols-2">
        <div>
          <p className="text-sm text-white/50">Kredit uji tersedia</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums">{rupiah(available)}</p>
        </div>
        <div>
          <p className="text-sm text-white/50">Kredit uji dicadangkan</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums">{rupiah(reserved)}</p>
        </div>
      </div>

      {demoEnabled ? (
        <section aria-labelledby="demo-credit-title" className="space-y-4">
          <h2 id="demo-credit-title" className="text-lg font-semibold">Tambahkan kredit uji</h2>
          <p className="text-sm text-white/55">Kredit hanya untuk menguji alur aktivasi kampanye. Tidak ada transfer bank atau QRIS.</p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="demo-amount">Nominal kredit uji</label>
            <select id="demo-amount" value={amount} onChange={(event) => setAmount(Number(event.target.value))}
              className="rounded-md border border-white/15 bg-[#1A1D20] px-4 py-3 text-sm text-white">
              {[500_000, 2_500_000, 5_000_000, 10_000_000].map((value) => (
                <option key={value} value={value}>{rupiah(value)}</option>
              ))}
            </select>
            <button type="button" disabled={pending}
              onClick={() => startTransition(async () => {
                try {
                  await addDemoCredit(amount);
                  toast.success("Kredit uji tercatat.");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Gagal mencatat kredit uji.");
                }
              })}
              className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">
              {pending ? "Mencatat..." : "Tambahkan kredit uji"}
            </button>
          </div>
        </section>
      ) : (
        <p className="border-y border-white/10 py-5 text-sm text-white/55">
          Kredit uji dinonaktifkan di lingkungan ini.
        </p>
      )}

      <section aria-labelledby="ledger-title">
        <h2 id="ledger-title" className="mb-5 text-lg font-semibold">Riwayat kredit uji</h2>
        {entries.length === 0 ? <p className="text-sm text-white/50">Belum ada pencatatan dana.</p> : (
          <div className="divide-y divide-white/10 border-y border-white/10">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-4 py-4 text-sm">
                <div>
                  <p className="font-medium">{labels[entry.kind]}</p>
                  <p className="mt-1 text-xs text-white/45">{entry.campaignTitle ?? "Akun dealer"} · {entry.createdAt}</p>
                </div>
                <p className="shrink-0 tabular-nums">{entry.kind === "reserve" ? "−" : "+"}{rupiah(entry.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
