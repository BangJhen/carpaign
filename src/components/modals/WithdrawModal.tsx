"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Power, CreditCard, ChevronDown, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BANKS = [
  { id: "bca", name: "Bank BCA", logo: "BCA" },
  { id: "bni", name: "Bank BNI", logo: "BNI" },
  { id: "mandiri", name: "Bank Mandiri", logo: "MDR" },
  { id: "bri", name: "Bank BRI", logo: "BRI" },
];

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [bankOpen, setBankOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const BALANCE = 8450000;

  const formatRupiah = (val: string) => {
    const num = val.replace(/\D/g, "");
    return num ? parseInt(num).toLocaleString("id-ID") : "";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").replace(/^0+/, "");
    setAmount(raw ? parseInt(raw).toLocaleString("id-ID") : "");
  };

  const numericAmount = parseInt(amount.replace(/\./g, "") || "0");

  const handleWithdraw = async () => {
    if (!numericAmount || numericAmount < 50000) {
      toast.error("Minimal penarikan Rp50.000");
      return;
    }
    if (numericAmount > BALANCE) {
      toast.error("Nominal melebihi saldo tersedia!");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsLoading(false);
    setSuccess(true);
    toast.success("Penarikan dana berhasil diproses!", {
      description: `Rp${amount} akan tiba dalam 1 hari kerja ke ${selectedBank.name}.`,
    });
    setTimeout(() => {
      setSuccess(false);
      setAmount("");
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111316] border border-white/10 text-foreground max-w-md rounded-2xl shadow-2xl p-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <DialogHeader className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-center size-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Power className="size-6 text-[#D4AF37]" />
          </div>
          <DialogTitle className="text-center text-xl font-black text-white">
            Tarik Dana
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Saldo tersedia:{" "}
            <span className="text-[#D4AF37] font-bold">
              Rp{BALANCE.toLocaleString("id-ID")}
            </span>
          </p>
        </DialogHeader>

        <div className="px-8 pb-8 flex flex-col gap-5">
          {/* Bank Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Bank Tujuan
            </label>
            <div className="relative">
              <button
                onClick={() => setBankOpen(!bankOpen)}
                className="w-full flex items-center justify-between gap-3 bg-[#1A1C20] border border-white/10 rounded-xl px-4 h-12 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[10px] font-black text-[#D4AF37]">
                    {selectedBank.logo}
                  </div>
                  <span className="text-sm font-semibold text-white">{selectedBank.name}</span>
                </div>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform ${bankOpen ? "rotate-180" : ""}`} />
              </button>
              {bankOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#1A1C20] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl">
                  {BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => { setSelectedBank(bank); setBankOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="size-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[10px] font-black text-[#D4AF37]">
                        {bank.logo}
                      </div>
                      <span className="text-sm font-medium text-white">{bank.name}</span>
                      {selectedBank.id === bank.id && <Check className="size-4 text-[#D4AF37] ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Nomor Rekening
            </label>
            <div className="flex items-center gap-3 bg-[#1A1C20] border border-white/10 rounded-xl px-4 h-12">
              <CreditCard className="size-4 text-muted-foreground" />
              <span className="text-sm font-mono text-white/70">1234 5678 9012 3456</span>
              <span className="ml-auto text-xs text-[#D4AF37] font-bold">Verified</span>
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Jumlah Penarikan
            </label>
            <div className="flex items-center gap-2 bg-[#1A1C20] border border-white/10 rounded-xl px-4 h-12 focus-within:border-[#D4AF37]/50 transition-colors">
              <span className="text-sm font-bold text-muted-foreground">Rp</span>
              <input
                type="text"
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
                className="flex-1 bg-transparent text-white font-bold text-lg outline-none"
              />
            </div>
            <div className="flex gap-2">
              {[500000, 1000000, 2500000, 5000000].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v.toLocaleString("id-ID"))}
                  className="flex-1 text-[10px] font-bold bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5 rounded-lg py-1.5 transition-colors"
                >
                  {v >= 1000000 ? `${v / 1000000}Jt` : `${v / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleWithdraw}
            disabled={isLoading || success}
            className={`h-12 w-full rounded-xl font-black text-[15px] transition-all ${
              success
                ? "bg-emerald-500 text-white"
                : "bg-gradient-to-r from-[#D4AF37] to-[#b39023] text-black hover:opacity-90 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            }`}
          >
            {isLoading ? (
              <><Loader2 className="size-4 mr-2 animate-spin" /> Memproses...</>
            ) : success ? (
              <><Check className="size-4 mr-2" /> Berhasil!</>
            ) : (
              <><Power className="size-4 mr-2" /> Konfirmasi Tarik Dana</>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Pencairan membutuhkan 1 hari kerja. Minimal penarikan Rp50.000
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
