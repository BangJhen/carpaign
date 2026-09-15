"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Info, Building2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCampaign } from "@/app/actions/campaigns";
import { useRouter } from "next/navigation";

type Vehicle = { id: string; name: string; location: string; image?: string | null };

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
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  // Step 1 State
  const [title, setTitle] = useState("");
  const [promotionalFocus, setPromotionalFocus] = useState<"dealer" | "single_unit" | "multiple_units">("dealer");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [mainObjective, setMainObjective] = useState("");
  const [audienceRegion, setAudienceRegion] = useState("");
  const [publishPlatforms, setPublishPlatforms] = useState("");

  // Step 2 State
  const [contentType, setContentType] = useState("");
  const [contentGuidelines, setContentGuidelines] = useState("");
  const [mandatoryPoints, setMandatoryPoints] = useState("");
  const [videosPerCreator, setVideosPerCreator] = useState("1");
  const [videoSpecs, setVideoSpecs] = useState("");
  const [cta, setCta] = useState("");
  const [captionHashtagTags, setCaptionHashtagTags] = useState("");
  const [references, setReferences] = useState("");
  const [revisionLimit, setRevisionLimit] = useState("1");
  const [requiredDeliverables, setRequiredDeliverables] = useState<"publish" | "file" | "both">("both");
  const [usageRights, setUsageRights] = useState("");

  // Step 3 State
  const [creatorCount, setCreatorCount] = useState("");
  const [feePerCreator, setFeePerCreator] = useState("");
  const [productionMethod, setProductionMethod] = useState<"visit" | "remote">("visit");
  const [productionLocation, setProductionLocation] = useState("");
  const [productionDateRange, setProductionDateRange] = useState("");
  const [draftDeadline, setDraftDeadline] = useState("");
  const [publishDeadline, setPublishDeadline] = useState("");
  const [creatorCriteria, setCreatorCriteria] = useState("");
  const [transportationTerms, setTransportationTerms] = useState("");

  const toggleVehicle = (id: string) => {
    if (promotionalFocus === "single_unit") {
      setSelectedVehicles([id]);
    } else {
      setSelectedVehicles((prev) =>
        prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
      );
    }
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!title || !mainObjective || !audienceRegion || !publishPlatforms) {
        setError("Harap isi semua field teks yang diperlukan.");
        return;
      }
      if (promotionalFocus !== "dealer" && selectedVehicles.length === 0) {
        setError("Harap pilih setidaknya satu unit kendaraan.");
        return;
      }
    }
    if (step === 2) {
      if (!contentType || !contentGuidelines || !videosPerCreator || !videoSpecs) {
        setError("Tipe konten, arahan, jumlah video, dan spesifikasi wajib diisi.");
        return;
      }
    }
    if (step === 3) {
      if (!creatorCount || !feePerCreator || !productionDateRange || !draftDeadline || !publishDeadline) {
        setError("Jumlah kreator, fee, dan tanggal wajib diisi.");
        return;
      }
      if (productionMethod === "visit" && !productionLocation) {
        setError("Lokasi produksi wajib diisi untuk metode kunjungan.");
        return;
      }
    }
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
          type: "UGC/Review Konten" as const,
          budget: numBudget,
          startDate: productionDateRange.split(" - ")[0] || draftDeadline, // fallback to draftDeadline if range format is weird
          deadline: publishDeadline,
          status,
          details: {
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

        await createCampaign(payload);
        router.push("/dealer/campaigns");
      } catch (e) {
        console.error(e);
        setError("Gagal menyimpan campaign. Silakan coba lagi.");
      }
    });
  };

  const numCreatorCount = parseInt(creatorCount.replace(/\D/g, ""), 10) || 0;
  const numFeePerCreator = parseInt(feePerCreator.replace(/\D/g, ""), 10) || 0;
  const numBudget = numCreatorCount * numFeePerCreator;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white/40 hover:text-white shrink-0">
          <ChevronLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-white">Buat Campaign Review / UGC</h1>
          <p className="text-[12px] text-white/40">Membangun kepercayaan dan mendorong sales</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {steps.map((label, i) => {
          const num = i + 1;
          const isActive = step === num;
          const isDone = step > num;
          return (
            <div key={label} className="flex items-center shrink-0">
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                  style={
                    isDone
                      ? { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }
                      : isActive
                      ? { background: "var(--primary)", color: "#0a0a0c" }
                      : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.2)" }
                  }
                >
                  {isDone ? "✓" : num}
                </div>
                <span
                  className="text-[12px] font-medium hidden sm:block"
                  style={{ color: isActive ? "white" : "rgba(255,255,255,0.25)" }}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-6 sm:w-10 h-[1px] mx-2" style={{ background: isDone ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)" }} />
              )}
            </div>
          );
        })}
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
                  <label className="text-[11px] font-medium text-white/40">Judul Campaign</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Review Mobil Keluarga di Dealer ABC"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Fokus Promosi</label>
                  <Select value={promotionalFocus} onValueChange={(val: any) => {
                    setPromotionalFocus(val);
                    if (val === "dealer") setSelectedVehicles([]);
                    if (val === "single_unit" && selectedVehicles.length > 1) setSelectedVehicles([selectedVehicles[0]]);
                  }}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Pilih fokus promosi" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="dealer">Dealer secara keseluruhan</SelectItem>
                      <SelectItem value="single_unit">Satu Unit Kendaraan</SelectItem>
                      <SelectItem value="multiple_units">Beberapa Unit Kendaraan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {promotionalFocus !== "dealer" && (
                  <div className="space-y-2 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                    <label className="text-[11px] font-medium text-white/40 mb-2 block">Pilih Unit dari Inventory</label>
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
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Tujuan Utama</label>
                  <Input
                    value={mainObjective}
                    onChange={(e) => setMainObjective(e.target.value)}
                    placeholder="Contoh: Kunjungan showroom, WhatsApp dealer, request test drive"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Target Wilayah Audiens</label>
                    <Input
                      value={audienceRegion}
                      onChange={(e) => setAudienceRegion(e.target.value)}
                      placeholder="Contoh: Jakarta Selatan"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Platform Publikasi</label>
                    <Input
                      value={publishPlatforms}
                      onChange={(e) => setPublishPlatforms(e.target.value)}
                      placeholder="TikTok, Instagram Reels"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
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
                  <label className="text-[11px] font-medium text-white/40">Tipe Konten</label>
                  <Select value={contentType} onValueChange={(val: any) => setContentType(val)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Pilih tipe konten" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="Review Unit">Review Unit</SelectItem>
                      <SelectItem value="Showroom Tour">Showroom Tour</SelectItem>
                      <SelectItem value="Pengalaman Layanan">Pengalaman Layanan</SelectItem>
                      <SelectItem value="Showcase Beberapa Unit">Showcase Beberapa Unit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Arahan Konten</label>
                  <Textarea
                    value={contentGuidelines}
                    onChange={(e) => setContentGuidelines(e.target.value)}
                    placeholder="Contoh: Tampilkan interior, kapasitas bagasi, dan kondisi unit..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Poin Wajib Disebutkan</label>
                  <Textarea
                    value={mandatoryPoints}
                    onChange={(e) => setMandatoryPoints(e.target.value)}
                    placeholder="Contoh: Nama dealer, lokasi, harga yang sudah dikonfirmasi..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[60px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Jumlah Video per Kreator</label>
                    <Input
                      type="number"
                      min="1"
                      value={videosPerCreator}
                      onChange={(e) => setVideosPerCreator(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Durasi dan Format</label>
                    <Input
                      value={videoSpecs}
                      onChange={(e) => setVideoSpecs(e.target.value)}
                      placeholder="30-60 detik, vertikal"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
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
                  <label className="text-[11px] font-medium text-white/40">Referensi atau Materi Pendukung (Opsional)</label>
                  <Input
                    value={references}
                    onChange={(e) => setReferences(e.target.value)}
                    placeholder="Link contoh video, spesifikasi, foto unit"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div className="bg-[#17191d] border border-white/[0.04] p-4 rounded-xl space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Hasil yang Dibutuhkan</label>
                    <Select value={requiredDeliverables} onValueChange={(val: any) => setRequiredDeliverables(val)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Pilih hasil yang dibutuhkan" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                        <SelectItem value="publish">Video dipublikasikan di akun kreator</SelectItem>
                        <SelectItem value="file">File video diserahkan kepada dealer</SelectItem>
                        <SelectItem value="both">Keduanya (Distribusi & Aset Konten)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Hak Penggunaan Konten</label>
                    <Input
                      value={usageRights}
                      onChange={(e) => setUsageRights(e.target.value)}
                      placeholder="Contoh: Dealer boleh repost, bisa digunakan untuk iklan berbayar (Ads)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Batas Revisi</label>
                    <Input
                      type="number"
                      min="0"
                      value={revisionLimit}
                      onChange={(e) => setRevisionLimit(e.target.value)}
                      placeholder="1"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 max-w-[150px]"
                    />
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

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 text-primary/80">
                <Info className="size-5 shrink-0" />
                <p className="text-[12px] leading-relaxed">
                  Fee UGC adalah fee tetap per kreator berdasarkan pekerjaan yang disepakati. Fee akan dicadangkan dari budget saat kreator Anda setujui.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Jumlah Kreator</label>
                  <Input
                    type="number"
                    min="1"
                    value={creatorCount}
                    onChange={(e) => setCreatorCount(e.target.value)}
                    placeholder="Contoh: 4"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Fee per Kreator</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/25">Rp</span>
                    <Input
                      value={feePerCreator}
                      onChange={(e) => setFeePerCreator(e.target.value)}
                      placeholder="300.000"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
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
                  <label className="text-[11px] font-medium text-white/40">Metode Produksi</label>
                  <Select value={productionMethod} onValueChange={(val: any) => setProductionMethod(val)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Pilih metode" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                      <SelectItem value="visit">Kunjungan ke Dealer</SelectItem>
                      <SelectItem value="remote">Produksi Jarak Jauh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {productionMethod === "visit" && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Lokasi Produksi</label>
                    <Input
                      value={productionLocation}
                      onChange={(e) => setProductionLocation(e.target.value)}
                      placeholder="Contoh: Jl. Sudirman No. 123"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
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
                <label className="text-[11px] font-medium text-white/40">Rentang Jadwal Produksi (Opsional)</label>
                <Input
                  value={productionDateRange}
                  onChange={(e) => setProductionDateRange(e.target.value)}
                  placeholder="Contoh: 10 Nov - 15 Nov 2026"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Batas Pengumpulan Draft</label>
                  <Input
                    type="date"
                    value={draftDeadline}
                    onChange={(e) => setDraftDeadline(e.target.value)}
                    className="bg-white/5 border-white/10 text-white [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Batas Publikasi</label>
                  <Input
                    type="date"
                    value={publishDeadline}
                    onChange={(e) => setPublishDeadline(e.target.value)}
                    className="bg-white/5 border-white/10 text-white [color-scheme:dark]"
                  />
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
                <p className="text-[12px] text-white/40 mt-1">Periksa seluruh informasi sebelum diluncurkan.</p>
              </div>

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
