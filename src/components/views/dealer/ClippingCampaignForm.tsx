"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Info, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock,
  Eye, 
  AlertCircle,
  Scissors,
  CircleDollarSign,
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";
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

const steps = [
  "Informasi Campaign",
  "Materi & Arahan Konten",
  "Budget & Ketentuan",
  "Tinjau & Buat Campaign",
];

const formatNumberId = (val: string | number) => {
  const digits = String(val).replace(/\D/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("id-ID");
};

const parseNumberId = (val: string | number) => {
  const digits = String(val).replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
};

export function ClippingCampaignForm({
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
  const [description, setDescription] = useState("");
  const [audienceRegion, setAudienceRegion] = useState("Nasional (Seluruh Indonesia)");
  const [publishPlatforms, setPublishPlatforms] = useState("TikTok & Instagram Reels");

  // Step 2 State
  const [sourceMaterial, setSourceMaterial] = useState("");
  const [contentGuidelines, setContentGuidelines] = useState("");
  const [mandatoryPoints, setMandatoryPoints] = useState("");
  const [videoSpecs, setVideoSpecs] = useState("30 - 60 Detik");
  const [captionHashtagTags, setCaptionHashtagTags] = useState("");
  const [cta, setCta] = useState("");
  const [forbiddenContent, setForbiddenContent] = useState("");

  // Step 3 State: Budget & Ketentuan
  const [budget, setBudget] = useState("1.000.000");
  const [cpm, setCpm] = useState("15.000");
  const [maxViewsPerClipper, setMaxViewsPerClipper] = useState("100.000");
  const viewsCalculationPeriod = 7;

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

  // Real-time Calculations & Validations
  const numBudget = parseNumberId(budget);
  const numCpm = parseNumberId(cpm);
  const numMaxViews = parseNumberId(maxViewsPerClipper);
  
  const isBudgetInvalid = numBudget > 0 && numBudget < 1000000;
  const isCpmInvalid = numCpm > 0 && numCpm < 500;
  const isMaxViewsInvalid = numMaxViews > 0 && numMaxViews < 10000;

  const estimatedViewsCapacity = numCpm > 0 ? Math.floor((numBudget / numCpm) * 1000) : 0;
  const estimatedMaxPayoutPerClipper = numCpm > 0 && numMaxViews > 0 ? Math.floor((numMaxViews / 1000) * numCpm) : 0;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!title.trim()) {
        newErrors.title = "Judul campaign wajib diisi";
      } else if (title.trim().length < 3) {
        newErrors.title = "Judul minimal 3 karakter";
      }

      if (!promotionalFocus) {
        newErrors.promotionalFocus = "Pilih fokus promosi";
      }

      if (promotionalFocus !== "dealer" && selectedVehicles.length === 0) {
        newErrors.selectedVehicles = "Pilih minimal satu unit kendaraan dari inventory";
      }

      if (!description.trim()) {
        newErrors.description = "Deskripsi campaign wajib diisi";
      }

      if (!audienceRegion.trim()) {
        newErrors.audienceRegion = "Target wilayah audiens wajib diisi";
      }

      if (!publishPlatforms.trim()) {
        newErrors.publishPlatforms = "Platform publikasi wajib diisi";
      }
    }

    if (currentStep === 2) {
      if (!sourceMaterial.trim()) {
        newErrors.sourceMaterial = "Link folder materi sumber wajib diisi";
      } else if (!sourceMaterial.startsWith("http://") && !sourceMaterial.startsWith("https://") && !sourceMaterial.includes(".")) {
        newErrors.sourceMaterial = "Format link materi harus berupa URL valid (contoh: https://...)";
      }

      if (!contentGuidelines.trim()) {
        newErrors.contentGuidelines = "Arahan konten wajib diisi";
      }

      if (!videoSpecs.trim()) {
        newErrors.videoSpecs = "Ketentuan video wajib diisi";
      }
    }

    if (currentStep === 3) {
      if (!budget.trim() || numBudget < 1000000) {
        newErrors.budget = "Minimal budget campaign adalah Rp 1.000.000 (tidak bisa di bawah 1 juta)";
      }

      if (!cpm.trim() || numCpm < 500) {
        newErrors.cpm = "Tarif CPM minimal Rp 500 per 1.000 views";
      }

      if (!maxViewsPerClipper.trim() || numMaxViews < 10000) {
        newErrors.maxViewsPerClipper = "Batas maksimal views minimal 10.000 views per clipper";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setError("");
    if (!validateStep(step)) {
      if (step === 3 && numBudget < 1000000) {
        toast.error("Tidak dapat melanjutkan: Minimal budget campaign adalah Rp 1.000.000");
      }
      return;
    }
    setErrors({});
    setStep((s) => Math.min(4, s + 1));
  };

  const handleSubmit = (status: "draft" | "active") => {
    setError("");
    startTransition(async () => {
      try {
        const now = new Date();
        const deadlineDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const payload = {
          title,
          promotionalFocus,
          vehicles: selectedVehicles,
          type: "Clipping" as const,
          budget: numBudget,
          startDate: now.toISOString(),
          deadline: deadlineDate.toISOString(),
          status,
          details: {
            thumbnail: thumbnail || (selectedVehicles.length > 0 ? vehicles.find((v) => v.id === selectedVehicles[0])?.image : null) || null,
            description,
            audienceRegion,
            publishPlatforms,
            sourceMaterial,
            contentGuidelines,
            mandatoryPoints,
            videoSpecs,
            captionHashtagTags,
            cta,
            forbiddenContent,
            cpm: numCpm,
            maxViewsPerClipper: numMaxViews,
            maxPayoutPerClipper: estimatedMaxPayoutPerClipper,
            durationDays: 30,
            viewsCalculationPeriod: 7,
            maxContentPerClipper: null,
          }
        };

        const res = await createCampaign(payload);
        toast.success("Kampanye berhasil dibuat! Selesaikan pembayaran agar kampanye aktif dan didistribusikan ke kreator.");
        router.push(res?.campaignId ? `/dealer/campaigns?payCampaignId=${res.campaignId}` : "/dealer/campaigns");
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Gagal menyimpan campaign. Silakan coba lagi.");
        toast.error(e.message || "Gagal menyimpan campaign");
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white/40 hover:text-white shrink-0">
          <ChevronLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-white">Buat Campaign Clipping</h1>
          <p className="text-[12px] text-white/40">Meningkatkan awareness brand dan showroom melalui kompilasi konten kreator</p>
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
                <p className="text-[12px] text-white/40 mt-1">Tentukan profil dan fokus promosi campaign clipping Anda.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Judul Campaign <span className="text-red-400">*</span></label>
                  <Input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      clearFieldError("title");
                    }}
                    placeholder="Contoh: Kenalan dengan Showroom Mobil Bekas AutoPremium Jakarta"
                    className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20", errors.title && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.title && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Fokus Promosi <span className="text-red-400">*</span></label>
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
                      <SelectItem value="dealer">Dealer / Showroom Keseluruhan</SelectItem>
                      <SelectItem value="single_unit">Satu Unit Kendaraan Spesifik</SelectItem>
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
                  <label className="text-[11px] font-medium text-white/40">Deskripsi Singkat Campaign <span className="text-red-400">*</span></label>
                  <Textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      clearFieldError("description");
                    }}
                    placeholder="Jelaskan pesan utama yang ingin disampaikan kepada audiens..."
                    className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]", errors.description && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.description && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Target Wilayah Audiens <span className="text-red-400">*</span></label>
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
                    <label className="text-[11px] font-medium text-white/40">Platform Publikasi <span className="text-red-400">*</span></label>
                    <Select
                      value={publishPlatforms}
                      onValueChange={(val) => {
                        setPublishPlatforms(val);
                        clearFieldError("publishPlatforms");
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "bg-white/5 border-white/10 text-white",
                          errors.publishPlatforms && "border-red-500/60 bg-red-500/[0.03]"
                        )}
                      >
                        <SelectValue placeholder="Pilih Platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                        <SelectItem value="TikTok & Instagram Reels">TikTok & Instagram Reels</SelectItem>
                        <SelectItem value="TikTok">TikTok Saja</SelectItem>
                        <SelectItem value="Instagram Reels">Instagram Reels Saja</SelectItem>
                      </SelectContent>
                    </Select>
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
                    campaignType="Clipping"
                    error={errors.thumbnail}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Materi & Arahan Konten */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Materi & Arahan Konten</h2>
                <p className="text-[12px] text-white/40 mt-1">Sediakan bahan footage dan instruksi pembuatan video bagi kreator clipper.</p>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 text-primary/80">
                <Info className="size-5 shrink-0" />
                <p className="text-[12px] leading-relaxed">
                  Layanan Clipping memanfaatkan materi video/foto yang sudah Anda sediakan di folder cloud storage. Pastikan link dapat diakses publik.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-white/40">
                      Materi Sumber (Link Google Drive / Dropbox) <span className="text-red-400">*</span>
                    </label>
                    {sourceMaterial.trim() && (
                      <a
                        href={sourceMaterial.trim().startsWith("http://") || sourceMaterial.trim().startsWith("https://") ? sourceMaterial.trim() : `https://${sourceMaterial.trim()}`}
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
                      value={sourceMaterial}
                      onChange={(e) => {
                        setSourceMaterial(e.target.value);
                        clearFieldError("sourceMaterial");
                      }}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className={cn(
                        "bg-white/5 border-white/10 text-white placeholder:text-white/20",
                        sourceMaterial.trim() && "pr-10",
                        errors.sourceMaterial && "border-red-500/60 bg-red-500/[0.03]"
                      )}
                    />
                    {sourceMaterial.trim() && (
                      <a
                        href={sourceMaterial.trim().startsWith("http://") || sourceMaterial.trim().startsWith("https://") ? sourceMaterial.trim() : `https://${sourceMaterial.trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/50 hover:text-primary hover:bg-white/10 transition-colors"
                        title="Buka link di tab baru"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                  {errors.sourceMaterial && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.sourceMaterial}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Arahan Konten <span className="text-red-400">*</span></label>
                  <Textarea
                    value={contentGuidelines}
                    onChange={(e) => {
                      setContentGuidelines(e.target.value);
                      clearFieldError("contentGuidelines");
                    }}
                    placeholder="Jelaskan gaya editing, hook video, transisi, atau sorotan spesifikasi mobil yang diinginkan..."
                    className={cn("bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]", errors.contentGuidelines && "border-red-500/60 bg-red-500/[0.03]")}
                  />
                  {errors.contentGuidelines && <p className="text-[11px] text-red-400 font-medium mt-1">{errors.contentGuidelines}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Poin Wajib Disebutkan (Opsional)</label>
                  <Textarea
                    value={mandatoryPoints}
                    onChange={(e) => setMandatoryPoints(e.target.value)}
                    placeholder="Contoh: Nama showroom AutoPremium, DP mulai 10 juta, garansi mesin 1 tahun..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[60px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Durasi Video <span className="text-red-400">*</span></label>
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
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Caption, Hashtag, & Tag Akun (Opsional)</label>
                    <Input
                      value={captionHashtagTags}
                      onChange={(e) => setCaptionHashtagTags(e.target.value)}
                      placeholder="#MobilBekasJakarta, tag @AutoPremiumID"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Call-to-Action (CTA) (Opsional)</label>
                  <Input
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="Klik link di bio untuk cek unit tersedia"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-red-400/70">Larangan Konten (Opsional)</label>
                  <Textarea
                    value={forbiddenContent}
                    onChange={(e) => setForbiddenContent(e.target.value)}
                    placeholder="Contoh: Dilarang mengubah informasi harga, jangan menyebut brand kompetitor..."
                    className="bg-white/5 border-red-500/20 text-white placeholder:text-white/20 focus:border-red-500/50 min-h-[60px]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Budget & Ketentuan */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Budget & Ketentuan Pembayaran</h2>
                <p className="text-[12px] text-white/40 mt-1">Tentukan alokasi dana dan batas maksimal perhitungan views bagi setiap kreator.</p>
              </div>

              {/* 1. Total Budget & 2. Tarif CPM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Budget Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-white/40">
                      Total Budget Campaign <span className="text-red-400">*</span>
                    </label>
                    <span className={cn(
                      "text-[10px] font-mono transition-colors",
                      isBudgetInvalid || errors.budget ? "text-red-400 font-semibold" : "text-white/40"
                    )}>
                      Min. Rp 1.000.000
                    </span>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-white/30">Rp</span>
                    <Input
                      value={budget}
                      onChange={(e) => {
                        const formatted = formatNumberId(e.target.value);
                        setBudget(formatted);
                        clearFieldError("budget");
                      }}
                      onBlur={() => {
                        if (numBudget > 0 && numBudget < 1000000) {
                          toast.error("Minimal budget campaign adalah Rp 1.000.000 (tidak bisa di bawah 1 juta)");
                        }
                      }}
                      placeholder="1.000.000"
                      className={cn(
                        "pl-10 bg-white/5 border-white/10 text-white font-medium placeholder:text-white/20 transition-all",
                        (isBudgetInvalid || errors.budget) && "border-red-500/70 bg-red-500/[0.04] text-red-100 ring-1 ring-red-500/30 focus:border-red-500"
                      )}
                    />
                  </div>

                  {/* Real-time Warning / Notification */}
                  {(isBudgetInvalid || errors.budget) ? (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-400 text-[11px] leading-relaxed mt-2"
                    >
                      <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-400" />
                      <div>
                        <p className="font-semibold text-red-300">Budget di bawah batas minimal</p>
                        <p className="text-red-400/90 mt-0.5">
                          Minimal budget campaign adalah <strong>Rp 1.000.000</strong>. Anda tidak dapat membuat campaign dengan budget di bawah 1 juta.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-[10px] text-white/35">Total deposit dana cadangan untuk pembayaran performa views.</p>
                  )}
                </div>

                {/* CPM Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-white/40">
                      Tarif per 1.000 Views (CPM) <span className="text-red-400">*</span>
                    </label>
                    <span className={cn(
                      "text-[10px] font-mono transition-colors",
                      isCpmInvalid || errors.cpm ? "text-red-400 font-semibold" : "text-white/40"
                    )}>
                      Min. Rp 500
                    </span>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-white/30">Rp</span>
                    <Input
                      value={cpm}
                      onChange={(e) => {
                        const formatted = formatNumberId(e.target.value);
                        setCpm(formatted);
                        clearFieldError("cpm");
                      }}
                      onBlur={() => {
                        if (numCpm > 0 && numCpm < 500) {
                          toast.error("Tarif CPM minimal Rp 500 per 1.000 views");
                        }
                      }}
                      placeholder="15.000"
                      className={cn(
                        "pl-10 bg-white/5 border-white/10 text-white font-medium placeholder:text-white/20 transition-all",
                        (isCpmInvalid || errors.cpm) && "border-red-500/70 bg-red-500/[0.04] text-red-100 ring-1 ring-red-500/30 focus:border-red-500"
                      )}
                    />
                  </div>

                  {/* Real-time Warning for CPM */}
                  {(isCpmInvalid || errors.cpm) ? (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-400 text-[11px] leading-relaxed mt-2"
                    >
                      <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-400" />
                      <p>Tarif CPM minimal <strong>Rp 500</strong> per 1.000 views.</p>
                    </motion.div>
                  ) : (
                    <p className="text-[10px] text-white/35">Tarif yang dibayarkan ke clipper per 1.000 views valid.</p>
                  )}
                </div>
              </div>

              {/* Estimation Card */}
              <div className="bg-[#17191d] border border-white/[0.06] p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                    <Eye className="size-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40">Estimasi Total Kapasitas Views</p>
                    <p className="text-[16px] font-bold text-white tracking-tight">
                      {estimatedViewsCapacity.toLocaleString("id-ID")} <span className="text-xs font-normal text-white/60">Views</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/30">Dihitung dari Budget / CPM</p>
                  <p className="text-[12px] font-mono text-primary/80">Rp {(numCpm / 1000).toFixed(1)} / View</p>
                </div>
              </div>

              {/* 3. Batas Maksimal Views per Clipper */}
              <div className={cn(
                "space-y-2 p-4 bg-white/[0.02] border rounded-xl transition-colors",
                (isMaxViewsInvalid || errors.maxViewsPerClipper) ? "border-red-500/40 bg-red-500/[0.02]" : "border-white/[0.06]"
              )}>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-white/60">
                    Batas Maksimal Views per Clipper <span className="text-red-400">*</span>
                  </label>
                  <span className={cn(
                    "text-[10px] font-mono transition-colors",
                    (isMaxViewsInvalid || errors.maxViewsPerClipper) ? "text-red-400 font-semibold" : "text-white/40"
                  )}>
                    Minimal 10.000 Views
                  </span>
                </div>
                
                <div className="relative">
                  <Input
                    value={maxViewsPerClipper}
                    onChange={(e) => {
                      const formatted = formatNumberId(e.target.value);
                      setMaxViewsPerClipper(formatted);
                      clearFieldError("maxViewsPerClipper");
                    }}
                    onBlur={() => {
                      if (numMaxViews > 0 && numMaxViews < 10000) {
                        toast.error("Batas maksimal views minimal 10.000 views per clipper");
                      }
                    }}
                    placeholder="100.000"
                    className={cn(
                      "pr-16 bg-white/5 border-white/10 text-white font-medium placeholder:text-white/20 transition-all",
                      (isMaxViewsInvalid || errors.maxViewsPerClipper) && "border-red-500/70 bg-red-500/[0.04] text-red-100 ring-1 ring-red-500/30 focus:border-red-500"
                    )}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-white/40 font-mono">Views</span>
                </div>

                {(isMaxViewsInvalid || errors.maxViewsPerClipper) && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-400 text-[11px] leading-relaxed mt-2"
                  >
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-400" />
                    <p>Batas views minimal <strong>10.000 views</strong> per clipper.</p>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-white/40">
                  <p>Maksimal views yang dihitung dan dibayar per kreator. Views di atas batas ini tidak akan dibayar lagi.</p>
                  <span className="font-semibold text-white/80 shrink-0">
                    Maks. Rp {estimatedMaxPayoutPerClipper.toLocaleString("id-ID")} / kreator
                  </span>
                </div>
              </div>

              {/* 4. Ketentuan & Parameter Otomatis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Durasi Campaign (Fixed 30 Days) */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-start gap-3.5">
                  <div className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 shrink-0 mt-0.5">
                    <Calendar className="size-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-white">Durasi Campaign: 30 Hari</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/80">Otomatis</span>
                    </div>
                    <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                      Campaign secara otomatis aktif selama 30 hari kalender sejak tanggal peluncuran untuk promosi optimal.
                    </p>
                  </div>
                </div>

                {/* Periode Perhitungan Views (Fixed 7 Days) */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-start gap-3.5">
                  <div className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 shrink-0 mt-0.5">
                    <Clock className="size-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-white">Hitung Views: 7 Hari</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/80">Otomatis</span>
                    </div>
                    <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                      Jangka waktu akumulasi views setelah link video disubmit dikunci otomatis 7 hari kalender.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Tinjau & Buat Campaign */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Tinjau & Konfirmasi Campaign</h2>
                <p className="text-[12px] text-white/40 mt-1">
                  Pastikan seluruh rincian anggaran, arahan materi, dan preview tampilan campaign di sisi kreator sudah sesuai sebelum diluncurkan.
                </p>
              </div>

              {/* LIVE CREATOR PREVIEW COMPONENT */}
              <div className="bg-[#17191d] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Preview Header & Tabs */}
                <div className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Eye className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-white">Preview Tampilan di Dashboard Kreator</h3>
                      <p className="text-[11px] text-white/40 mt-0.5">
                        Simulasi visual bagaimana campaign ini akan dilihat dan diakses oleh para kreator / clipper.
                      </p>
                    </div>
                  </div>

                  {/* Tab Switcher */}
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

                {/* Preview Content Canvas */}
                <div className="p-5 sm:p-6 bg-gradient-to-b from-black/40 to-black/20">
                  {previewTab === "card" ? (
                    /* CARD EXPLORE PREVIEW */
                    <div className="max-w-[580px] mx-auto">
                      <div className="group border border-white/10 bg-[#111316] overflow-hidden shadow-2xl rounded-2xl flex flex-col sm:flex-row transition-all">
                        {/* Image Section */}
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

                        {/* Content Section */}
                        <div className="p-4 sm:p-5 flex flex-col justify-between grow">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-bold text-primary tracking-wider uppercase flex items-center gap-1">
                                <Scissors className="size-3" /> CLIPPING
                              </span>
                              <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
                                30 Hari Tersisa
                              </span>
                            </div>
                            
                            <h4 className="font-bold text-[15px] text-white line-clamp-1 mb-1.5">
                              {title || "Judul Campaign Clipping"}
                            </h4>
                            
                            <p className="text-[12px] text-white/60 line-clamp-2 leading-relaxed mb-3">
                              {description || "Dapatkan penghasilan dari setiap penonton video clipping otomotif yang Anda buat dan unggah."}
                            </p>

                            {/* Estimasi Sisa Budget (Hanya Persentase) */}
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
                              <span className="text-[10px] text-white/40 block">Tarif Reward</span>
                              <div className="flex items-center gap-1.5">
                                <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                  <CircleDollarSign className="size-3.5" />
                                </div>
                                <p className="text-[13px] font-bold text-white">
                                  Rp {numCpm.toLocaleString("id-ID")} <span className="text-[10px] font-normal text-white/50">/ 1.000 views</span>
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
                    /* DETAIL PAGE PREVIEW */
                    <div className="space-y-4 max-w-[680px] mx-auto">
                      {/* Hero Mockup */}
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
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-transparent to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-primary/10 border-primary/30 text-primary flex items-center gap-1">
                                <Scissors className="size-3" /> CLIPPING
                              </Badge>
                              <span className="text-[10px] text-white/60 bg-black/60 border border-white/10 px-2 py-0.5 rounded">
                                {audienceRegion}
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                              {title || "Judul Campaign"}
                            </h3>
                            <p className="text-[12px] text-white/70 mt-0.5">Dealer Showroom Keseluruhan</p>
                          </div>

                          <div className="flex flex-col sm:items-end gap-0.5 shrink-0">
                            <span className="text-[10px] text-white/40">Tarif per 1.000 Views</span>
                            <div className="flex items-center gap-1.5 text-lg font-extrabold text-primary">
                              <CircleDollarSign className="size-4" />
                              Rp {numCpm.toLocaleString("id-ID")}
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
                          <span className="text-[10px] text-white/40 block">Periode Hitung Views</span>
                          <span className="text-white font-semibold">7 Hari Kalender</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111316] border border-white/[0.06]">
                          <span className="text-[10px] text-white/40 block">Durasi Campaign</span>
                          <span className="text-white font-semibold">30 Hari</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#111316] border border-white/[0.06]">
                          <span className="text-[10px] text-white/40 block">Batas Submisi</span>
                          <span className="text-white font-semibold">Tak Terbatas</span>
                        </div>
                      </div>

                      {/* Arahan & Link Materi */}
                      <div className="p-4 rounded-xl bg-[#111316] border border-white/[0.06] space-y-3 text-[12px]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">Arahan Konten & Ketentuan Video</span>
                          <span className="text-[11px] text-white/40">{videoSpecs}</span>
                        </div>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                          {contentGuidelines || "Potong video terbaik dari folder materi, tonjolkan fitur utama dan promo harga spesial."}
                        </p>

                        {sourceMaterial && (
                          <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between gap-3">
                            <span className="text-[11px] text-white/40 shrink-0">Folder Materi Sumber</span>
                            <a
                              href={sourceMaterial.trim().startsWith("http://") || sourceMaterial.trim().startsWith("https://") ? sourceMaterial.trim() : `https://${sourceMaterial.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary hover:underline truncate max-w-[280px] inline-flex items-center gap-1 font-medium bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded border border-primary/20"
                            >
                              <ExternalLink className="size-3 shrink-0" />
                              <span className="truncate">{sourceMaterial}</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Button Mockup */}
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[11px] text-white/60">
                          Kreator dapat langsung download materi & upload link video.
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white text-black font-bold text-[12px] shadow-sm">
                          Ambil Job & Submit Video
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RINGKASAN PARAMETER DEALER */}
              <div className="bg-[#17191d] border border-white/[0.06] p-5 rounded-2xl space-y-5">
                {/* Informasi Dasar */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-[13px] font-semibold text-white">Informasi Dasar Campaign</h3>
                    <button type="button" onClick={() => setStep(1)} className="text-[11px] text-primary hover:underline font-medium">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 text-[12px]">
                    <div className="text-white/40">Judul Campaign</div>
                    <div className="text-white font-medium">{title}</div>
                    
                    <div className="text-white/40">Fokus Promosi</div>
                    <div className="text-white">
                      {promotionalFocus === "dealer" ? "Dealer / Showroom Keseluruhan" : promotionalFocus === "single_unit" ? "1 Unit Kendaraan" : "Beberapa Unit"}
                    </div>
                    
                    <div className="text-white/40">Target Wilayah</div>
                    <div className="text-white">{audienceRegion}</div>

                    <div className="text-white/40">Platform</div>
                    <div className="text-white">{publishPlatforms}</div>

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

                {/* Materi */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-[13px] font-semibold text-white">Materi & Arahan Konten</h3>
                    <button type="button" onClick={() => setStep(2)} className="text-[11px] text-primary hover:underline font-medium">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 text-[12px]">
                    <div className="text-white/40">Materi Sumber</div>
                    <div className="text-primary truncate">
                      {sourceMaterial ? (
                        <a
                          href={sourceMaterial.trim().startsWith("http://") || sourceMaterial.trim().startsWith("https://") ? sourceMaterial.trim() : `https://${sourceMaterial.trim()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="size-3 shrink-0" />
                          <span className="truncate">{sourceMaterial}</span>
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                    
                    <div className="text-white/40">Durasi Video</div>
                    <div className="text-white">{videoSpecs || "-"}</div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* Budget & Ketentuan */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-[13px] font-semibold text-white">Anggaran & Ketentuan Pembayaran</h3>
                    <button type="button" onClick={() => setStep(3)} className="text-[11px] text-primary hover:underline font-medium">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2.5 text-[12px]">
                    <div className="text-white/40">Total Budget</div>
                    <div className="text-white font-bold">Rp {numBudget.toLocaleString("id-ID")}</div>
                    
                    <div className="text-white/40">Tarif CPM</div>
                    <div className="text-white">Rp {numCpm.toLocaleString("id-ID")} / 1.000 views</div>
                    
                    <div className="text-white/40">Batas Max Views / Clipper</div>
                    <div className="text-white">
                      {numMaxViews.toLocaleString("id-ID")} Views <span className="text-white/40 text-[11px]">(Maks. Rp {estimatedMaxPayoutPerClipper.toLocaleString("id-ID")})</span>
                    </div>

                    <div className="text-white/40">Durasi Campaign</div>
                    <div className="text-white font-medium">30 Hari Kalender (Otomatis)</div>

                    <div className="text-white/40">Periode Hitung Views</div>
                    <div className="text-white font-medium">7 Hari Kalender (Otomatis)</div>

                    <div className="text-white/40">Batas Konten per Kreator</div>
                    <div className="text-white font-medium">Tak Terbatas (Bebas Buat Konten)</div>

                    <div className="text-white/40">Estimasi Kapasitas Total</div>
                    <div className="text-primary font-semibold">{estimatedViewsCapacity.toLocaleString("id-ID")} Views</div>
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

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[12px] text-red-400 font-medium">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/[0.05]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || isPending}
            className="gap-1.5 text-[12px] text-white/40 hover:text-white disabled:opacity-20"
          >
            <ChevronLeft className="size-4" /> Kembali
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="gap-1.5 h-9 px-5 rounded-xl text-[12px] font-semibold bg-white text-black hover:bg-white/90 shadow-sm transition-all"
            >
              Lanjut <ChevronRight className="size-4" />
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isPending}
                className="h-9 px-5 rounded-xl text-[12px] font-medium border-white/10 bg-transparent hover:bg-white/5 text-white w-full sm:w-auto"
              >
                Simpan Draft
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={isPending}
                className="gap-2 h-9 px-6 rounded-xl text-[12px] font-bold bg-primary text-black hover:bg-primary/90 shadow-sm transition-all w-full sm:w-auto"
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
