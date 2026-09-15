"use client";

import { useState, useTransition, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  Loader2, 
  ShieldCheck, 
  User, 
  Clock, 
  Sparkles,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { updateDealerProfile } from "@/app/actions/dealerProfile";
import { compressImage } from "@/lib/image-compression";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.45, 
      delay: i * 0.07, 
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
    },
  }),
};

type ProfileType = {
  dealerName: string | null;
  picName: string | null;
  phone: string | null;
  businessEmail: string | null;
  address: string | null;
  coverImage?: string | null;
  avatarImage?: string | null;
};

export function DealerProfileView({ initialProfile }: { initialProfile: ProfileType | null }) {
  const { data: session } = useSession();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    dealerName: initialProfile?.dealerName || session?.user?.name || "",
    picName: initialProfile?.picName || "",
    phone: initialProfile?.phone || "",
    businessEmail: initialProfile?.businessEmail || session?.user?.email || "",
    address: initialProfile?.address || "",
    coverImage: initialProfile?.coverImage || "",
    avatarImage: initialProfile?.avatarImage || (session?.user as any)?.image || "",
  });

  const [isPending, startTransition] = useTransition();

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Mengoptimalkan foto sampul showroom...", { id: "upload-cover" });
      const base64 = await compressImage(file, 1280, 720, 0.8);
      setForm((prev) => ({ ...prev, coverImage: base64 }));
      toast.success("Foto sampul berhasil dipilih", { id: "upload-cover" });
    } catch {
      toast.error("Gagal memproses gambar sampul", { id: "upload-cover" });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Mengoptimalkan logo showroom...", { id: "upload-avatar" });
      const base64 = await compressImage(file, 400, 400, 0.85);
      setForm((prev) => ({ ...prev, avatarImage: base64 }));
      toast.success("Logo showroom berhasil dipilih", { id: "upload-avatar" });
    } catch {
      toast.error("Gagal memproses gambar logo", { id: "upload-avatar" });
    }
  };

  const handleSave = () => {
    if (!form.dealerName.trim()) {
      toast.error("Nama dealer wajib diisi");
      return;
    }

    startTransition(async () => {
      try {
        await updateDealerProfile(form);
        toast.success("Profil dealer berhasil diperbarui", {
          description: "Informasi identitas showroom Anda telah disimpan.",
        });
      } catch (err: any) {
        toast.error("Gagal menyimpan profil", {
          description: err?.message || "Terjadi kendala saat menyimpan perubahan.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-[840px] mx-auto w-full pb-20">
      {/* Hidden File Inputs */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverUpload}
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      {/* Header */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Pengaturan Showroom
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Profil Dealer
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Identitas resmi dealership dan informasi kontak yang tampil pada publikasi kampanye kreator.
        </p>
      </motion.div>

      {/* Cover and Avatar Visual Card */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
        <Card className="bg-[#0f1114] border-white/10 overflow-hidden rounded-2xl shadow-lg">
          {/* Cover Photo */}
          <div
            onClick={() => coverInputRef.current?.click()}
            className="relative h-44 sm:h-52 bg-[#14161a] group cursor-pointer overflow-hidden"
          >
            {form.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.coverImage}
                alt="Foto Showroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent flex items-center justify-center">
                <p className="text-xs text-muted-foreground">Belum ada foto sampul showroom</p>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-xs">
              <Camera className="size-4 text-white" />
              <span className="text-xs font-medium text-white">
                Ganti Foto Sampul Showroom
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f1114]" />
          </div>

          {/* Avatar and Showroom Title */}
          <div className="px-6 pb-6 -mt-10 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="size-20 rounded-2xl flex items-center justify-center border-2 border-white/10 bg-[#0f1114] relative group cursor-pointer flex-shrink-0 overflow-hidden shadow-xl"
              >
                {form.avatarImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.avatarImage}
                    alt="Logo Showroom"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="size-8 text-white/30" />
                )}

                <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                  <Camera className="size-4 text-white" />
                </div>
              </div>

              <div className="pb-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {form.dealerName || "Nama Showroom"}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                    <ShieldCheck className="size-3 text-white" />
                    <span>Terverifikasi</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {form.address || "Lokasi belum ditentukan"}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="h-9 px-5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 shadow-sm transition-all gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Main Profile Form */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
        <Card className="bg-[#0f1114] border-white/10 p-6 sm:p-8 rounded-2xl shadow-lg space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Informasi Dealership
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Data resmi yang digunakan dalam kontrak kerja sama dan verifikasi kreator.
            </p>
          </div>

          <div className="space-y-4">
            {/* Showroom Name & PIC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/90">
                  Nama Dealer atau Showroom
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    value={form.dealerName}
                    onChange={(e) => setForm({ ...form, dealerName: e.target.value })}
                    placeholder="Contoh: BMW Tunas Sudirman"
                    className="pl-10 bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/90">
                  Nama Penanggung Jawab (PIC)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    value={form.picName}
                    onChange={(e) => setForm({ ...form, picName: e.target.value })}
                    placeholder="Contoh: Hendra Pratama"
                    className="pl-10 bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Business Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/90">
                  Nomor Telepon atau WhatsApp Showroom
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+62 812 3456 7890"
                    className="pl-10 bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/90">
                  Email Bisnis Resmi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    value={form.businessEmail}
                    onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
                    placeholder="official@dealership.co.id"
                    className="pl-10 bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/90">
                Alamat Lengkap Showroom
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  placeholder="Jl. Jenderal Sudirman Kav. 52, Kebayoran Baru, Jakarta Selatan"
                  className="w-full pl-10 pt-2.5 pb-2.5 bg-white/[0.02] border border-white/10 focus:border-white/25 text-xs text-white rounded-xl outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <p className="text-[11px] text-muted-foreground">
              Perubahan profil akan langsung disinkronkan ke seluruh materi kampanye aktif.
            </p>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="h-9 px-6 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 shadow-sm transition-all gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
