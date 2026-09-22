"use client";

import { useState, useRef, useTransition } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  User,
  Link as LinkIcon,
  MapPin,
  Mail,
  Phone,
  Wallet,
  Check,
  Loader2,
  Film,
  ShieldCheck,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { compressImage } from "@/lib/image-compression";
import { updateCreatorProfile } from "@/app/actions/creatorProfile";
import { TikTokIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/social-icons";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export type CreatorProfileData = {
  fullName: string | null;
  username: string | null;
  phone: string | null;
  city: string | null;
  bio: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolderName: string | null;
  tiktokUsername: string | null;
  instagramUsername: string | null;
  youtubeUsername: string | null;
  avatarImage?: string | null;
  coverImage?: string | null;
  referralCode?: string | null;
};

export function ProfileView({
  initialProfile,
}: {
  initialProfile: CreatorProfileData | null;
}) {
  const { data: session } = useSession();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: initialProfile?.fullName || session?.user?.name || "",
    username:
      initialProfile?.username ||
      (session?.user?.email ? `@${session.user.email.split("@")[0]}` : "@kreator"),
    phone: initialProfile?.phone || "",
    city: initialProfile?.city || "Jakarta Selatan, Indonesia",
    bio:
      initialProfile?.bio ||
      "Kreator otomotif berfokus pada ulasan mobil, sinematografi, dan konten digital.",
    bankName: initialProfile?.bankName || "BCA",
    accountNumber: initialProfile?.accountNumber || "",
    accountHolderName:
      initialProfile?.accountHolderName || initialProfile?.fullName || session?.user?.name || "",
    tiktokUsername: initialProfile?.tiktokUsername || "",
    instagramUsername: initialProfile?.instagramUsername || "",
    youtubeUsername: initialProfile?.youtubeUsername || "",
    avatarImage: initialProfile?.avatarImage || (session?.user as any)?.image || "",
    coverImage: initialProfile?.coverImage || (session?.user as any)?.coverImage || "",
    referralCode: initialProfile?.referralCode || "",
  });

  const referralCode = form.referralCode || initialProfile?.referralCode || "";
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/c/${referralCode}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const [isPending, startTransition] = useTransition();

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Mengoptimalkan foto sampul...", { id: "upload-cover" });
      const base64 = await compressImage(file, 1280, 720, 0.8);
      setForm((prev) => ({ ...prev, coverImage: base64 }));
      
      // Auto save image
      startTransition(async () => {
        try {
          await updateCreatorProfile({ coverImage: base64 });
          toast.success("Foto sampul berhasil diperbarui dan disimpan", { id: "upload-cover" });
        } catch {
          toast.error("Gagal menyimpan foto sampul ke database", { id: "upload-cover" });
        }
      });
    } catch {
      toast.error("Gagal memproses gambar sampul", { id: "upload-cover" });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Mengoptimalkan foto profil...", { id: "upload-avatar" });
      const base64 = await compressImage(file, 400, 400, 0.85);
      setForm((prev) => ({ ...prev, avatarImage: base64 }));

      // Auto save image
      startTransition(async () => {
        try {
          await updateCreatorProfile({ avatarImage: base64 });
          toast.success("Foto profil berhasil diperbarui dan disimpan", { id: "upload-avatar" });
        } catch {
          toast.error("Gagal menyimpan foto profil ke database", { id: "upload-avatar" });
        }
      });
    } catch {
      toast.error("Gagal memproses gambar profil", { id: "upload-avatar" });
    }
  };

  const handleSaveAll = (sectionName = "Profil") => {
    if (!form.fullName.trim()) {
      toast.error("Nama lengkap wajib diisi");
      return;
    }

    startTransition(async () => {
      try {
        await updateCreatorProfile({
          fullName: form.fullName,
          username: form.username,
          phone: form.phone,
          city: form.city,
          bio: form.bio,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountHolderName: form.accountHolderName,
          tiktokUsername: form.tiktokUsername,
          instagramUsername: form.instagramUsername,
          youtubeUsername: form.youtubeUsername,
          avatarImage: form.avatarImage,
          coverImage: form.coverImage,
          referralCode: form.referralCode,
        });

        toast.success(`${sectionName} berhasil disimpan`, {
          description: "Data profil kreator Anda telah diperbarui secara permanen di sistem.",
        });
      } catch (err: any) {
        toast.error("Gagal menyimpan profil", {
          description: err?.message || "Terjadi kendala saat menyimpan perubahan.",
        });
      }
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "K";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const userEmail = session?.user?.email || "kreator@carpaign.id";
  const userTier = (session?.user as any)?.tier || 1;

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto w-full pb-20">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={coverInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleCoverUpload}
      />
      <input
        type="file"
        ref={avatarInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleAvatarUpload}
      />

      {/* Header Visual Card */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
        <Card className="bg-[#0f1114] border-white/10 overflow-hidden relative shadow-lg rounded-2xl">
          {/* Cover Photo */}
          <div
            onClick={() => coverInputRef.current?.click()}
            className="h-36 sm:h-52 w-full bg-[#14161a] relative group cursor-pointer overflow-hidden"
          >
            {form.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.coverImage}
                alt="Cover Profil"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent flex items-center justify-center">
                <p className="text-xs text-muted-foreground">Klik untuk menambahkan foto sampul</p>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-xs">
              <Camera className="size-4 text-white" />
              <span className="text-xs font-medium text-white">Ganti Foto Sampul</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f1114]" />
          </div>

          <CardContent className="p-6 sm:p-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="size-24 sm:size-28 rounded-2xl flex items-center justify-center border-2 border-white/10 bg-[#0f1114] relative group cursor-pointer flex-shrink-0 overflow-hidden shadow-xl"
                >
                  {form.avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.avatarImage}
                      alt="Avatar Kreator"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground select-none">
                      {getInitials(form.fullName)}
                    </span>
                  )}

                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                    <Camera className="size-5 text-white" />
                  </div>
                </div>

                <div className="pb-1 space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {form.fullName || "Nama Kreator"}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                      <ShieldCheck className="size-3 text-white" />
                      <span>Kreator Tier {userTier}</span>
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-muted-foreground/70" />
                    <span>{form.city || "Lokasi belum diatur"}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-end">
                {/* Portfolio Modal Dialog */}
                <Dialog>
                  <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-4 text-xs font-semibold text-white transition-all gap-1.5">
                    <Film className="size-3.5 text-white/70" />
                    <span>Lihat Portofolio</span>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111316] border-white/10 text-white max-w-2xl rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-base font-semibold flex items-center gap-2">
                        <Film className="size-4 text-white" />
                        <span>Portofolio Konten Kreator</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 mt-3">
                      {[
                        { title: "Review BMW M4 Competition", views: "142K Views" },
                        { title: "Cinematic Reel Porsche 911", views: "98K Views" },
                        { title: "Shorts Toyota GR Yaris", views: "65K Views" },
                        { title: "Showroom Walkthrough Mercedes", views: "83K Views" },
                        { title: "Highlights Honda Civic Type R", views: "52K Views" },
                        { title: "Audio Exhaust Sound Compilation", views: "115K Views" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="aspect-[9/16] rounded-xl bg-[#14161a] border border-white/10 relative overflow-hidden group cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                          <div className="w-full h-full bg-[#181a1f] flex items-center justify-center text-xs text-white/40">
                            Unit Video {i + 1}
                          </div>
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 space-y-0.5">
                            <p className="text-[11px] font-semibold text-white truncate">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-white/60 font-mono">
                              {item.views}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  type="button"
                  onClick={() => handleSaveAll("Profil")}
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
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Public Shortlink Card */}
      {referralCode && (
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0.5}>
          <div className="relative overflow-hidden rounded-2xl bg-[#0f1114] border border-[#D4AF37]/15 p-5 sm:p-6">
            <div className="absolute top-0 left-[15%] right-[15%] h-[50px] bg-[#D4AF37]/5 blur-2xl pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.15em]">
                  Link Portofolio Publik
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  Bagikan link ini kepada dealer agar mereka dapat melihat profil dan statistik Anda.
                </p>
                <p className="text-sm font-mono text-white/80 truncate mt-1">
                  {typeof window !== "undefined" ? `${window.location.origin}/c/${referralCode}` : `/c/${referralCode}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`/c/${referralCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Lihat</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold transition-all ${
                    linkCopied
                      ? "bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37]"
                      : "bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                  }`}
                >
                  {linkCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{linkCopied ? "Disalin" : "Salin"}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Personal Info & Payout Accounts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Personal Info Card */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
            <Card className="bg-[#0f1114] border-white/10 p-6 sm:p-8 rounded-2xl shadow-lg space-y-5">
              <div className="border-b border-white/5 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <User className="size-4 text-white/70" />
                    <span>Informasi Pribadi & Kreator</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Data identitas resmi yang tercatat untuk kontrak kerja sama dengan dealer.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/90">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Contoh: Rian Pratama"
                        className="pl-10 bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/90">
                      Username Publik
                    </label>
                    <Input
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="@username"
                      className="bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/90">
                      Email Akun
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        value={userEmail}
                        disabled
                        className="pl-10 bg-white/[0.01] border-white/5 text-xs text-muted-foreground rounded-xl h-10 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/90">
                      Nomor WhatsApp
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
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/90">
                    Custom Shortlink / Referral Code
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={form.referralCode}
                      onChange={(e) => setForm({ ...form, referralCode: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                      placeholder="contoh-shortlink"
                      className="pl-10 bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Hanya boleh berisi huruf kecil, angka, dan tanda strip (-).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/90">
                    Domisili atau Wilayah Operasional
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                      className="pl-10 bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/90">
                    Bio Singkat
                  </label>
                  <Textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    placeholder="Tuliskan spesialisasi konten Anda (misal: Video Reel Otomotif, Fotografi Showroom, dsb)..."
                    className="w-full p-3 bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => handleSaveAll("Informasi Pribadi")}
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
                      <span>Simpan Informasi Pribadi</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Payout Bank Account Card */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
            <Card className="bg-[#0f1114] border-white/10 p-6 sm:p-8 rounded-2xl shadow-lg space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Wallet className="size-4 text-white/70" />
                  <span>Rekening Pencairan Penghasilan (Withdrawal)</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rekening tujuan transfer reward setiap kali Anda mencairkan saldo kampanye.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/90">
                      Bank atau Dompet Digital (E-Wallet)
                    </label>
                    <Select
                      value={form.bankName}
                      onValueChange={(val) => setForm({ ...form, bankName: val })}
                    >
                      <SelectTrigger className="bg-white/[0.02] border-white/10 text-xs text-white rounded-xl h-10">
                        <SelectValue placeholder={form.bankName || "BCA"} />
                      </SelectTrigger>
                      <SelectContent className="bg-[#14161a] border-white/10 text-white text-xs">
                        <SelectItem value="BCA">BCA</SelectItem>
                        <SelectItem value="Mandiri">Mandiri</SelectItem>
                        <SelectItem value="BRI">BRI</SelectItem>
                        <SelectItem value="BNI">BNI</SelectItem>
                        <SelectItem value="CIMB Niaga">CIMB Niaga</SelectItem>
                        <SelectItem value="BSI">BSI</SelectItem>
                        <SelectItem value="GoPay">GoPay</SelectItem>
                        <SelectItem value="OVO">OVO</SelectItem>
                        <SelectItem value="DANA">DANA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/90">
                      Nomor Rekening atau Akun E-Wallet
                    </label>
                    <Input
                      value={form.accountNumber}
                      onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                      placeholder="Contoh: 1234567890"
                      className="bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/90">
                    Nama Lengkap Pemilik Rekening
                  </label>
                  <Input
                    value={form.accountHolderName}
                    onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
                    placeholder="Nama harus sesuai dengan buku tabungan"
                    className="bg-white/[0.02] border-white/10 focus:border-white/25 text-xs text-white rounded-xl h-10"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Pastikan nama pemilik rekening sesuai untuk menghindari keterlambatan verifikasi transfer.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => handleSaveAll("Rekening Pencairan")}
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
                      <span>Simpan Rekening</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right 1 Column: Social Connect */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
            <Card className="bg-[#0f1114] border-white/10 p-6 rounded-2xl shadow-lg space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <LinkIcon className="size-4 text-white/70" />
                  <span>Media Sosial Terhubung</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tautkan akun media sosial resmi yang Anda gunakan untuk mempublikasikan konten.
                </p>
              </div>

              <div className="space-y-4">
                {/* TikTok */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-black flex items-center justify-center text-white">
                        <TikTokIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">TikTok</p>
                        <span className="text-[10px] text-muted-foreground">
                          {form.tiktokUsername ? "Tersambung" : "Belum diisi"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Input
                    value={form.tiktokUsername}
                    onChange={(e) => setForm({ ...form, tiktokUsername: e.target.value })}
                    placeholder="@username_tiktok"
                    className="bg-black/30 border-white/10 focus:border-white/25 text-xs text-white rounded-lg h-8"
                  />
                </div>

                {/* Instagram */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <InstagramIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Instagram</p>
                        <span className="text-[10px] text-muted-foreground">
                          {form.instagramUsername ? "Tersambung" : "Belum diisi"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Input
                    value={form.instagramUsername}
                    onChange={(e) => setForm({ ...form, instagramUsername: e.target.value })}
                    placeholder="@username_ig"
                    className="bg-black/30 border-white/10 focus:border-white/25 text-xs text-white rounded-lg h-8"
                  />
                </div>

                {/* YouTube */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <YouTubeIcon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">YouTube</p>
                        <span className="text-[10px] text-muted-foreground">
                          {form.youtubeUsername ? "Tersambung" : "Belum diisi"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Input
                    value={form.youtubeUsername}
                    onChange={(e) => setForm({ ...form, youtubeUsername: e.target.value })}
                    placeholder="https://youtube.com/@channel"
                    className="bg-black/30 border-white/10 focus:border-white/25 text-xs text-white rounded-lg h-8"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={() => handleSaveAll("Media Sosial")}
                  disabled={isPending}
                  className="w-full h-9 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 shadow-sm transition-all gap-1.5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      <span>Simpan Media Sosial</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
