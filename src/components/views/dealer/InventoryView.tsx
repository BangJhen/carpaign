"use client";

import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  MapPin,
  Pencil,
  Trash2,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
  Car,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addVehicle, updateVehicle, deleteVehicle } from "@/app/actions/vehicles";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/image-compression";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.06,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const statusStyle: Record<string, { color: string; text: string; bg: string }> = {
  available: {
    color: "text-emerald-400",
    text: "Tersedia",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  in_use: {
    color: "text-amber-400",
    text: "Sedang Dipakai",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
};

const PRESET_CAR_IMAGES = [
  {
    label: "SUV Premium",
    name: "Toyota Fortuner 2.8 GR Sport",
    url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
    color: "Platinum White Pearl",
    year: "2024",
    category: "SUV",
  },
  {
    label: "Sedan Mewah",
    name: "BMW 330i M Sport",
    url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80",
    color: "Black Sapphire",
    year: "2023",
    category: "Sedan",
  },
  {
    label: "Modern EV",
    name: "Hyundai Ioniq 5 Signature",
    url: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
    color: "Gravity Gold Matte",
    year: "2024",
    category: "EV",
  },
  {
    label: "City Car",
    name: "Honda Brio RS Urbanite",
    url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80",
    color: "Carnival Red",
    year: "2023",
    category: "Hatchback",
  },
  {
    label: "Family MPV",
    name: "Toyota Innova Zenix 2.0 Q HV",
    url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
    color: "Attitude Black",
    year: "2024",
    category: "MPV",
  },
];

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

const initialFormState = {
  name: "",
  category: "SUV",
  year: new Date().getFullYear().toString(),
  color: "",
  transmission: "Automatic (AT)",
  plateNumber: "",
  location: "",
  status: "available" as "available" | "in_use",
  image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
};

export function InventoryView({ vehicles }: { vehicles: Vehicle[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Delete Alert Dialog State
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(initialFormState);
  const [imageInputMode, setImageInputMode] = useState<"presets" | "upload" | "url">("presets");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const available = vehicles.filter((v) => v.status === "available").length;
  const inUse = vehicles.filter((v) => v.status === "in_use").length;

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingVehicleId(null);
    setForm(initialFormState);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setModalMode("edit");
    setEditingVehicleId(vehicle.id);
    setForm({
      name: vehicle.name,
      category: "SUV",
      year: vehicle.year.toString(),
      color: vehicle.color,
      transmission: "Automatic (AT)",
      plateNumber: "",
      location: vehicle.location,
      status: (vehicle.status as "available" | "in_use") || "available",
      image: vehicle.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, 1000, 1000, 0.8);
        setForm((prev) => ({ ...prev, image: compressedDataUrl }));
      } catch (err) {
        console.error("Gagal memproses gambar:", err);
        toast.error("Gagal memproses gambar. Pastikan format file berupa foto.");
      }
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_CAR_IMAGES[0]) => {
    setForm((prev) => ({
      ...prev,
      name: prev.name ? prev.name : preset.name,
      color: prev.color ? prev.color : preset.color,
      year: prev.year ? prev.year : preset.year,
      image: preset.url,
      category: preset.category || prev.category,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nama unit kendaraan wajib diisi";
    if (!form.year.trim()) newErrors.year = "Tahun perakitan wajib diisi";
    if (!form.color.trim()) newErrors.color = "Warna kendaraan wajib diisi";
    if (!form.location.trim()) newErrors.location = "Lokasi showroom / cabang wajib diisi";

    const numYear = parseInt(form.year, 10);
    if (isNaN(numYear) || numYear < 1990 || numYear > new Date().getFullYear() + 2) {
      newErrors.year = "Masukkan tahun yang valid (contoh: 2024)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        if (modalMode === "edit" && editingVehicleId) {
          await updateVehicle(editingVehicleId, {
            name: form.name.trim(),
            year: parseInt(form.year, 10),
            color: form.color.trim(),
            location: form.location.trim(),
            status: form.status,
            image: form.image,
          });
          toast.success("Detail unit kendaraan berhasil diperbarui");
        } else {
          await addVehicle({
            name: form.name.trim(),
            year: parseInt(form.year, 10),
            color: form.color.trim(),
            location: form.location.trim(),
            status: form.status,
            image: form.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
          });
          toast.success("Unit kendaraan berhasil ditambahkan ke inventori");
        }

        setIsModalOpen(false);
        setForm(initialFormState);
        setErrors({});
      } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan saat menyimpan unit. Silakan coba lagi.");
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!vehicleToDelete) return;

    startTransition(async () => {
      try {
        await deleteVehicle(vehicleToDelete.id);
        toast.success(`Unit ${vehicleToDelete.name} berhasil dihapus dari inventori`);
        setIsDeleteDialogOpen(false);
        setVehicleToDelete(null);
      } catch (err) {
        console.error(err);
        toast.error("Gagal menghapus unit kendaraan. Silakan coba lagi.");
      }
    });
  };

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
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/25 mb-1">
            Inventory
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Kendaraan Showroom
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {available} unit siap campaign | {inUse} sedang digunakan
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          size="sm"
          className="h-10 px-5 rounded-xl gap-2 text-[13px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all"
        >
          <Plus className="size-4" />
          Tambah Unit Baru
        </Button>
      </motion.div>

      {/* Vehicle Grid */}
      {vehicles.length === 0 ? (
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
          <Card className="bg-[#111316] border-white/[0.06] p-16 flex flex-col items-center justify-center text-center rounded-2xl">
            <div className="size-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/30 mb-4">
              <Car className="size-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Belum Ada Unit Kendaraan
            </h3>
            <p className="text-white/40 text-sm max-w-md mb-6">
              Daftarkan mobil dari showroom Anda agar bisa dipilih dan dipromosikan oleh kreator dalam kampanye Review/UGC, Clipping, atau Video Production.
            </p>
            <Button
              onClick={handleOpenAdd}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl h-10 px-6"
            >
              <Plus className="size-4" /> Tambah Unit Sekarang
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {vehicles.map((vehicle, i) => {
            const s = statusStyle[vehicle.status] || statusStyle.available;
            return (
              <motion.div
                key={vehicle.id}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={i + 1}
              >
                <Card className="bg-[#111316] border-white/[0.06] overflow-hidden group hover:border-white/15 transition-all duration-300 h-full flex flex-col rounded-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  {/* Image */}
                  <div className="relative h-48 flex-shrink-0 overflow-hidden bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vehicle.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80"}
                      alt={vehicle.name}
                      className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-[#111316]/20 to-transparent" />

                    {/* Status pill */}
                    <div className={cn("absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border", s.bg)}>
                      <span className={`text-[10px] font-semibold tracking-wide ${s.color}`}>{s.text}</span>
                    </div>

                    {/* Menu */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="size-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 transition-colors">
                            <MoreHorizontal className="size-4" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#1a1c20] border-white/10 text-white min-w-[160px]"
                        >
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(vehicle)}
                            className="gap-2 text-[13px] hover:bg-white/5 cursor-pointer text-white/80 hover:text-white"
                          >
                            <Pencil className="size-3.5 text-primary" /> Edit Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(vehicle)}
                            className="gap-2 text-[13px] text-red-400 hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 className="size-3.5 text-red-400" /> Hapus Unit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-5 py-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {vehicle.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-white/50 font-medium">{vehicle.year}</span>
                        <span className="text-[10px] text-white/20">•</span>
                        <span className="text-[11px] text-white/50 font-medium">{vehicle.color}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2.5 text-white/35">
                        <MapPin className="size-3.5 text-white/25 shrink-0" />
                        <p className="text-[11px] truncate">{vehicle.location}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                      {vehicle.campaigns > 0 ? (
                        <span className="text-[11px] font-medium text-primary/80 flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                          {vehicle.campaigns} Kampanye Aktif
                        </span>
                      ) : (
                        <span className="text-[11px] text-white/30">Belum ada kampanye</span>
                      )}
                      <span className="text-[10px] font-mono text-white/25 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.04]">
                        ID: {vehicle.id.slice(0, 6)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => !isPending && setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] my-auto bg-[#111316] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-gradient-to-r from-[#14171c] to-[#111316]">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    {modalMode === "edit" ? <Pencil className="size-5" /> : <Car className="size-5" />}
                  </div>
                  <div>
                    <h2 className="text-[17px] font-semibold text-white">
                      {modalMode === "edit" ? "Edit Detail Unit Kendaraan" : "Tambah Unit Kendaraan"}
                    </h2>
                    <p className="text-[12px] text-white/40">
                      {modalMode === "edit"
                        ? "Perbarui informasi dan spesifikasi unit inventori"
                        : "Lengkapi detail mobil untuk materi kampanye kreator"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="size-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                  disabled={isPending}
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body - 2 Columns on Desktop */}
              <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 custom-scrollbar">
                {/* Left Column: Form Fields (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Section 1: Informasi Utama */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80">
                        1. Informasi Kendaraan
                      </span>
                      <span className="text-[10px] text-white/30">* Wajib diisi</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-white/60">
                        Nama Unit (Merk, Model & Varian) <span className="text-red-400">*</span>
                      </label>
                      <Input
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          clearFieldError("name");
                        }}
                        placeholder="Contoh: Toyota Fortuner 2.8 GR Sport"
                        className={cn(
                          "bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10",
                          errors.name && "border-red-500/60 bg-red-500/[0.03]"
                        )}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-400 font-medium">{errors.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-white/60">Kategori Bodi</label>
                        <Select
                          value={form.category}
                          onValueChange={(val) => setForm({ ...form, category: val })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                            <SelectItem value="SUV">SUV / Crossover</SelectItem>
                            <SelectItem value="MPV">MPV / Family Car</SelectItem>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="Hatchback">Hatchback / City Car</SelectItem>
                            <SelectItem value="EV">EV / Mobil Listrik</SelectItem>
                            <SelectItem value="Commercial">Komersial / Pickup</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-white/60">
                          Tahun Pembuatan <span className="text-red-400">*</span>
                        </label>
                        <Input
                          value={form.year}
                          onChange={(e) => {
                            setForm({ ...form, year: e.target.value });
                            clearFieldError("year");
                          }}
                          placeholder="2024"
                          maxLength={4}
                          className={cn(
                            "bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10",
                            errors.year && "border-red-500/60 bg-red-500/[0.03]"
                          )}
                        />
                        {errors.year && (
                          <p className="text-[11px] text-red-400 font-medium">{errors.year}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-white/60">
                          Warna Eksterior <span className="text-red-400">*</span>
                        </label>
                        <Input
                          value={form.color}
                          onChange={(e) => {
                            setForm({ ...form, color: e.target.value });
                            clearFieldError("color");
                          }}
                          placeholder="Contoh: Platinum White Pearl"
                          className={cn(
                            "bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10",
                            errors.color && "border-red-500/60 bg-red-500/[0.03]"
                          )}
                        />
                        {errors.color && (
                          <p className="text-[11px] text-red-400 font-medium">{errors.color}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-white/60">Transmisi</label>
                        <Select
                          value={form.transmission}
                          onValueChange={(val) => setForm({ ...form, transmission: val })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
                            <SelectValue placeholder="Pilih Transmisi" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                            <SelectItem value="Automatic (AT)">Otomatis (AT / CVT)</SelectItem>
                            <SelectItem value="Manual (MT)">Manual (MT)</SelectItem>
                            <SelectItem value="EV (Single-Speed)">Electric (Single-Speed)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Lokasi & Showroom */}
                  <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80">
                      2. Lokasi & Ketersediaan
                    </span>

                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-white/60">
                        Lokasi Showroom / Cabang <span className="text-red-400">*</span>
                      </label>
                      <Input
                        value={form.location}
                        onChange={(e) => {
                          setForm({ ...form, location: e.target.value });
                          clearFieldError("location");
                        }}
                        placeholder="Contoh: Showroom Pusat - Jakarta Selatan (Jl. TB Simatupang)"
                        className={cn(
                          "bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10",
                          errors.location && "border-red-500/60 bg-red-500/[0.03]"
                        )}
                      />
                      {errors.location && (
                        <p className="text-[11px] text-red-400 font-medium">{errors.location}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-white/60">
                          Status Ketersediaan
                        </label>
                        <Select
                          value={form.status}
                          onValueChange={(val: any) => setForm({ ...form, status: val })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white h-10">
                            <SelectValue placeholder="Pilih Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1c20] border-white/10 text-white">
                            <SelectItem value="available">Tersedia (Siap Campaign)</SelectItem>
                            <SelectItem value="in_use">Sedang Dipakai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[12px] font-medium text-white/60">
                          Nomor Polisi / Plat (Opsional)
                        </label>
                        <Input
                          value={form.plateNumber}
                          onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
                          placeholder="Contoh: B 1234 RFS"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Photo Uploader & Live Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80">
                      Foto Unit Kendaraan
                    </span>
                    <span className="text-[11px] text-white/40">Pratinjau Live</span>
                  </div>

                  {/* Photo Preview Card */}
                  <div className="rounded-2xl border border-white/10 bg-[#16191e] overflow-hidden shadow-lg flex flex-col">
                    <div className="relative h-44 w-full bg-black/60 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image}
                        alt="Vehicle Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16191e] via-transparent to-transparent" />

                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white/80">
                        {form.category} • {form.year}
                      </div>

                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-[13px] font-semibold text-white truncate">
                          {form.name || "Nama Unit Kendaraan"}
                        </p>
                        <p className="text-[11px] text-white/50 truncate">
                          {form.color || "Warna"} {form.location ? `• ${form.location}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Photo Selector Tabs */}
                    <div className="p-3.5 space-y-3 bg-[#131518]">
                      <div className="flex rounded-lg bg-white/[0.04] p-1 gap-1 border border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => setImageInputMode("presets")}
                          className={cn(
                            "flex-1 py-1 text-[11px] font-medium rounded-md transition-colors",
                            imageInputMode === "presets"
                              ? "bg-primary text-primary-foreground font-semibold shadow"
                              : "text-white/60 hover:text-white"
                          )}
                        >
                          Pilihan Cepat
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode("upload")}
                          className={cn(
                            "flex-1 py-1 text-[11px] font-medium rounded-md transition-colors",
                            imageInputMode === "upload"
                              ? "bg-primary text-primary-foreground font-semibold shadow"
                              : "text-white/60 hover:text-white"
                          )}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode("url")}
                          className={cn(
                            "flex-1 py-1 text-[11px] font-medium rounded-md transition-colors",
                            imageInputMode === "url"
                              ? "bg-primary text-primary-foreground font-semibold shadow"
                              : "text-white/60 hover:text-white"
                          )}
                        >
                          Link URL
                        </button>
                      </div>

                      {/* Presets Mode */}
                      {imageInputMode === "presets" && (
                        <div className="space-y-2">
                          <p className="text-[10px] text-white/40">
                            Pilih model mobil referensi untuk gambar:
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {PRESET_CAR_IMAGES.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleApplyPreset(preset)}
                                className={cn(
                                  "relative rounded-lg overflow-hidden border p-1 text-left transition-all group",
                                  form.image === preset.url
                                    ? "border-primary ring-1 ring-primary bg-primary/10"
                                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                                )}
                              >
                                <div className="h-14 w-full rounded overflow-hidden relative mb-1">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={preset.url}
                                    alt={preset.label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  {form.image === preset.url && (
                                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                      <CheckCircle2 className="size-4 text-white" />
                                    </div>
                                  )}
                                </div>
                                <p className="text-[10px] font-medium text-white truncate">
                                  {preset.label}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload Mode */}
                      {imageInputMode === "upload" && (
                        <div className="space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/15 hover:border-primary/50 hover:bg-primary/[0.02] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                          >
                            <div className="size-9 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                              <Upload className="size-4" />
                            </div>
                            <div className="text-center">
                              <p className="text-[12px] font-medium text-white">
                                Klik untuk upload foto mobil
                              </p>
                              <p className="text-[10px] text-white/40">
                                PNG, JPG, WEBP (Otomatis dikompresi)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* URL Mode */}
                      {imageInputMode === "url" && (
                        <div className="space-y-2">
                          <label className="text-[11px] text-white/50">Tautan Gambar (Direct Link)</label>
                          <div className="flex gap-2">
                            <Input
                              value={customImageUrl}
                              onChange={(e) => setCustomImageUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-9 text-[12px]"
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                if (customImageUrl.trim()) {
                                  setForm((prev) => ({ ...prev, image: customImageUrl.trim() }));
                                }
                              }}
                              className="h-9 px-3 bg-white/10 hover:bg-white/20 text-white text-[12px]"
                            >
                              Terapkan
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-white/[0.06] bg-[#14171c] flex items-center justify-between">
                <p className="text-[11px] text-white/35 hidden sm:block">
                  {modalMode === "edit"
                    ? "Perubahan unit akan langsung diperbarui di semua kampanye terkait."
                    : "Unit akan langsung tersedia di katalog saat memilih mobil campaign."}
                </p>
                <div className="flex items-center gap-3 ml-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isPending}
                    className="text-white/50 hover:text-white"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-xl gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        {modalMode === "edit" ? <Pencil className="size-4" /> : <Plus className="size-4" />}
                        {modalMode === "edit" ? "Simpan Perubahan" : "Simpan Unit"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert Modal */}
      <AnimatePresence>
        {isDeleteDialogOpen && vehicleToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => !isPending && setIsDeleteDialogOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-[#14161a] border border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-white">
                    Hapus Unit Kendaraan?
                  </h3>
                  <p className="text-[12px] text-white/50 mt-1 leading-relaxed">
                    Apakah Anda yakin ingin menghapus unit <strong className="text-white font-semibold">{vehicleToDelete.name}</strong> ({vehicleToDelete.year}) dari inventori showroom Anda?
                  </p>
                </div>
              </div>

              {/* Vehicle Preview Card in Alert */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vehicleToDelete.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80"}
                  alt={vehicleToDelete.name}
                  className="size-12 rounded-lg object-cover bg-black/50 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-white truncate">
                    {vehicleToDelete.name}
                  </p>
                  <p className="text-[11px] text-white/40 truncate">
                    {vehicleToDelete.color} • {vehicleToDelete.location}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-500/[0.06] border border-red-500/15 text-red-300 text-[11px] leading-relaxed">
                <strong>Perhatian:</strong> Tindakan ini bersifat permanen dan unit akan dihapus dari sistem.
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isPending}
                  className="text-white/50 hover:text-white"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold gap-2 px-5 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Hapus Unit
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
