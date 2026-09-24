"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  CircleDollarSign,
  CheckCircle2,
  Check,
  FileText,
  Wrench,
  Car,
  Loader2,
  Share2,
  ExternalLink,
} from "lucide-react";
import { type Campaign } from "@/lib/campaigns-data";
import { formatCampaignType } from "@/lib/utils";
import { toast } from "sonner";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

interface JobDetailViewProps {
  campaign: Campaign;
}

export function JobDetailView({ campaign }: JobDetailViewProps) {
  const router = useRouter();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setApplying(false);
    setApplied(true);
    toast.success("Pengajuan berhasil dikirim!", {
      description: `${campaign.brand} akan memverifikasi dalam 1x24 jam.`,
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/campaigns/${campaign.id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    toast.success("Link job disalin!", { description: "Bagikan ke rekan kreator lainnya." });
  };

  return (
    <div className="max-w-[1100px] mx-auto w-full pb-20 flex flex-col gap-8">

      {/* Back + Actions */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-[14px] font-semibold group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Campaigns
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="border-white/10 bg-transparent hover:bg-white/5 text-muted-foreground gap-2 rounded-xl"
        >
          <Share2 className="size-4" />
          Bagikan
        </Button>
      </motion.div>

      {/* Hero Banner */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <div className="relative w-full h-[360px] rounded-2xl overflow-hidden">
          <img
            src={campaign.image}
            alt={campaign.vehicle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div>
              <Badge className={`text-[10px] font-black tracking-widest px-3 py-1 border mb-4 ${campaign.typeColor}`}>
                {formatCampaignType(campaign.type)}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {campaign.vehicle}
              </h1>
              <p className="text-base text-white/70 font-medium mt-1">{campaign.brand}</p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="size-5 text-[#D4AF37]" />
                <span className="text-2xl font-black text-[#D4AF37]">{campaign.reward}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-white/60 font-medium">
                <Users className="size-3.5" />
                {campaign.quota}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Body */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left: Brief & Requirements */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">

          {/* Key Info Chips */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campaign.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka lokasi di Google Maps"
                className="flex items-center gap-2 bg-[#111316] border border-white/5 hover:border-primary/40 rounded-xl px-4 py-2.5 transition-colors group cursor-pointer"
              >
                <MapPin className="size-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="text-[13px] font-semibold text-white group-hover:text-primary transition-colors">{campaign.location}</span>
                <ExternalLink className="size-3 text-white/30 group-hover:text-primary transition-colors" />
              </a>
              <div className="flex items-center gap-2 bg-[#111316] border border-white/5 rounded-xl px-4 py-2.5">
                <Clock className="size-4 text-[#D4AF37]" />
                <span className="text-[13px] font-semibold text-white">Deadline: {campaign.deadline}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#111316] border border-primary/20 rounded-xl px-4 py-2.5">
                <span className="text-[13px] font-semibold text-white/70">Sisa Kuota Budget:</span>
                <span className="text-[13px] font-bold text-primary">85% Tersedia</span>
              </div>
              {campaign.tags.map((tag) => (
                <div key={tag} className="flex items-center gap-2 bg-[#111316] border border-white/5 rounded-xl px-4 py-2.5">
                  <span className="text-[13px] font-semibold text-muted-foreground">{tag}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Campaign Brief */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
            <Card className="bg-[#111316] border-white/5 rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <h2 className="flex items-center gap-2 text-base font-black text-white mb-4 uppercase tracking-wider">
                  <FileText className="size-5 text-[#D4AF37]" /> Brief Campaign
                </h2>
                <p className="text-[14px] sm:text-[15px] text-white/80 leading-relaxed">
                  {campaign.brief}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Technical Specs */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={4}>
            <Card className="bg-[#111316] border-white/5 rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <h2 className="flex items-center gap-2 text-base font-black text-white mb-5 uppercase tracking-wider">
                  <Wrench className="size-5 text-[#D4AF37]" /> Spesifikasi Teknis
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {campaign.specs.map((spec) => (
                    <div key={spec.label} className="flex flex-col gap-1 bg-[#1A1C20] rounded-xl p-4 border border-white/5">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{spec.label}</span>
                      <span className="text-[14px] font-bold text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Requirements */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5}>
            <Card className="bg-[#111316] border-white/5 rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <h2 className="flex items-center gap-2 text-base font-black text-white mb-5 uppercase tracking-wider">
                  <CheckCircle2 className="size-5 text-[#D4AF37]" /> Persyaratan
                </h2>
                <div className="flex flex-col gap-3">
                  {campaign.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="size-5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-3 text-[#D4AF37]" />
                      </div>
                      <span className="text-[14px] text-white/80 leading-relaxed">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right: Actions & Requirements */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2} className="w-full lg:w-[320px] shrink-0">
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            <Card className="bg-[#111316] border-[#D4AF37]/20 rounded-2xl overflow-hidden relative shadow-[0_0_40px_rgba(212,175,55,0.07)]">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <CardContent className="p-6 flex flex-col gap-5">
                {/* Dealer Info */}
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                    <Car className="size-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Dealer dan Brand</p>
                    <p className="text-[15px] font-bold text-white leading-tight">{campaign.brand}</p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5" />

                {/* Reward breakdown */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-muted-foreground font-semibold">Bayaran</span>
                    <span className="text-[15px] font-black text-[#D4AF37]">{campaign.reward}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-muted-foreground font-semibold">Deadline</span>
                    <span className="text-[14px] font-bold text-white">{campaign.deadline}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-muted-foreground font-semibold">Kuota</span>
                    <span className="text-[14px] font-bold text-white">{campaign.quota}</span>
                  </div>
                  
                  {/* Sisa Budget Percentage */}
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-white/50 font-medium">Sisa Kuota Budget</span>
                      <span className="font-bold text-primary text-xs">85% Tersedia</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#D4AF37]/80 to-[#D4AF37] rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5" />

                {/* Apply Button */}
                <Button
                  onClick={handleApply}
                  disabled={applying || applied}
                  className={`w-full h-12 rounded-xl font-black text-[15px] transition-all shadow-lg ${
                    applied
                      ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                      : "bg-gradient-to-r from-[#D4AF37] to-[#b39023] text-black hover:opacity-90 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  }`}
                >
                  {applying ? (
                    <><Loader2 className="size-4 mr-2 animate-spin" /> Mengirim...</>
                  ) : applied ? (
                    <><CheckCircle2 className="size-4 mr-2" /> Pengajuan Terkirim!</>
                  ) : (
                    "Ambil Job Ini"
                  )}
                </Button>

                {!applied && (
                  <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
                    Dengan mengambil job, Anda menyetujui syarat dan ketentuan Carpaign serta NDA dari {campaign.brand}.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
