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
  "Materi & Arahan Konten",
  "Budget & Ketentuan",
  "Tinjau & Buat Campaign",
];

export function ClippingCampaignForm({
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
  const [description, setDescription] = useState("");
  const [audienceRegion, setAudienceRegion] = useState("");
  const [publishPlatforms, setPublishPlatforms] = useState("");

  // Step 2 State
  const [sourceMaterial, setSourceMaterial] = useState("");
  const [contentGuidelines, setContentGuidelines] = useState("");
  const [mandatoryPoints, setMandatoryPoints] = useState("");
  const [videoSpecs, setVideoSpecs] = useState("");
  const [captionHashtagTags, setCaptionHashtagTags] = useState("");
  const [cta, setCta] = useState("");
  const [forbiddenContent, setForbiddenContent] = useState("");

  // Step 3 State
  const [budget, setBudget] = useState("");
  const [cpm, setCpm] = useState("");
  const [maxPayoutPerClipper, setMaxPayoutPerClipper] = useState("");
  const [startDate, setStartDate] = useState("");
  const [publishDeadline, setPublishDeadline] = useState("");
  const [viewsCalculationPeriod, setViewsCalculationPeriod] = useState("7");
  const [clipperRequirements, setClipperRequirements] = useState("");
  const [maxContentPerClipper, setMaxContentPerClipper] = useState("1");

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
      if (!title || !description || !audienceRegion || !publishPlatforms) {
        setError("Harap isi semua field teks yang diperlukan.");
        return;
      }
      if (promotionalFocus !== "dealer" && selectedVehicles.length === 0) {
        setError("Harap pilih setidaknya satu unit kendaraan.");
        return;
      }
    }
    if (step === 2) {
      if (!sourceMaterial || !contentGuidelines) {
        setError("Link materi sumber dan arahan konten wajib diisi.");
        return;
      }
    }
    if (step === 3) {
      if (!budget || !cpm || !maxPayoutPerClipper || !startDate || !publishDeadline) {
        setError("Informasi budget dan tanggal wajib diisi.");
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
          type: "Clipping" as const,
          budget: parseInt(budget.replace(/\D/g, ""), 10),
          startDate,
          deadline: publishDeadline,
          status, // 'draft' or 'active'
          details: {
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
            cpm: parseInt(cpm.replace(/\D/g, ""), 10),
            maxPayoutPerClipper: parseInt(maxPayoutPerClipper.replace(/\D/g, ""), 10),
            viewsCalculationPeriod,
            clipperRequirements,
            maxContentPerClipper: parseInt(maxContentPerClipper, 10),
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

  // Calculate Capacity
  const numBudget = parseInt(budget.replace(/\D/g, ""), 10) || 0;
  const numCpm = parseInt(cpm.replace(/\D/g, ""), 10) || 0;
  const estimatedViewsCapacity = numCpm > 0 ? Math.floor((numBudget / numCpm) * 1000) : 0;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white/40 hover:text-white shrink-0">
          <ChevronLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-white">Buat Campaign Clipping</h1>
          <p className="text-[12px] text-white/40">Meningkatkan awareness melalui kompilasi konten</p>
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
                <p className="text-[12px] text-white/40 mt-1">Menentukan apa yang dipromosikan dalam campaign ini.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Judul Campaign</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kenalan dengan Showroom Mobil Bekas di Jakarta Barat"
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
                  <label className="text-[11px] font-medium text-white/40">Deskripsi Singkat Campaign</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan pesan utama yang ingin dikenalkan kepada audiens..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Target Wilayah Audiens</label>
                    <Input
                      value={audienceRegion}
                      onChange={(e) => setAudienceRegion(e.target.value)}
                      placeholder="Contoh: Jakarta dan sekitarnya"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Platform Publikasi</label>
                    <Input
                      value={publishPlatforms}
                      onChange={(e) => setPublishPlatforms(e.target.value)}
                      placeholder="TikTok, Instagram Reels, YouTube Shorts"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Materi & Arahan Konten */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-[16px] font-semibold text-white">Materi & Arahan Konten</h2>
                <p className="text-[12px] text-white/40 mt-1">Menjelaskan bahan dan aturan pembuatan konten bagi Clipper.</p>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 text-primary/80">
                <Info className="size-5 shrink-0" />
                <p className="text-[12px] leading-relaxed">
                  Layanan Clipping menggunakan materi yang sudah Anda sediakan (foto/video). Jika Anda membutuhkan pengambilan footage baru, silakan gunakan layanan <strong>Videography</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Materi Sumber (Link Folder / Drive)</label>
                  <Input
                    value={sourceMaterial}
                    onChange={(e) => setSourceMaterial(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Arahan Konten</label>
                  <Textarea
                    value={contentGuidelines}
                    onChange={(e) => setContentGuidelines(e.target.value)}
                    placeholder="Jelaskan gaya visual, transisi, atau bagian footage yang perlu ditonjolkan..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Poin Wajib Disebutkan (Opsional)</label>
                  <Textarea
                    value={mandatoryPoints}
                    onChange={(e) => setMandatoryPoints(e.target.value)}
                    placeholder="Contoh: Nama dealer, promo DP rendah, garansi 1 tahun..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[60px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Ketentuan Video (Durasi, Format)</label>
                    <Input
                      value={videoSpecs}
                      onChange={(e) => setVideoSpecs(e.target.value)}
                      placeholder="Vertikal (9:16), Max 60 detik"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
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
                    placeholder="Kunjungi profil dealer untuk melihat stok mobil lain"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-red-400/70">Larangan Konten (Opsional)</label>
                  <Textarea
                    value={forbiddenContent}
                    onChange={(e) => setForbiddenContent(e.target.value)}
                    placeholder="Contoh: Tidak boleh mengubah harga, jangan sebut kompetitor..."
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
                <h2 className="text-[16px] font-semibold text-white">Budget & Ketentuan</h2>
                <p className="text-[12px] text-white/40 mt-1">Mengatur jadwal dan tarif pembayaran berdasarkan Cost Per Mille (Views).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Total Budget Campaign</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/25">Rp</span>
                    <Input
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="1.000.000"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <p className="text-[10px] text-white/30">Dana cadangan yang disiapkan.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Tarif per 1.000 Views (CPM)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/25">Rp</span>
                    <Input
                      value={cpm}
                      onChange={(e) => setCpm(e.target.value)}
                      placeholder="15.000"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Estimation UI */}
              <div className="bg-[#17191d] border border-white/[0.04] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-white/40 mb-0.5">Estimasi Kapasitas Pembayaran Views</p>
                  <p className="text-[16px] font-semibold text-primary">{estimatedViewsCapacity.toLocaleString("id-ID")} Views</p>
                </div>
                <Info className="size-4 text-white/20" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-white/40">Batas Pembayaran per Clipper</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-white/25">Rp</span>
                  <Input
                    value={maxPayoutPerClipper}
                    onChange={(e) => setMaxPayoutPerClipper(e.target.value)}
                    placeholder="250.000"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>
                <p className="text-[10px] text-white/30">Mencegah budget habis oleh satu kreator saja.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Tanggal Mulai Publikasi</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-white/40">Periode Hitung Views</label>
                  <div className="relative">
                    <Input
                      value={viewsCalculationPeriod}
                      onChange={(e) => setViewsCalculationPeriod(e.target.value)}
                      placeholder="7"
                      className="pr-12 bg-white/5 border-white/10 text-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-white/30">Hari</span>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[11px] font-medium text-white/40">Syarat Akun Clipper (Min. Followers, Niche)</label>
                  <Input
                    value={clipperRequirements}
                    onChange={(e) => setClipperRequirements(e.target.value)}
                    placeholder="Minimal 1.000 followers, akun publik"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
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
                    <div className="text-white/40">Platform</div><div className="text-white">{publishPlatforms}</div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* Materi */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[13px] font-semibold text-white">Materi & Arahan</h3>
                    <button onClick={() => setStep(2)} className="text-[11px] text-primary hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 text-[12px]">
                    <div className="text-white/40">Materi</div><div className="text-primary truncate"><a href={sourceMaterial} target="_blank" rel="noreferrer">{sourceMaterial || "-"}</a></div>
                    <div className="text-white/40">Spesifikasi</div><div className="text-white">{videoSpecs || "-"}</div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* Budget */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[13px] font-semibold text-white">Budget & Ketentuan</h3>
                    <button onClick={() => setStep(3)} className="text-[11px] text-primary hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 text-[12px]">
                    <div className="text-white/40">Total Budget</div><div className="text-white font-medium">Rp {numBudget.toLocaleString("id-ID")}</div>
                    <div className="text-white/40">Tarif CPM</div><div className="text-white">Rp {numCpm.toLocaleString("id-ID")} / 1.000 views</div>
                    <div className="text-white/40">Est. Kapasitas</div><div className="text-primary font-medium">{estimatedViewsCapacity.toLocaleString("id-ID")} Views</div>
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
