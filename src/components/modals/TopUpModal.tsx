"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  Copy, 
  CreditCard, 
  Building2, 
  QrCode, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface TopUpSuccessPayload {
  amount: number;
  methodName: string;
  transactionId: string;
  date: string;
}

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (payload: TopUpSuccessPayload) => void;
}

type PaymentChannel = {
  id: string;
  category: "va" | "qris" | "transfer";
  name: string;
  description: string;
  accountNumber: string;
  accountHolder: string;
};

const PAYMENT_CHANNELS: PaymentChannel[] = [
  {
    id: "bca-va",
    category: "va",
    name: "BCA Virtual Account",
    description: "Verifikasi otomatis 24 jam bebas biaya admin",
    accountNumber: "8271908234190823",
    accountHolder: "PT CARPAIGN MEDIA ASIA",
  },
  {
    id: "mandiri-va",
    category: "va",
    name: "Mandiri Virtual Account",
    description: "Verifikasi otomatis melalui Livin dan ATM",
    accountNumber: "8932001948271038",
    accountHolder: "PT CARPAIGN MEDIA ASIA",
  },
  {
    id: "bri-va",
    category: "va",
    name: "BRI Virtual Account (BRIVA)",
    description: "Verifikasi otomatis melalui BRImo dan ATM",
    accountNumber: "1038294820194821",
    accountHolder: "PT CARPAIGN MEDIA ASIA",
  },
  {
    id: "bni-va",
    category: "va",
    name: "BNI Virtual Account",
    description: "Verifikasi otomatis melalui BNI Mobile Banking",
    accountNumber: "9881029384729103",
    accountHolder: "PT CARPAIGN MEDIA ASIA",
  },
  {
    id: "qris",
    category: "qris",
    name: "QRIS Dinamis",
    description: "Pindai melalui seluruh aplikasi perbankan dan dompet digital",
    accountNumber: "NMID: ID1024391029384",
    accountHolder: "CARPAIGN OFFICIAL QRIS",
  },
];

const PRESET_AMOUNTS = [
  { label: "Rp 2,5 Juta", value: 2500000 },
  { label: "Rp 5 Juta", value: 5000000 },
  { label: "Rp 10 Juta", value: 10000000 },
  { label: "Rp 25 Juta", value: 25000000 },
];

export function TopUpModal({ open, onClose, onSuccess }: TopUpModalProps) {
  const [step, setStep] = useState<"select" | "instruction">("select");
  const [selectedAmount, setSelectedAmount] = useState<number>(5000000);
  const [customInput, setCustomInput] = useState<string>("5.000.000");
  const [selectedChannelId, setSelectedChannelId] = useState<string>("bca-va");
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep("select");
      setSelectedAmount(5000000);
      setCustomInput("5.000.000");
      setSelectedChannelId("bca-va");
      setIsCopied(false);
      setIsSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const selectedChannel =
    PAYMENT_CHANNELS.find((c) => c.id === selectedChannelId) || PAYMENT_CHANNELS[0];

  const handleSelectPreset = (val: number) => {
    setSelectedAmount(val);
    setCustomInput(val.toLocaleString("id-ID"));
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setCustomInput("");
      setSelectedAmount(0);
      return;
    }
    const num = parseInt(raw, 10);
    setSelectedAmount(num);
    setCustomInput(num.toLocaleString("id-ID"));
  };

  const handleProceedToInstruction = () => {
    if (selectedAmount < 500000) {
      toast.error("Nominal minimal deposit adalah Rp 500.000");
      return;
    }
    setStep("instruction");
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText(selectedChannel.accountNumber);
    setIsCopied(true);
    toast.success("Nomor rekening berhasil disalin");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = `${now.getDate()} Sep ${now.getFullYear()}`;
      onSuccess({
        amount: selectedAmount,
        methodName: selectedChannel.name,
        transactionId: `TRX-${Date.now().toString().slice(-6)}`,
        date: dateStr,
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="w-full max-w-xl bg-[#0f1114] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {step === "select" ? "Top-Up Saldo Deposit" : "Instruksi Pembayaran"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step === "select"
                ? "Pilih nominal dan saluran pembayaran untuk menambah saldo kampanye"
                : `Selesaikan transfer melalui ${selectedChannel.name}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {step === "select" ? (
            <>
              {/* Preset Nominals */}
              <div className="space-y-2.5">
                <label className="text-xs font-medium text-white/90">
                  Pilihan Cepat Nominal Deposit
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_AMOUNTS.map((preset) => {
                    const isSelected = selectedAmount === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleSelectPreset(preset.value)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border text-center ${
                          isSelected
                            ? "bg-white text-black border-white shadow-sm"
                            : "bg-white/[0.02] border-white/10 text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/90">
                  Nominal Lainnya
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    type="text"
                    value={customInput}
                    onChange={handleCustomInputChange}
                    placeholder="Minimal 500.000"
                    className="pl-10 h-10 text-sm font-semibold bg-white/[0.02] border-white/10 focus:border-white/25 rounded-xl text-white"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Minimal top-up Rp 500.000 untuk saldo operasional kampanye dealer.
                </p>
              </div>

              {/* Payment Channel Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-medium text-white/90">
                  Pilih Saluran Pembayaran
                </label>
                <div className="space-y-2">
                  {PAYMENT_CHANNELS.map((channel) => {
                    const isSelected = selectedChannelId === channel.id;
                    return (
                      <div
                        key={channel.id}
                        onClick={() => setSelectedChannelId(channel.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-white/[0.04] border-white/20 shadow-sm"
                            : "bg-white/[0.015] border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                            {channel.category === "va" ? (
                              <Building2 className="size-4" />
                            ) : (
                              <QrCode className="size-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white leading-snug">
                              {channel.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {channel.description}
                            </p>
                          </div>
                        </div>

                        <div className="size-4 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                          {isSelected && <div className="size-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Box */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Nominal Deposit</span>
                  <span className="font-mono text-white font-medium">
                    Rp {selectedAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Biaya Administrasi</span>
                  <span className="text-white font-medium font-mono">Gratis</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Total Tagihan</span>
                  <span className="text-sm font-bold font-mono text-white">
                    Rp {selectedAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Payment Instruction Screen */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 text-center">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Total Pembayaran
                </p>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  Rp {selectedAmount.toLocaleString("id-ID")}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-muted-foreground">
                  <Clock className="size-3 text-white/60" />
                  <span>Batas waktu pembayaran 24 jam ke depan</span>
                </div>
              </div>

              {/* Account Number Box */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Metode Pembayaran</span>
                  <span className="font-semibold text-white">{selectedChannel.name}</span>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[11px] text-muted-foreground block">
                    {selectedChannel.category === "va"
                      ? "Nomor Virtual Account"
                      : "Kode Identifikasi QRIS"}
                  </span>
                  <div className="flex items-center justify-between gap-3 bg-black/40 p-3 rounded-xl border border-white/10">
                    <span className="text-base sm:text-lg font-mono font-bold tracking-widest text-white select-all">
                      {selectedChannel.accountNumber}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyVA}
                      className="h-8 px-3 text-xs font-medium border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-lg gap-1.5"
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-muted-foreground">Nama Penerima</span>
                  <span className="font-medium text-white text-right">
                    {selectedChannel.accountHolder}
                  </span>
                </div>
              </div>

              {/* Security & Verification note */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-muted-foreground leading-relaxed">
                <ShieldCheck className="size-4 text-white/70 shrink-0 mt-0.5" />
                <span>
                  Sistem mendeteksi transfer secara otomatis dalam 1 menit setelah transaksi berhasil. Tidak perlu mengunggah bukti struk fisik.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-3">
          {step === "select" ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-9 px-4 text-xs font-medium border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleProceedToInstruction}
                className="h-9 px-5 text-xs font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-sm transition-all gap-1.5"
              >
                <span>Lanjut Pembayaran</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep("select")}
                disabled={isSubmitting}
                className="h-9 px-4 text-xs font-medium border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white rounded-xl"
              >
                Ubah Nominal
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleSimulatePayment}
                  className="h-9 px-5 text-xs font-semibold bg-white text-black hover:bg-white/90 rounded-xl shadow-sm transition-all"
                >
                  {isSubmitting ? "Memverifikasi..." : "Konfirmasi Pembayaran Selesai"}
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
