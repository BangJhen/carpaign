"use client";

import { useState, useRef } from "react";
import { 
  Upload, 
  Car, 
  Loader2, 
  Check, 
  Pencil,
  Trash2
} from "lucide-react";
import { compressImage } from "@/lib/image-compression";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Vehicle = { id: string; name: string; location: string; image?: string | null };

interface CampaignThumbnailUploaderProps {
  thumbnail: string;
  onChange: (url: string) => void;
  vehicles?: Vehicle[];
  selectedVehicleIds?: string[];
  campaignTitle?: string;
  campaignType?: string;
  error?: string;
}

export function CampaignThumbnailUploader({
  thumbnail,
  onChange,
  vehicles = [],
  campaignTitle = "",
  campaignType = "Campaign",
  error,
}: CampaignThumbnailUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "inventory">("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableVehiclesWithImages = vehicles.filter((v) => !!v.image);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressed = await compressImage(file, 1280, 720, 0.82);
      onChange(compressed);
      toast.success("Thumbnail kampanye berhasil diunggah");
    } catch (err) {
      console.error("Gagal memproses gambar:", err);
      toast.error("Format file tidak didukung atau gambar terlalu besar.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3.5 w-full">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-[12px] font-semibold text-white">
            Thumbnail & Banner Kampanye
          </label>
          <p className="text-[11px] text-white/40 mt-0.5">
            Gambar ini akan tampil pada kartu feed kampanye di dashboard kreator (Rasio 16:9).
          </p>
        </div>
        {thumbnail && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
            Gambar Terpasang
          </span>
        )}
      </div>

      {/* Tabs (only if inventory vehicles exist) */}
      {availableVehiclesWithImages.length > 0 && (
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={cn(
              "flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-medium transition-all",
              activeTab === "upload"
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-white/40 hover:text-white hover:bg-white/[0.02]"
            )}
          >
            <Upload className="size-3 text-white/60" />
            Upload File Banner
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={cn(
              "flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-medium transition-all",
              activeTab === "inventory"
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-white/40 hover:text-white hover:bg-white/[0.02]"
            )}
          >
            <Car className="size-3 text-white/60" />
            Pilih dari Inventory ({availableVehiclesWithImages.length})
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isProcessing}
      />

      {/* Inventory Selector Tab */}
      {activeTab === "inventory" && availableVehiclesWithImages.length > 0 && (
        <div className="space-y-2 p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <p className="text-[11px] text-white/40 mb-1.5">
            Pilih foto mobil langsung dari inventori showroom terdaftar:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {availableVehiclesWithImages.map((vehicle) => {
              const isSelected = thumbnail === vehicle.image;
              return (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => {
                    if (vehicle.image) {
                      onChange(vehicle.image);
                      setActiveTab("upload");
                    }
                  }}
                  className={cn(
                    "relative group rounded-xl overflow-hidden border text-left p-1.5 transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <div className="h-16 w-full rounded-lg bg-black/40 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vehicle.image!}
                      alt={vehicle.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-medium text-white truncate mt-1.5 px-0.5">
                    {vehicle.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Single Unified Preview Card */}
      {activeTab === "upload" && (
        <div className="w-full">
          {thumbnail ? (
            /* Uploaded & Active Live Preview Card */
            <div className="rounded-2xl border border-white/10 bg-[#111316] overflow-hidden shadow-xl flex flex-col group w-full">
              <div className="relative h-60 sm:h-72 md:h-80 w-full bg-black/60 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail}
                  alt="Campaign Thumbnail Preview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-[#111316]/35 to-black/30" />

                {/* Top Action & Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <button
                    type="button"
                    onClick={() => !isProcessing && fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="h-8 px-3.5 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-3.5 animate-spin text-white/70" />
                    ) : (
                      <Pencil className="size-3 text-white/70" />
                    )}
                    Ganti Foto
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg">
                      {campaignType}
                    </span>

                    <button
                      type="button"
                      onClick={() => onChange("")}
                      className="size-8 rounded-lg bg-black/60 hover:bg-red-500/20 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 backdrop-blur-md flex items-center justify-center transition-all"
                      title="Hapus gambar"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Card Title & Brand */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="size-4 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-[7px] font-bold text-white">
                      C
                    </div>
                    <span className="text-[11px] font-medium text-white/80">Showroom Resmi</span>
                  </div>
                  <p className="text-[14px] sm:text-[15px] font-semibold text-white truncate drop-shadow-sm">
                    {campaignTitle.trim() || "Judul Kampanye Promosi"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Upload Dropzone */
            <div
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={cn(
                "w-full border border-dashed border-white/15 hover:border-white/30 hover:bg-white/[0.02] transition-all rounded-2xl p-10 text-center cursor-pointer flex flex-col items-center justify-center gap-3 group",
                isProcessing && "opacity-50 cursor-wait"
              )}
            >
              <div className="size-12 rounded-2xl bg-white/5 group-hover:bg-white/10 border border-white/10 group-hover:border-white/20 flex items-center justify-center text-white/40 group-hover:text-white/70 transition-colors">
                {isProcessing ? (
                  <Loader2 className="size-6 animate-spin text-white/60" />
                ) : (
                  <Upload className="size-6" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-medium text-white/90 group-hover:text-white transition-colors">
                  Klik untuk memilih file banner / thumbnail
                </p>
                <p className="text-[11px] text-white/35 mt-1">
                  Mendukung format JPG, PNG, WEBP (otomatis dioptimalkan untuk performa web)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-[11px] text-red-400 font-medium">{error}</p>}
    </div>
  );
}
