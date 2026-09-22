"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Info, Building2, MapPin, AlertCircle, Eye, Camera, CircleDollarSign, ExternalLink, Check } from "lucide-react";
import { TikTokIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/social-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignThumbnailUploader } from "./CampaignThumbnailUploader";
import { VehicleSelectDropdown, type VehicleItem } from "./VehicleSelectDropdown";
import { createCampaign } from "@/app/actions/campaigns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Vehicle = VehicleItem;

const TARGET_PLATFORMS = [
  { id: "TikTok", label: "TikTok", icon: TikTokIcon },
  { id: "Instagram Reels", label: "Instagram Reels", icon: InstagramIcon },
  { id: "YouTube Shorts", label: "YouTube Shorts", icon: YouTubeIcon },
];

const USAGE_RIGHTS_OPTIONS = [
  "Komersial & Bebas untuk Iklan Ads",
  "Boleh di-repost akun dealer & digunakan untuk Ads berbayar",
  "Boleh di-repost di akun media sosial dealer (Organik Saja)",
  "Hak Cipta Penuh dialihkan ke Dealer (Full Commercial Ownership)",
  "Hanya tayang di akun kreator (Tanpa Hak Repost / Ads)",
  "Bebas digunakan untuk materi promosi & arsip showroom dealer",
];

const OUTPUT_COUNT_OPTIONS = [
  { value: "1", label: "1 Video" },
  { value: "2", label: "2 Video" },
  { value: "3", label: "3 Video" },
  { value: "4", label: "4 Video" },
  { value: "5", label: "5 Video" },
  { value: "6", label: "6 Video" },
  { value: "8", label: "8 Video" },
  { value: "10", label: "10 Video" },
  { value: "15", label: "15 Video" },
  { value: "20", label: "20 Video" },
];

const OUTPUT_DURATION_OPTIONS = [
  "15 - 30 Detik",
  "30 - 60 Detik",
  "60 - 90 Detik",
  "1 - 3 Menit",
  "3 - 5 Menit",
  "> 5 Menit (Long-form)",
];

const OUTPUT_SPECS_OPTIONS = [
  "Vertikal (9:16), 1080p 60fps (Reels / TikTok / Shorts)",
  "Vertikal (9:16), 4K UHD 60fps",
  "Horizontal (16:9), 1080p Full HD (YouTube / Web)",
  "Horizontal (16:9), 4K UHD Cinema",
  "Square (1:1), 1080p (Feed Post)",
];

const steps = [
  "Informasi Kebutuhan",
  "Brief & Hasil Pekerjaan",
  "Budget & Pelaksanaan",
  "Tinjau & Buat Campaign",
];

export function VideographyCampaignForm({
  onBack,
  vehicles,
}: {
  onBack: () => void;
  vehicles: Vehicle[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [previewTab, setPreviewTab] = useState<"card" | "detail">("card");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Step 1 State
  const [title, setTitle] = useState("");
  const [serviceType, setServiceType] = useState<"footage_only" | "edit_only" | "footage_and_edit" | "">("");
  const [promotionalFocus, setPromotionalFocus] = useState<"dealer" | "single_unit" | "multiple_units">("dealer");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [usagePurpose, setUsagePurpose] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("TikTok, Instagram Reels");

  const togglePlatform = (platformId: string) => {
    clearFieldError("targetPlatform");
    const current = targetPlatform
      ? targetPlatform.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    let next: string[];
    if (current.includes(platformId)) {
      next = current.filter((p) => p !== platformId);
    } else {
      next = [...current, platformId];
    }
    setTargetPlatform(next.join(", "));
  };

  // Step 2 State
  const [shotList, setShotList] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [sourceMaterialUrl, setSourceMaterialUrl] = useState("");
  const [editingGuidelines, setEditingGuidelines] = useState("");
  const [outputCount, setOutputCount] = useState("1");
  const [outputDuration, setOutputDuration] = useState("30 - 60 Detik");
  const [outputSpecs, setOutputSpecs] = useState("Vertikal (9:16), 1080p 60fps (Reels / TikTok / Shorts)");
  const [visualReferences, setVisualReferences] = useState("");
  const [mandatoryPoints, setMandatoryPoints] = useState("");
  const [talentRequirements, setTalentRequirements] = useState("");
  const [revisionLimit, setRevisionLimit] = useState("2");
  const [additionalFiles, setAdditionalFiles] = useState("");
  const [usageRights, setUsageRights] = useState("Komersial & Bebas untuk Iklan Ads");

  // Step 3 State
  const [feeAmount, setFeeAmount] = useState("1.500.000");
  const [productionLocation, setProductionLocation] = useState("");
  const [productionSchedule, setProductionSchedule] = useState("10 Okt 2026");
  const [sourceMaterialDate, setSourceMaterialDate] = useState("");
  const [draftDeadline, setDraftDeadline] = useState("15 Okt 2026");
  const [finalDeadline, setFinalDeadline] = useState("20 Okt 2026");
  const [providerCriteria, setProviderCriteria] = useState("Peralatan kamera min. Sony A7/Mirrorless 4K, stabil gimbal");
  const [transportationTerms, setTransportationTerms] = useState("Termasuk dalam fee");

  const toggleVehicle = (id: string) => {
    clearFieldError("selectedVehicles");
    const veh = vehicles.find((v) => v.id === id);
    if (!thumbnail && veh?.image) {
      setThumbnail(veh.image);
    }
    if (promotionalFocus === "single_unit") {
      setSelectedVehicles([id]);
    } else {
      setSelectedVehicles((prev) =>
        prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
      );
    }
  };

  const isFootageIncluded = serviceType === "footage_only" || serviceType === "footage_and_edit";
  const isEditingIncluded = serviceType === "edit_only" || serviceType === "footage_and_edit";

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!title.trim()) {
        newErrors.title = "Judul pekerjaan wajib diisi";
      } else if (title.trim().length < 3) {
        newErrors.title = "Judul minimal 3 karakter";
      }

      if (!serviceType) {
        newErrors.serviceType = "Pilih jenis layanan videography";
      }

      if (!promotionalFocus) {
        newErrors.promotionalFocus = "Pilih objek konten";
      }

      if (promotionalFocus !== "dealer" && selectedVehicles.length === 0) {
        newErrors.selectedVehicles = "Pilih minimal satu unit kendaraan dari inventory";
      }

      if (!usagePurpose.trim()) {
        newErrors.usagePurpose = "Tujuan penggunaan konten wajib diisi";
      }

      if (!targetPlatform.trim()) {
        newErrors.targetPlatform = "Platform tujuan wajib diisi";
      }
    }

    if (currentStep === 2) {
      if (isFootageIncluded && !shotList.trim()) {
        newErrors.shotList = "Daftar objek / shot wajib diisi";
      }

      if (serviceType === "edit_only" && !sourceMaterialUrl.trim()) {
        newErrors.sourceMaterialUrl = "Tautan materi mentah wajib diisi";
      }

      const numOut = parseInt(outputCount, 10);
      if (!outputCount || isNaN(numOut) || numOut < 1) {
        newErrors.outputCount = "Jumlah video hasil harus minimal 1";
      }

      if (!outputDuration.trim()) {
        newErrors.outputDuration = "Durasi per video wajib diisi";
      }

      if (!outputSpecs.trim()) {
        newErrors.outputSpecs = "Format dan resolusi wajib diisi";
      }

      if (!usageRights.trim()) {
        newErrors.usageRights = "Hak penggunaan aset video wajib diisi";
      }

      const numRevis = parseInt(revisionLimit, 10);
      if (revisionLimit === "" || isNaN(numRevis) || numRevis < 0) {
        newErrors.revisionLimit = "Batas revisi harus berupa angka (minimal 0)";
      }
    }

    if (currentStep === 3) {
      const rawFee = feeAmount.replace(/\D/g, "").trim();
      const numFee = parseInt(rawFee, 10);
      if (!rawFee || isNaN(numFee) || numFee <= 0) {
        newErrors.feeAmount = "Fee pekerjaan harus berupa nominal lebih dari 0";
      }

      if (isFootageIncluded && !productionLocation.trim()) {
        newErrors.productionLocation = "Lokasi pengambilan gambar wajib diisi";
      }

      if (isFootageIncluded && !productionSchedule.trim()) {
        newErrors.productionSchedule = "Jadwal pengambilan gambar wajib ditentukan";
      }

      if (!draftDeadline.trim()) {
        newErrors.draftDeadline = "Batas penyerahan draf wajib ditentukan";
      }

      if (!finalDeadline.trim()) {
        newErrors.finalDeadline = "Batas hasil akhir / final wajib ditentukan";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setError("");
    if (!validateStep(step)) {
      return;
    }
    setErrors({});
    setStep((s) => Math.min(4, s + 1));
  };

  const numFeeAmount = parseInt(feeAmount.replace(/\D/g, ""), 10) || 0;

  const handleSubmit = (status: "draft" | "active") => {
    setError("");
    startTransition(async () => {
      try {
        const payload = {
          title,
          promotionalFocus,
          vehicles: selectedVehicles,
          type: "Videographer/Edit" as const,
          budget: numFeeAmount,
          startDate: productionSchedule.split(" - ")[0] || sourceMaterialDate || draftDeadline,
          deadline: finalDeadline,
          status,
          details: {
            thumbnail: thumbnail || (selectedVehicles.length > 0 ? vehicles.find((v) => v.id === selectedVehicles[0])?.image : null) || null,
            serviceType,
            usagePurpose,
            targetPlatform,
            
            shotList,
            sessionDuration,
            sourceMaterialUrl,
            editingGuidelines,
            outputCount: parseInt(outputCount, 10),
            outputDuration,
            outputSpecs,
            visualReferences,
            mandatoryPoints,
            talentRequirements,
            revisionLimit: parseInt(revisionLimit, 10),
            additionalFiles,
            usageRights,

            feeAmount: numFeeAmount,
            productionLocation,
            productionSchedule,
            sourceMaterialDate,
            draftDeadline,
            finalDeadline,
            providerCriteria,
            transportationTerms,
          }
        };

        const res = await createCampaign(payload);
        if (res.success) {
          toast.success("Kampanye berhasil dibuat! Selesaikan pembayaran agar kampanye aktif dan didistribusikan ke kreator.");
          router.push(res?.campaignId ? `/dealer/campaigns?payCampaignId=${res.campaignId}` : "/dealer/campaigns");
        }
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Gagal menyimpan campaign. Silakan coba lagi.");
        toast.error(e.message || "Gagal menyimpan campaign");
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white/40 hover:text-white shrink-0">
          <ChevronLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-white">Buat Campaign Videographer/Edit</h1>
          <p className="text-[12px] text-white/40">Produksi aset konten visual untuk dealer</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="w-full bg-[#111316]/60 border border-white/[0.06] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          {steps.map((label, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={label} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-initial">
                <div className="flex items-center gap-2.5 min-w-0 shrink-0">
                  <div
                    className="size-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all"
                    style={
                      isDone
                        ? { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }
                        : isActive
                        ? { background: "var(--primary)", color: "#0a0a0c" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)" }
                    }
                  >
                    {isDone ? "✓" : num}
                  </div>
                  <span
                    className="text-[12px] sm:text-[13px] font-medium whitespace-nowrap"
                    style={{ color: isActive ? "white" : isDone ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="h-[1px] flex-1 mx-2 sm:mx-3 transition-colors hidden lg:block"
                    style={{ background: isDone ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="bg-[#111316] border-white/[0.06] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: Informasi Kebutuhan */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Informasi Kebutuhan</h2>
                <p className="text-[12px] text-white/40 mt-1">Menentukan jasa dan objek konten.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Judul Pekerjaan <span className="text-red-400">*</span></label>
                  <Input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      clearFieldError("title");
                    }}
                    placeholder="Contoh: Produksi 5 Video Stok Mobil Dealer ABC"
                    className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.title && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.title && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Jenis Layanan <span className="text-red-400">*</span></label>
                  <Select value={serviceType} onValueChange={(val: any) => {
                    setServiceType(val);
                    clearFieldError("serviceType");
                  }}>
                    <SelectTrigger className={cn("bg-white/5 border-white/10 text-white", errors.serviceType && "border-red-500/60 bg-red-500/[0.03]")}>
                      <SelectValue placeholder="Pengambilan Footage + Editing" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="footage_and_edit">Pengambilan Footage + Editing</SelectItem>
                      <SelectItem value="footage_only">Pengambilan Footage Saja</SelectItem>
                      <SelectItem value="edit_only">Editing Saja</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.serviceType && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.serviceType}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Objek Konten <span className="text-red-400">*</span></label>
                  <Select value={promotionalFocus} onValueChange={(val: any) => {
                    setPromotionalFocus(val);
                    clearFieldError("promotionalFocus");
                    if (val === "dealer") setSelectedVehicles([]);
                    if (val === "single_unit" && selectedVehicles.length > 1) setSelectedVehicles([selectedVehicles[0]]);
                  }}>
                    <SelectTrigger className={cn("bg-white/5 border-white/10 text-white", errors.promotionalFocus && "border-red-500/60 bg-red-500/[0.03]")}>
                      <SelectValue placeholder="Dealer" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="dealer">Dealer</SelectItem>
                      <SelectItem value="single_unit">Satu Unit Kendaraan</SelectItem>
                      <SelectItem value="multiple_units">Beberapa Unit Kendaraan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.promotionalFocus && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.promotionalFocus}</p>}
                </div>

                {promotionalFocus !== "dealer" && (
                  <VehicleSelectDropdown
                    vehicles={vehicles}
                    selectedVehicleIds={selectedVehicles}
                    onChange={(ids) => {
                      setSelectedVehicles(ids);
                      clearFieldError("selectedVehicles");
                    }}
                    promotionalFocus={promotionalFocus}
                    error={errors.selectedVehicles}
                    onVehicleSelected={(veh) => {
                      if (!thumbnail && veh.image) {
                        setThumbnail(veh.image);
                      }
                    }}
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Tujuan Penggunaan <span className="text-red-400">*</span></label>
                    <Input
                      value={usagePurpose}
                      onChange={(e) => {
                        setUsagePurpose(e.target.value);
                        clearFieldError("usagePurpose");
                      }}
                      placeholder="Contoh: Iklan berbayar, konten rutin sosmed"
                      className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.usagePurpose && "border-red-500/60 bg-red-500/[0.03]")}
                    />
                    {errors.usagePurpose && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.usagePurpose}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-white/40">Platform Tujuan <span className="text-red-400">*</span></label>
                      {targetPlatform && (
                        <span className="text-[10px] font-semibold text-primary">
                          {targetPlatform}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {TARGET_PLATFORMS.map((p) => {
                        const Icon = p.icon;
                        const isSelected = targetPlatform
                          .split(",")
                          .map((s) => s.trim())
                          .includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => togglePlatform(p.id)}
                            className={cn(
                              "p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative group",
                              isSelected
                                ? "bg-primary/10 border-primary/40 text-white shadow-sm ring-1 ring-primary/25"
                                : "bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white hover:border-white/20"
                            )}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 size-3.5 rounded-full bg-primary flex items-center justify-center text-black">
                                <Check className="size-2 stroke-[3]" />
                              </div>
                            )}
                            <div
                              className={cn(
                                "size-7 rounded-lg flex items-center justify-center transition-colors",
                                isSelected
                                  ? "bg-primary/20 text-primary"
                                  : "bg-white/5 text-white/50 group-hover:text-white group-hover:bg-white/10"
                              )}
                            >
                              <Icon className="size-4" />
                            </div>
                            <span
                              className={cn(
                                "text-[11px] font-medium tracking-tight text-center truncate w-full px-1",
                                isSelected ? "text-primary font-semibold" : "text-white/70"
                              )}
                            >
                              {p.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.targetPlatform && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.targetPlatform}</p>}
                  </div>
                </div>

                {/* Campaign Thumbnail / Banner */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <CampaignThumbnailUploader
                    thumbnail={thumbnail}
                    onChange={(val) => {
                      setThumbnail(val);
                      clearFieldError("thumbnail");
                    }}
                    vehicles={vehicles}
                    selectedVehicleIds={selectedVehicles}
                    campaignTitle={title}
                    campaignType="Videographer"
                    error={errors.thumbnail}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Brief & Hasil Pekerjaan */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Brief & Hasil Pekerjaan</h2>
                <p className="text-[12px] text-white/40 mt-1">Menentukan materi, spesifikasi, dan hasil yang diserahkan.</p>
              </div>

              <div className="space-y-6">
                
                {/* Specific Fields based on Service Type */}
                {isFootageIncluded && (
                  <div className="p-5 border border-white/10 rounded-xl bg-white/[0.02] space-y-4">
                    <h3 className="text-[13px] font-semibold text-white mb-2">Kebutuhan Footage</h3>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Daftar Objek / Shot <span className="text-red-400">*</span></label>
                      <Textarea
                        value={shotList}
                        onChange={(e) => {
                          setShotList(e.target.value);
                          clearFieldError("shotList");
                        }}
                        placeholder="Contoh: Exterior depan, interior dashboard, mesin, dsb."
                        className={cn("bg-[#1a1c20] border-white/10 text-white placeholder:text-white/20", errors.shotList && "border-red-500/60 bg-red-500/[0.03]")}
                      />
                      {errors.shotList && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.shotList}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Durasi Sesi / Estimasi Waktu</label>
                      <Input
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(e.target.value)}
                        placeholder="Contoh: 3 Jam"
                        className="bg-[#1a1c20] border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>
                )}

                {isEditingIncluded && (
                  <div className="p-5 border border-white/10 rounded-xl bg-white/[0.02] space-y-4">
                    <h3 className="text-[13px] font-semibold text-white mb-2">Kebutuhan Editing</h3>
                    {!isFootageIncluded && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-white/40">
                            Link Materi Sumber (Drive/Dropbox) <span className="text-red-400">*</span>
                          </label>
                          {sourceMaterialUrl.trim() && (
                            <a
                              href={sourceMaterialUrl.trim().startsWith("http://") || sourceMaterialUrl.trim().startsWith("https://") ? sourceMaterialUrl.trim() : `https://${sourceMaterialUrl.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-2.5 py-0.5 rounded-md border border-primary/20"
                            >
                              <ExternalLink className="size-3" />
                              <span>Buka & Uji Link</span>
                            </a>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            value={sourceMaterialUrl}
                            onChange={(e) => {
                              setSourceMaterialUrl(e.target.value);
                              clearFieldError("sourceMaterialUrl");
                            }}
                            placeholder="Link folder berisi aset video mentah (https://...)"
                            className={cn(
                              "bg-[#1a1c20] border-white/10 text-white placeholder:text-white/20",
                              sourceMaterialUrl.trim() && "pr-10",
                              errors.sourceMaterialUrl && "border-red-500/60 bg-red-500/[0.03]"
                            )}
                          />
                          {sourceMaterialUrl.trim() && (
                            <a
                              href={sourceMaterialUrl.trim().startsWith("http://") || sourceMaterialUrl.trim().startsWith("https://") ? sourceMaterialUrl.trim() : `https://${sourceMaterialUrl.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/50 hover:text-primary hover:bg-white/10 transition-colors"
                              title="Buka link di tab baru"
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          )}
                        </div>
                        {errors.sourceMaterialUrl && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.sourceMaterialUrl}</p>}
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Arahan Editing</label>
                      <Textarea
                        value={editingGuidelines}
                        onChange={(e) => setEditingGuidelines(e.target.value)}
                        placeholder="Contoh: Tempo cepat, transisi dinamis, sertakan text popup harga"
                        className="bg-[#1a1c20] border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>
                )}

                {/* General Output Specs */}
                <div className="space-y-5 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Jumlah Hasil Final <span className="text-red-400">*</span></label>
                      <Select
                        value={outputCount}
                        onValueChange={(val) => {
                          setOutputCount(val);
                          clearFieldError("outputCount");
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "bg-white/5 border-white/10 text-white",
                            errors.outputCount && "border-red-500/60 bg-red-500/[0.03]"
                          )}
                        >
                          <SelectValue placeholder="Pilih jumlah video" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                          {OUTPUT_COUNT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.outputCount && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.outputCount}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Durasi (Per Video) <span className="text-red-400">*</span></label>
                      <Select
                        value={outputDuration}
                        onValueChange={(val) => {
                          setOutputDuration(val);
                          clearFieldError("outputDuration");
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "bg-white/5 border-white/10 text-white",
                            errors.outputDuration && "border-red-500/60 bg-red-500/[0.03]"
                          )}
                        >
                          <SelectValue placeholder="Pilih durasi video" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                          {OUTPUT_DURATION_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.outputDuration && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.outputDuration}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Rasio & Resolusi <span className="text-red-400">*</span></label>
                      <Select
                        value={outputSpecs}
                        onValueChange={(val) => {
                          setOutputSpecs(val);
                          clearFieldError("outputSpecs");
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "bg-white/5 border-white/10 text-white",
                            errors.outputSpecs && "border-red-500/60 bg-red-500/[0.03]"
                          )}
                        >
                          <SelectValue placeholder="Pilih rasio & resolusi" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                          {OUTPUT_SPECS_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.outputSpecs && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.outputSpecs}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-white/40">Referensi Visual (Opsional)</label>
                        {visualReferences && (
                          <a
                            href={visualReferences.startsWith("http://") || visualReferences.startsWith("https://") ? visualReferences : `https://${visualReferences}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="size-3" /> Buka Link
                          </a>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <Input
                          value={visualReferences}
                          onChange={(e) => setVisualReferences(e.target.value)}
                          placeholder="Link referensi gaya konten (https://...)"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 pr-10"
                        />
                        {visualReferences && (
                          <a
                            href={visualReferences.startsWith("http://") || visualReferences.startsWith("https://") ? visualReferences : `https://${visualReferences}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka link di tab baru"
                            className="absolute right-3 p-1 rounded-md text-white/40 hover:text-primary hover:bg-white/5 transition-colors"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Poin Wajib (Logo, CTA, dll)</label>
                      <Input
                        value={mandatoryPoints}
                        onChange={(e) => setMandatoryPoints(e.target.value)}
                        placeholder="Logo dealer di awal, nomor WA di akhir"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Kebutuhan Talent / Voice Over (Opsional)</label>
                      <Input
                        value={talentRequirements}
                        onChange={(e) => setTalentRequirements(e.target.value)}
                        placeholder="Penyedia wajib sediakan talent"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Hak Penggunaan Konten <span className="text-red-400">*</span></label>
                      <Select
                        value={usageRights}
                        onValueChange={(val) => {
                          setUsageRights(val);
                          clearFieldError("usageRights");
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            "bg-white/5 border-white/10 text-white",
                            errors.usageRights && "border-red-500/60 bg-red-500/[0.03]"
                          )}
                        >
                          <SelectValue placeholder="Pilih Hak Penggunaan Konten" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                          {USAGE_RIGHTS_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.usageRights && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.usageRights}</p>}
                    </div>
                  </div>

                  {/* Spaced out Batas Revisi section */}
                  <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Batas Revisi <span className="text-red-400">*</span></label>
                      <Input
                        type="number"
                        min="0"
                        value={revisionLimit}
                        onChange={(e) => {
                          setRevisionLimit(e.target.value);
                          clearFieldError("revisionLimit");
                        }}
                        placeholder="Contoh: 2"
                        className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.revisionLimit && "border-red-500/60 bg-red-500/[0.03]")}
                      />
                      {errors.revisionLimit && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.revisionLimit}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Penyerahan File Tambahan (Opsional)</label>
                      <Input
                        value={additionalFiles}
                        onChange={(e) => setAdditionalFiles(e.target.value)}
                        placeholder="Contoh: Wajib serahkan file mentah/project"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 3: Budget & Pelaksanaan */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Budget & Pelaksanaan</h2>
                <p className="text-[12px] text-white/40 mt-1">Mengatur fee, lokasi, jadwal, dan kriteria penyedia.</p>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 text-primary/80">
                <Info className="size-5 shrink-0" />
                <p className="text-[12px] leading-relaxed">
                  Fee tetap ini berlaku untuk keseluruhan pekerjaan dan akan dicadangkan dari sistem saat Anda menyetujui penyedia/kreator terpilih.
                </p>
              </div>

              <div className="space-y-2 max-w-sm">
                <label className="text-[11px] font-medium text-white/40">Fee Pekerjaan Keseluruhan <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/25">Rp</span>
                  <Input
                    value={feeAmount}
                    onChange={(e) => {
                      setFeeAmount(e.target.value);
                      clearFieldError("feeAmount");
                    }}
                    placeholder="2.000.000"
                    className={cn("pl-10 text-[15px] font-medium bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.feeAmount && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                </div>
                {errors.feeAmount && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.feeAmount}</p>}
              </div>

              <div className="h-[1px] bg-white/[0.06]" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isFootageIncluded ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-white/40">Lokasi Pengambilan Gambar <span className="text-red-400">*</span></label>
                        {productionLocation.trim() && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(productionLocation.trim())}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <MapPin className="size-3" /> Buka Google Maps
                          </a>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <Input
                          value={productionLocation}
                          onChange={(e) => {
                            setProductionLocation(e.target.value);
                            clearFieldError("productionLocation");
                          }}
                          placeholder="Contoh: Jl. Gatot Subroto No. 45"
                          className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20 pr-10", errors.productionLocation && "border-red-500/60 bg-red-500/[0.03]")}
                        />
                        {productionLocation.trim() && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(productionLocation.trim())}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka alamat di Google Maps"
                            className="absolute right-3 p-1 rounded-md text-white/40 hover:text-primary hover:bg-white/5 transition-colors"
                          >
                            <MapPin className="size-4" />
                          </a>
                        )}
                      </div>
                      {errors.productionLocation && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.productionLocation}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Jadwal Pengambilan Gambar <span className="text-red-400">*</span></label>
                      <Input
                        value={productionSchedule}
                        onChange={(e) => {
                          setProductionSchedule(e.target.value);
                          clearFieldError("productionSchedule");
                        }}
                        placeholder="Contoh: 15-16 Nov 2026"
                        className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.productionSchedule && "border-red-500/60 bg-red-500/[0.03]")}
                      />
                      {errors.productionSchedule && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.productionSchedule}</p>}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 col-span-2">
                    <label className="text-[11px] font-medium text-white/40">Target Pengiriman Bahan Mentah</label>
                    <Input
                      value={sourceMaterialDate}
                      onChange={(e) => setSourceMaterialDate(e.target.value)}
                      placeholder="Contoh: 10 Nov 2026"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Batas Penyerahan Draft <span className="text-red-400">*</span></label>
                  <Input
                    type="date"
                    value={draftDeadline}
                    onChange={(e) => {
                      setDraftDeadline(e.target.value);
                      clearFieldError("draftDeadline");
                    }}
                    className={cn("bg-white/5 border-white/10 text-white [color-scheme:dark]", errors.draftDeadline && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.draftDeadline && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.draftDeadline}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Batas Hasil Akhir / Final <span className="text-red-400">*</span></label>
                  <Input
                    type="date"
                    value={finalDeadline}
                    onChange={(e) => {
                      setFinalDeadline(e.target.value);
                      clearFieldError("finalDeadline");
                    }}
                    className={cn("bg-white/5 border-white/10 text-white [color-scheme:dark]", errors.finalDeadline && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.finalDeadline && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.finalDeadline}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/40">Ketentuan Akomodasi / Transportasi</label>
                <Input
                  value={transportationTerms}
                  onChange={(e) => setTransportationTerms(e.target.value)}
                  placeholder="Contoh: Biaya makan ditanggung, transportasi ditanggung sendiri"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/40">Kriteria Penyedia (Portofolio, Alat, dll)</label>
                <Textarea
                  value={providerCriteria}
                  onChange={(e) => setProviderCriteria(e.target.value)}
                  placeholder="Contoh: Wajib punya portofolio otomotif, menggunakan gimbal/stabilizer"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[60px]"
                />
              </div>

            </motion.div>
          )}

          {/* STEP 4: Tinjau & Buat Campaign */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Tinjau & Buat Campaign</h2>
                <p className="text-[12px] text-white/40 mt-1">Periksa seluruh pesanan dan preview tampilan sebelum diluncurkan.</p>
              </div>

              {/* LIVE CREATOR PREVIEW */}
              <div className="bg-[#17191d] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Eye className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-white">Preview Tampilan di Dashboard Kreator</h3>
                      <p className="text-[11px] text-white/40 mt-0.5">
                        Simulasi bagaimana job videografi/edit ini akan ditampilkan kepada videografer & editor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setPreviewTab("card")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                        previewTab === "card"
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      Card Feed Explore
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab("detail")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                        previewTab === "detail"
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-white/60 hover:text-white"
                      )}
                    >
                      Halaman Detail Job
                    </button>
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-gradient-to-b from-black/40 to-black/20">
                  {previewTab === "card" ? (
                    <div className="max-w-[580px] mx-auto">
                      <div className="group border border-white/10 bg-[#111316] overflow-hidden shadow-2xl rounded-2xl flex flex-col sm:flex-row transition-all">
                        <div className="relative w-full sm:w-[210px] h-[170px] sm:h-auto shrink-0 overflow-hidden bg-black/60">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={
                              thumbnail || 
                              (selectedVehicles.length > 0 ? vehicles.find((v) => v.id === selectedVehicles[0])?.image : null) || 
                              "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200"
                            } 
                            alt={title || "Campaign Thumbnail"} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111316] sm:bg-gradient-to-r sm:from-transparent sm:to-[#111316] opacity-70" />
                          <Badge className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/15 text-white font-semibold text-[10px] px-2.5 py-0.5 rounded">
                            Dealer Showroom
                          </Badge>
                        </div>

                        <div className="p-4 sm:p-5 flex flex-col justify-between grow">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-bold text-primary tracking-wider uppercase flex items-center gap-1">
                                <Camera className="size-3" /> VIDEOGRAPHY / EDIT
                              </span>
                              <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
                                Deadline: {finalDeadline || "Fleksibel"}
                              </span>
                            </div>
                            
                            <h4 className="font-bold text-[15px] text-white line-clamp-1 mb-1.5">
                              {title || "Judul Proyek Videografi"}
                            </h4>
                            
                            <p className="text-[12px] text-white/60 line-clamp-2 leading-relaxed mb-3">
                              {usagePurpose || "Produksi dan editing materi video berkualitas sinematik untuk promosi kendaraan."}
                            </p>

                            {/* Estimasi Sisa Budget (Persentase Saja) */}
                            <div className="space-y-1.5 mb-3">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-white/40">Sisa Kuota Budget</span>
                                <span className="font-semibold text-primary font-mono">100% Tersedia</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full w-full" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
                            <div>
                              <span className="text-[10px] text-white/40 block">Fee Kontrak</span>
                              <div className="flex items-center gap-1.5">
                                <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                  <CircleDollarSign className="size-3.5" />
                                </div>
                                <p className="text-[13px] font-bold text-white">
                                  Rp {numFeeAmount.toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                            
                            <div className="rounded-full bg-white/10 text-white font-semibold px-3.5 py-1.5 text-[11px] flex items-center">
                              Lihat Detail
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-[680px] mx-auto">
                      <div className="relative w-full h-[200px] sm:h-[240px] rounded-2xl overflow-hidden bg-black/80 border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            thumbnail ||
                            (selectedVehicles.length > 0 ? vehicles.find((v) => v.id === selectedVehicles[0])?.image : null) ||
                            "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200"
                          }
                          alt={title || "Campaign Thumbnail"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-primary/10 border-primary/30 text-primary flex items-center gap-1">
                                <Camera className="size-3" /> VIDEOGRAPHY / EDIT
                              </Badge>
                              <span className="text-[10px] text-white/60 bg-black/60 border border-white/10 px-2 py-0.5 rounded capitalize">
                                {serviceType?.replace(/_/g, " ")}
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                              {title || "Judul Campaign"}
                            </h3>
                            <p className="text-[12px] text-white/70 mt-0.5">Dealer Showroom</p>
                          </div>

                          <div className="flex flex-col sm:items-end gap-0.5 shrink-0">
                            <span className="text-[10px] text-white/40">Total Honor</span>
                            <div className="flex items-center gap-1.5 text-lg font-extrabold text-primary">
                              <CircleDollarSign className="size-4" />
                              Rp {numFeeAmount.toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rule Badges & Sisa Budget */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                        <div className="p-3 rounded-xl bg-[#111316] border border-white/[0.06] flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-white/40 block">Sisa Kuota Budget</span>
                            <span className="text-primary font-bold">100% Tersedia</span>
                          </div>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full w-full" />
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111316] border border-white/[0.06]">
                          <span className="text-[10px] text-white/40 block">Output Video</span>
                          <span className="text-white font-semibold">{outputCount} Final</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111316] border border-white/[0.06]">
                          <span className="text-[10px] text-white/40 block">Batas Revisi</span>
                          <span className="text-white font-semibold">{revisionLimit || "0"} Kali</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111316] border border-white/[0.06]">
                          <span className="text-[10px] text-white/40 block">Deadline</span>
                          <span className="text-white font-semibold">{finalDeadline || "Fleksibel"}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#111316] border border-white/[0.06] space-y-2 text-[12px]">
                        <span className="font-semibold text-white">Spesifikasi Hasil & Arahan</span>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                          Format: {outputSpecs} • Durasi: {outputDuration}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[11px] text-white/60">
                          Videografer / Editor dapat mengajukan portofolio dan menerima tawaran ini.
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white text-black font-bold text-[12px] shadow-sm">
                          Terima Job & Mulai Proyek
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RINCIAN PARAMETER */}
              <div className="bg-[#17191d] border border-white/[0.04] p-5 rounded-xl space-y-5">
                {/* Judul & Fokus */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[13px] font-semibold text-white">Informasi Kebutuhan</h3>
                    <button onClick={() => setStep(1)} className="text-[11px] text-primary hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 text-[12px]">
                    <div className="text-white/40">Judul</div><div className="text-white font-medium">{title}</div>
                    <div className="text-white/40">Layanan</div><div className="text-white capitalize">{serviceType?.replace(/_/g, " ")}</div>
                    <div className="text-white/40">Tujuan</div><div className="text-white">{usagePurpose}</div>
                    <div className="text-white/40">Thumbnail / Banner</div>
                    <div className="text-white flex items-center gap-2">
                      <div className="h-8 w-14 rounded bg-black/40 overflow-hidden border border-white/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbnail || (selectedVehicles.length > 0 ? vehicles.find((v) => v.id === selectedVehicles[0])?.image : null) || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200"}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] text-white/60">Terpasang</span>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* Brief */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[13px] font-semibold text-white">Brief & Hasil Pekerjaan</h3>
                    <button onClick={() => setStep(2)} className="text-[11px] text-primary hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 text-[12px]">
                    <div className="text-white/40">Jumlah Hasil</div><div className="text-white">{outputCount} Final</div>
                    <div className="text-white/40">Spesifikasi</div><div className="text-white">{outputSpecs}, {outputDuration}</div>
                    <div className="text-white/40">Batas Revisi</div><div className="text-white">{revisionLimit || "0"} Kali</div>
                    <div className="text-white/40">Hak Penggunaan</div><div className="text-white">{usageRights}</div>
                    {visualReferences && (
                      <>
                        <div className="text-white/40">Referensi Visual</div>
                        <div className="text-primary truncate">
                          <a
                            href={visualReferences.trim().startsWith("http://") || visualReferences.trim().startsWith("https://") ? visualReferences.trim() : `https://${visualReferences.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <ExternalLink className="size-3 shrink-0" />
                            <span className="truncate">{visualReferences}</span>
                          </a>
                        </div>
                      </>
                    )}
                    {isEditingIncluded && !isFootageIncluded && sourceMaterialUrl && (
                      <>
                        <div className="text-white/40">Materi Mentah</div>
                        <div className="text-primary truncate">
                          <a
                            href={sourceMaterialUrl.trim().startsWith("http://") || sourceMaterialUrl.trim().startsWith("https://") ? sourceMaterialUrl.trim() : `https://${sourceMaterialUrl.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <ExternalLink className="size-3 shrink-0" />
                            <span className="truncate">{sourceMaterialUrl}</span>
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* Budget */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[13px] font-semibold text-white">Budget & Pelaksanaan</h3>
                    <button onClick={() => setStep(3)} className="text-[11px] text-primary hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 text-[12px]">
                    <div className="text-white/40">Fee Pekerjaan</div><div className="text-primary font-medium">Rp {numFeeAmount.toLocaleString("id-ID")}</div>
                    {isFootageIncluded && (
                      <>
                        <div className="text-white/40">Jadwal Produksi</div><div className="text-white">{productionSchedule}</div>
                        {productionLocation && (
                          <>
                            <div className="text-white/40">Lokasi / Alamat</div>
                            <div className="text-primary truncate">
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(productionLocation)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline inline-flex items-center gap-1 font-medium truncate max-w-full"
                              >
                                <MapPin className="size-3 shrink-0" />
                                <span className="truncate">{productionLocation}</span>
                                <ExternalLink className="size-2.5 shrink-0 opacity-70" />
                              </a>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    <div className="text-white/40">Deadline Final</div><div className="text-white">{finalDeadline}</div>
                  </div>
                </div>
              </div>

              {/* Payment & Activation Notice */}
              <div className="p-4 rounded-xl bg-primary/[0.05] border border-primary/20 flex items-start gap-3 text-xs text-white/80 leading-relaxed">
                <Info className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-primary block mb-0.5">Alur Pembayaran & Aktivasi Kampanye</span>
                  Kampanye yang dibuat akan disimpan sebagai <span className="text-white font-medium">Draft (Menunggu Pembayaran)</span>. Kampanye baru akan aktif dan otomatis didistribusikan ke dashboard & feed kreator setelah pembayaran alokasi budget diselesaikan.
                </div>
              </div>

              {error && <p className="text-[12px] text-red-400 font-medium">{error}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/[0.05]">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || isPending}
            className="gap-1.5 text-[12px] text-white/30 hover:text-white/60 disabled:opacity-20"
          >
            <ChevronLeft className="size-4" /> Kembali
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              className="gap-1.5 h-9 px-5 rounded-lg text-[12px] font-semibold bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-colors"
            >
              Lanjut <ChevronRight className="size-4" />
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isPending}
                className="h-9 px-5 rounded-lg text-[12px] font-medium border-white/10 bg-transparent hover:bg-white/5 text-white w-full sm:w-auto"
              >
                Simpan Draft
              </Button>
              <Button
                onClick={() => handleSubmit("draft")}
                disabled={isPending}
                className="gap-2 h-9 px-6 rounded-lg text-[12px] font-bold bg-primary text-black hover:bg-primary/90 shadow-sm transition-all w-full sm:w-auto"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : "Buat & Lanjut ke Pembayaran"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
