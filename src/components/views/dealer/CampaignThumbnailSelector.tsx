"use client";

import { useState } from "react";
import { Image as ImageIcon, Link as LinkIcon, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AUTOMOTIVE_PRESET_THUMBNAILS = [
  {
    id: "showroom",
    label: "Showroom Modern",
    url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "luxury-sedan",
    label: "Sedan Premium",
    url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "luxury-suv",
    label: "SUV Tangguh",
    url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "supercar",
    label: "Sport & Performa",
    url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "electric",
    label: "Futuristik EV",
    url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "cinematic-road",
    label: "Cinematic Drive",
    url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200",
  },
];

interface CampaignThumbnailSelectorProps {
  value: string;
  onChange: (url: string) => void;
  selectedVehicleImages?: { id: string; name: string; image?: string | null }[];
  error?: string;
}

export function CampaignThumbnailSelector({
  value,
  onChange,
  selectedVehicleImages = [],
  error,
}: CampaignThumbnailSelectorProps) {
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [customInputUrl, setCustomInputUrl] = useState("");

  const availableVehicleImages = selectedVehicleImages.filter(
    (v) => typeof v.image === "string" && v.image.trim().length > 0
  );

  const handleApplyCustomUrl = () => {
    if (customInputUrl.trim()) {
      onChange(customInputUrl.trim());
      setCustomInputUrl("");
      setShowCustomUrlInput(false);
    }
  };

  return (
    <div className={cn("space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]", error && "border-red-500/40 bg-red-500/[0.02]")}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-[12px] font-semibold text-white flex items-center gap-2">
            <ImageIcon className="size-4 text-primary" />
            Foto Thumbnail Kampanye
          </label>
          <p className="text-[11px] text-white/35 mt-0.5">
            Foto utama yang akan tampil di kartu eksplorasi kreator dan daftar kampanye.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomUrlInput((prev) => !prev)}
            className="h-7 text-[11px] px-2.5 bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
          >
            <LinkIcon className="size-3 mr-1.5" />
            {showCustomUrlInput ? "Tutup URL" : "Input URL Kustom"}
          </Button>
        </div>
      </div>

      {/* Custom URL Input Bar */}
      {showCustomUrlInput && (
        <div className="flex items-center gap-2 pt-1 pb-2">
          <Input
            value={customInputUrl}
            onChange={(e) => setCustomInputUrl(e.target.value)}
            placeholder="Tempel tautan URL gambar langsung (https://...)"
            className="bg-black/30 border-white/10 text-white text-xs placeholder:text-white/20 h-9"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleApplyCustomUrl}
            disabled={!customInputUrl.trim()}
            className="h-9 px-3 text-xs bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 shrink-0"
          >
            Terapkan
          </Button>
        </div>
      )}

      {/* Main Thumbnail Preview & Preset Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
        {/* Left: Active Thumbnail Live Preview */}
        <div className="md:col-span-5 relative w-full h-[180px] sm:h-[190px] rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
          {value ? (
            <>
              <img
                src={value}
                alt="Thumbnail Kampanye"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-medium text-primary">
                  Thumbnail Terpilih
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/25 gap-2 p-4 text-center">
              <ImageIcon className="size-8 stroke-[1.5]" />
              <span className="text-[11px]">Belum ada thumbnail dipilih</span>
            </div>
          )}
        </div>

        {/* Right: Presets and Vehicle Options */}
        <div className="md:col-span-7 space-y-3">
          {/* If there are vehicle images from selected inventory */}
          {availableVehicleImages.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary block">
                Foto dari Unit Kendaraan Terpilih
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableVehicleImages.map((veh) => {
                  const isSelected = value === veh.image;
                  return (
                    <button
                      key={veh.id}
                      type="button"
                      onClick={() => onChange(veh.image!)}
                      className={cn(
                        "relative group rounded-lg overflow-hidden border h-16 text-left transition-all p-0",
                        isSelected
                          ? "border-primary ring-1 ring-primary/40"
                          : "border-white/10 hover:border-white/20"
                      )}
                    >
                      <img
                        src={veh.image!}
                        alt={veh.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-medium text-white truncate">
                        {veh.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 size-4 rounded-full bg-primary text-black flex items-center justify-center">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Curated Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40 block">
              Pilih dari Koleksi Foto Otomotif
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {AUTOMOTIVE_PRESET_THUMBNAILS.map((preset) => {
                const isSelected = value === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onChange(preset.url)}
                    className={cn(
                      "relative group rounded-lg overflow-hidden border h-16 text-left transition-all p-0",
                      isSelected
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-medium text-white truncate">
                      {preset.label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 size-4 rounded-full bg-primary text-black flex items-center justify-center">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-[11px] text-red-400 font-medium mt-1">{error}</p>}
    </div>
  );
}
