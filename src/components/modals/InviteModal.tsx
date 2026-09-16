"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, Zap, Users2, Gift } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REFERRAL_LINK = "https://carpaign.id/join?ref=REZAA7";

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_LINK).catch(() => {});
    setCopied(true);
    toast.success("Link referral disalin!", {
      description: "Bagikan ke kreator otomotif lainnya dan raih bonus!",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111316] border border-[#D4AF37]/20 text-foreground max-w-[90vw] sm:max-w-[440px] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Subtle gold glow at top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        <div className="absolute top-0 left-[20%] right-[20%] h-[60px] bg-[#D4AF37]/5 blur-2xl pointer-events-none" />

        <DialogHeader className="text-center items-center pt-2">
          {/* Icon */}
          <div className="relative flex items-center justify-center size-16 rounded-2xl bg-[#1A1C20] border border-[#D4AF37]/20 mb-2 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <Zap className="size-7 text-[#D4AF37] fill-[#D4AF37]/20" />
          </div>
          <DialogTitle className="text-xl font-black text-white">
            Undang Teman Kreator
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-[320px]">
            Ajak kreator otomotif bergabung. Setiap teman aktif yang mendaftar, Anda mendapat{" "}
            <span className="text-[#D4AF37] font-bold">Rp50.000 bonus</span> otomatis ke saldo.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-2">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1A1C20] rounded-xl p-4 border border-white/5 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Users2 className="size-4 text-[#D4AF37]" />
                <p className="text-2xl font-black text-white">3</p>
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold">Teman Bergabung</p>
            </div>
            <div className="bg-[#1A1C20] rounded-xl p-4 border border-white/5 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Gift className="size-4 text-emerald-400" />
                <p className="text-2xl font-black text-emerald-400">150k</p>
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold">Bonus Diterima</p>
            </div>
          </div>

          {/* Link copy */}
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Link Referral Kamu
            </p>
            <div className="flex items-center bg-[#0D0F12] rounded-xl border border-white/8 overflow-hidden w-full min-w-0">
              <span className="text-[13px] text-white/50 font-mono pl-4 pr-2 truncate flex-1 min-w-0 py-3">
                {REFERRAL_LINK}
              </span>
              <Button
                size="sm"
                onClick={handleCopy}
                className={`rounded-none rounded-l-md rounded-r-xl h-11 px-5 font-bold text-[13px] shrink-0 transition-all duration-300 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-[#D4AF37] text-black hover:bg-[#c4a030]"
                }`}
              >
                {copied ? (
                  <span className="flex items-center gap-1.5"><Check className="size-4" /> Disalin!</span>
                ) : (
                  <span className="flex items-center gap-1.5"><Copy className="size-4" /> Salin</span>
                )}
              </Button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Bagikan Via
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-white/10 bg-white/3 hover:bg-white/8 text-foreground rounded-xl h-11 gap-2 font-semibold"
                onClick={() => window.open(`https://wa.me/?text=Cuan%20konten%20otomotif%20bareng%20Carpaign!%20${REFERRAL_LINK}`, "_blank")}
              >
                <Share2 className="size-4 text-green-400" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="border-white/10 bg-white/3 hover:bg-white/8 text-foreground rounded-xl h-11 gap-2 font-semibold"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Cuan%20konten%20otomotif%20bareng%20Carpaign!&url=${REFERRAL_LINK}`, "_blank")}
              >
                <Share2 className="size-4 text-sky-400" />
                Twitter atau X
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
