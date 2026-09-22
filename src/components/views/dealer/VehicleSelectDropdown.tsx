"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, 
  MapPin, 
  ChevronDown, 
  Search, 
  Check, 
  X, 
  Layers, 
  PlusCircle, 
  Building2,
  Calendar,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type VehicleItem = {
  id: string;
  name: string;
  location: string;
  image?: string | null;
  year?: number | null;
  color?: string | null;
  status?: string | null;
};

interface VehicleSelectDropdownProps {
  vehicles: VehicleItem[];
  selectedVehicleIds: string[];
  onChange: (ids: string[]) => void;
  promotionalFocus: "single_unit" | "multiple_units";
  error?: string;
  onVehicleSelected?: (vehicle: VehicleItem) => void;
  label?: string;
  required?: boolean;
}

export function VehicleSelectDropdown({
  vehicles = [],
  selectedVehicleIds = [],
  onChange,
  promotionalFocus,
  error,
  onVehicleSelected,
  label = "Pilih Unit dari Inventory",
  required = true,
}: VehicleSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMultiple = promotionalFocus === "multiple_units";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter vehicles by search query
  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicles;
    const q = searchQuery.toLowerCase().trim();
    return vehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        (v.color && v.color.toLowerCase().includes(q)) ||
        (v.year && String(v.year).includes(q))
    );
  }, [vehicles, searchQuery]);

  // Selected vehicles objects
  const selectedVehicles = useMemo(() => {
    return vehicles.filter((v) => selectedVehicleIds.includes(v.id));
  }, [vehicles, selectedVehicleIds]);

  const toggleSelect = (vehicle: VehicleItem) => {
    if (isMultiple) {
      if (selectedVehicleIds.includes(vehicle.id)) {
        onChange(selectedVehicleIds.filter((id) => id !== vehicle.id));
      } else {
        onChange([...selectedVehicleIds, vehicle.id]);
        if (onVehicleSelected) onVehicleSelected(vehicle);
      }
    } else {
      onChange([vehicle.id]);
      if (onVehicleSelected) onVehicleSelected(vehicle);
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    onChange(vehicles.map((v) => v.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const removeSingleSelected = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedVehicleIds.filter((item) => item !== id));
  };

  return (
    <div className="space-y-2.5 w-full" ref={dropdownRef}>
      {/* Label and Info */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-white/50 flex items-center gap-1">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {isMultiple && vehicles.length > 0 && selectedVehicleIds.length > 0 && (
          <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
            {selectedVehicleIds.length} dari {vehicles.length} unit dipilih
          </span>
        )}
      </div>

      {/* Main Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={cn(
            "w-full min-h-[46px] p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between text-left group cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40",
            isOpen && "border-primary/50 ring-1 ring-primary/30 bg-white/[0.04]",
            error && "border-red-500/60 bg-red-500/[0.03]"
          )}
        >
          {/* Left / Selected content */}
          <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
            {!isMultiple ? (
              // Single Select Trigger State
              selectedVehicles.length > 0 ? (
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="size-9 rounded-lg bg-[#111316] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {selectedVehicles[0].image ? (
                      <img
                        src={selectedVehicles[0].image}
                        alt={selectedVehicles[0].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car className="size-4 text-white/40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white truncate">
                        {selectedVehicles[0].name}
                      </p>
                      {selectedVehicles[0].year && (
                        <span className="text-[10px] text-white/40 tabular-nums">
                          ({selectedVehicles[0].year})
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/40 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-primary/70 shrink-0" />
                      <span>{selectedVehicles[0].location}</span>
                      {selectedVehicles[0].color && (
                        <span className="text-white/30">• {selectedVehicles[0].color}</span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-white/35 text-xs">
                  <div className="size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/30">
                    <Car className="size-4" />
                  </div>
                  <span>Pilih 1 unit mobil dari inventory...</span>
                </div>
              )
            ) : (
              // Multiple Select Trigger State
              selectedVehicles.length > 0 ? (
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Avatar stack */}
                  <div className="flex -space-x-2 shrink-0 overflow-hidden">
                    {selectedVehicles.slice(0, 3).map((veh, idx) => (
                      <div
                        key={veh.id}
                        className="size-8 rounded-lg bg-[#111316] border-2 border-[#141619] overflow-hidden flex items-center justify-center shrink-0"
                        style={{ zIndex: 10 - idx }}
                      >
                        {veh.image ? (
                          <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" />
                        ) : (
                          <Car className="size-3.5 text-white/40" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">
                      {selectedVehicles.length} Unit Mobil Dipilih
                    </p>
                    <p className="text-[10px] text-white/40 truncate">
                      {selectedVehicles.map((v) => v.name).join(", ")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-white/35 text-xs">
                  <div className="size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/30">
                    <Layers className="size-4" />
                  </div>
                  <span>Pilih beberapa unit mobil dari inventory...</span>
                </div>
              )
            )}
          </div>

          {/* Right Chevron & Indicators */}
          <div className="flex items-center gap-2 shrink-0">
            {!isMultiple && selectedVehicles.length > 0 && (
              <span className="text-[9px] font-semibold text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full hidden sm:inline-block">
                Terpilih
              </span>
            )}
            <ChevronDown
              className={cn(
                "size-4 text-white/40 group-hover:text-white transition-all duration-200",
                isOpen && "rotate-180 text-primary"
              )}
            />
          </div>
        </button>

        {/* Dropdown Floating Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.99 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl bg-[#16181c] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              {/* Search Bar */}
              <div className="p-2.5 border-b border-white/[0.06] bg-[#1a1c21]/90 flex items-center gap-2">
                <Search className="size-3.5 text-white/40 shrink-0 ml-1" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama unit atau kota lokasi..."
                  className="w-full bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {/* Quick Actions for Multiple Select */}
              {isMultiple && vehicles.length > 0 && (
                <div className="px-3 py-2 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-[11px]">
                  <span className="text-white/40">
                    {filteredVehicles.length} unit ditemukan
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-primary font-medium hover:underline cursor-pointer"
                    >
                      Pilih Semua
                    </button>
                    <span className="text-white/20">•</span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Vehicle Options List */}
              <div className="max-h-[280px] overflow-y-auto p-1.5 space-y-1 divide-y-0">
                {vehicles.length === 0 ? (
                  <div className="p-6 text-center space-y-2.5">
                    <div className="size-10 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/30">
                      <Car className="size-5" />
                    </div>
                    <p className="text-xs text-white/60 font-medium">Inventory Showroom Kosong</p>
                    <p className="text-[11px] text-white/40 max-w-xs mx-auto">
                      Tambahkan unit mobil terlebih dahulu pada menu Inventory untuk dapat memilih unit promosi.
                    </p>
                    <Link
                      href="/dealer/inventory"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <PlusCircle className="size-3.5" /> Buka Inventory
                    </Link>
                  </div>
                ) : filteredVehicles.length === 0 ? (
                  <div className="p-6 text-center text-white/40 text-xs">
                    Tidak ditemukan unit yang sesuai dengan &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  filteredVehicles.map((v) => {
                    const isSelected = selectedVehicleIds.includes(v.id);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => toggleSelect(v)}
                        className={cn(
                          "w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between gap-3 group cursor-pointer",
                          isSelected
                            ? "bg-primary/10 border border-primary/25 text-white"
                            : "hover:bg-white/[0.04] border border-transparent text-white/80"
                        )}
                      >
                        {/* Vehicle Image + Info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="size-11 rounded-lg bg-[#111316] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {v.image ? (
                              <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                              <Car className="size-5 text-white/30" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={cn("text-xs font-semibold truncate", isSelected ? "text-primary" : "text-white group-hover:text-white")}>
                                {v.name}
                              </p>
                              {v.year && (
                                <span className="text-[10px] font-normal text-white/40 tabular-nums">
                                  {v.year}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/40">
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="size-3 text-primary/70 shrink-0" />
                                {v.location}
                              </span>
                              {v.color && (
                                <>
                                  <span className="text-white/20">•</span>
                                  <span className="truncate">{v.color}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Checkbox / Radio indicator */}
                        <div className="shrink-0 flex items-center">
                          {isMultiple ? (
                            <div
                              className={cn(
                                "size-4 rounded border flex items-center justify-center transition-colors",
                                isSelected
                                  ? "bg-primary border-primary text-black"
                                  : "border-white/20 group-hover:border-white/40"
                              )}
                            >
                              {isSelected && <Check className="size-3 stroke-[3]" />}
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "size-4 rounded-full border flex items-center justify-center transition-colors",
                                isSelected
                                  ? "border-primary bg-primary/20"
                                  : "border-white/20 group-hover:border-white/40"
                              )}
                            >
                              {isSelected && <div className="size-2 rounded-full bg-primary" />}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Bottom Footer */}
              <div className="p-2 border-t border-white/[0.04] bg-[#141619] flex items-center justify-between text-[11px] text-white/40">
                <span>
                  {isMultiple
                    ? "Klik untuk memilih beberapa unit kendaraan"
                    : "Pilih 1 unit yang menjadi fokus kampanye"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Units Cards (Shown beneath the dropdown for Multiple Units or quick overview) */}
      {isMultiple && selectedVehicles.length > 0 && (
        <div className="pt-1.5">
          <p className="text-[10px] font-medium text-white/40 mb-2">Unit yang Dipilih:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedVehicles.map((v) => (
              <div
                key={v.id}
                className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/15 transition-all flex items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="size-8 rounded-lg bg-[#111316] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {v.image ? (
                      <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    ) : (
                      <Car className="size-3.5 text-white/30" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-white truncate">{v.name}</p>
                    <p className="text-[9px] text-white/40 truncate flex items-center gap-1">
                      <MapPin className="size-2.5 text-primary/70 shrink-0" /> {v.location}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => removeSingleSelected(v.id, e)}
                  title="Hapus unit dari pilihan"
                  className="size-6 rounded-md bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 flex items-center justify-center transition-colors shrink-0"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-[11px] text-red-400 font-medium mt-1">{error}</p>}
    </div>
  );
}
