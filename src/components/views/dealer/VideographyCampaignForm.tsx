"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Info, Building2, MapPin, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCampaign } from "@/app/actions/campaigns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Vehicle = { id: string; name: string; location: string; image?: string | null };

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
  const [usagePurpose, setUsagePurpose] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("");

  // Step 2 State
  const [shotList, setShotList] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [sourceMaterialUrl, setSourceMaterialUrl] = useState("");
  const [editingGuidelines, setEditingGuidelines] = useState("");
  const [outputCount, setOutputCount] = useState("1");
  const [outputDuration, setOutputDuration] = useState("30-60 detik");
  const [outputSpecs, setOutputSpecs] = useState("Vertikal (9:16), 1080p 60fps");
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
          type: "Videographer" as const,
          budget: numFeeAmount,
          startDate: productionSchedule.split(" - ")[0] || sourceMaterialDate || draftDeadline,
          deadline: finalDeadline,
          status,
          details: {
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

        await createCampaign(payload);
        router.push("/dealer/campaigns");
      } catch (e) {
        console.error(e);
        setError("Gagal menyimpan campaign. Silakan coba lagi.");
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
          <h1 className="text-xl font-semibold text-white">Buat Campaign Videography / Edit</h1>
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
                      <SelectValue placeholder="Pilih jenis layanan" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="footage_only">Pengambilan Footage Saja</SelectItem>
                      <SelectItem value="edit_only">Editing Saja</SelectItem>
                      <SelectItem value="footage_and_edit">Pengambilan Footage + Editing</SelectItem>
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
                      <SelectValue placeholder="Pilih objek konten" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="dealer">Dealer / Showroom</SelectItem>
                      <SelectItem value="single_unit">Satu Unit Kendaraan</SelectItem>
                      <SelectItem value="multiple_units">Beberapa Unit Kendaraan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.promotionalFocus && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.promotionalFocus}</p>}
                </div>

                {promotionalFocus !== "dealer" && (
                  <div className={cn("space-y-2 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl", errors.selectedVehicles && "border-red-500/40 bg-red-500/[0.02]")}>
                    <label className="text-[11px] font-medium text-white/40 mb-2 block">Pilih Unit dari Inventory <span className="text-red-400">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {vehicles.length === 0 ? (
                        <p className="text-[12px] text-white/30 p-2">Inventory kosong. Harap tambah kendaraan terlebih dahulu.</p>
                      ) : (
                        vehicles.map((v) => {
                          const isSelected = selectedVehicles.includes(v.id);
                          return (
                            <button
                              key={v.id}
                              onClick={() => toggleVehicle(v.id)}
                              className="text-left p-3 rounded-lg border transition-all flex gap-3 items-center"
                              style={
                                isSelected
                                  ? { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.2)" }
                                  : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }
                              }
                            >
                              <div className="size-10 rounded bg-[#1a1c20] overflow-hidden shrink-0">
                                {v.image ? <img src={v.image} alt={v.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><Building2 className="size-4" /></div>}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[12px] font-medium text-white truncate">{v.name}</p>
                                <p className="text-[10px] text-white/35 truncate flex items-center gap-1"><MapPin className="size-3" /> {v.location}</p>
                              </div>
                            </button>
                          )
                        })
                      )}
                    </div>
                    {errors.selectedVehicles && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.selectedVehicles}</p>}
                  </div>
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
                    <label className="text-[11px] font-medium text-white/40">Platform Tujuan <span className="text-red-400">*</span></label>
                    <Input
                      value={targetPlatform}
                      onChange={(e) => {
                        setTargetPlatform(e.target.value);
                        clearFieldError("targetPlatform");
                      }}
                      placeholder="TikTok, IG Reels, YouTube"
                      className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.targetPlatform && "border-red-500/60 bg-red-500/[0.03]")}
                    />
                    {errors.targetPlatform && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.targetPlatform}</p>}
                  </div>
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
                        <label className="text-[11px] font-medium text-white/40">Link Materi Sumber (Drive/Dropbox) <span className="text-red-400">*</span></label>
                        <Input
                          value={sourceMaterialUrl}
                          onChange={(e) => {
                            setSourceMaterialUrl(e.target.value);
                            clearFieldError("sourceMaterialUrl");
                          }}
                          placeholder="Link folder berisi aset video mentah (https://...)"
                          className={cn("bg-[#1a1c20] border-white/10 text-white placeholder:text-white/20", errors.sourceMaterialUrl && "border-red-500/60 bg-red-500/[0.03]")}
                        />
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
                      <Input
                        type="number"
                        min="1"
                        value={outputCount}
                        onChange={(e) => {
                          setOutputCount(e.target.value);
                          clearFieldError("outputCount");
                        }}
                        placeholder="Contoh: 5"
                        className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.outputCount && "border-red-500/60 bg-red-500/[0.03]")}
                      />
                      {errors.outputCount && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.outputCount}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Durasi (Per Video) <span className="text-red-400">*</span></label>
                      <Input
                        value={outputDuration}
                        onChange={(e) => {
                          setOutputDuration(e.target.value);
                          clearFieldError("outputDuration");
                        }}
                        placeholder="30-60 detik"
                        className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.outputDuration && "border-red-500/60 bg-red-500/[0.03]")}
                      />
                      {errors.outputDuration && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.outputDuration}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Rasio & Resolusi <span className="text-red-400">*</span></label>
                      <Input
                        value={outputSpecs}
                        onChange={(e) => {
                          setOutputSpecs(e.target.value);
                          clearFieldError("outputSpecs");
                        }}
                        placeholder="9:16, Full HD"
                        className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.outputSpecs && "border-red-500/60 bg-red-500/[0.03]")}
                      />
                      {errors.outputSpecs && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.outputSpecs}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Referensi Visual (Opsional)</label>
                      <Input
                        value={visualReferences}
                        onChange={(e) => setVisualReferences(e.target.value)}
                        placeholder="Link referensi gaya konten (https://...)"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
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
                      <Input
                        value={usageRights}
                        onChange={(e) => {
                          setUsageRights(e.target.value);
                          clearFieldError("usageRights");
                        }}
                        placeholder="Komersial, bebas untuk Iklan Ads"
                        className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.usageRights && "border-red-500/60 bg-red-500/[0.03]")}
                      />
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
                      <label className="text-[11px] font-medium text-white/40">Lokasi Pengambilan Gambar <span className="text-red-400">*</span></label>
                      <Input
                        value={productionLocation}
                        onChange={(e) => {
                          setProductionLocation(e.target.value);
                          clearFieldError("productionLocation");
                        }}
                        placeholder="Contoh: Jl. Gatot Subroto No. 45"
                        className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.productionLocation && "border-red-500/60 bg-red-500/[0.03]")}
                      />
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
                <p className="text-[12px] text-white/40 mt-1">Periksa pesanan sebelum pendanaan.</p>
              </div>

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
                      </>
                    )}
                    <div className="text-white/40">Deadline Final</div><div className="text-white">{finalDeadline}</div>
                  </div>
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
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isPending}
                className="h-9 px-5 rounded-lg text-[12px] font-medium border-white/10 bg-transparent hover:bg-white/5 text-white"
              >
                Simpan Draft
              </Button>
              <Button
                onClick={() => handleSubmit("active")}
                disabled={isPending}
                className="gap-2 h-9 px-6 rounded-lg text-[12px] font-bold"
                style={{ background: "var(--primary)", color: "#0a0a0c" }}
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : "Lanjut ke Pembayaran"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
