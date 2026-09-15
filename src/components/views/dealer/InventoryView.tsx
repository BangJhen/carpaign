"use client";

import { motion } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const vehicles = [
  { id: 1, name: "Honda Brio RS", year: 2024, color: "Crystal Black Pearl", location: "Jakarta Selatan", status: "available", campaigns: 1, image: "https://picsum.photos/seed/honda-brio-rs-2024/400/240" },
  { id: 2, name: "Toyota Veloz", year: 2023, color: "Silver Metallic", location: "Jakarta Selatan", status: "in_use", campaigns: 2, image: "https://picsum.photos/seed/toyota-veloz-2023/400/240" },
  { id: 3, name: "Mitsubishi Xpander", year: 2024, color: "Diamond White", location: "Tangerang", status: "available", campaigns: 0, image: "https://picsum.photos/seed/mitsubishi-xpander/400/240" },
  { id: 4, name: "Suzuki Jimny", year: 2023, color: "Kinetic Yellow", location: "Jakarta Barat", status: "in_use", campaigns: 1, image: "https://picsum.photos/seed/suzuki-jimny-yellow/400/240" },
  { id: 5, name: "Daihatsu Terios", year: 2024, color: "Adventure Black", location: "Bekasi", status: "available", campaigns: 0, image: "https://picsum.photos/seed/daihatsu-terios/400/240" },
  { id: 6, name: "Honda HR-V Turbo", year: 2023, color: "Sonic Gray Pearl", location: "Jakarta Selatan", status: "available", campaigns: 0, image: "https://picsum.photos/seed/honda-hrv-turbo/400/240" },
];

const statusStyle: Record<string, { color: string; text: string }> = {
  available: { color: "text-white/60", text: "Tersedia" },
  in_use: { color: "text-primary/80", text: "Dipakai" },
};

export function InventoryView() {
  const available = vehicles.filter((v) => v.status === "available").length;
  const inUse = vehicles.filter((v) => v.status === "in_use").length;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div
        initial="hidden" animate="show" variants={fadeUp} custom={0}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">Inventory</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Kendaraan</h1>
          <p className="text-sm text-white/40 mt-1">
            {available} tersedia | {inUse} sedang dipakai
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 px-5 rounded-lg gap-1.5 text-[12px] font-semibold bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-colors"
        >
          <Plus className="size-3.5" />
          Tambah Unit
        </Button>
      </motion.div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((vehicle, i) => {
          const s = statusStyle[vehicle.status];
          return (
            <motion.div key={vehicle.id} initial="hidden" animate="show" variants={fadeUp} custom={i + 1}>
              <Card className="bg-[#111316] border-white/[0.06] overflow-hidden group hover:border-white/10 transition-colors h-full flex flex-col">
                {/* Image */}
                <div className="relative h-44 flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-transparent to-transparent" />

                  {/* Status pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.08]">
                    <span className={`text-[10px] font-medium ${s.color}`}>{s.text}</span>
                  </div>

                  {/* Menu */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className="size-7 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                          <MoreHorizontal className="size-3.5" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1c20] border-white/10 text-white">
                        <DropdownMenuItem className="gap-2 text-[13px] hover:bg-white/5">
                          <Pencil className="size-3.5" /> Edit Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-[13px] text-white/40 hover:bg-white/5 hover:text-white/70">
                          <Trash2 className="size-3.5" /> Hapus Unit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Info */}
                <div className="px-4 py-4">
                  <h3 className="text-[14px] font-semibold text-white">{vehicle.name}</h3>
                  <p className="text-[11px] text-white/35 mt-0.5">{vehicle.year} | {vehicle.color}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="size-3 text-white/20" />
                    <p className="text-[11px] text-white/30">{vehicle.location}</p>
                  </div>
                  {vehicle.campaigns > 0 && (
                    <p className="text-[10px] text-primary/50 mt-2">
                      {vehicle.campaigns} kampanye berjalan
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
