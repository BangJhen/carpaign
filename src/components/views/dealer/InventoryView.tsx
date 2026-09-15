"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  MapPin,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addVehicle } from "@/app/actions/vehicles";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const statusStyle: Record<string, { color: string; text: string }> = {
  available: { color: "text-white/60", text: "Tersedia" },
  in_use: { color: "text-primary/80", text: "Dipakai" },
};

type Vehicle = {
  id: string;
  name: string;
  year: number;
  color: string;
  location: string;
  status: string;
  campaigns: number;
  image: string | null;
};

export function InventoryView({ vehicles }: { vehicles: Vehicle[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    year: "",
    color: "",
    location: "",
  });

  const available = vehicles.filter((v) => v.status === "available").length;
  const inUse = vehicles.filter((v) => v.status === "in_use").length;

  const handleSubmit = () => {
    if (!form.name || !form.year || !form.color || !form.location) return;
    startTransition(async () => {
      try {
        await addVehicle({
          name: form.name,
          year: parseInt(form.year, 10),
          color: form.color,
          location: form.location,
        });
        setIsModalOpen(false);
        setForm({ name: "", year: "", color: "", location: "" });
      } catch (err) {
        console.error(err);
      }
    });
  };

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
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="h-9 px-5 rounded-lg gap-1.5 text-[12px] font-semibold bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 transition-colors"
        >
          <Plus className="size-3.5" />
          Tambah Unit
        </Button>
      </motion.div>

      {/* Vehicle Grid */}
      {vehicles.length === 0 ? (
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
          <Card className="bg-[#111316] border-white/[0.06] p-12 flex flex-col items-center justify-center text-center">
            <p className="text-white/40 text-sm mb-4">Belum ada unit kendaraan di inventory Anda.</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white"
            >
              <Plus className="size-4" /> Tambah Sekarang
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {vehicles.map((vehicle, i) => {
            const s = statusStyle[vehicle.status] || statusStyle.available;
            return (
              <motion.div key={vehicle.id} initial="hidden" animate="show" variants={fadeUp} custom={i + 1}>
                <Card className="bg-[#111316] border-white/[0.06] overflow-hidden group hover:border-white/10 transition-colors h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 flex-shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vehicle.image || ""}
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
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isPending && setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md"
            >
              <Card className="bg-[#111316] border-white/10 p-6 flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-white">Tambah Unit Baru</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white" disabled={isPending}>
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Nama Unit (Merk & Tipe)</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Contoh: Honda Brio RS"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Tahun</label>
                      <Input
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        placeholder="2024"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-white/40">Warna</label>
                      <Input
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        placeholder="Hitam"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-white/40">Lokasi / Cabang</label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Jakarta Selatan"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isPending} className="text-white/50">
                    Batal
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isPending || !form.name || !form.year || !form.color || !form.location}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                  >
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : "Simpan"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
