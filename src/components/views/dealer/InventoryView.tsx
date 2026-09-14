"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Car,
  MoreHorizontal,
  MapPin,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEALER_ACCENT = "#B87333";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const vehicles = [
  {
    id: 1,
    name: "Honda Brio RS",
    year: 2024,
    color: "Crystal Black Pearl",
    location: "Jakarta Selatan",
    status: "available",
    campaigns: 1,
    image: "https://picsum.photos/seed/honda-brio-rs-2024/400/240",
  },
  {
    id: 2,
    name: "Toyota Veloz",
    year: 2023,
    color: "Silver Metallic",
    location: "Jakarta Selatan",
    status: "in_use",
    campaigns: 2,
    image: "https://picsum.photos/seed/toyota-veloz-2023/400/240",
  },
  {
    id: 3,
    name: "Mitsubishi Xpander",
    year: 2024,
    color: "Diamond White",
    location: "Tangerang",
    status: "available",
    campaigns: 0,
    image: "https://picsum.photos/seed/mitsubishi-xpander/400/240",
  },
  {
    id: 4,
    name: "Suzuki Jimny",
    year: 2023,
    color: "Kinetic Yellow",
    location: "Jakarta Barat",
    status: "in_use",
    campaigns: 1,
    image: "https://picsum.photos/seed/suzuki-jimny-yellow/400/240",
  },
  {
    id: 5,
    name: "Daihatsu Terios",
    year: 2024,
    color: "Adventure Black",
    location: "Bekasi",
    status: "available",
    campaigns: 0,
    image: "https://picsum.photos/seed/daihatsu-terios/400/240",
  },
  {
    id: 6,
    name: "Honda HR-V Turbo",
    year: 2023,
    color: "Sonic Gray Pearl",
    location: "Jakarta Selatan",
    status: "available",
    campaigns: 0,
    image: "https://picsum.photos/seed/honda-hrv-turbo/400/240",
  },
];

const statusConfig = {
  available: { label: "Tersedia", color: "#6BCB77", bg: "#6BCB7715", icon: CheckCircle2 },
  in_use: { label: "Dipakai Kampanye", color: DEALER_ACCENT, bg: `${DEALER_ACCENT}15`, icon: Clock },
};

export function InventoryView() {
  const available = vehicles.filter((v) => v.status === "available").length;
  const inUse = vehicles.filter((v) => v.status === "in_use").length;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-20">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        custom={0}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
            Inventory
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Kendaraan
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {available} unit tersedia · {inUse} sedang dipakai kampanye
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 px-5 rounded-lg gap-2 text-[12px] font-bold uppercase tracking-widest"
          style={{
            background: `linear-gradient(135deg, ${DEALER_ACCENT}25, ${DEALER_ACCENT}10)`,
            border: `1px solid ${DEALER_ACCENT}50`,
            color: DEALER_ACCENT,
          }}
        >
          <Plus className="size-4" />
          Tambah Unit
        </Button>
      </motion.div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {vehicles.map((vehicle, i) => {
          const cfg = statusConfig[vehicle.status as keyof typeof statusConfig];
          return (
            <motion.div key={vehicle.id} initial="hidden" animate="show" variants={fadeUp} custom={i + 1}>
              <Card className="bg-[#111316] border-white/5 overflow-hidden group hover:border-white/10 transition-all">
                {/* Car image */}
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-transparent to-transparent" />

                  {/* Status badge overlay */}
                  <div className="absolute top-3 right-3">
                    <div
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm"
                      style={{
                        background: `${cfg.bg}cc`,
                        color: cfg.color,
                        border: `1px solid ${cfg.color}30`,
                      }}
                    >
                      <cfg.icon className="size-3" />
                      {cfg.label}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="px-5 pt-3 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-white truncate">
                        {vehicle.name}
                      </h3>
                      <p className="text-[12px] text-white/40">
                        {vehicle.year} · {vehicle.color}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-lg text-white/30 hover:text-white hover:bg-white/5"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#1a1c20] border-white/10 text-white"
                      >
                        <DropdownMenuItem className="gap-2 text-[13px] hover:bg-white/5">
                          <Pencil className="size-3.5" /> Edit Unit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="size-3.5" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <MapPin className="size-3" />
                      <span className="text-[11px]">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5" style={{ color: `${DEALER_ACCENT}99` }}>
                      <Car className="size-3" />
                      <span className="text-[11px]">{vehicle.campaigns} kampanye</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
