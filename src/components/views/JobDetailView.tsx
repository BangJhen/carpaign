"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
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
  Video,
  ShieldCheck,
  Copy,
  FolderOpen,
  Radio,
} from "lucide-react";
import { type Campaign } from "@/lib/campaigns-data";
import { formatCampaignType } from "@/lib/utils";
import { toast } from "sonner";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const stepSlide: Variants = {
  hidden: { opacity: 0, x: 8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface JobDetailViewProps {
  campaign: Campaign;
}

const STEPS = [
  { id: 1, label: "Informasi", icon: FileText },
  { id: 2, label: "Arahan Konten", icon: Video },
  { id: 3, label: "Spesifikasi", icon: Wrench },
  { id: 4, label: "Kriteria & Daftar", icon: ShieldCheck },
];

export function JobDetailView({ campaign }: JobDetailViewProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setApplying(false);
    setApplied(true);
    toast.success("Pengajuan terkirim!", {
      description: `${campaign.brand} akan memverifikasi aplikasi Anda dalam 1x24 jam.`,
    });
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/campaigns/${campaign.id}` : "";
    navigator.clipboard.writeText(url).catch(() => {});
    toast.success("Link berhasil disalin!");
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    toast.success(`${label} disalin ke clipboard!`);
  };

  return (
    <div className="max-w-[1100px] mx-auto w-full pb-20 flex flex-col gap-6">
      {/* Back & Share Actions */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-xs sm:text-sm font-semibold group cursor-pointer"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Campaigns
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="border-white/10 bg-transparent hover:bg-white/5 text-muted-foreground hover:text-white gap-2 rounded-xl text-xs cursor-pointer"
        >
          <Share2 className="size-3.5" />
          Bagikan
        </Button>
      </motion.div>

      {/* Hero Banner Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <div className="relative w-full min-h-[260px] sm:min-h-[300px] rounded-2xl overflow-hidden border border-white/5 bg-[#111316]">
          <img
            src={campaign.image}
            alt={campaign.vehicle}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-transparent to-transparent" />

          <div className="relative z-10 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-20 sm:mt-24">
            <div className="max-w-2xl">
              <Badge className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 border mb-2.5 ${campaign.typeColor}`}>
                {formatCampaignType(campaign.type)}
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight break-words">
                {campaign.vehicle}
              </h1>
              <p className="text-xs sm:text-sm text-white/70 font-medium mt-1 break-words">{campaign.brand}</p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <CircleDollarSign className="size-4 text-primary" />
                <span className="text-lg sm:text-xl font-bold text-primary">{campaign.reward}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
                <Users className="size-3" />
                {campaign.quota}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: 4-Step Brief */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">

          {/* Minimalist 4-Step Tab Navigation */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
            <div className="bg-[#111316] border border-white/10 rounded-2xl p-1.5 sm:p-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {STEPS.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-black font-bold shadow-sm"
                          : isCompleted
                          ? "bg-white/[0.04] text-white hover:bg-white/10"
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span
                        className={`size-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                          isActive
                            ? "bg-black/20 text-black"
                            : isCompleted
                            ? "bg-primary/20 text-primary"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {isCompleted ? <Check className="size-3 stroke-[3]" /> : step.id}
                      </span>
                      <span className="whitespace-normal leading-tight text-left">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Step Content Card */}
          <div className="min-h-[380px]">
            <AnimatePresence mode="wait">
              {/* STEP 1: INFORMASI */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  variants={stepSlide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col gap-4"
                >
                  {/* Meta Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        campaign.location || "Jakarta"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-[#111316] border border-white/10 hover:border-primary/40 rounded-xl px-3 py-1.5 text-white/90 hover:text-primary transition-colors cursor-pointer"
                    >
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span className="break-words">{campaign.location || "Showroom AutoPremium, Jakarta"}</span>
                      <ExternalLink className="size-3 opacity-40 shrink-0" />
                    </a>

                    <div className="flex items-center gap-1.5 bg-[#111316] border border-white/10 rounded-xl px-3 py-1.5 text-white/70">
                      <Clock className="size-3.5 text-primary shrink-0" />
                      <span>Deadline: {campaign.deadline}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#111316] border border-primary/20 rounded-xl px-3 py-1.5 text-primary font-medium">
                      <span>Sisa Kuota: 85%</span>
                    </div>
                  </div>

                  {/* Brief Content Card */}
                  <Card className="bg-[#111316] border-white/10 rounded-2xl shadow-none">
                    <CardContent className="p-5 sm:p-7 flex flex-col gap-5">
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-2">
                          <FileText className="size-3.5 text-primary" /> Ringkasan Brief
                        </h2>
                        <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line break-words">
                          {campaign.brief}
                        </p>
                      </div>

                      {/* Specs Row - Fully wrapping without truncation */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/5 text-xs">
                        <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5 flex flex-col justify-center">
                          <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">Unit</span>
                          <span className="font-semibold text-white leading-snug break-words">{campaign.vehicle}</span>
                        </div>
                        <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5 flex flex-col justify-center">
                          <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">Dealer</span>
                          <span className="font-semibold text-white leading-snug break-words">{campaign.brand}</span>
                        </div>
                        <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5 flex flex-col justify-center">
                          <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">Tipe</span>
                          <span className="font-semibold text-white leading-snug break-words">{formatCampaignType(campaign.type)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* STEP 2: ARAHAN KONTEN */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  variants={stepSlide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col gap-4"
                >
                  <Card className="bg-[#111316] border-white/10 rounded-2xl shadow-none">
                    <CardContent className="p-5 sm:p-7 flex flex-col gap-5">
                      {/* Poin Wajib */}
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-primary" /> Poin Wajib Konten
                        </h2>
                        <div className="flex flex-col gap-2.5">
                          {campaign.mandatoryHighlights && campaign.mandatoryHighlights.length > 0 ? (
                            campaign.mandatoryHighlights.map((point, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 bg-[#14161a] border border-white/5 rounded-xl p-3.5 text-xs sm:text-sm text-white/85"
                              >
                                <span className="size-5 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed break-words flex-1">{point}</span>
                              </div>
                            ))
                          ) : (
                            <div className="bg-[#14161a] border border-white/5 rounded-xl p-3.5 text-xs text-white/60">
                              Sorot fitur utama unit, kenyamanan berkendara, desain bodi, dan promo showroom.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTA & Tagar Mini Grid - Full Text Visibility */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                        {/* CTA Box */}
                        <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5 flex flex-col justify-between gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-white/40 uppercase font-semibold">CTA Wajib</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(campaign.cta || `Kunjungi dealer & test drive!`, "CTA")}
                              className="h-6 px-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg text-[11px] gap-1 cursor-pointer"
                            >
                              <Copy className="size-3" />
                              Salin
                            </Button>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-primary leading-relaxed break-words whitespace-normal">
                            {campaign.cta || `Kunjungi showroom ${campaign.brand} & test drive sekarang!`}
                          </p>
                        </div>

                        {/* Tagar Box */}
                        <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5 flex flex-col justify-between gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-white/40 uppercase font-semibold">Tagar & Mention</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopy(
                                  `#Carpaign #${campaign.vehicle.replace(/\s+/g, "")} @${campaign.brand.toLowerCase().replace(/\s+/g, "")}`,
                                  "Tagar"
                                )
                              }
                              className="h-6 px-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg text-[11px] gap-1 cursor-pointer"
                            >
                              <Copy className="size-3" />
                              Salin
                            </Button>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-white/90 leading-relaxed break-words whitespace-normal">
                            #Carpaign #{campaign.vehicle.replace(/\s+/g, "")} @{campaign.brand.toLowerCase().replace(/\s+/g, "")}
                          </p>
                        </div>
                      </div>

                      {/* Folder Bahan Mentah */}
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FolderOpen className="size-4 text-primary shrink-0" />
                          <span className="text-white/80 font-medium break-words">Folder Bahan Mentah & Logo Resmi Dealer</span>
                        </div>
                        <a
                          href="https://drive.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-semibold flex items-center gap-1 shrink-0 bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20"
                        >
                          Google Drive <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* STEP 3: SPESIFIKASI */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  variants={stepSlide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col gap-4"
                >
                  <Card className="bg-[#111316] border-white/10 rounded-2xl shadow-none">
                    <CardContent className="p-5 sm:p-7 flex flex-col gap-5">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                        <Wrench className="size-3.5 text-primary" /> Ketentuan Teknis
                      </h2>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {campaign.specs && campaign.specs.length > 0 ? (
                          campaign.specs.map((spec) => (
                            <div key={spec.label} className="bg-[#14161a] rounded-xl p-3.5 border border-white/5 flex flex-col justify-center">
                              <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">
                                {spec.label}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-white leading-snug break-words">
                                {spec.value}
                              </span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5">
                              <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">Format</span>
                              <span className="text-xs sm:text-sm font-semibold text-white">9:16 Vertikal</span>
                            </div>
                            <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5">
                              <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">Resolusi</span>
                              <span className="text-xs sm:text-sm font-semibold text-white">1080p / 4K UHD</span>
                            </div>
                            <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5">
                              <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">Durasi</span>
                              <span className="text-xs sm:text-sm font-semibold text-white">30 - 60 Detik</span>
                            </div>
                            <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5">
                              <span className="text-[10px] text-white/40 uppercase font-semibold block mb-1">Hak Cipta</span>
                              <span className="text-xs sm:text-sm font-semibold text-white">Organic & Paid Ads</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Audio Note */}
                      <div className="bg-[#14161a] rounded-xl p-3.5 border border-white/5 flex items-start gap-2.5 text-xs text-white/70">
                        <Radio className="size-4 text-primary shrink-0 mt-0.5" />
                        <span className="leading-relaxed break-words">
                          Gunakan audio komersial bebas royalti atau musik trending yang relevan tanpa menutupi narasi voiceover utama.
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* STEP 4: KRITERIA & DAFTAR */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  variants={stepSlide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col gap-4"
                >
                  <Card className="bg-[#111316] border-white/10 rounded-2xl shadow-none">
                    <CardContent className="p-5 sm:p-7 flex flex-col gap-5">
                      {/* Syarat Kreator */}
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-2">
                          <ShieldCheck className="size-3.5 text-primary" /> Syarat & Kriteria
                        </h2>
                        <div className="flex flex-col gap-2.5">
                          {campaign.requirements.map((req, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 bg-[#14161a] border border-white/5 rounded-xl p-3.5 text-xs sm:text-sm text-white/85"
                            >
                              <Check className="size-4 text-primary shrink-0 mt-0.5" />
                              <span className="leading-relaxed break-words">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reward Info */}
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-white/40 uppercase font-semibold block">Total Reward</span>
                          <span className="text-lg sm:text-xl font-bold text-primary break-words">{campaign.reward}</span>
                        </div>
                        <span className="text-xs text-white/60">Pencairan H+3 pasca approved</span>
                      </div>

                      {/* Checkbox */}
                      <label className="flex items-start gap-2.5 cursor-pointer pt-1 select-none">
                        <input
                          type="checkbox"
                          checked={termsAgreed}
                          onChange={(e) => setTermsAgreed(e.target.checked)}
                          className="mt-0.5 size-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-white/70 leading-relaxed break-words">
                          Saya menyetujui seluruh arahan brief dan berkomitmen mengunggah hasil sebelum deadline.
                        </span>
                      </label>

                      {/* Apply Button */}
                      <Button
                        onClick={handleApply}
                        disabled={applying || applied || !termsAgreed}
                        className={`w-full h-11 rounded-xl font-bold text-sm transition-all shadow-none cursor-pointer ${
                          applied
                            ? "bg-primary/20 text-primary border border-primary/40 cursor-default"
                            : termsAgreed
                            ? "bg-primary text-black hover:bg-primary/90"
                            : "bg-white/10 text-white/30 cursor-not-allowed"
                        }`}
                      >
                        {applying ? (
                          <><Loader2 className="size-4 mr-2 animate-spin" /> Mengirim...</>
                        ) : applied ? (
                          <><CheckCircle2 className="size-4 mr-2" /> Pengajuan Berhasil!</>
                        ) : (
                          "Ambil Job Ini"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stepper Footer Controls */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
            <div className="flex items-center justify-between gap-3 bg-[#111316] border border-white/10 rounded-2xl p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="border-white/10 bg-transparent hover:bg-white/5 text-white/70 hover:text-white disabled:opacity-25 rounded-xl text-xs gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                Sebelumnya
              </Button>

              <span className="text-xs text-white/40 font-medium">
                {currentStep} / {STEPS.length}
              </span>

              {currentStep < STEPS.length ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))}
                  className="bg-primary text-black hover:bg-primary/90 font-bold rounded-xl text-xs gap-1.5 cursor-pointer shadow-none"
                >
                  Lanjut
                  <ArrowRight className="size-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={applying || applied || !termsAgreed}
                  className={`font-bold rounded-xl text-xs gap-1.5 cursor-pointer shadow-none ${
                    applied
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-primary text-black hover:bg-primary/90"
                  }`}
                >
                  {applied ? "Terdaftar" : "Ambil Job"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Sticky Sidebar */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2} className="w-full lg:w-[300px] shrink-0">
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            <Card className="bg-[#111316] border-white/10 rounded-2xl overflow-hidden relative shadow-none">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <CardContent className="p-5 flex flex-col gap-4">
                {/* Dealer Info */}
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Car className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Dealer</p>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight break-words">{campaign.brand}</p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5" />

                {/* Key Numbers */}
                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-white/50">Reward</span>
                    <span className="font-bold text-primary text-sm break-words">{campaign.reward}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-white/50">Deadline</span>
                    <span className="font-semibold text-white break-words">{campaign.deadline}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-white/50">Kuota</span>
                    <span className="font-semibold text-white break-words">{campaign.quota}</span>
                  </div>

                  {/* Sisa Budget */}
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-white/40">Sisa Kuota</span>
                      <span className="font-bold text-primary">85%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/5" />

                {/* Apply Button */}
                <Button
                  onClick={handleApply}
                  disabled={applying || applied}
                  className={`w-full h-10 rounded-xl font-bold text-xs transition-all shadow-none cursor-pointer ${
                    applied
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-primary text-black hover:bg-primary/90"
                  }`}
                >
                  {applying ? (
                    <><Loader2 className="size-3.5 mr-1.5 animate-spin" /> Mengirim...</>
                  ) : applied ? (
                    <><CheckCircle2 className="size-3.5 mr-1.5" /> Pengajuan Terkirim</>
                  ) : (
                    "Ambil Job Ini"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
