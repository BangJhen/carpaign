"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Info, Building2, MapPin, AlertCircle, Eye, Video, CircleDollarSign, ExternalLink, Check } from "lucide-react";
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
  "Boleh di-repost akun dealer & digunakan untuk Ads berbayar",
  "Boleh di-repost di akun media sosial dealer (Organik Saja)",
  "Hak Cipta Penuh dialihkan ke Dealer (Full Commercial Ownership)",
  "Hanya tayang di akun kreator (Tanpa Hak Repost / Ads)",
  "Bebas digunakan untuk materi promosi & arsip showroom dealer",
];

const steps = [
  "Informasi Campaign",
  "Brief & Hasil Konten",
  "Budget & Pelaksanaan",
  "Tinjau & Buat Campaign",
];

export function UgcCampaignForm({
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
  const [promotionalFocus, setPromotionalFocus] = useState<"dealer" | "single_unit" | "multiple_units">("dealer");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [mainObjective, setMainObjective] = useState("");
  const [audienceRegion, setAudienceRegion] = useState("Nasional (Seluruh Indonesia)");
  const [publishPlatforms, setPublishPlatforms] = useState("TikTok, Instagram Reels");

  const togglePublishPlatform = (platformId: string) => {
    clearFieldError("publishPlatforms");
    const current = publishPlatforms
      ? publishPlatforms.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    let next: string[];
    if (current.includes(platformId)) {
      next = current.filter((p) => p !== platformId);
    } else {
      next = [...current, platformId];
    }
    setPublishPlatforms(next.join(", "));
  };

  // Step 2 State
  const [contentType, setContentType] = useState("Review Unit");
  const [contentGuidelines, setContentGuidelines] = useState("");
  const [mandatoryPoints, setMandatoryPoints] = useState("");
  const [videosPerCreator, setVideosPerCreator] = useState("1");
  const [videoSpecs, setVideoSpecs] = useState("30 - 60 Detik");
  const [cta, setCta] = useState("");
  const [captionHashtagTags, setCaptionHashtagTags] = useState("");
  const [references, setReferences] = useState("");
  const [revisionLimit, setRevisionLimit] = useState("1");
  const [requiredDeliverables, setRequiredDeliverables] = useState<"publish" | "file" | "both">("publish");
  const [usageRights, setUsageRights] = useState("Boleh di-repost akun dealer & digunakan untuk Ads berbayar");

  // Step 3 State
  const [creatorCount, setCreatorCount] = useState("3");
  const [feePerCreator, setFeePerCreator] = useState("500.000");
  const [productionMethod, setProductionMethod] = useState<"visit" | "remote">("visit");
  const [productionLocation, setProductionLocation] = useState("");
  const [productionDateRange, setProductionDateRange] = useState("1 Okt 2026 - 10 Okt 2026");
  const [draftDeadline, setDraftDeadline] = useState("5 Okt 2026");
  const [publishDeadline, setPublishDeadline] = useState("12 Okt 2026");
  const [creatorCriteria, setCreatorCriteria] = useState("Niche Otomotif / Lifestyle, Min. 5k Followers, Engagement Rate > 3%");
  const [transportationTerms, setTransportationTerms] = useState("Termasuk dalam fee atau ditanggung kreator");

  const numCreatorCount = parseInt(creatorCount || "0", 10) || 0;
  const numFeePerCreator = parseInt(feePerCreator.replace(/\./g, "") || "0", 10) || 0;
  const numBudget = numCreatorCount * numFeePerCreator;

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

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!title.trim()) {
        newErrors.title = "Judul campaign wajib diisi";
      } else if (title.trim().length < 3) {
        newErrors.title = "Judul campaign minimal 3 karakter";
      }

      if (!promotionalFocus) {
        newErrors.promotionalFocus = "Pilih fokus promosi";
      }

      if (promotionalFocus !== "dealer" && selectedVehicles.length === 0) {
        newErrors.selectedVehicles = "Pilih minimal satu unit kendaraan dari inventory";
      }

      if (!mainObjective.trim()) {
        newErrors.mainObjective = "Tujuan utama campaign wajib diisi";
      }

      if (!audienceRegion.trim()) {
        newErrors.audienceRegion = "Target wilayah audiens wajib diisi";
      }

      if (!publishPlatforms.trim()) {
        newErrors.publishPlatforms = "Platform publikasi wajib diisi";
      }
    }

    if (currentStep === 2) {
      if (!contentType) {
        newErrors.contentType = "Pilih tipe konten";
      }

      if (!contentGuidelines.trim()) {
        newErrors.contentGuidelines = "Arahan konten wajib diisi";
      }

      const numVideos = parseInt(videosPerCreator, 10);
      if (!videosPerCreator || isNaN(numVideos) || numVideos < 1) {
        newErrors.videosPerCreator = "Jumlah video harus minimal 1";
      }

      if (!videoSpecs.trim()) {
        newErrors.videoSpecs = "Ketentuan & spesifikasi video wajib diisi";
      }

      if (!requiredDeliverables) {
        newErrors.requiredDeliverables = "Pilih hasil yang dibutuhkan";
      }

      if (!usageRights.trim()) {
        newErrors.usageRights = "Hak penggunaan konten wajib diisi";
      }

      const numRevis = parseInt(revisionLimit, 10);
      if (revisionLimit === "" || isNaN(numRevis) || numRevis < 0) {
        newErrors.revisionLimit = "Batas revisi harus berupa angka (minimal 0)";
      }

      if (references.trim() && !references.startsWith("http://") && !references.startsWith("https://") && !references.includes(".")) {
        newErrors.references = "Format referensi harus berupa link URL yang valid";
      }
    }

    if (currentStep === 3) {
      const numCreators = parseInt(creatorCount, 10);
      if (!creatorCount || isNaN(numCreators) || numCreators < 1) {
        newErrors.creatorCount = "Jumlah kreator harus minimal 1 orang";
      }

      const rawFee = feePerCreator.replace(/\./g, "").trim();
      const numFee = parseInt(rawFee, 10);
      if (!rawFee || isNaN(numFee) || numFee <= 0) {
        newErrors.feePerCreator = "Fee per kreator harus berupa nominal lebih dari 0";
      } else if (numFee < 100000) {
        newErrors.feePerCreator = "Fee per kreator minimal Rp 100.000";
      }

      if (productionMethod === "visit" && !productionLocation.trim()) {
        newErrors.productionLocation = "Lokasi produksi / alamat dealer wajib diisi";
      }

      if (!productionDateRange.trim()) {
        newErrors.productionDateRange = "Jadwal produksi wajib ditentukan";
      }

      if (!draftDeadline.trim()) {
        newErrors.draftDeadline = "Batas penyerahan draf wajib ditentukan";
      }

      if (!publishDeadline.trim()) {
        newErrors.publishDeadline = "Batas publikasi/penyerahan final wajib ditentukan";
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

  const handleSubmit = (status: "draft" | "active") => {
    setError("");
    startTransition(async () => {
      try {
        const payload = {
          title,
          promotionalFocus,
          vehicles: selectedVehicles,
          type: "UGC/Review" as const,
          budget: numBudget,
          startDate: productionDateRange.split(" - ")[0] || draftDeadline, // fallback to draftDeadline if range format is weird
          deadline: publishDeadline,
          status,
          details: {
            thumbnail: thumbnail || (selectedVehicles.length > 0 ? vehicles.find((v) => v.id === selectedVehicles[0])?.image : null) || null,
            mainObjective,
            audienceRegion,
            publishPlatforms,
            
            contentType,
            contentGuidelines,
            mandatoryPoints,
            videosPerCreator: parseInt(videosPerCreator, 10),
            videoSpecs,
            cta,
            captionHashtagTags,
            references,
            revisionLimit: parseInt(revisionLimit, 10),
            requiredDeliverables,
            usageRights,

            creatorCount: parseInt(creatorCount, 10),
            feePerCreator: numFeePerCreator,
            productionMethod,
            productionLocation,
            productionDateRange,
            draftDeadline,
            creatorCriteria,
            transportationTerms,
          }
        };

        const res = await createCampaign(payload);
        if (res.success) {
          toast.success("Kampanye berhasil dibuat! Selesaikan pembayaran agar kampanye aktif dan didistribusikan ke kreator.");
          router.push(res?.campaignId ? `/dealer/campaigns?payCampaignId=${res.campaignId}` : "/dealer/campaigns");
        }
      } catch (err: any) {
        setError(err.message || "Gagal menyimpan kampanye");
        toast.error(err.message || "Gagal menyimpan kampanye");
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
          <h1 className="text-xl font-semibold text-white">Buat Campaign UGC/Review</h1>
          <p className="text-[12px] text-white/40">Membangun kepercayaan dan mendorong sales</p>
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
          {/* STEP 1: Informasi Campaign */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Informasi Campaign</h2>
                <p className="text-[12px] text-white/40 mt-1">Menentukan objek promosi dan tujuan konten.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Judul Campaign {!title.trim() && <span className="text-red-400">*</span>}</label>
                  <Input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      clearFieldError("title");
                    }}
                    placeholder="Contoh: Review Mobil Keluarga di Dealer ABC"
                    className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.title && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.title && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Fokus Promosi {!promotionalFocus && <span className="text-red-400">*</span>}</label>
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

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Tujuan Utama {!mainObjective.trim() && <span className="text-red-400">*</span>}</label>
                  <Input
                    value={mainObjective}
                    onChange={(e) => {
                      setMainObjective(e.target.value);
                      clearFieldError("mainObjective");
                    }}
                    placeholder="Contoh: Kunjungan showroom, WhatsApp dealer, request test drive"
                    className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.mainObjective && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.mainObjective && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.mainObjective}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Target Wilayah Audiens {!audienceRegion && <span className="text-red-400">*</span>}</label>
                    <Select
                      value={audienceRegion}
                      onValueChange={(val) => {
                        setAudienceRegion(val);
                        clearFieldError("audienceRegion");
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "bg-white/5 border-white/10 text-white",
                          errors.audienceRegion && "border-red-500/60 bg-red-500/[0.03]"
                        )}
                      >
                        <SelectValue placeholder="Pilih Target Wilayah" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                        <SelectItem value="Nasional (Seluruh Indonesia)">Nasional (Seluruh Indonesia)</SelectItem>
                        <SelectItem value="Jabodetabek">Jabodetabek</SelectItem>
                        <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                        <SelectItem value="Jawa Tengah & DIY">Jawa Tengah &amp; DIY</SelectItem>
                        <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                        <SelectItem value="Sumatera">Sumatera</SelectItem>
                        <SelectItem value="Bali & Nusa Tenggara">Bali &amp; Nusa Tenggara</SelectItem>
                        <SelectItem value="Kalimantan">Kalimantan</SelectItem>
                        <SelectItem value="Sulawesi">Sulawesi</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.audienceRegion && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.audienceRegion}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Platform Publikasi {!publishPlatforms.trim() && <span className="text-red-400">*</span>}</label>
                    <div className="flex items-center gap-2 pt-0.5">
                      {TARGET_PLATFORMS.map((p) => {
                        const Icon = p.icon;
                        const isSelected = publishPlatforms
                          .split(",")
                          .map((s) => s.trim())
                          .includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => togglePublishPlatform(p.id)}
                            title={p.label}
                            aria-label={p.label}
                            className={cn(
                              "size-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer select-none relative group",
                              isSelected
                                ? "bg-primary/15 border-primary/50 text-primary shadow-xs ring-1 ring-primary/25"
                                : "bg-white/[0.02] border-white/10 text-white/40 hover:bg-white/[0.06] hover:text-white hover:border-white/20"
                            )}
                          >
                            <Icon className="size-4.5 transition-transform group-hover:scale-110" />
                          </button>
                        );
                      })}
                    </div>
                    {errors.publishPlatforms && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.publishPlatforms}</p>}
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
                    campaignType="UGC / Review"
                    error={errors.thumbnail}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Brief & Hasil Konten */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Brief & Hasil Konten</h2>
                <p className="text-[12px] text-white/40 mt-1">Menentukan konten yang harus dibuat kreator.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Tipe Konten {!contentType.trim() && <span className="text-red-400">*</span>}</label>
                  <Select value={contentType} onValueChange={(val: any) => {
                    setContentType(val);
                    clearFieldError("contentType");
                  }}>
                    <SelectTrigger className={cn("bg-white/5 border-white/10 text-white", errors.contentType && "border-red-500/60 bg-red-500/[0.03]")}>
                      <SelectValue placeholder="Review Unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="Review Unit">Review Unit</SelectItem>
                      <SelectItem value="Showroom Tour">Showroom Tour</SelectItem>
                      <SelectItem value="Pengalaman Layanan">Pengalaman Layanan</SelectItem>
                      <SelectItem value="Showcase Beberapa Unit">Showcase Beberapa Unit</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.contentType && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.contentType}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Arahan Konten {!contentGuidelines.trim() && <span className="text-red-400">*</span>}</label>
                  <Textarea
                    value={contentGuidelines}
                    onChange={(e) => {
                      setContentGuidelines(e.target.value);
                      clearFieldError("contentGuidelines");
                    }}
                    placeholder="Contoh: Tampilkan interior, kapasitas bagasi, dan kondisi unit..."
                    className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]", errors.contentGuidelines && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.contentGuidelines && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.contentGuidelines}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Poin Wajib Disebutkan (Opsional)</label>
                  <Textarea
                    value={mandatoryPoints}
                    onChange={(e) => setMandatoryPoints(e.target.value)}
                    placeholder="Contoh: Nama dealer, lokasi, harga yang sudah dikonfirmasi..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[60px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Jumlah Video per Kreator {!videosPerCreator.trim() && <span className="text-red-400">*</span>}</label>
                    <Input
                      type="number"
                      min="1"
                      value={videosPerCreator}
                      onChange={(e) => {
                        setVideosPerCreator(e.target.value);
                        clearFieldError("videosPerCreator");
                      }}
                      className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.videosPerCreator && "border-red-500/60 bg-red-500/[0.03]")}
                    />
                    {errors.videosPerCreator && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.videosPerCreator}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Durasi Video {!videoSpecs && <span className="text-red-400">*</span>}</label>
                    <Select
                      value={videoSpecs}
                      onValueChange={(val) => {
                        setVideoSpecs(val);
                        clearFieldError("videoSpecs");
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "bg-white/5 border-white/10 text-white",
                          errors.videoSpecs && "border-red-500/60 bg-red-500/[0.03]"
                        )}
                      >
                        <SelectValue placeholder="Pilih Durasi Video" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                        <SelectItem value="30 - 60 Detik">30 - 60 Detik</SelectItem>
                        <SelectItem value="1 - 3 Menit">1 - 3 Menit</SelectItem>
                        <SelectItem value="3 - 5 Menit">3 - 5 Menit</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.videoSpecs && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.videoSpecs}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Call-to-Action (CTA)</label>
                    <Input
                      value={cta}
                      onChange={(e) => setCta(e.target.value)}
                      placeholder="Hubungi WhatsApp dealer untuk jadwal kunjungan"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Caption, Hashtag, dan Tag</label>
                    <Input
                      value={captionHashtagTags}
                      onChange={(e) => setCaptionHashtagTags(e.target.value)}
                      placeholder="Tag akun dealer dan hashtag campaign"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-white/40">Referensi atau Materi Pendukung (Opsional)</label>
                    {references && (
                      <a
                        href={references.startsWith("http://") || references.startsWith("https://") ? references : `https://${references}`}
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
                      value={references}
                      onChange={(e) => {
                        setReferences(e.target.value);
                        clearFieldError("references");
                      }}
                      placeholder="Link contoh video, spesifikasi, foto unit (https://...)"
                      className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20 pr-10", errors.references && "border-red-500/60 bg-red-500/[0.03]")}
                    />
                    {references && (
                      <a
                        href={references.startsWith("http://") || references.startsWith("https://") ? references : `https://${references}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka link di tab baru"
                        className="absolute right-3 p-1 rounded-md text-white/40 hover:text-primary hover:bg-white/5 transition-colors"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                  {errors.references && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.references}</p>}
                </div>

                {/* Deliverables and Revision Container */}
                <div className="bg-[#17191d] border border-white/[0.04] p-5 rounded-xl space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Hasil yang Dibutuhkan {!requiredDeliverables && <span className="text-red-400">*</span>}</label>
                    <Select value={requiredDeliverables} onValueChange={(val: any) => {
                      setRequiredDeliverables(val);
                      clearFieldError("requiredDeliverables");
                    }}>
                      <SelectTrigger className={cn("bg-white/5 border-white/10 text-white", errors.requiredDeliverables && "border-red-500/60 bg-red-500/[0.03]")}>
                        <SelectValue placeholder="Video dipublikasikan di akun kreator" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                        <SelectItem value="publish">Video dipublikasikan di akun kreator</SelectItem>
                        <SelectItem value="file">File video diserahkan kepada dealer</SelectItem>
                        <SelectItem value="both">Keduanya (Distribusi & Aset Konten)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.requiredDeliverables && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.requiredDeliverables}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Hak Penggunaan Konten {!usageRights.trim() && <span className="text-red-400">*</span>}</label>
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
                  
                  {/* Spaced out Batas Revisi section */}
                  <div className="pt-4 border-t border-white/[0.06] space-y-2">
                    <label className="text-[11px] font-medium text-white/40 block">Batas Revisi {!revisionLimit.trim() && <span className="text-red-400">*</span>}</label>
                    <Input
                      type="number"
                      min="0"
                      value={revisionLimit}
                      onChange={(e) => {
                        setRevisionLimit(e.target.value);
                        clearFieldError("revisionLimit");
                      }}
                      placeholder="1"
                      className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20 w-full sm:max-w-[180px]", errors.revisionLimit && "border-red-500/60 bg-red-500/[0.03]")}
                    />
                    <p className="text-[10px] text-white/35">Maksimal pengajuan revisi minor per konten.</p>
                    {errors.revisionLimit && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.revisionLimit}</p>}
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
                <p className="text-[12px] text-white/40 mt-1">Mengatur fee, jumlah kreator, lokasi, dan jadwal.</p>
              </div>

              <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                <div className="size-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="size-3.5 text-primary" />
                </div>
                <p className="text-[12px] text-white/60 leading-relaxed">
                  Fee UGC adalah fee tetap per kreator berdasarkan pekerjaan yang disepakati. Fee akan dicadangkan dari budget saat kreator Anda setujui.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Jumlah Kreator {!creatorCount.trim() && <span className="text-red-400">*</span>}</label>
                  <Input
                    type="number"
                    min="1"
                    value={creatorCount}
                    onChange={(e) => {
                      setCreatorCount(e.target.value);
                      clearFieldError("creatorCount");
                    }}
                    placeholder="Contoh: 4"
                    className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.creatorCount && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.creatorCount && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.creatorCount}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Fee per Kreator {!feePerCreator.trim() && <span className="text-red-400">*</span>}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/25">Rp</span>
                    <Input
                      value={feePerCreator}
                      onChange={(e) => {
                        setFeePerCreator(e.target.value);
                        clearFieldError("feePerCreator");
                      }}
                      placeholder="300.000"
                      className={cn("pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.feePerCreator && "border-red-500/60 bg-red-500/[0.03]")}
                    />
                  </div>
                  {errors.feePerCreator && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.feePerCreator}</p>}
                </div>
              </div>

              <div className="bg-[#17191d] border border-white/[0.04] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-white/40 mb-0.5">Budget Pembayaran Kreator</p>
                  <p className="text-[16px] font-semibold text-primary">Rp {numBudget.toLocaleString("id-ID")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Metode Produksi {!productionMethod && <span className="text-red-400">*</span>}</label>
                  <Select value={productionMethod} onValueChange={(val: any) => {
                    setProductionMethod(val);
                    clearFieldError("productionMethod");
                  }}>
                    <SelectTrigger className={cn("bg-white/5 border-white/10 text-white", errors.productionMethod && "border-red-500/60 bg-red-500/[0.03]")}>
                      <SelectValue placeholder="Kunjungan ke Dealer" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="visit">Kunjungan ke Dealer</SelectItem>
                      <SelectItem value="remote">Produksi Jarak Jauh</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.productionMethod && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.productionMethod}</p>}
                </div>
                
                {productionMethod === "visit" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-white/40">Lokasi Produksi / Alamat Dealer {!productionLocation.trim() && <span className="text-red-400">*</span>}</label>
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
                        placeholder="Contoh: Jl. Soekarno Hatta No.57"
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
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/40">Ketentuan Transportasi</label>
                <Input
                  value={transportationTerms}
                  onChange={(e) => setTransportationTerms(e.target.value)}
                  placeholder="Contoh: Termasuk dalam fee, atau ditanggung terpisah"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/40">Rentang Jadwal Produksi {!productionDateRange.trim() && <span className="text-red-400">*</span>}</label>
                <Input
                  value={productionDateRange}
                  onChange={(e) => {
                    setProductionDateRange(e.target.value);
                    clearFieldError("productionDateRange");
                  }}
                  placeholder="Contoh: 10 Nov - 15 Nov 2026"
                  className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.productionDateRange && "border-red-500/60 bg-red-500/[0.03]")}
                />
                {errors.productionDateRange && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.productionDateRange}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Batas Pengumpulan Draft {!draftDeadline.trim() && <span className="text-red-400">*</span>}</label>
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
                  <label className="text-[11px] font-medium text-white/40">Batas Publikasi {!publishDeadline.trim() && <span className="text-red-400">*</span>}</label>
                  <Input
                    type="date"
                    value={publishDeadline}
                    onChange={(e) => {
                      setPublishDeadline(e.target.value);
                      clearFieldError("publishDeadline");
                    }}
                    className={cn("bg-white/5 border-white/10 text-white [color-scheme:dark]", errors.publishDeadline && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.publishDeadline && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.publishDeadline}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/40">Kriteria Kreator (Wilayah, Kategori, Syarat Akun)</label>
                <Textarea
                  value={creatorCriteria}
                  onChange={(e) => setCreatorCriteria(e.target.value)}
                  placeholder="Contoh: Berdomisili di Jakarta, kategori otomotif, min 5K followers..."
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
                <p className="text-[12px] text-white/40 mt-1">Periksa seluruh informasi dan preview tampilan sebelum diluncurkan.</p>
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
                        Simulasi bagaimana campaign UGC ini akan ditampilkan kepada kreator otomotif.
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
                              "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200"
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
                                <Video className="size-3" /> UGC / REVIEW
                              </span>
                              <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
                                Kuota: {numCreatorCount} Kreator
                              </span>
                            </div>
                            
                            <h4 className="font-bold text-[15px] text-white line-clamp-1 mb-1.5">
                              {title || "Judul Campaign UGC"}
                            </h4>
                            
                            <p className="text-[12px] text-white/60 line-clamp-2 leading-relaxed mb-3">
                              {mainObjective || "Buat video ulasan autentik mengenai fitur dan performa kendaraan."}
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
                              <span className="text-[10px] text-white/40 block">Fee per Kreator</span>
                              <div className="flex items-center gap-1.5">
                                <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                  <CircleDollarSign className="size-3.5" />
                                </div>
                                <p className="text-[13px] font-bold text-white">
                                  Rp {numFeePerCreator.toLocaleString("id-ID")}
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
                            "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200"
                          }
                          alt={title || "Campaign Thumbnail"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-primary/10 border-primary/30 text-primary flex items-center gap-1">
                                <Video className="size-3" /> UGC / REVIEW
                              </Badge>
                              <span className="text-[10px] text-white/60 bg-black/60 border border-white/10 px-2 py-0.5 rounded">
                                {audienceRegion}
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                              {title || "Judul Campaign"}
                            </h3>
                            <p className="text-[12px] text-white/70 mt-0.5">Dealer Showroom</p>
                          </div>

                          <div className="flex flex-col sm:items-end gap-0.5 shrink-0">
                            <span className="text-[10px] text-white/40">Imbalan / Fee</span>
                            <div className="flex items-center gap-1.5 text-lg font-extrabold text-primary">
                              <CircleDollarSign className="size-4" />
                              Rp {numFeePerCreator.toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rule Badges & Sisa Budget */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
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
                          <span className="text-[10px] text-white/40 block">Target Kreator</span>
                          <span className="text-white font-semibold">{numCreatorCount} Kreator</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111316] border border-white/[0.06]">
                          <span className="text-[10px] text-white/40 block">Format Video</span>
                          <span className="text-white font-semibold">{contentType}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111316] border border-white/[0.06]">
                          <span className="text-[10px] text-white/40 block">Batas Revisi</span>
                          <span className="text-white font-semibold">{revisionLimit || "0"} Kali</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#111316] border border-white/[0.06] space-y-2 text-[12px]">
                        <span className="font-semibold text-white">Arahan Konten</span>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                          {contentGuidelines || "Buat konten review unit dengan menonjolkan keunggulan spesifikasi, kenyamanan, dan program promo terkini."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[11px] text-white/60">
                          Kreator dapat langsung mendaftar & mengirim pengajuan konten.
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white text-black font-bold text-[12px] shadow-sm">
                          Daftar & Ajukan Diri
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
                    <h3 className="text-[13px] font-semibold text-white">Informasi Dasar</h3>
                    <button onClick={() => setStep(1)} className="text-[11px] text-primary hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 text-[12px]">
                    <div className="text-white/40">Judul</div><div className="text-white font-medium">{title}</div>
                    <div className="text-white/40">Fokus</div><div className="text-white">{promotionalFocus}</div>
                    <div className="text-white/40">Tujuan</div><div className="text-white">{mainObjective}</div>
                    <div className="text-white/40">Thumbnail / Banner</div>
                    <div className="text-white flex items-center gap-2">
                      <div className="h-8 w-14 rounded bg-black/40 overflow-hidden border border-white/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbnail || (selectedVehicles.length > 0 ? vehicles.find((v) => v.id === selectedVehicles[0])?.image : null) || "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200"}
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
                    <h3 className="text-[13px] font-semibold text-white">Brief & Hasil Konten</h3>
                    <button onClick={() => setStep(2)} className="text-[11px] text-primary hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 text-[12px]">
                    <div className="text-white/40">Tipe Konten</div><div className="text-white">{contentType}</div>
                    <div className="text-white/40">Video/Kreator</div><div className="text-white">{videosPerCreator} Video</div>
                    <div className="text-white/40">Hasil Dibutuhkan</div><div className="text-white">{requiredDeliverables === "publish" ? "Publikasi" : requiredDeliverables === "file" ? "File Saja" : "Keduanya"}</div>
                    <div className="text-white/40">Hak Penggunaan</div><div className="text-white">{usageRights}</div>
                    {references && (
                      <>
                        <div className="text-white/40">Referensi / Materi</div>
                        <div>
                          <a
                            href={references.startsWith("http://") || references.startsWith("https://") ? references : `https://${references}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1 font-medium truncate max-w-full"
                          >
                            <ExternalLink className="size-3 shrink-0" />
                            <span className="truncate">{references}</span>
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
                    <div className="text-white/40">Kreator</div><div className="text-white">{numCreatorCount} Kreator</div>
                    <div className="text-white/40">Fee/Kreator</div><div className="text-white">Rp {numFeePerCreator.toLocaleString("id-ID")}</div>
                    <div className="text-white/40">Total Budget</div><div className="text-primary font-medium">Rp {numBudget.toLocaleString("id-ID")}</div>
                    {productionMethod === "visit" && productionLocation && (
                      <>
                        <div className="text-white/40">Lokasi / Alamat</div>
                        <div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(productionLocation)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1 font-medium truncate max-w-full"
                          >
                            <MapPin className="size-3 shrink-0" />
                            <span className="truncate">{productionLocation}</span>
                            <ExternalLink className="size-2.5 shrink-0 opacity-70" />
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment & Activation Notice */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3.5 text-xs text-white/60 leading-relaxed">
                <div className="size-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="size-3.5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold text-white/90 block mb-0.5">Alur Pembayaran & Aktivasi Kampanye</span>
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
