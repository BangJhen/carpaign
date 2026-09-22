"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Clock, Wallet, FileText, CheckCircle2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  dealer: string;
  location: string;
  vehicle: string;
  type: string;
  payment: string;
  deadline: string;
  brief: string;
  requirements: string[];
}

interface ApplyJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

export function ApplyJobModal({ open, onOpenChange, job }: ApplyJobModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) return null;

  const handleApply = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setApplied(true);
    toast.success("Pengajuan berhasil dikirim!", {
      description: `Dealer ${job.dealer} akan memverifikasi dalam 1x24 jam.`,
    });
    setTimeout(() => {
      setApplied(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isLoading) onOpenChange(v); }}>
      <DialogContent className="bg-[#111316] border border-white/10 text-foreground max-w-lg rounded-2xl shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Header */}
        <DialogHeader className="px-6 pt-7 pb-4 shrink-0">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <Car className="size-6 text-[#D4AF37]" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-black text-white leading-tight">
                {job.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10 text-[10px] font-bold uppercase">
                  {job.type}
                </Badge>
                <span className="text-sm text-muted-foreground font-medium">{job.dealer}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-6 flex flex-col gap-4">
          {/* Key Info Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#1A1C20] rounded-xl p-3 border border-white/5 text-center">
              <Wallet className="size-4 text-[#D4AF37] mx-auto mb-1" />
              <p className="text-sm font-black text-white">{job.payment}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">Bayaran</p>
            </div>
            <div className="bg-[#1A1C20] rounded-xl p-3 border border-white/5 text-center">
              <Clock className="size-4 text-blue-400 mx-auto mb-1" />
              <p className="text-sm font-black text-white">{job.deadline}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">Deadline</p>
            </div>
            <div className="bg-[#1A1C20] rounded-xl p-3 border border-white/5 text-center">
              <MapPin className="size-4 text-[#D4AF37] mx-auto mb-1" />
              <p className="text-sm font-black text-white truncate">{job.location}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">Lokasi</p>
            </div>
          </div>

          {/* Vehicle */}
          <div className="bg-[#1A1C20] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Car className="size-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unit Kendaraan</span>
            </div>
            <p className="text-base font-bold text-white">{job.vehicle}</p>
          </div>

          {/* Brief */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Brief Campaign</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed bg-[#1A1C20] rounded-xl p-4 border border-white/5">
              {job.brief}
            </p>
          </div>

          {/* Requirements */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Persyaratan</span>
            </div>
            <div className="flex flex-col gap-2">
              {job.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <span className="text-sm text-white/80">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <Button
            onClick={handleApply}
            disabled={isLoading || applied}
            className={`h-12 w-full rounded-xl font-black text-[15px] mt-2 transition-all ${
              applied
                ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                : "bg-gradient-to-r from-[#D4AF37] to-[#b39023] text-black hover:opacity-90 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            }`}
          >
            {isLoading ? (
              <><Loader2 className="size-4 mr-2 animate-spin" /> Mengirim Pengajuan...</>
            ) : applied ? (
              <><CheckCircle2 className="size-4 mr-2" /> Pengajuan Terkirim!</>
            ) : (
              "Ambil Job Ini"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
